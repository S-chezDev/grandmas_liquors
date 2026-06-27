require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'grandmasliquorsdb'
});

async function createTestClient() {
  try {
    const roleRes = await pool.query("SELECT id FROM roles WHERE nombre = 'Cliente'");
    if (roleRes.rows.length === 0) {
      console.log("No se encontró el rol Cliente");
      return;
    }
    const roleId = roleRes.rows[0].id;
    const email = 'cliente@example.com';
    
    const userRes = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (userRes.rows.length > 0) {
      console.log("El usuario cliente de prueba ya existe.");
    } else {
      console.log("Insertando usuario cliente de prueba...");
      await pool.query(`
        INSERT INTO usuarios (nombre, apellido, tipo_documento, documento, email, telefono, direccion, password_hash, rol_id, estado)
        VALUES ('Test', 'Cliente', 'CC', '1000100010', $1, '3001234567', 'Calle Test 123', '$2b$10$npauCy3OmoZRWSMfDCfLGO1AfbaCFv54unyLryPZ6SsX0gFPhVuqC', $2, 'Activo')
      `, [email, roleId]);
      console.log("Usuario insertado correctamente.");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createTestClient();
