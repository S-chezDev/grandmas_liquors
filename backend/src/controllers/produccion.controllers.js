const models = require('../../models/entities.models');

module.exports = {
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
      if (!produccion) return res.status(404).json({ success: false, message: 'Registro de produccion no encontrado' });
      res.json({ success: true, data: produccion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Produccion.create(req.body);
      res.status(201).json({ success: true, id, message: 'Produccion creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Produccion.update(req.params.id, req.body);
      res.json({ success: true, message: 'Produccion actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Produccion.delete(req.params.id);
      res.json({ success: true, message: 'Produccion eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
