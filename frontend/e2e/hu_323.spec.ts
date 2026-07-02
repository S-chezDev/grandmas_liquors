import { test, expect } from '@playwright/test';

test.describe('HU_323: Buscar Pedidos (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

    // 1. Inyectar sessionStorage para evitar modal de edad
    await page.addInitScript(() => {
      window.sessionStorage.setItem('grandmas_mayor_edad', '1');
    });

    // Mock the API to return a list of multiple orders
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
                estado: 'Pendiente',
                total: 50000,
                fecha_creacion: new Date().toISOString(),
                detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 1, precio_unitario: 50000, producto_nombre: 'Aguardiente Antioqueño' }]
              },
              {
                id: 102,
                estado: 'Completado',
                total: 120000,
                fecha_creacion: new Date().toISOString(),
                detalles: [{ id: 2, pedido_id: 102, inventario_id: 2, cantidad: 2, precio_unitario: 60000, producto_nombre: 'Ron Viejo de Caldas' }]
              }
            ]
          })
        });
      } else {
        await route.continue();
      }
    });

    // Mock API para el detalle de cada pedido (necesario por getAllWithDetails)
    await page.route('**/api/pedidos/*', async route => {
      if (route.request().method() === 'GET') {
        const url = route.request().url();
        const id = url.split('/').pop();
        if (id === '101') {
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
        } else if (id === '102') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                id: 102,
                estado: 'Completado',
                total: 120000,
                fecha_creacion: new Date().toISOString(),
                detalles: [{ id: 2, pedido_id: 102, inventario_id: 2, cantidad: 2, precio_unitario: 60000, producto_nombre: 'Ron Viejo de Caldas' }]
              }
            })
          });
        } else {
          await route.continue();
        }
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

  test('CA_323_01: Cliente busca sus pedidos y se filtran correctamente', async ({ page }) => {
    // 1. Abrir menú lateral
    const menuBtn = page.locator('button').first();
    await menuBtn.click();
    
    // 2. Clic en "Mis Pedidos"
    const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
    await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await misPedidosMenuItem.click();

    // 3. Verificar que ambos pedidos están visibles
    await expect(page.locator('h4:has-text("Pedido P101")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h4:has-text("Pedido P102")')).toBeVisible({ timeout: 5000 });

    // 4. Buscar pedido 101 en el input de búsqueda
    const searchInput = page.locator('input[name="search-pedidos"]');
    await searchInput.fill('101');

    // 5. Verificar que sólo P101 esté visible
    await expect(page.locator('h4:has-text("Pedido P101")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h4:has-text("Pedido P102")')).toBeHidden({ timeout: 5000 });

    // 6. Buscar por estado
    await searchInput.fill('');
    await searchInput.fill('completado');

    // 7. Verificar que sólo P102 esté visible
    await expect(page.locator('h4:has-text("Pedido P101")')).toBeHidden({ timeout: 5000 });
    await expect(page.locator('h4:has-text("Pedido P102")')).toBeVisible({ timeout: 5000 });
  });
});
