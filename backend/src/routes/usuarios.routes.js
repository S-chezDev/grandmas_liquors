const express = require('express');
const controller = require('../controllers/usuarios.controllers');

const router = express.Router();
router.get('/', controller.getAll);
router.get('/email/:email', controller.getByEmail);
router.get('/documento/:documento', controller.getByDocumento);
router.post('/', controller.create);
// Rutas específicas ANTES de rutas genéricas con parámetro /:id
router.put('/:id/estado', controller.updateStatus);
router.put('/:id/rol', controller.assignRole);
router.get('/:id/impacto-eliminacion', controller.getDeleteImpactById);
router.get('/:id/detalle-completo', controller.getFullDetailById);
router.post('/:id/reset-password-forzado', controller.forceResetPassword);
router.get('/:id/historial', controller.getActivityById);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
