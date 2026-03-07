const models = require('../models/entities.models');

module.exports = {
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

