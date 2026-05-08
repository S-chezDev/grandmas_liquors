const models = require('../models/entities.models');

module.exports = {
  getAll: async (req, res) => {
    try {
      const data = await models.ProductoInsumos.getAll();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByProducto: async (req, res) => {
    try {
      const data = await models.ProductoInsumos.getByProducto(req.params.productoId);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const row = await models.ProductoInsumos.getById(req.params.id);
      if (!row) return res.status(404).json({ success: false, message: 'Receta no encontrada' });
      res.json({ success: true, data: row });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.ProductoInsumos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Receta creada exitosamente' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.ProductoInsumos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Receta actualizada exitosamente' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.ProductoInsumos.delete(req.params.id);
      res.json({ success: true, message: 'Receta eliminada exitosamente' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  },
};
