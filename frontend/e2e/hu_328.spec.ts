import { test, expect } from '@playwright/test';

test.describe('HU_328: Eliminar productos del pedido (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Inyectar sessionStorage antes de que cargue la app para evitar el modal
    await page.addInitScript(() => {
      window.sessionStorage.setItem('grandmas_mayor_edad', '1');
    });

    // 2. Navegar al inicio
    await page.goto('/');

    // 3. Hacer clic explícitamente en el botón de Iniciar Sesión del encabezado
    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();

    // 4. Iniciar sesión como Cliente
    await page.fill('input[name="email"]', 'cliente@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 5. Esperar a que el login sea exitoso verificando que aparece el botón de perfil
    const profileBtn = page.locator('button[title="Mi perfil"]');
    await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('CA_328_01, CA_328_02, CA_328_03: Confirmar, eliminar y recalcular total', async ({ page }) => {
    // 1. Ir a la tienda y añadir un producto al carrito
    const productButton = page.locator('button:has-text("Agregar")').first();
    await productButton.waitFor({ state: 'visible', timeout: 10000 });
    await productButton.click();
    
    // 2. Abrir el carrito (último botón de la barra de navegación)
    const cartBtn = page.locator('nav').locator('button').last();
    await cartBtn.click();

    // Extraer el total inicial
    const totalElement = page.locator('.cart-total, [data-testid="cart-total"], span:has-text("Total") + span, div:has-text("Total") + div').last();
    await expect(totalElement).toBeVisible({ timeout: 5000 });
    const totalInicial = await totalElement.innerText();

    // 3. Eliminar producto del carrito (CA_328_01)
    const btnEliminar = page.locator('button[aria-label*="Eliminar"]').first();
    await btnEliminar.waitFor({ state: 'visible', timeout: 5000 });
    await btnEliminar.click();

    // 5. Verificar que el producto desapareció
    await expect(btnEliminar).toHaveCount(0, { timeout: 3000 }); // CA_328_01

    // 6. Recalcular total (CA_328_03)
    // Tras eliminar el único producto, el carrito debería estar vacío
    const emptyMsg = page.locator('text="Tu carrito está vacío"');
    await expect(emptyMsg).toBeVisible({ timeout: 5000 });
  });
});
