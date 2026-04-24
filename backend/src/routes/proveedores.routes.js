const express = require('express');
const controller = require('../controllers/proveedores.controllers');

const router = express.Router();
router.get('/', controller.getAll);
router.get('/nit/:nit', controller.getByNit);
router.get('/email/:email', controller.getByEmail);
router.get('/telefono/:telefono', controller.getByTelefono);
router.get('/:id', controller.getById);
router.get('/:id/historial', controller.getHistory);
router.get('/:id/pendientes', controller.getPendingPurchases);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/estado', controller.updateStatus);
router.delete('/:id', controller.delete);

module.exports = router;
