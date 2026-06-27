require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'grandmasliquorsdb'
});

async function checkClient() {
  try {
    const res = await pool.query("SELECT * FROM usuarios WHERE email = 'cliente@example.com'");
    console.log('User in DB:', res.rows);
    
    const clientRes = await pool.query("SELECT * FROM clientes WHERE email = 'cliente@example.com'");
    console.log('Client in DB:', clientRes.rows);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkClient();
