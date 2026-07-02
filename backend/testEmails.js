require('dotenv').config();
const emailService = require('./src/services/email.service');

const TEST_EMAIL = process.env.MAIL_USER || 'grandmasliqueurs@gmail.com';

async function runTests() {
  console.log(`Iniciando pruebas de envío de correos a: ${TEST_EMAIL}`);

  try {
    // 1. Bienvenida (con credenciales)
    console.log('1. Enviando Welcome Email (con credenciales)...');
    await emailService.sendWelcomeEmail({
      to: TEST_EMAIL,
      name: 'Cliente de Prueba',
      email: TEST_EMAIL,
      password: 'MiPasswordSeguro123',
      emailCredentialExpiresHours: 24,
    });
    console.log('OK - Welcome Email');

    // 2. Bienvenida (sin credenciales)
    console.log('2. Enviando Welcome Email (sin credenciales)...');
    await emailService.sendWelcomeEmail({
      to: TEST_EMAIL,
      name: 'Cliente de Prueba',
      email: TEST_EMAIL,
    });
    console.log('OK - Welcome Email (sin credenciales)');

    // 3. Recuperar contraseña
    console.log('3. Enviando Temporary Password...');
    await emailService.sendTemporaryPasswordEmail({
      to: TEST_EMAIL,
      name: 'Cliente de Prueba',
      tempPassword: '9 3 4 1 2 5',
    });
    console.log('OK - Temporary Password');

    // 4. Confirmación de Pedido (con PDFs)
    console.log('4. Enviando Pedido Creado (con generación de PDF)...');
    await emailService.sendPedidoCreatedEmail({
      to: TEST_EMAIL,
      pedidoId: 1045,
      name: 'Cliente de Prueba',
      email: TEST_EMAIL,
      clienteDocumento: '1020304050',
      fechaPedido: '2026-07-01T15:00:00Z',
      fechaEntrega: '2026-07-02T18:00:00Z',
      estado: 'Pendiente',
      direccion: 'Calle Falsa 123, Medellín',
      telefono: '3001234567',
      detalles: 'Entregar en portería, por favor.',
      metodoPago: 'Transferencia',
      esquemaAbono: '50%',
      productos: [
        { nombre: 'Aguardiente Antioqueño Tapa Azul x 750ml', cantidad: 2, precio: 45000, subtotal: 90000 },
        { nombre: 'Ron Medellín Añejo 3 Años x 750ml', cantidad: 1, precio: 55000, subtotal: 55000 },
      ],
      total: 145000,
      montoAbonado: 72500,
      abono: {
        id: 301,
        monto: 72500,
        fecha: '2026-07-01T15:05:00Z',
        metodo_pago: 'Transferencia',
        estado: 'Verificado',
        detalle: 'Transferencia Bancolombia terminada en 4321',
      }
    });
    console.log('OK - Pedido Creado');

    // 5. Cambio de correo
    console.log('5. Enviando Notificación Cambio de Correo...');
    await emailService.sendEmailChangeNotification({
      to: TEST_EMAIL,
      name: 'Cliente de Prueba',
      previousEmail: 'correo_viejo@gmail.com',
      currentEmail: TEST_EMAIL,
    });
    console.log('OK - Cambio de Correo');

    // 6. Cuenta inactivada
    console.log('6. Enviando Notificación Cuenta Inactivada...');
    await emailService.sendUserStatusChangeNotification({
      to: TEST_EMAIL,
      name: 'Cliente de Prueba',
      estado: 'Inactivo',
      motivo: 'Solicitud del cliente',
      changedBy: 'Admin (admin@grandmasliquors.com)'
    });
    console.log('OK - Cuenta Inactivada');

    console.log('\\n--- ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE! ---');
    console.log(`Revisa la bandeja de entrada de ${TEST_EMAIL} para validar los contenidos.`);
  } catch (error) {
    console.error('ERROR durante las pruebas:', error);
  } finally {
    process.exit(0);
  }
}

runTests();
