require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../db');

const migrationsDir = path.join(__dirname, '..', 'historias-migraciones');
let migrationColumn = 'filename';
let hasVersionColumn = false;

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const columnsResult = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = 'schema_migrations'`
  );

  const columns = new Set(columnsResult.rows.map((row) => row.column_name));
  hasVersionColumn = columns.has('version');

  if (columns.has('filename')) {
    migrationColumn = 'filename';
    return;
  }

  if (columns.has('name')) {
    migrationColumn = 'name';
    return;
  }

  if (columns.has('version')) {
    migrationColumn = 'version';
    return;
  }

  await pool.query('ALTER TABLE schema_migrations ADD COLUMN filename VARCHAR(255)');
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_migrations_filename ON schema_migrations(filename)');
  migrationColumn = 'filename';
}

async function getAppliedMigrations() {
  const names = new Set();

  const tracked = await pool.query(
    `SELECT ${migrationColumn} AS migration_name
     FROM schema_migrations
     WHERE ${migrationColumn} IS NOT NULL`
  );
  tracked.rows.forEach((row) => names.add(row.migration_name));

  if (hasVersionColumn && migrationColumn !== 'version') {
    const versionTracked = await pool.query(
      `SELECT version AS migration_name
       FROM schema_migrations
       WHERE version IS NOT NULL`
    );
    versionTracked.rows.forEach((row) => names.add(row.migration_name));
  }

  return names;
}

async function runMigration(filename) {
  const filePath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(filePath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);

    if (migrationColumn === 'version') {
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [filename]);
    } else if (hasVersionColumn) {
      await client.query(
        `INSERT INTO schema_migrations (${migrationColumn}, version) VALUES ($1, $1)`,
        [filename]
      );
    } else {
      await client.query(`INSERT INTO schema_migrations (${migrationColumn}) VALUES ($1)`, [filename]);
    }

    await client.query('COMMIT');
    console.log(`✓ Migracion aplicada: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`✗ Error en migracion ${filename}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function migrate() {
  try {
    await ensureMigrationsTable();

    if (!fs.existsSync(migrationsDir)) {
      console.log('No existe carpeta de migraciones. Nada por ejecutar.');
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const applied = await getAppliedMigrations();
    const pending = files.filter((file) => {
      if (file === '001_create_schema_migrations.sql') {
        return false;
      }
      return !applied.has(file);
    });

    if (pending.length === 0) {
      console.log('✓ No hay migraciones pendientes');
      return;
    }

    for (const file of pending) {
      await runMigration(file);
    }

    console.log('✓ Todas las migraciones pendientes fueron aplicadas');
  } catch (error) {
    console.error('✗ Proceso de migracion fallido:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
