const models = require('../models/entities.models');

module.exports = {
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

