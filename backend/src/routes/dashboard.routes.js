const express = require('express');
const controller = require('../controllers/dashboard.controllers');

const router = express.Router();

router.get('/resumen', controller.getStaffResumen);

module.exports = router;
