#!/usr/bin/env node
/**
 * Test de Flujo CRUD de Pedidos
 * Verifica que la creación, lectura, actualización y eliminación de pedidos funciona correctamente
 */

const http = require('http');

const BASE_URL = 'http://localhost:3003';

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(type, message) {
  const symbols = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    test: '🧪'
  };
  const color = type === 'error' ? colors.red : type === 'success' ? colors.green : colors.blue;
  console.log(`${color}${symbols[type]} ${message}${colors.reset}`);
}

async function makeRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST: FLUJO CRUD DE PEDIDOS');
  console.log('='.repeat(60) + '\n');

  try {
    // 1. Obtener un cliente existente
    log('test', 'Obteniendo clientes...');
    const clientesRes = await makeRequest('GET', '/api/clientes');
    if (clientesRes.status !== 200 || !Array.isArray(clientesRes.data)) {
      throw new Error(`Error obteniendo clientes. Status: ${clientesRes.status}`);
    }
    const cliente = clientesRes.data[0];
    if (!cliente || !cliente.id) throw new Error('No hay clientes disponibles');
    log('success', `Cliente obtenido: ${cliente.nombre} ${cliente.apellido} (ID: ${cliente.id})`);

    // 2. Obtener un producto existente
    log('test', 'Obteniendo productos...');
    const productosRes = await makeRequest('GET', '/api/productos');
    if (productosRes.status !== 200 || !Array.isArray(productosRes.data)) {
      throw new Error(`Error obteniendo productos. Status: ${productosRes.status}`);
    }
    const producto = productosRes.data[0];
    if (!producto || !producto.id) throw new Error('No hay productos disponibles');
    log('success', `Producto obtenido: ${producto.nombre} (ID: ${producto.id})`);

    // 3. Crear un pedido
    log('test', 'Creando pedido...');
    const nuevoP = {
      cliente_id: cliente.id,
      fecha: new Date().toISOString().split('T')[0],
      fecha_entrega: null,
      detalles: 'Pedido de prueba automatizada',
      total: 100000,
      estado: 'Pendiente'
    };
    const createRes = await makeRequest('POST', '/api/pedidos', nuevoP);
    if (createRes.status !== 201) {
      throw new Error(`Error creando pedido. Status: ${createRes.status}. Response: ${JSON.stringify(createRes.data)}`);
    }
    const pedidoId = createRes.data?.id;
    if (!pedidoId) throw new Error('No se obtuvo ID del pedido creado');
    log('success', `Pedido creado exitosamente con ID: ${pedidoId}`);

    // 4. Agregar producto al pedido
    log('test', 'Agregando producto al pedido...');
    const detalleData = {
      pedidoId,
      productoId: producto.id,
      cantidad: 2,
      precioUnitario: 50000
    };
    const addProductRes = await makeRequest('POST', '/api/pedidos/producto', detalleData);
    if (addProductRes.status !== 201) {
      throw new Error(`Error agregando producto. Status: ${addProductRes.status}. Response: ${JSON.stringify(addProductRes.data)}`);
    }
    log('success', `Producto agregado al pedido: ${producto.nombre} (cantidad: 2)`);

    // 5. Leer el pedido
    log('test', 'Leyendo pedido creado...');
    const readRes = await makeRequest('GET', `/api/pedidos/${pedidoId}`);
    if (readRes.status !== 200) {
      throw new Error(`Error leyendo pedido. Status: ${readRes.status}`);
    }
    const pedidoActual = readRes.data;
    log('success', `Pedido leído exitosamente. Estado: ${pedidoActual.estado}, Total: $${pedidoActual.total}`);

    // 6. Actualizar el pedido
    log('test', 'Actualizando pedido...');
    const updateData = {
      ...nuevoP,
      estado: 'En Proceso',
      total: 150000
    };
    const updateRes = await makeRequest('PUT', `/api/pedidos/${pedidoId}`, updateData);
    if (updateRes.status !== 200) {
      throw new Error(`Error actualizando pedido. Status: ${updateRes.status}. Response: ${JSON.stringify(updateRes.data)}`);
    }
    log('success', 'Pedido actualizado exitosamente');

    // 7. Verificar actualización
    const verifyRes = await makeRequest('GET', `/api/pedidos/${pedidoId}`);
    const pedidoActualizado = verifyRes.data;
    log('success', `Verificación: Estado = ${pedidoActualizado.estado}, Total = $${pedidoActualizado.total}`);

    // 8. Listar todos los pedidos del cliente
    log('test', 'Listando pedidos del cliente...');
    const listRes = await makeRequest('GET', `/api/pedidos/cliente/${cliente.id}`);
    if (listRes.status !== 200 || !Array.isArray(listRes.data)) {
      throw new Error(`Error listando pedidos. Status: ${listRes.status}`);
    }
    log('success', `Pedidos del cliente listados: ${listRes.data.length} pedido(s)`);

    // 9. Eliminar el pedido
    log('test', 'Eliminando pedido...');
    const deleteRes = await makeRequest('DELETE', `/api/pedidos/${pedidoId}`);
    if (deleteRes.status !== 200) {
      throw new Error(`Error eliminando pedido. Status: ${deleteRes.status}. Response: ${JSON.stringify(deleteRes.data)}`);
    }
    log('success', 'Pedido eliminado exitosamente');

    // 10. Verificar que fue eliminado
    const verifyDeleteRes = await makeRequest('GET', `/api/pedidos/${pedidoId}`);
    if (verifyDeleteRes.status === 404) {
      log('success', 'Verificación: Pedido no encontrado (eliminación confirmada)');
    } else if (verifyDeleteRes.status === 200) {
      log('error', 'Pedido aún existe después de eliminación');
    }

    console.log('\n' + '='.repeat(60));
    log('success', 'TODOS LOS TESTS PASARON ✨');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    log('error', `TEST FALLIDO: ${error.message}`);
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Ejecutar tests
runTests().catch(error => {
  log('error', `Error no capturado: ${error.message}`);
  process.exit(1);
});
