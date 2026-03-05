const express = require('express');

const categoriasRoutes = require('./categorias.routes');
const productosRoutes = require('./productos.routes');
const clientesRoutes = require('./clientes.routes');
const proveedoresRoutes = require('./proveedores.routes');
const pedidosRoutes = require('./pedidos.routes');
const ventasRoutes = require('./ventas.routes');
const abonosRoutes = require('./abonos.routes');
const domiciliosRoutes = require('./domicilios.routes');
const comprasRoutes = require('./compras.routes');
const insumosRoutes = require('./insumos.routes');
const entregasInsumosRoutes = require('./entregas-insumos.routes');
const produccionRoutes = require('./produccion.routes');
const rolesRoutes = require('./roles.routes');
const usuariosRoutes = require('./usuarios.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/api/categorias', categoriasRoutes);
router.use('/api/productos', productosRoutes);
router.use('/api/clientes', clientesRoutes);
router.use('/api/proveedores', proveedoresRoutes);
router.use('/api/pedidos', pedidosRoutes);
router.use('/api/ventas', ventasRoutes);
router.use('/api/abonos', abonosRoutes);
router.use('/api/domicilios', domiciliosRoutes);
router.use('/api/compras', comprasRoutes);
router.use('/api/insumos', insumosRoutes);
router.use('/api/entregas-insumos', entregasInsumosRoutes);
router.use('/api/produccion', produccionRoutes);
router.use('/api/roles', rolesRoutes);
router.use('/api/usuarios', usuariosRoutes);
router.use('/api/auth', authRoutes);

module.exports = router;
