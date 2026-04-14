const models = require('../models/entities.models');

module.exports = {
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
      res.status(error.statusCode || 500).json({ success: false, message: error.message, details: error.details });
    }
  },
  addProducto: async (req, res) => {
    try {
      const { compraId, productoId, cantidad, precioUnitario, permisoExtraordinario, motivoPermiso } = req.body;
      await models.Compras.addDetalle(compraId, productoId, cantidad, precioUnitario, {
        permisoExtraordinario,
        motivoPermiso,
      });
      res.status(201).json({ success: true, message: 'Producto agregado a la compra' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message, details: error.details });
    }
  },
  update: async (req, res) => {
    try {
      await models.Compras.update(req.params.id, req.body);
      res.json({ success: true, message: 'Compra actualizada exitosamente' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message, details: error.details });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Compras.delete(req.params.id);
      res.json({ success: true, message: 'Compra eliminada exitosamente' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message, details: error.details });
    }
  }
};

