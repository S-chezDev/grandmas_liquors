import { test, expect } from '@playwright/test';

test.describe('HU_321: Registrar Pedido (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Inyectar sessionStorage para evitar modal de edad
    await page.addInitScript(() => {
      window.sessionStorage.setItem('grandmas_mayor_edad', '1');
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

  test('CA_321_01: Completar flujo de checkout y crear pedido', async ({ page }) => {
    // 1. Añadir producto al carrito
    const productButton = page.locator('button:has-text("Agregar")').first();
    await productButton.waitFor({ state: 'visible', timeout: 10000 });
    await productButton.click();
    
    // 2. Abrir el carrito
    const cartBtn = page.locator('nav').locator('button').last();
    await cartBtn.click();

    // 3. Hacer clic en Realizar Pedido
    const realizarPedidoBtn = page.locator('button:has-text("Realizar Pedido")');
    await realizarPedidoBtn.waitFor({ state: 'visible', timeout: 5000 });
    await realizarPedidoBtn.click();

    // 4. Llenar formulario de checkout
    const checkoutModal = page.locator('h3:has-text("Finalizar Pedido")');
    await expect(checkoutModal).toBeVisible({ timeout: 5000 });

    // Esperar a que el input sea visible antes de llenarlo
    await page.locator('input[name="checkout-direccion"]').waitFor({ state: 'visible' });
    await page.fill('input[name="checkout-direccion"]', 'Calle 123 # 45-67, Medellín');
    await page.fill('input[name="checkout-telefono"]', '3001234567');
    
    // Fecha de entrega para mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[name="checkout-fecha-entrega"]', dateStr);

    // Mock de subida de comprobante
    await page.route('**/api/pedidos/comprobante', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { comprobante_url: 'https://mocked-url.com/comprobante.jpg' }
        })
      });
    });

    // Mock de creación de pedido
    await page.route('**/api/pedidos', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { id: 999, estado: 'Pendiente' }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('input[name="checkout-comprobante"]').setInputFiles({
      name: 'comprobante.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08]) // dummy jpeg header
    });

    // Esperar a que la imagen de vista previa aparezca (indica que la subida mockeada terminó)
    const previewImg = page.locator('img[alt="Vista previa del comprobante"]');
    await expect(previewImg).toBeVisible({ timeout: 5000 });

    // 5. Confirmar el pedido
    const confirmarBtn = page.locator('button:has-text("Confirmar Pedido")');
    await confirmarBtn.click();

    // 6. Verificar que aparece un mensaje de éxito o que el carrito se limpia
    // Debería salir un toast de éxito, podemos verificar el texto "Pedido confirmado"
    const successToast = page.locator('text="Pedido confirmado"');
    await expect(successToast).toBeVisible({ timeout: 10000 });
  });
});
