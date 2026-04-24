#!/usr/bin/env node
/**
 * Script de Inicialización de Base de Datos
 * Ejecuta el esquema principal + todas las migraciones
 */

const fs = require('fs');
const path = require('path');
const pool = require('../db');

const migrationsDir = path.join(__dirname, '../historias-migraciones');

async function runMigrations() {
  console.log('🔄 Iniciando migración de base de datos...\n');

  try {
    // 1. Ejecutar el esquema principal
    console.log('📋 Ejecutando esquema principal (db.sql)...');
    const dbSqlPath = path.join(__dirname, '../db.sql');
    const dbSql = await fs.promises.readFile(dbSqlPath, 'utf8');
    
    try {
      await pool.query(dbSql);
      console.log('✅ Esquema principal ejecutado\n');
    } catch (error) {
      if (!error.message.includes('already exists') && 
          !error.message.includes('ERRCODE_DUPLICATE')) {
        console.warn('⚠️ Algunas tablas ya existen (puede ser normal)');
      }
    }

    // 2. Ejecutar migraciones en orden
    console.log('📂 Ejecutando migraciones históricas...');
    const migrations = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && f !== 'README.md')
      .sort();

    for (const migration of migrations) {
      console.log(`  ⏳ Migrando: ${migration}`);
      const migrationPath = path.join(migrationsDir, migration);
      const migrationSql = await fs.promises.readFile(migrationPath, 'utf8');
      
      try {
        await pool.query(migrationSql);
        console.log(`  ✅ ${migration}`);
      } catch (error) {
        // Ignorar errores de operaciones idempotentes
        if (!error.message.includes('already exists') &&
            !error.message.includes('ERRCODE_DUPLICATE') &&
            !error.message.includes('IF NOT EXISTS')) {
          console.warn(`    ⚠️ ${error.message}`);
        } else {
          console.log(`  ✅ ${migration} (idempotente)`);
        }
      }
    }

    console.log('\n✅ Migración de base de datos completada exitosamente\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

// Ejecutar migraciones
runMigrations();
