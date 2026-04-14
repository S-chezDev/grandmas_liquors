const express = require('express');
const controller = require('../controllers/compras.controllers');

const router = express.Router();
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/producto', controller.addProducto);
router.put('/:id', controller.update);
router.put('/:id/estado', controller.updateStatus);
router.delete('/:id', controller.delete);

module.exports = router;
