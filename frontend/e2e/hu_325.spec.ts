import { test, expect } from '@playwright/test';

test.describe('HU_325: Ver/Descargar PDF de Pedido (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

    // 1. Inyectar sessionStorage para evitar modal de edad
    await page.addInitScript(() => {
      window.sessionStorage.setItem('grandmas_mayor_edad', '1');
    });

    // Mock the API to return a list of orders
    await page.route('**/api/pedidos', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 101,
                estado: 'Completado',
                total: 50000,
                fecha_creacion: new Date().toISOString(),
              }
            ]
          })
        });
      } else {
        await route.continue();
      }
    });

    // Mock the API to return order details
    await page.route('**/api/pedidos/*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 101,
              estado: 'Completado',
              total: 50000,
              fecha_creacion: new Date().toISOString(),
              fecha_entrega: new Date().toISOString(),
              direccion: 'Calle Falsa 123',
              telefono: '3001234567',
              metodo_pago: 'Efectivo',
              esquema_abono: '100%',
              monto_abonado: 50000,
              saldo: 0,
              detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 2, precio_unitario: 25000, subtotal: 50000, producto_nombre: 'Vino Tinto Reserva' }]
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Iniciar sesión (real)
    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
    await page.fill('input[name="email"]', 'cliente@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Esperar a que el login sea exitoso
    const profileBtn = page.locator('button[title="Mi perfil"]');
    await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('CA_325_01: Cliente descarga PDF de su pedido', async ({ page }) => {
    // 1. Abrir menú lateral
    const menuBtn = page.locator('button').first();
    await menuBtn.click();
    
    // 2. Clic en "Mis Pedidos"
    const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
    await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await misPedidosMenuItem.click();

    // 3. Verificar que se lista el pedido mockeado
    const orderTitle = page.locator('h4:has-text("Pedido P101")');
    await expect(orderTitle).toBeVisible({ timeout: 5000 });

    // 4. Click en el botón de descargar PDF
    const btnPdf = page.locator('button:has-text("Descargar PDF")').first();
    await expect(btnPdf).toBeVisible();
    await btnPdf.click();

    // 5. Verificar que se abre la vista imprimible (el iframe/modal con el PDF)
    // El sistema usa window.open('', '_blank') con HTML inyectado para openPrintablePdf.
    // Playwright maneja las nuevas páginas. Esperaremos el popup.
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      btnPdf.click()
    ]);
    
    await popup.waitForLoadState('domcontentloaded');
    
    // Verificar contenido en el PDF generado
    await expect(popup.locator('text="Pedido P101"')).toBeVisible();
    await expect(popup.locator('text="Vino Tinto Reserva"')).toBeVisible();
  });
});
