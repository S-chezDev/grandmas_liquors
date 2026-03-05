const models = require('../../models/entities.models');

module.exports = {
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
