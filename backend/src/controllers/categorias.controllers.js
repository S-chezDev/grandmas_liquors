const models = require('../../models/entities.models');

module.exports = {
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
      if (!categoria) return res.status(404).json({ success: false, message: 'Categoria no encontrada' });
      res.json({ success: true, data: categoria });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Categorias.create(req.body);
      res.status(201).json({ success: true, id, message: 'Categoria creada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Categorias.update(req.params.id, req.body);
      res.json({ success: true, message: 'Categoria actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Categorias.delete(req.params.id);
      res.json({ success: true, message: 'Categoria eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
