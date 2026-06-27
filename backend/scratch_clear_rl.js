const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'grandmasliquorsdb'
});

async function clearRateLimit() {
  await pool.query('DELETE FROM api_rate_limit_log;');
  console.log('Rate limits cleared');
  process.exit(0);
}

clearRateLimit();
