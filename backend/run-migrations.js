const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Configurar conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || "grandma'sdb",
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando migraciones de base de datos...\n');

    // Leer y ejecutar schema inicial
    const schemaPath = path.join(__dirname, 'db.pgsql');
    if (fs.existsSync(schemaPath)) {
      console.log('📋 Ejecutando schema inicial (db.pgsql)...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
      console.log('✓ Schema inicial completado\n');
    }

    // Ejecutar migraciones en orden
    const migrationsDir = path.join(__dirname, 'historias-migraciones');
    const migrationFiles = [
      '015_add_pedido_tiempo_insumos_to_produccion.sql',
      '016_add_positive_constraints_to_produccion.sql',
      '018_cliente_role_permisos_tienda.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`📋 Ejecutando migración: ${file}...`);
        const migration = fs.readFileSync(filePath, 'utf8');
        await client.query(migration);
        console.log(`✓ ${file} completada\n`);
      } else {
        console.warn(`⚠️  Archivo de migración no encontrado: ${file}\n`);
      }
    }

    console.log('✅ ¡Todas las migraciones completadas exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante las migraciones:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
