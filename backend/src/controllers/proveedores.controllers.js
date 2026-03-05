const models = require('../../models/entities.models');

module.exports = {
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
