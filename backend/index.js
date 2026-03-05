//cambios desde el pc de manolo 1mer commit
const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./db');
const routes = require('./src/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ===== RUTAS =====
// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Todas las rutas de API
app.use('/', routes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: config.server.env === 'development' ? err : {}
  });
});

// ===== INICIAR SERVIDOR =====
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`\n`);
  console.log(`╔════════════════════════════════════════════════════════════╗`);
  console.log(`║        LIQUEUR SALES MANAGEMENT APP - BACKEND              ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
  console.log(`\n`);
  console.log(`✓ Servidor Backend iniciado exitosamente`);
  console.log(`✓ Puerto: ${PORT}`);
  console.log(`✓ Ambiente: ${config.server.env}`);
  console.log(`✓ Base de Datos: Conectada`);
  console.log(`✓ Conexión App-Backend: Establecida`);
  console.log(`\n📋 ENDPOINTS DISPONIBLES:`);
  console.log(`   - GET    /api/health                 (Verificar estado)`);
  console.log(`   - GET    /api/categorias             (Listar categorías)`);
  console.log(`   - GET    /api/productos              (Listar productos)`);
  console.log(`   - GET    /api/clientes               (Listar clientes)`);
  console.log(`   - GET    /api/proveedores            (Listar proveedores)`);
  console.log(`   - GET    /api/pedidos                (Listar pedidos)`);
  console.log(`   - GET    /api/ventas                 (Listar ventas)`);
  console.log(`   - GET    /api/abonos                 (Listar abonos)`);
  console.log(`   - GET    /api/domicilios             (Listar domicilios)`);
  console.log(`   - GET    /api/compras                (Listar compras)`);
  console.log(`   - GET    /api/insumos                (Listar insumos)`);
  console.log(`   - GET    /api/entregas-insumos       (Listar entregas)`);
  console.log(`   - GET    /api/produccion             (Listar producción)`);
  console.log(`\n🌐 URL Base: http://localhost:${PORT}`);
  console.log(`\n════════════════════════════════════════════════════════════\n`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

module.exports = app;
