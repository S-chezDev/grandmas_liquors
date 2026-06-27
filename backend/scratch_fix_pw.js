const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'grandmasliquorsdb'
});

async function fixPassword() {
  const hash = await bcrypt.hash('password123', 10);
  await pool.query("UPDATE usuarios SET password_hash = $1 WHERE email = 'cliente@example.com'", [hash]);
  console.log('Password hash updated for cliente@example.com to match password123');
  process.exit(0);
}

fixPassword();
