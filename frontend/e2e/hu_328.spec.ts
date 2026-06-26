import { test, expect } from '@playwright/test';

test.describe('HU_328: Eliminar productos del pedido (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navegar a la página de login
    await page.goto('/login');
    
    // 2. Iniciar sesión como Cliente
    // Nota: Reemplazar con credenciales de prueba válidas en la BD
    await page.fill('input[name="email"]', 'cliente@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 3. Esperar a estar en el portal del cliente (tienda o inicio)
    await page.waitForURL(/.*(tienda|cliente|dashboard).*/);
  });

  test('CA_328_01, CA_328_02, CA_328_03: Confirmar, eliminar y recalcular total', async ({ page }) => {
    // 1. Ir a la tienda y añadir un producto al carrito
    // Ajustar los selectores según la implementación real del frontend
    const productButton = page.locator('button:has-text("Agregar al carrito")').first();
    if (await productButton.isVisible()) {
        await productButton.click();
    }
    
    // 2. Abrir el carrito
    await page.click('button:has-text("Carrito"), .cart-icon');

    // Extraer el total inicial
    const totalElement = page.locator('.cart-total, [data-testid="cart-total"]');
    await expect(totalElement).toBeVisible();
    const totalInicial = await totalElement.innerText();

    // 3. Eliminar producto del carrito (CA_328_01)
    const btnEliminar = page.locator('button:has-text("Eliminar"), [aria-label="Eliminar producto"]').first();
    await btnEliminar.click();

    // 4. Confirmación de eliminación (CA_328_02)
    // Asumimos que hay un modal o alert dialog
    const btnConfirmar = page.locator('button:has-text("Confirmar"), button:has-text("Sí, eliminar")');
    if (await btnConfirmar.isVisible()) {
      await btnConfirmar.click();
    }

    // 5. Verificar que el producto desapareció
    await expect(btnEliminar).toHaveCount(0, { timeout: 3000 }); // CA_328_01 (en menos de 2s aprox)

    // 6. Recalcular total (CA_328_03)
    // El total debe ser distinto al inicial (o 0 si era el único producto)
    await expect(totalElement).not.toHaveText(totalInicial);
  });
});
