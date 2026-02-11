const pool = require('../db');

/**
 * FUNCIONES GENÉRICAS PARA CONSULTAS A LA BD POSTGRESQL
 */

// ------- CATEGORÍAS -------
const Categorias = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nombre');
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO categorias (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id',
      [data.nombre, data.descripcion, data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE categorias SET nombre = $1, descripcion = $2, estado = $3 WHERE id = $4',
      [data.nombre, data.descripcion, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    return true;
  }
};

// ------- PRODUCTOS -------
const Productos = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria 
      FROM productos p 
      JOIN categorias c ON p.categoria_id = c.id 
      ORDER BY p.nombre
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria 
      FROM productos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = $1
    `, [id]);
    return result.rows[0];
  },
  getByCategory: async (categoryId) => {
    const result = await pool.query(
      'SELECT * FROM productos WHERE categoria_id = $1 ORDER BY nombre',
      [categoryId]
    );
    return result.rows;
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO productos (nombre, categoria_id, descripcion, precio, stock, stock_minimo, imagen_url, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [data.nombre, data.categoria_id, data.descripcion, data.precio, data.stock || 0, data.stock_minimo || 10, data.imagen_url, data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE productos SET nombre = $1, categoria_id = $2, descripcion = $3, precio = $4, stock = $5, stock_minimo = $6, imagen_url = $7, estado = $8 WHERE id = $9',
      [data.nombre, data.categoria_id, data.descripcion, data.precio, data.stock, data.stock_minimo, data.imagen_url, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    return true;
  }
};

// ------- CLIENTES -------
const Clientes = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nombre');
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows[0];
  },
  getByDocumento: async (documento) => {
    const result = await pool.query('SELECT * FROM clientes WHERE documento = $1', [documento]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, apellido, tipo_documento, documento, telefono, email, direccion, foto_url, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [data.nombre, data.apellido, data.tipoDocumento, data.documento, data.telefono, data.email, data.direccion, data.foto_url, data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE clientes SET nombre = $1, apellido = $2, tipo_documento = $3, documento = $4, telefono = $5, email = $6, direccion = $7, estado = $8 WHERE id = $9',
      [data.nombre, data.apellido, data.tipoDocumento, data.documento, data.telefono, data.email, data.direccion, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
    return true;
  }
};

// ------- PROVEEDORES -------
const Proveedores = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre_empresa, nombre');
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO proveedores (tipo_persona, nombre_empresa, nit, nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
      [data.tipoPersona, data.nombreEmpresa, data.nit, data.nombre, data.apellido, data.tipoDocumento, data.numeroDocumento, data.telefono, data.email, data.direccion, data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE proveedores SET tipo_persona = $1, nombre_empresa = $2, nit = $3, nombre = $4, apellido = $5, tipo_documento = $6, numero_documento = $7, telefono = $8, email = $9, direccion = $10, estado = $11 WHERE id = $12',
      [data.tipoPersona, data.nombreEmpresa, data.nit, data.nombre, data.apellido, data.tipoDocumento, data.numeroDocumento, data.telefono, data.email, data.direccion, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM proveedores WHERE id = $1', [id]);
    return true;
  }
};

// ------- PEDIDOS -------
const Pedidos = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT p.*, 
             CONCAT(c.nombre, ' ', c.apellido) as cliente,
             c.email
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.fecha DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query(`
      SELECT p.*, 
             CONCAT(c.nombre, ' ', c.apellido) as cliente,
             c.email
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = $1
    `, [id]);
    return result.rows[0];
  },
  getDetalles: async (pedidoId) => {
    const result = await pool.query(`
      SELECT dp.*, pr.nombre as producto_nombre
      FROM detalle_pedidos dp
      JOIN productos pr ON dp.producto_id = pr.id
      WHERE dp.pedido_id = $1
    `, [pedidoId]);
    return result.rows;
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO pedidos (numero_pedido, cliente_id, fecha, fecha_entrega, detalles, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [data.numero_pedido, data.cliente_id, data.fecha, data.fecha_entrega, data.detalles, data.estado || 'Pendiente']
    );
    return result.rows[0].id;
  },
  addDetalle: async (pedidoId, productoId, cantidad, precioUnitario) => {
    const subtotal = cantidad * precioUnitario;
    await pool.query(
      'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
      [pedidoId, productoId, cantidad, precioUnitario, subtotal]
    );
    return true;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE pedidos SET numero_pedido = $1, fecha = $2, fecha_entrega = $3, detalles = $4, total = $5, estado = $6 WHERE id = $7',
      [data.numero_pedido, data.fecha, data.fecha_entrega, data.detalles, data.total, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM detalle_pedidos WHERE pedido_id = $1', [id]);
    await pool.query('DELETE FROM pedidos WHERE id = $1', [id]);
    return true;
  }
};

// ------- VENTAS -------
const Ventas = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT v.*, 
             CONCAT(c.nombre, ' ', c.apellido) as cliente,
             c.nombre as cliente_nombre,
             c.apellido as cliente_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.fecha DESC
    `);
    
    // Obtener detalles para cada venta
    for (let venta of result.rows) {
      const detalles = await pool.query(`
        SELECT dv.*, p.nombre as producto
        FROM detalle_ventas dv
        JOIN productos p ON dv.producto_id = p.id
        WHERE dv.venta_id = $1
      `, [venta.id]);
      venta.items = detalles.rows;
    }
    
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query(`
      SELECT v.*, 
             CONCAT(c.nombre, ' ', c.apellido) as cliente,
             c.nombre as cliente_nombre,
             c.apellido as cliente_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      WHERE v.id = $1
    `, [id]);
    
    if (result.rows[0]) {
      const detalles = await pool.query(`
        SELECT dv.*, p.nombre as producto
        FROM detalle_ventas dv
        JOIN productos p ON dv.producto_id = p.id
        WHERE dv.venta_id = $1
      `, [id]);
      result.rows[0].items = detalles.rows;
    }
    
    return result.rows[0];
  },
  getDetalles: async (ventaId) => {
    const result = await pool.query(`
      SELECT dv.*, pr.nombre as producto_nombre
      FROM detalle_ventas dv
      JOIN productos pr ON dv.producto_id = pr.id
      WHERE dv.venta_id = $1
    `, [ventaId]);
    return result.rows;
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO ventas (numero_venta, tipo, cliente_id, pedido_id, fecha, metodopago, total, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [data.numero_venta, data.tipo, data.cliente_id, data.pedido_id, data.fecha, data.metodopago, data.total, data.estado || 'Completada']
    );
    return result.rows[0].id;
  },
  addDetalle: async (ventaId, productoId, cantidad, precioUnitario) => {
    const subtotal = cantidad * precioUnitario;
    await pool.query(
      'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
      [ventaId, productoId, cantidad, precioUnitario, subtotal]
    );
    return true;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE ventas SET numero_venta = $1, tipo = $2, cliente_id = $3, pedido_id = $4, fecha = $5, metodopago = $6, total = $7, estado = $8 WHERE id = $9',
      [data.numero_venta, data.tipo, data.cliente_id, data.pedido_id, data.fecha, data.metodopago, data.total, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM detalle_ventas WHERE venta_id = $1', [id]);
    await pool.query('DELETE FROM ventas WHERE id = $1', [id]);
    return true;
  }
};

