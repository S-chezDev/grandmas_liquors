const express = require('express');
const controllers = require('./controllers');

// Crear un router
const router = express.Router();

/**
 * RUTAS API PARA TODAS LAS ENTIDADES
 */

// ========== CATEGORÍAS ==========
router.get('/api/categorias', controllers.categoriasController.getAll);
router.get('/api/categorias/:id', controllers.categoriasController.getById);
router.post('/api/categorias', controllers.categoriasController.create);
router.put('/api/categorias/:id', controllers.categoriasController.update);
router.delete('/api/categorias/:id', controllers.categoriasController.delete);

// ========== PRODUCTOS ==========
router.get('/api/productos', controllers.productosController.getAll);
router.get('/api/productos/:id', controllers.productosController.getById);
router.get('/api/productos/categoria/:categoryId', controllers.productosController.getByCategory);
router.post('/api/productos', controllers.productosController.create);
router.put('/api/productos/:id', controllers.productosController.update);
router.delete('/api/productos/:id', controllers.productosController.delete);

// ========== CLIENTES ==========
router.get('/api/clientes', controllers.clientesController.getAll);
router.get('/api/clientes/:id', controllers.clientesController.getById);
router.post('/api/clientes', controllers.clientesController.create);
router.put('/api/clientes/:id', controllers.clientesController.update);
router.delete('/api/clientes/:id', controllers.clientesController.delete);

// ========== PROVEEDORES ==========
router.get('/api/proveedores', controllers.proveedoresController.getAll);
router.get('/api/proveedores/:id', controllers.proveedoresController.getById);
router.post('/api/proveedores', controllers.proveedoresController.create);
router.put('/api/proveedores/:id', controllers.proveedoresController.update);
router.delete('/api/proveedores/:id', controllers.proveedoresController.delete);

// ========== PEDIDOS ==========
router.get('/api/pedidos', controllers.pedidosController.getAll);
router.get('/api/pedidos/:id', controllers.pedidosController.getById);
router.post('/api/pedidos', controllers.pedidosController.create);
router.post('/api/pedidos/producto', controllers.pedidosController.addProducto);
router.put('/api/pedidos/:id', controllers.pedidosController.update);
router.delete('/api/pedidos/:id', controllers.pedidosController.delete);

// ========== VENTAS ==========
router.get('/api/ventas', controllers.ventasController.getAll);
router.get('/api/ventas/:id', controllers.ventasController.getById);
router.post('/api/ventas', controllers.ventasController.create);
router.post('/api/ventas/producto', controllers.ventasController.addProducto);
router.put('/api/ventas/:id', controllers.ventasController.update);
router.delete('/api/ventas/:id', controllers.ventasController.delete);

// ========== ABONOS ==========
router.get('/api/abonos', controllers.abonosController.getAll);
router.get('/api/abonos/:id', controllers.abonosController.getById);
router.get('/api/abonos/pedido/:pedidoId', controllers.abonosController.getByPedido);
router.post('/api/abonos', controllers.abonosController.create);
router.put('/api/abonos/:id', controllers.abonosController.update);
router.delete('/api/abonos/:id', controllers.abonosController.delete);

// ========== DOMICILIOS ==========
router.get('/api/domicilios', controllers.domiciliosController.getAll);
router.get('/api/domicilios/:id', controllers.domiciliosController.getById);
router.get('/api/domicilios/pedido/:pedidoId', controllers.domiciliosController.getByPedido);
router.post('/api/domicilios', controllers.domiciliosController.create);
router.put('/api/domicilios/:id', controllers.domiciliosController.update);
router.delete('/api/domicilios/:id', controllers.domiciliosController.delete);

// ========== COMPRAS ==========
router.get('/api/compras', controllers.comprasController.getAll);
router.get('/api/compras/:id', controllers.comprasController.getById);
router.post('/api/compras', controllers.comprasController.create);
router.post('/api/compras/producto', controllers.comprasController.addProducto);
router.put('/api/compras/:id', controllers.comprasController.update);
router.delete('/api/compras/:id', controllers.comprasController.delete);

// ========== INSUMOS ==========
router.get('/api/insumos', controllers.insumosController.getAll);
router.get('/api/insumos/:id', controllers.insumosController.getById);
router.post('/api/insumos', controllers.insumosController.create);
router.put('/api/insumos/:id', controllers.insumosController.update);
router.delete('/api/insumos/:id', controllers.insumosController.delete);

// ========== ENTREGAS INSUMOS ==========
router.get('/api/entregas-insumos', controllers.entregasInsumosController.getAll);
router.get('/api/entregas-insumos/:id', controllers.entregasInsumosController.getById);
router.post('/api/entregas-insumos', controllers.entregasInsumosController.create);
router.put('/api/entregas-insumos/:id', controllers.entregasInsumosController.update);
router.delete('/api/entregas-insumos/:id', controllers.entregasInsumosController.delete);

// ========== PRODUCCIÓN ==========
router.get('/api/produccion', controllers.produccionController.getAll);
router.get('/api/produccion/:id', controllers.produccionController.getById);
router.post('/api/produccion', controllers.produccionController.create);
router.put('/api/produccion/:id', controllers.produccionController.update);
router.delete('/api/produccion/:id', controllers.produccionController.delete);

// ========== ROLES ==========
router.get('/api/roles', controllers.rolesController.getAll);
router.get('/api/roles/:id', controllers.rolesController.getById);
router.post('/api/roles', controllers.rolesController.create);
router.put('/api/roles/:id', controllers.rolesController.update);
router.delete('/api/roles/:id', controllers.rolesController.delete);

// ========== USUARIOS ==========
router.get('/api/usuarios', controllers.usuariosController.getAll);
router.get('/api/usuarios/:id', controllers.usuariosController.getById);
router.get('/api/usuarios/email/:email', controllers.usuariosController.getByEmail);
router.get('/api/usuarios/documento/:documento', controllers.usuariosController.getByDocumento);
router.post('/api/usuarios', controllers.usuariosController.create);
router.put('/api/usuarios/:id', controllers.usuariosController.update);
router.delete('/api/usuarios/:id', controllers.usuariosController.delete);

module.exports = router;
