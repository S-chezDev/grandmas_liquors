/* eslint-disable no-console */
const http = require('http');
const jwt = require('jsonwebtoken');
const config = require('../config');
const pool = require('../db');

function signAdminToken() {
  return jwt.sign(
    { id: 1, rol: 'Administrador', rol_id: 1, cliente_id: null, email: 'admin@test.com' },
    config.auth.jwtSecret,
    {
      algorithm: 'HS256',
      subject: '1',
      issuer: config.auth.jwtIssuer,
      audience: config.auth.jwtAudience,
      expiresIn: 3600,
    }
  );
}

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: Number(config.server.port || 3002),
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let b = '';
        res.on('data', (c) => {
          b += c;
        });
        res.on('end', () => resolve({ status: res.statusCode, body: b }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  const token = signAdminToken();

  const prov = await pool.query(
    `SELECT id, estado FROM proveedores WHERE LOWER(TRIM(COALESCE(estado,''))) = 'activo' ORDER BY id ASC LIMIT 1`
  );
  const prod = await pool.query(
    `SELECT id, estado FROM productos WHERE LOWER(TRIM(COALESCE(estado,''))) = 'activo' ORDER BY id ASC LIMIT 1`
  );

  const proveedorId = prov.rows[0]?.id;
  const productoId = prod.rows[0]?.id;

  console.log('Activo sample — proveedor_id:', proveedorId, prov.rows[0]);
  console.log('Activo sample — producto_id:', productoId, prod.rows[0]);

  if (!proveedorId) {
    console.log('No hay proveedor activo en BD; POST /api/compras fallará con proveedor no encontrado.');
    process.exit(0);
  }

  const body = {
    numero_compra: `CMP-DEBUG-${Date.now()}`,
    proveedor_id: proveedorId,
    fecha: new Date().toISOString().slice(0, 10),
    subtotal: 100,
    iva: 19,
    total: 119,
    observaciones: null,
  };

  const r1 = await post('/api/compras', body, token);
  console.log('\n--- POST /api/compras ---');
  console.log('HTTP status:', r1.status);
  console.log('Body:', r1.body);

  let compraId;
  try {
    compraId = JSON.parse(r1.body).id;
  } catch (_) {
    /* noop */
  }

  if (compraId && productoId) {
    const r2 = await post(
      '/api/compras/producto',
      {
        compraId,
        productoId,
        cantidad: 2,
        precioUnitario: 50,
        porcentajeGanancia: 10,
      },
      token
    );
    console.log('\n--- POST /api/compras/producto ---');
    console.log('HTTP status:', r2.status);
    console.log('Body:', r2.body);
  } else if (!productoId) {
    console.log('\n(Sin producto activo no se prueba addDetalle.)');
  }

  await pool.end();
})().catch(async (e) => {
  console.error(e);
  try {
    await pool.end();
  } catch (_) {
    /* noop */
  }
  process.exit(1);
});
