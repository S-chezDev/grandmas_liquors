require('dotenv').config();

const parseCsv = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET es obligatorio en produccion');
}

const defaultCorsOrigins = isProduction
  ? []
  : ['http://localhost:5173', 'http://localhost:3000'];

const configuredCorsOrigins = parseCsv(process.env.CORS_ORIGINS);

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || process.env.DB_NAME,
  },
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev_only_change_me',
    jwtIssuer: process.env.JWT_ISSUER || 'grandmas-liquors-api',
    jwtAudience: process.env.JWT_AUDIENCE || 'grandmas-liquors-web',
    cookieName: process.env.AUTH_COOKIE_NAME || 'gl_session',
    cookieDomain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    cookieSameSite: process.env.AUTH_COOKIE_SAME_SITE || 'lax',
    cookieSecure: isProduction,
    clienteTokenTtlMs: parseInt(process.env.JWT_CLIENTE_TTL_MS || `${60 * 60 * 1000}`, 10),
    staffTokenTtlMs: parseInt(process.env.JWT_STAFF_TTL_MS || `${3 * 60 * 60 * 1000}`, 10),
    corsOrigins: configuredCorsOrigins.length > 0 ? configuredCorsOrigins : defaultCorsOrigins,
  },
};

module.exports = config;
