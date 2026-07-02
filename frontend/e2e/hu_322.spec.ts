import { test, expect } from '@playwright/test';

test.describe('HU_322: Listar Pedidos (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
    page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure()?.errorText));

    // 1. Inyectar sessionStorage para evitar modal de edad
    await page.addInitScript(() => {
      window.sessionStorage.setItem('grandmas_mayor_edad', '1');
    });

    // Mock the API to return a list of orders
    await page.route('**/api/pedidos', async route => {
      console.log('INTERCEPTED ROUTE LIST:', route.request().url());
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 101,
                estado: 'Pendiente',
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
      console.log('INTERCEPTED ROUTE DETAIL:', route.request().url());
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 101,
              estado: 'Pendiente',
              total: 50000,
              fecha_creacion: new Date().toISOString(),
              detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 1, precio_unitario: 50000, producto_nombre: 'Aguardiente Antioqueño' }]
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    // 2. Navegar al inicio
    await page.goto('/');

    // 3. Iniciar sesión como Cliente
    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
    await page.fill('input[name="email"]', 'cliente@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Esperar a que el login sea exitoso
    const profileBtn = page.locator('button[title="Mi perfil"]');
    await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('CA_322_01: Cliente ve la lista de sus pedidos', async ({ page }) => {
    // 1. Abrir menú lateral
    const menuBtn = page.locator('button').first();
    await menuBtn.click();
    
    // 2. Clic en "Mis Pedidos"
    const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
    await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await misPedidosMenuItem.click();

    // 3. Verificar que el modal de Mis Pedidos se abre
    const modalTitle = page.locator('h3:has-text("Mis Pedidos")');
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    // 4. Verificar que se lista el pedido mockeado
    const orderTitle = page.locator('h4:has-text("Pedido P101")');
    await expect(orderTitle).toBeVisible({ timeout: 5000 });

    // 5. Verificar que se muestran los detalles básicos del pedido
    const productName = page.locator('text="Aguardiente Antioqueño"');
    await expect(productName).toBeVisible();
  });
});
