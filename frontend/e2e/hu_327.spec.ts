import { test, expect } from '@playwright/test';

test.describe('HU_327: Pedido con Abono Parcial (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

    // 1. Inyectar sessionStorage para evitar modal de edad
    await page.addInitScript(() => {
      window.sessionStorage.setItem('grandmas_mayor_edad', '1');
    });

    // Mock de subida de comprobante
    await page.route('**/api/pedidos/comprobante', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { comprobante_url: '/uploads/fake-comprobante.png' }
          })
        });
      } else {
        await route.continue();
      }
    });

    // Mock API para interceptar la creación del pedido (POST)
    await page.route('**/api/pedidos', async route => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        // Verificar que envíe el esquema_abono correcto
        expect(postData.esquema_abono).toBe('50%');
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Pedido registrado con abono parcial',
            data: { id: 999 }
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

  test('CA_327_01 y CA_327_02: Cliente selecciona abono parcial y completa pedido', async ({ page }) => {
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

    await page.fill('input[name="checkout-direccion"]', 'Calle 123 # 45-67, Medellín');
    await page.fill('input[name="checkout-telefono"]', '3001234567');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[name="checkout-fecha-entrega"]', dateStr);

    // 5. Seleccionar la opción de abono parcial (50%)
    const radioAbono = page.locator('input[name="percentage"]').nth(1);
    await radioAbono.check();
    await expect(radioAbono).toBeChecked();

    // Subir archivo "comprobante" de prueba para el abono
    const fileInput = page.locator('input#checkout-comprobante');
    await fileInput.setInputFiles({
      name: 'comprobante_test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content')
    });
    
    // 6. Confirmar Pedido
    const confirmBtn = page.locator('button:has-text("Confirmar Pedido")');
    await expect(confirmBtn).not.toBeDisabled({ timeout: 10000 });
    await confirmBtn.click();

    // Verificar alerta de éxito
    await expect(page.locator('text="Pedido confirmado"')).toBeVisible({ timeout: 10000 });
  });
});
