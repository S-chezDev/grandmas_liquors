const models = require('../models/entities.models');

module.exports = {
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

