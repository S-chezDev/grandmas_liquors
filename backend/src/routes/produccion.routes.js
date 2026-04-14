const express = require('express');
const controller = require('../controllers/produccion.controllers');

const router = express.Router();
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/estado', controller.updateStatus);
router.delete('/:id', controller.delete);

module.exports = router;
