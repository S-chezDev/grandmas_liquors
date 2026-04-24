require('dotenv').config();

const { Pool } = require('pg');
const config = require('../config');

const baseUrl = process.env.API_BASE_URL || `http://localhost:${config.server.port}`;
const LOGIN_EMAIL = process.env.CHECK_EMAIL || 'admin@grandmas.com';
const LOGIN_PASSWORD = process.env.CHECK_PASSWORD || 'admin123';

const db = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: typeof config.db.password === 'string' ? config.db.password : String(config.db.password || ''),
  database: config.db.database,
});

const nowToken = () => Date.now();

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const parseJsonSafe = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

const createHttpClient = (cookieHeader) => {
  return async (method, path, body, expectedStatuses = [200, 201], withAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (withAuth && cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const payload = await parseJsonSafe(response);

    if (!expectedStatuses.includes(response.status)) {
      throw new Error(
        `${method} ${path} esperado ${expectedStatuses.join(',')} pero obtuvo ${response.status}. Respuesta: ${JSON.stringify(payload)}`
      );
    }

    return { status: response.status, data: payload };
  };
};

const getOne = async (sql, params = []) => {
  const result = await db.query(sql, params);
  return result.rows[0] || null;
};

const runModule = async (name, fn, report) => {
  try {
    await fn();
    report.push({ modulo: name, ok: true });
  } catch (error) {
    report.push({ modulo: name, ok: false, error: error.message });
  }
};

const main = async () => {
  const report = [];

  const loginResp = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD }),
  });

  const loginPayload = await parseJsonSafe(loginResp);
  assert(loginResp.status === 200, `No se pudo autenticar: ${JSON.stringify(loginPayload)}`);

  const setCookie = loginResp.headers.get('set-cookie') || '';
  const sessionCookie = setCookie.split(';')[0];
  assert(sessionCookie.includes('='), 'No se recibió cookie de sesión en login');

  const api = createHttpClient(sessionCookie);

  await runModule('categorias', async () => {
    await api('GET', '/api/categorias');
    const code = nowToken();
    const create = await api('POST', '/api/categorias', {
      nombre: `CAT-AUTO-${code}`,
      descripcion: 'Categoria de prueba automatica',
    });
    const id = create.data.id;
    assert(Number.isInteger(id), 'No retornó id en categoria.create');

    const row = await getOne('SELECT id, nombre FROM categorias WHERE id = $1', [id]);
    assert(row && row.nombre.includes('CAT-AUTO'), 'Categoria no persistió en DB');

    await api('GET', `/api/categorias/${id}`);
    await api('PUT', `/api/categorias/${id}`, {
      nombre: `CAT-AUTO-UPD-${code}`,
      descripcion: 'Categoria actualizada',
    });

    const updated = await getOne('SELECT nombre FROM categorias WHERE id = $1', [id]);
    assert(updated?.nombre === `CAT-AUTO-UPD-${code}`, 'Categoria no actualizó en DB');

    await api('DELETE', `/api/categorias/${id}`);
    const deleted = await getOne('SELECT id FROM categorias WHERE id = $1', [id]);
    assert(!deleted, 'Categoria no eliminada en DB');
  }, report);

  await runModule('productos', async () => {
    await api('GET', '/api/productos');

    const catCode = nowToken();
    const cat = await api('POST', '/api/categorias', {
      nombre: `CAT-PROD-${catCode}`,
      descripcion: 'Categoria apoyo producto',
    });

    const code = nowToken();
    const create = await api('POST', '/api/productos', {
      nombre: `PROD-AUTO-${code}`,
      categoria_id: cat.data.id,
      descripcion: 'Producto de prueba',
      precio: 12345,
      stock: 10,
      stock_minimo: 2,
    });
    const id = create.data.id;

    await api('GET', `/api/productos/${id}`);
    await api('GET', `/api/productos/categoria/${cat.data.id}`);

    await api('PUT', `/api/productos/${id}`, {
      nombre: `PROD-AUTO-UPD-${code}`,
      categoria_id: cat.data.id,
      descripcion: 'Producto actualizado',
      precio: 15000,
      stock: 12,
      stock_minimo: 3,
      imagen_url: null,
    });

    const updated = await getOne('SELECT nombre, precio FROM productos WHERE id = $1', [id]);
    assert(updated?.nombre === `PROD-AUTO-UPD-${code}`, 'Producto no actualizó nombre');
    assert(Number(updated?.precio) === 15000, 'Producto no actualizó precio');

    await api('DELETE', `/api/productos/${id}`);
    await api('DELETE', `/api/categorias/${cat.data.id}`);

    const deleted = await getOne('SELECT id FROM productos WHERE id = $1', [id]);
    assert(!deleted, 'Producto no eliminado en DB');
  }, report);

  await runModule('clientes', async () => {
    await api('GET', '/api/clientes');
    const code = nowToken();

    const create = await api('POST', '/api/clientes', {
      nombre: 'Cliente',
      apellido: `Auto${code}`,
      tipoDocumento: 'CC',
      documento: `99${String(code).slice(-8)}`,
      telefono: `31${String(code).slice(-8)}`,
      email: `cliente.auto.${code}@mail.com`,
      direccion: 'Direccion test cliente',
      estado: 'Activo',
    });

    const id = create.data.id;
    await api('GET', `/api/clientes/${id}`);

    await api('PUT', `/api/clientes/${id}`, {
      nombre: 'ClienteEditado',
      apellido: `Auto${code}`,
      tipoDocumento: 'CC',
      documento: `99${String(code).slice(-8)}`,
      telefono: `32${String(code).slice(-8)}`,
      email: `cliente.auto.${code}@mail.com`,
      direccion: 'Direccion test cliente update',
      estado: 'Activo',
    });

    const updated = await getOne('SELECT nombre, telefono FROM clientes WHERE id = $1', [id]);
    assert(updated?.nombre === 'ClienteEditado', 'Cliente no actualizó nombre');

    await api('DELETE', `/api/clientes/${id}`);
    const deleted = await getOne('SELECT id FROM clientes WHERE id = $1', [id]);
    assert(!deleted, 'Cliente no eliminado en DB');
  }, report);

  await runModule('proveedores', async () => {
    await api('GET', '/api/proveedores');
    const code = nowToken();

    const create = await api('POST', '/api/proveedores', {
      tipoPersona: 'Natural',
      nombre: 'Prov',
      apellido: `Auto${code}`,
      tipoDocumento: 'CC',
      numeroDocumento: `55${String(code).slice(-8)}`,
      telefono: `30${String(code).slice(-8)}`,
      email: `proveedor.auto.${code}@mail.com`,
      direccion: 'Direccion test proveedor',
      estado: 'Activo',
      preferente: true,
      rating: 4.5,
      observaciones: 'Proveedor creado por prueba automatica',
    });

    const id = create.data.id;
    await api('GET', `/api/proveedores/${id}`);
    await api('GET', `/api/proveedores/${id}/historial`);
    await api('GET', `/api/proveedores/${id}/pendientes`);

    await api('PUT', `/api/proveedores/${id}`, {
      tipoPersona: 'Natural',
      nombre: 'ProvEditado',
      apellido: `Auto${code}`,
      tipoDocumento: 'CC',
      numeroDocumento: `55${String(code).slice(-8)}`,
      telefono: `30${String(code).slice(-8)}`,
      email: `proveedor.auto.${code}@mail.com`,
      direccion: 'Direccion test proveedor update',
      estado: 'Activo',
      preferente: false,
      rating: 4.8,
      observaciones: 'Proveedor actualizado por prueba automatica',
    });

    const updated = await getOne('SELECT nombre, observaciones FROM proveedores WHERE id = $1', [id]);
    assert(updated?.nombre === 'ProvEditado', 'Proveedor no actualizó nombre');

    await api('DELETE', `/api/proveedores/${id}`, {
      motivo: 'Eliminacion de registro de prueba automatizada',
    });

    const deleted = await getOne('SELECT id FROM proveedores WHERE id = $1', [id]);
    assert(!deleted, 'Proveedor no eliminado en DB');
  }, report);

  await runModule('pedidos', async () => {
    await api('GET', '/api/pedidos');

    const cliente = await getOne('SELECT id FROM clientes ORDER BY id ASC LIMIT 1');
    const producto = await getOne('SELECT id, precio FROM productos ORDER BY id ASC LIMIT 1');
    assert(cliente && producto, 'No hay cliente/producto base para pruebas de pedidos');

    const code = nowToken();
    const create = await api('POST', '/api/pedidos', {
      numero_pedido: `PED-AUTO-${code}`,
      cliente_id: cliente.id,
      fecha: '2026-04-24',
      fecha_entrega: '2026-04-27',
      detalles: 'Pedido de prueba automatica',
      estado: 'Pendiente',
    });

    const id = create.data.id;
    await api('POST', '/api/pedidos/producto', {
      pedidoId: id,
      productoId: producto.id,
      cantidad: 2,
      precioUnitario: Number(producto.precio),
    });

    await api('GET', `/api/pedidos/${id}`);
    await api('GET', `/api/pedidos/cliente/${cliente.id}`);

    await api('PUT', `/api/pedidos/${id}`, {
      numero_pedido: `PED-AUTO-UPD-${code}`,
      fecha: '2026-04-25',
      fecha_entrega: '2026-04-28',
      detalles: 'Pedido actualizado prueba automatica',
      total: Number(producto.precio) * 2,
      estado: 'En Proceso',
    });

    const updated = await getOne('SELECT numero_pedido, estado FROM pedidos WHERE id = $1', [id]);
    assert(updated?.numero_pedido === `PED-AUTO-UPD-${code}`, 'Pedido no actualizó número');

    await api('DELETE', `/api/pedidos/${id}`);
    const deleted = await getOne('SELECT id FROM pedidos WHERE id = $1', [id]);
    assert(!deleted, 'Pedido no eliminado en DB');
  }, report);

  await runModule('ventas', async () => {
    await api('GET', '/api/ventas');

    const cliente = await getOne('SELECT id FROM clientes ORDER BY id ASC LIMIT 1');
    const producto = await getOne('SELECT id, precio FROM productos ORDER BY id ASC LIMIT 1');
    assert(cliente && producto, 'No hay cliente/producto base para pruebas de ventas');

    const code = nowToken();
    const create = await api('POST', '/api/ventas', {
      numero_venta: `VEN-AUTO-${code}`,
      tipo: 'Directa',
      cliente_id: cliente.id,
      fecha: '2026-04-24',
      metodopago: 'Efectivo',
      total: Number(producto.precio),
      estado: 'Completada',
    });

    const id = create.data.id;
    await api('POST', '/api/ventas/producto', {
      ventaId: id,
      productoId: producto.id,
      cantidad: 1,
      precioUnitario: Number(producto.precio),
    });

    await api('GET', `/api/ventas/${id}`);

    await api('PUT', `/api/ventas/${id}`, {
      numero_venta: `VEN-AUTO-UPD-${code}`,
      tipo: 'Directa',
      cliente_id: cliente.id,
      pedido_id: null,
      fecha: '2026-04-25',
      metodopago: 'Tarjeta',
      total: Number(producto.precio),
      estado: 'Completada',
    });

    const updated = await getOne('SELECT numero_venta, metodopago FROM ventas WHERE id = $1', [id]);
    assert(updated?.numero_venta === `VEN-AUTO-UPD-${code}`, 'Venta no actualizó número');

    await api('DELETE', `/api/ventas/${id}`);
    const deleted = await getOne('SELECT id FROM ventas WHERE id = $1', [id]);
    assert(!deleted, 'Venta no eliminada en DB');
  }, report);

  await runModule('abonos', async () => {
    await api('GET', '/api/abonos');

    const pedido = await getOne('SELECT id, cliente_id FROM pedidos ORDER BY id ASC LIMIT 1');
    assert(pedido, 'No hay pedido base para pruebas de abonos');

    const code = nowToken();
    const create = await api('POST', '/api/abonos', {
      numero_abono: `ABO-AUTO-${code}`,
      pedido_id: pedido.id,
      cliente_id: pedido.cliente_id,
      monto: 10000,
      fecha: '2026-04-24',
      metodo_pago: 'Efectivo',
      estado: 'Registrado',
    });

    const id = create.data.id;
    await api('GET', `/api/abonos/${id}`);
    await api('GET', `/api/abonos/pedido/${pedido.id}`);

    await api('PUT', `/api/abonos/${id}`, {
      monto: 12000,
      fecha: '2026-04-25',
      metodo_pago: 'Transferencia',
      estado: 'Registrado',
    });

    const updated = await getOne('SELECT monto FROM abonos WHERE id = $1', [id]);
    assert(Number(updated?.monto) === 12000, 'Abono no actualizó monto');

    await api('DELETE', `/api/abonos/${id}`);
    const deleted = await getOne('SELECT id FROM abonos WHERE id = $1', [id]);
    assert(!deleted, 'Abono no eliminado en DB');
  }, report);

  await runModule('domicilios', async () => {
    await api('GET', '/api/domicilios');

    const pedido = await getOne('SELECT id, cliente_id FROM pedidos ORDER BY id ASC LIMIT 1');
    assert(pedido, 'No hay pedido base para pruebas de domicilios');

    const code = nowToken();
    const create = await api('POST', '/api/domicilios', {
      numero_domicilio: `DOM-AUTO-${code}`,
      pedido_id: pedido.id,
      cliente_id: pedido.cliente_id,
      direccion: 'Direccion domicilio test',
      repartidor: 'Repartidor Auto',
      fecha: '2026-04-24',
      hora: '10:15',
      estado: 'Pendiente',
      detalle: 'Domicilio de prueba automatica',
    });

    const id = create.data.id;
    await api('GET', `/api/domicilios/${id}`);
    await api('GET', `/api/domicilios/pedido/${pedido.id}`);

    await api('PUT', `/api/domicilios/${id}`, {
      repartidor: 'Repartidor Auto Editado',
      fecha: '2026-04-25',
      hora: '11:30',
      estado: 'En Camino',
      detalle: 'Domicilio actualizado automatizado',
    });

    const updated = await getOne('SELECT repartidor, estado FROM domicilios WHERE id = $1', [id]);
    assert(updated?.repartidor === 'Repartidor Auto Editado', 'Domicilio no actualizó repartidor');

    await api('DELETE', `/api/domicilios/${id}`);
    const deleted = await getOne('SELECT id FROM domicilios WHERE id = $1', [id]);
    assert(!deleted, 'Domicilio no eliminado en DB');
  }, report);

  await runModule('compras', async () => {
    await api('GET', '/api/compras');

    const proveedor = await getOne("SELECT id FROM proveedores WHERE estado = 'Activo' ORDER BY id ASC LIMIT 1");
    const producto = await getOne("SELECT id, precio FROM productos WHERE estado = 'Activo' ORDER BY id ASC LIMIT 1");
    assert(proveedor && producto, 'No hay proveedor/producto activo para pruebas de compras');

    const code = nowToken();
    const create = await api('POST', '/api/compras', {
      numero_compra: `COM-AUTO-${code}`,
      proveedor_id: proveedor.id,
      fecha: '2026-04-24',
      fecha_creacion: '2026-04-24T10:00:00.000Z',
      subtotal: 0,
      iva: 0,
      total: 0,
      observaciones: 'Compra de prueba automatica',
    });

    const id = create.data.id;
    await api('POST', '/api/compras/producto', {
      compraId: id,
      productoId: producto.id,
      cantidad: 1,
      precioUnitario: Number(producto.precio),
    });

    await api('GET', `/api/compras/${id}`);

    await api('PUT', `/api/compras/${id}/estado`, {
      estado: 'Cancelada',
      motivo_cancelacion: 'Cancelacion de compra de prueba automatica',
    });

    const updated = await getOne('SELECT estado FROM compras WHERE id = $1', [id]);
    assert(updated?.estado === 'Cancelada', 'Compra no actualizó estado');

    await api('DELETE', `/api/compras/${id}`);
    const deleted = await getOne('SELECT id FROM compras WHERE id = $1', [id]);
    assert(!deleted, 'Compra no eliminada en DB');
  }, report);

  await runModule('insumos', async () => {
    await api('GET', '/api/insumos');
    const code = nowToken();

    const create = await api('POST', '/api/insumos', {
      nombre: `INS-AUTO-${code}`,
      descripcion: 'Insumo de prueba',
      cantidad: 20,
      unidad: 'Litros',
      stock_minimo: 5,
      estado: 'Activo',
    });
    const id = create.data.id;

    await api('GET', `/api/insumos/${id}`);

    await api('PUT', `/api/insumos/${id}`, {
      nombre: `INS-AUTO-UPD-${code}`,
      descripcion: 'Insumo de prueba actualizado',
      cantidad: 25,
      unidad: 'Litros',
      stock_minimo: 6,
      estado: 'Activo',
    });

    const updated = await getOne('SELECT nombre, cantidad FROM insumos WHERE id = $1', [id]);
    assert(updated?.nombre === `INS-AUTO-UPD-${code}`, 'Insumo no actualizó nombre');

    await api('DELETE', `/api/insumos/${id}`);
    const deleted = await getOne('SELECT id FROM insumos WHERE id = $1', [id]);
    assert(!deleted, 'Insumo no eliminado en DB');
  }, report);

  await runModule('entregas-insumos', async () => {
    await api('GET', '/api/entregas-insumos');

    const insumo = await getOne('SELECT id FROM insumos ORDER BY id ASC LIMIT 1');
    assert(insumo, 'No hay insumo para pruebas de entregas');

    const code = nowToken();
    const create = await api('POST', '/api/entregas-insumos', {
      numero_entrega: `ENT-AUTO-${code}`,
      insumo_id: insumo.id,
      cantidad: 3,
      unidad: 'Litros',
      operario: 'Operario Auto',
      fecha: '2026-04-24',
      hora: '08:45',
    });

    const id = create.data.id;
    await api('GET', `/api/entregas-insumos/${id}`);

    await api('PUT', `/api/entregas-insumos/${id}`, {
      insumo_id: insumo.id,
      cantidad: 4,
      unidad: 'Litros',
      operario: 'Operario Auto Editado',
      fecha: '2026-04-25',
      hora: '09:15',
    });

    const updated = await getOne('SELECT cantidad, operario FROM entregas_insumos WHERE id = $1', [id]);
    assert(Number(updated?.cantidad) === 4, 'Entrega no actualizó cantidad');

    await api('DELETE', `/api/entregas-insumos/${id}`);
    const deleted = await getOne('SELECT id FROM entregas_insumos WHERE id = $1', [id]);
    assert(!deleted, 'Entrega no eliminada en DB');
  }, report);

  await runModule('produccion', async () => {
    await api('GET', '/api/produccion');

    const producto = await getOne('SELECT id FROM productos ORDER BY id ASC LIMIT 1');
    assert(producto, 'No hay producto para pruebas de produccion');

    const code = nowToken();
    const create = await api('POST', '/api/produccion', {
      numero_produccion: `PROD-AUTO-${code}`,
      producto_id: producto.id,
      cantidad: 2,
      fecha: '2026-04-24',
      responsable: 'Operario Auto',
      tiempo_preparacion_minutos: 30,
      estado: 'Orden Recibida',
      notes: 'Produccion de prueba',
      insumos_gastados: [],
    });

    const id = create.data.id;
    await api('GET', `/api/produccion/${id}`);

    await api('PUT', `/api/produccion/${id}`, {
      numero_produccion: `PROD-AUTO-UPD-${code}`,
      producto_id: producto.id,
      cantidad: 3,
      fecha: '2026-04-25',
      responsable: 'Operario Auto Editado',
      tiempo_preparacion_minutos: 45,
      estado: 'Orden en preparacion',
      notes: 'Produccion actualizada',
      insumos_gastados: [],
    });

    await api('PUT', `/api/produccion/${id}/estado`, {
      estado: 'Orden Lista',
    });

    const updated = await getOne('SELECT estado, cantidad FROM produccion WHERE id = $1', [id]);
    assert(updated?.estado === 'Orden Lista', 'Produccion no actualizó estado');

    await api('DELETE', `/api/produccion/${id}`);
    const deleted = await getOne('SELECT id FROM produccion WHERE id = $1', [id]);
    assert(!deleted, 'Produccion no eliminada en DB');
  }, report);

  await runModule('roles', async () => {
    await api('GET', '/api/roles');

    const code = nowToken();
    const create = await api('POST', '/api/roles', {
      nombre: `ROL_AUTO_${code}`,
      descripcion: 'Rol de prueba automatica',
      permisos: ['Ver Dashboard'],
      estado: 'Activo',
    });

    const id = create.data.id;
    await api('GET', `/api/roles/${id}`);
    await api('GET', `/api/roles/${id}/auditoria`);

    await api('PUT', `/api/roles/${id}`, {
      nombre: `ROL_AUTO_UPD_${code}`,
      descripcion: 'Rol de prueba actualizado',
      permisos: ['Ver Dashboard', 'Ver Usuarios'],
      estado: 'Activo',
      motivo: 'Actualizacion de rol de prueba automatizada',
    });

    const updated = await getOne('SELECT nombre FROM roles WHERE id = $1', [id]);
    assert(updated?.nombre === `ROL_AUTO_UPD_${code}`, 'Rol no actualizó nombre');

    await api('DELETE', `/api/roles/${id}`, {
      motivo: 'Eliminacion de rol de prueba automatizada',
    });

    const deleted = await getOne('SELECT id FROM roles WHERE id = $1', [id]);
    assert(!deleted, 'Rol no eliminado en DB');
  }, report);

  await runModule('usuarios', async () => {
    await api('GET', '/api/usuarios');

    const rol = await getOne("SELECT id FROM roles WHERE estado = 'Activo' ORDER BY id ASC LIMIT 1");
    assert(rol, 'No hay rol activo para pruebas de usuarios');

    const code = nowToken();
    const email = `usuario.auto.${code}@mail.com`;
    const documento = `77${String(code).slice(-8)}`;
    const telefono = `30${String(code).slice(-8)}`;

    const create = await api('POST', '/api/usuarios', {
      nombre: 'Usuario',
      apellido: `Auto${code}`,
      tipo_documento: 'CC',
      documento,
      direccion: 'Direccion test usuario',
      email,
      telefono,
      rol_id: rol.id,
      estado: 'Activo',
      password: 'Prueba!2026',
    });

    const id = create.data.id;
    await api('GET', `/api/usuarios/${id}`);
    await api('GET', `/api/usuarios/email/${encodeURIComponent(email)}`);
    await api('GET', `/api/usuarios/documento/${documento}`);
    await api('GET', `/api/usuarios/telefono/${telefono}`);
    await api('GET', `/api/usuarios/${id}/historial`);
    await api('GET', `/api/usuarios/${id}/detalle-completo`);
    await api('GET', `/api/usuarios/${id}/impacto-eliminacion`);

    await api('PUT', `/api/usuarios/${id}`, {
      nombre: 'UsuarioEditado',
      apellido: `Auto${code}`,
      direccion: 'Direccion test usuario update',
      email,
      telefono,
      rol_id: rol.id,
    });

    await api('PUT', `/api/usuarios/${id}/rol`, {
      rol_id: rol.id,
    });

    const updated = await getOne('SELECT nombre FROM usuarios WHERE id = $1', [id]);
    assert(updated?.nombre === 'UsuarioEditado', 'Usuario no actualizó nombre');

    await api('DELETE', `/api/usuarios/${id}`, {
      motivo: 'Eliminacion de usuario de prueba automatizada',
      mode: 'logical',
      omit_validaciones: true,
    });

    const deleted = await getOne("SELECT estado FROM usuarios WHERE id = $1", [id]);
    assert(deleted?.estado === 'Eliminado', 'Usuario no quedó en estado Eliminado');
  }, report);

  const passed = report.filter((x) => x.ok).length;
  const failed = report.length - passed;

  console.log('\n=== RESUMEN VALIDACION CRUD ===');
  for (const item of report) {
    if (item.ok) {
      console.log(`PASS - ${item.modulo}`);
    } else {
      console.log(`FAIL - ${item.modulo} - ${item.error}`);
    }
  }

  console.log(`\nTotal módulos: ${report.length}`);
  console.log(`Pasaron: ${passed}`);
  console.log(`Fallaron: ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
  }

  await db.end();
};

main().catch(async (error) => {
  console.error('Error en validacion CRUD:', error.message);
  await db.end();
  process.exit(1);
});