// ------- ABONOS -------
const Abonos = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT a.*, c.nombre as cliente_nombre
      FROM abonos a
      JOIN clientes c ON a.cliente_id = c.id
      ORDER BY a.fecha DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM abonos WHERE id = $1', [id]);
    return result.rows[0];
  },
  getByPedido: async (pedidoId) => {
    const result = await pool.query('SELECT * FROM abonos WHERE pedido_id = $1 ORDER BY fecha DESC', [pedidoId]);
    return result.rows;
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO abonos (numero_abono, pedido_id, cliente_id, monto, fecha, metodo_pago, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [data.numero_abono, data.pedido_id, data.cliente_id, data.monto, data.fecha, data.metodo_pago, data.estado || 'Registrado']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE abonos SET monto = $1, fecha = $2, metodo_pago = $3, estado = $4 WHERE id = $5',
      [data.monto, data.fecha, data.metodo_pago, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM abonos WHERE id = $1', [id]);
    return true;
  }
};

// ------- DOMICILIOS -------
const Domicilios = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT d.*, 
             p.numero_pedido as pedido,
             CONCAT(c.nombre, ' ', c.apellido) as cliente
      FROM domicilios d
      JOIN pedidos p ON d.pedido_id = p.id
      JOIN clientes c ON d.cliente_id = c.id
      ORDER BY d.fecha DESC, d.hora DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM domicilios WHERE id = $1', [id]);
    return result.rows[0];
  },
  getByPedido: async (pedidoId) => {
    const result = await pool.query('SELECT * FROM domicilios WHERE pedido_id = $1', [pedidoId]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO domicilios (numero_domicilio, pedido_id, cliente_id, direccion, repartidor, fecha, hora, estado, detalle) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [data.numero_domicilio, data.pedido_id, data.cliente_id, data.direccion, data.repartidor, data.fecha, data.hora, data.estado || 'Pendiente', data.detalle]
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE domicilios SET repartidor = $1, fecha = $2, hora = $3, estado = $4, detalle = $5 WHERE id = $6',
      [data.repartidor, data.fecha, data.hora, data.estado, data.detalle, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM domicilios WHERE id = $1', [id]);
    return true;
  }
};

// ------- COMPRAS -------
const Compras = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT c.*, p.nombre_empresa, p.nombre as proveedor_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      ORDER BY c.fecha DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query(`
      SELECT c.*, p.nombre_empresa, p.nombre as proveedor_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  },
  getDetalles: async (compraId) => {
    const result = await pool.query(`
      SELECT dc.*, pr.nombre as producto_nombre
      FROM detalle_compras dc
      JOIN productos pr ON dc.producto_id = pr.id
      WHERE dc.compra_id = $1
    `, [compraId]);
    return result.rows;
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO compras (numero_compra, proveedor_id, fecha, fecha_creacion, subtotal, iva, total, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [data.numero_compra, data.proveedor_id, data.fecha, data.fecha_creacion, data.subtotal, data.iva, data.total, data.estado || 'Pendiente']
    );
    return result.rows[0].id;
  },
  addDetalle: async (compraId, productoId, cantidad, precioUnitario) => {
    const subtotal = cantidad * precioUnitario;
    await pool.query(
      'INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
      [compraId, productoId, cantidad, precioUnitario, subtotal]
    );
    return true;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE compras SET numero_compra = $1, proveedor_id = $2, fecha = $3, subtotal = $4, iva = $5, total = $6, estado = $7 WHERE id = $8',
      [data.numero_compra, data.proveedor_id, data.fecha, data.subtotal, data.iva, data.total, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM detalle_compras WHERE compra_id = $1', [id]);
    await pool.query('DELETE FROM compras WHERE id = $1', [id]);
    return true;
  }
};

// ------- INSUMOS -------
const Insumos = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM insumos ORDER BY nombre');
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM insumos WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO insumos (nombre, descripcion, cantidad, unidad, stock_minimo, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [data.nombre, data.descripcion, data.cantidad || 0, data.unidad, data.stock_minimo || 10, data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE insumos SET nombre = $1, descripcion = $2, cantidad = $3, unidad = $4, stock_minimo = $5, estado = $6 WHERE id = $7',
      [data.nombre, data.descripcion, data.cantidad, data.unidad, data.stock_minimo, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM insumos WHERE id = $1', [id]);
    return true;
  }
};

// ------- ENTREGAS INSUMOS -------
const EntregasInsumos = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT ei.*, i.nombre as insumo_nombre
      FROM entregas_insumos ei
      JOIN insumos i ON ei.insumo_id = i.id
      ORDER BY ei.fecha DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM entregas_insumos WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO entregas_insumos (numero_entrega, insumo_id, cantidad, unidad, operario, fecha, hora) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [data.numero_entrega, data.insumo_id, data.cantidad, data.unidad, data.operario, data.fecha, data.hora]
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE entregas_insumos SET insumo_id = $1, cantidad = $2, unidad = $3, operario = $4, fecha = $5, hora = $6 WHERE id = $7',
      [data.insumo_id, data.cantidad, data.unidad, data.operario, data.fecha, data.hora, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM entregas_insumos WHERE id = $1', [id]);
    return true;
  }
};

// ------- PRODUCCIÓN -------
const Produccion = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT p.*, pr.nombre as producto_nombre
      FROM produccion p
      JOIN productos pr ON p.producto_id = pr.id
      ORDER BY p.fecha DESC
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM produccion WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO produccion (numero_produccion, producto_id, cantidad, fecha, responsable, estado, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [data.numero_produccion, data.producto_id, data.cantidad, data.fecha, data.responsable, data.estado || 'Pendiente', data.notes]
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE produccion SET cantidad = $1, fecha = $2, responsable = $3, estado = $4, notes = $5 WHERE id = $6',
      [data.cantidad, data.fecha, data.responsable, data.estado, data.notes, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM produccion WHERE id = $1', [id]);
    return true;
  }
};

// ------- ROLES -------
const Roles = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT r.*, 
             (SELECT COUNT(*) FROM usuarios WHERE rol_id = r.id) as usuarios
      FROM roles r 
      ORDER BY r.nombre
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO roles (nombre, descripcion, permisos, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [data.nombre, data.descripcion, data.permisos || [], data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE roles SET nombre = $1, descripcion = $2, permisos = $3, estado = $4 WHERE id = $5',
      [data.nombre, data.descripcion, data.permisos, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    return true;
  }
};

// ------- USUARIOS -------
const Usuarios = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT u.*, r.nombre as rol
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      ORDER BY u.nombre
    `);
    return result.rows;
  },
  getById: async (id) => {
    const result = await pool.query(`
      SELECT u.*, r.nombre as rol
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `, [id]);
    return result.rows[0];
  },
  getByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
  },
  getByDocumento: async (documento) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE documento = $1', [documento]);
    return result.rows[0];
  },
  create: async (data) => {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, tipo_documento, documento, direccion, email, telefono, password_hash, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [data.nombre, data.apellido, data.tipo_documento, data.documento, data.direccion, data.email, data.telefono, data.password_hash || '$2a$10$DEFAULT', data.rol_id, data.estado || 'Activo']
    );
    return result.rows[0].id;
  },
  update: async (id, data) => {
    await pool.query(
      'UPDATE usuarios SET nombre = $1, apellido = $2, tipo_documento = $3, documento = $4, direccion = $5, email = $6, telefono = $7, rol_id = $8, estado = $9 WHERE id = $10',
      [data.nombre, data.apellido, data.tipo_documento, data.documento, data.direccion, data.email, data.telefono, data.rol_id, data.estado, id]
    );
    return true;
  },
  delete: async (id) => {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return true;
  }
};

// Exportar todos los modelos
module.exports = {
  Categorias,
  Productos,
  Clientes,
  Proveedores,
  Pedidos,
  Ventas,
  Abonos,
  Domicilios,
  Compras,
  Insumos,
  EntregasInsumos,
  Produccion,
  Roles,
  Usuarios
};
