#!/usr/bin/env node
/**
 * Script para crear la base de datos inicial
 * Se conecta a la BD postgres por defecto para crear grandmasdb
 */

const { Pool } = require('pg');

const adminPool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'admin123',
  database: 'postgres' // Conectarse a la BD de administración
});

async function createDatabase() {
  const client = await adminPool.connect();
  
  try {
    console.log('🔄 Creando base de datos...');
    
    // Verificar si ya existe
    const checkResult = await client.query(
      `SELECT datname FROM pg_database WHERE datname = 'grandmasdb'`
    );
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Base de datos "grandmasdb" ya existe');
      return;
    }
    
    // Crear la base de datos
    await client.query('CREATE DATABASE grandmasdb');
    console.log('✅ Base de datos "grandmasdb" creada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error.message);
    throw error;
  } finally {
    client.release();
    await adminPool.end();
  }
}

createDatabase()
  .then(() => {
    console.log('✅ Proceso completado. Ahora ejecuta: npm run migrate-db\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  });
