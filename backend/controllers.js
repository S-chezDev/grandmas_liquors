const models = require('./models');

/**
 * CONTROLADORES PARA TODAS LAS ENTIDADES
 */

// ========== CATEGORÍAS ==========
const categoriasController = {
  getAll: async (req, res) => {
    try {
      const categorias = await models.Categorias.getAll();
      res.json({ success: true, data: categorias });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const categoria = await models.Categorias.getById(req.params.id);
      if (!categoria) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      res.json({ success: true, data: categoria });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Categorias.create(req.body);
      res.status(201).json({ success: true, id, message: 'Categoría creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Categorias.update(req.params.id, req.body);
      res.json({ success: true, message: 'Categoría actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Categorias.delete(req.params.id);
      res.json({ success: true, message: 'Categoría eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== PRODUCTOS ==========
const productosController = {
  getAll: async (req, res) => {
    try {
      const productos = await models.Productos.getAll();
      res.json({ success: true, data: productos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const producto = await models.Productos.getById(req.params.id);
      if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      res.json({ success: true, data: producto });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByCategory: async (req, res) => {
    try {
      const productos = await models.Productos.getByCategory(req.params.categoryId);
      res.json({ success: true, data: productos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Productos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Producto creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Productos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Producto actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Productos.delete(req.params.id);
      res.json({ success: true, message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== CLIENTES ==========
const clientesController = {
  getAll: async (req, res) => {
    try {
      const clientes = await models.Clientes.getAll();
      res.json({ success: true, data: clientes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const cliente = await models.Clientes.getById(req.params.id);
      if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      res.json({ success: true, data: cliente });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Clientes.create(req.body);
      res.status(201).json({ success: true, id, message: 'Cliente creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Clientes.update(req.params.id, req.body);
      res.json({ success: true, message: 'Cliente actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Clientes.delete(req.params.id);
      res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== PROVEEDORES ==========
const proveedoresController = {
  getAll: async (req, res) => {
    try {
      const proveedores = await models.Proveedores.getAll();
      res.json({ success: true, data: proveedores });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const proveedor = await models.Proveedores.getById(req.params.id);
      if (!proveedor) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      res.json({ success: true, data: proveedor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Proveedores.create(req.body);
      res.status(201).json({ success: true, id, message: 'Proveedor creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Proveedores.update(req.params.id, req.body);
      res.json({ success: true, message: 'Proveedor actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Proveedores.delete(req.params.id);
      res.json({ success: true, message: 'Proveedor eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== PEDIDOS ==========
const pedidosController = {
  getAll: async (req, res) => {
    try {
      const pedidos = await models.Pedidos.getAll();
      res.json({ success: true, data: pedidos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const pedido = await models.Pedidos.getById(req.params.id);
      if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
      
      const detalles = await models.Pedidos.getDetalles(req.params.id);
      res.json({ success: true, data: { ...pedido, detalles } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Pedidos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Pedido creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  addProducto: async (req, res) => {
    try {
      const { pedidoId, productoId, cantidad, precioUnitario } = req.body;
      await models.Pedidos.addDetalle(pedidoId, productoId, cantidad, precioUnitario);
      res.status(201).json({ success: true, message: 'Producto agregado al pedido' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Pedidos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Pedido actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Pedidos.delete(req.params.id);
      res.json({ success: true, message: 'Pedido eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== VENTAS ==========
const ventasController = {
  getAll: async (req, res) => {
    try {
      const ventas = await models.Ventas.getAll();
      res.json({ success: true, data: ventas });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const venta = await models.Ventas.getById(req.params.id);
      if (!venta) return res.status(404).json({ success: false, message: 'Venta no encontrada' });
      
      const detalles = await models.Ventas.getDetalles(req.params.id);
      res.json({ success: true, data: { ...venta, detalles } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Ventas.create(req.body);
      res.status(201).json({ success: true, id, message: 'Venta creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  addProducto: async (req, res) => {
    try {
      const { ventaId, productoId, cantidad, precioUnitario } = req.body;
      await models.Ventas.addDetalle(ventaId, productoId, cantidad, precioUnitario);
      res.status(201).json({ success: true, message: 'Producto agregado a la venta' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Ventas.update(req.params.id, req.body);
      res.json({ success: true, message: 'Venta actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Ventas.delete(req.params.id);
      res.json({ success: true, message: 'Venta eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== ABONOS ==========
const abonosController = {
  getAll: async (req, res) => {
    try {
      const abonos = await models.Abonos.getAll();
      res.json({ success: true, data: abonos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const abono = await models.Abonos.getById(req.params.id);
      if (!abono) return res.status(404).json({ success: false, message: 'Abono no encontrado' });
      res.json({ success: true, data: abono });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByPedido: async (req, res) => {
    try {
      const abonos = await models.Abonos.getByPedido(req.params.pedidoId);
      res.json({ success: true, data: abonos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Abonos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Abono creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Abonos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Abono actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Abonos.delete(req.params.id);
      res.json({ success: true, message: 'Abono eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== DOMICILIOS ==========
const domiciliosController = {
  getAll: async (req, res) => {
    try {
      const domicilios = await models.Domicilios.getAll();
      res.json({ success: true, data: domicilios });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const domicilio = await models.Domicilios.getById(req.params.id);
      if (!domicilio) return res.status(404).json({ success: false, message: 'Domicilio no encontrado' });
      res.json({ success: true, data: domicilio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByPedido: async (req, res) => {
    try {
      const domicilio = await models.Domicilios.getByPedido(req.params.pedidoId);
      res.json({ success: true, data: domicilio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Domicilios.create(req.body);
      res.status(201).json({ success: true, id, message: 'Domicilio creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Domicilios.update(req.params.id, req.body);
      res.json({ success: true, message: 'Domicilio actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Domicilios.delete(req.params.id);
      res.json({ success: true, message: 'Domicilio eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== COMPRAS ==========
const comprasController = {
  getAll: async (req, res) => {
    try {
      const compras = await models.Compras.getAll();
      res.json({ success: true, data: compras });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const compra = await models.Compras.getById(req.params.id);
      if (!compra) return res.status(404).json({ success: false, message: 'Compra no encontrada' });
      
      const detalles = await models.Compras.getDetalles(req.params.id);
      res.json({ success: true, data: { ...compra, detalles } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Compras.create(req.body);
      res.status(201).json({ success: true, id, message: 'Compra creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  addProducto: async (req, res) => {
    try {
      const { compraId, productoId, cantidad, precioUnitario } = req.body;
      await models.Compras.addDetalle(compraId, productoId, cantidad, precioUnitario);
      res.status(201).json({ success: true, message: 'Producto agregado a la compra' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Compras.update(req.params.id, req.body);
      res.json({ success: true, message: 'Compra actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Compras.delete(req.params.id);
      res.json({ success: true, message: 'Compra eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== INSUMOS ==========
const insumosController = {
  getAll: async (req, res) => {
    try {
      const insumos = await models.Insumos.getAll();
      res.json({ success: true, data: insumos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const insumo = await models.Insumos.getById(req.params.id);
      if (!insumo) return res.status(404).json({ success: false, message: 'Insumo no encontrado' });
      res.json({ success: true, data: insumo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Insumos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Insumo creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Insumos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Insumo actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Insumos.delete(req.params.id);
      res.json({ success: true, message: 'Insumo eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== ENTREGAS INSUMOS ==========
const entregasInsumosController = {
  getAll: async (req, res) => {
    try {
      const entregas = await models.EntregasInsumos.getAll();
      res.json({ success: true, data: entregas });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const entrega = await models.EntregasInsumos.getById(req.params.id);
      if (!entrega) return res.status(404).json({ success: false, message: 'Entrega no encontrada' });
      res.json({ success: true, data: entrega });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.EntregasInsumos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Entrega creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.EntregasInsumos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Entrega actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.EntregasInsumos.delete(req.params.id);
      res.json({ success: true, message: 'Entrega eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ========== PRODUCCIÓN ==========
const produccionController = {
  getAll: async (req, res) => {
    try {
      const produccion = await models.Produccion.getAll();
      res.json({ success: true, data: produccion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const produccion = await models.Produccion.getById(req.params.id);
      if (!produccion) return res.status(404).json({ success: false, message: 'Registro de producción no encontrado' });
      res.json({ success: true, data: produccion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Produccion.create(req.body);
      res.status(201).json({ success: true, id, message: 'Producción creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Produccion.update(req.params.id, req.body);
      res.json({ success: true, message: 'Producción actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Produccion.delete(req.params.id);
      res.json({ success: true, message: 'Producción eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Exportar todos los controladores
module.exports = {
  categoriasController,
  productosController,
  clientesController,
  proveedoresController,
  pedidosController,
  ventasController,
  abonosController,
  domiciliosController,
  comprasController,
  insumosController,
  entregasInsumosController,
  produccionController
};
