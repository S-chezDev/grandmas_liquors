# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_328.spec.ts >> HU_328: Eliminar productos del pedido (Cliente) >> CA_328_01, CA_328_02, CA_328_03: Confirmar, eliminar y recalcular total
- Location: e2e\hu_328.spec.ts:26:3

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('HU_328: Eliminar productos del pedido (Cliente)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // 1. Inyectar sessionStorage antes de que cargue la app para evitar el modal
  6  |     await page.addInitScript(() => {
  7  |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  8  |     });
  9  | 
  10 |     // 2. Navegar al inicio
> 11 |     await page.goto('/');
     |                ^ Error: page.goto: Could not connect to server
  12 | 
  13 |     // 3. Hacer clic explícitamente en el botón de Iniciar Sesión del encabezado
  14 |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  15 | 
  16 |     // 4. Iniciar sesión como Cliente
  17 |     await page.fill('input[name="email"]', 'cliente@example.com');
  18 |     await page.fill('input[name="password"]', 'password123');
  19 |     await page.click('button[type="submit"]');
  20 |     
  21 |     // 5. Esperar a que el login sea exitoso verificando que aparece el botón de perfil
  22 |     const profileBtn = page.locator('button[title="Mi perfil"]');
  23 |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  24 |   });
  25 | 
  26 |   test('CA_328_01, CA_328_02, CA_328_03: Confirmar, eliminar y recalcular total', async ({ page }) => {
  27 |     // 1. Ir a la tienda y añadir un producto al carrito
  28 |     const productButton = page.locator('button:has-text("Agregar")').first();
  29 |     await productButton.waitFor({ state: 'visible', timeout: 10000 });
  30 |     await productButton.click();
  31 |     
  32 |     // 2. Abrir el carrito (último botón de la barra de navegación)
  33 |     const cartBtn = page.locator('nav').locator('button').last();
  34 |     await cartBtn.click();
  35 | 
  36 |     // Extraer el total inicial
  37 |     const totalElement = page.locator('.cart-total, [data-testid="cart-total"], span:has-text("Total") + span, div:has-text("Total") + div').last();
  38 |     await expect(totalElement).toBeVisible({ timeout: 5000 });
  39 |     const totalInicial = await totalElement.innerText();
  40 | 
  41 |     // 3. Eliminar producto del carrito (CA_328_01)
  42 |     const btnEliminar = page.locator('button[aria-label*="Eliminar"]').first();
  43 |     await btnEliminar.waitFor({ state: 'visible', timeout: 5000 });
  44 |     await btnEliminar.click();
  45 | 
  46 |     // 5. Verificar que el producto desapareció
  47 |     await expect(btnEliminar).toHaveCount(0, { timeout: 3000 }); // CA_328_01
  48 | 
  49 |     // 6. Recalcular total (CA_328_03)
  50 |     // Tras eliminar el único producto, el carrito debería estar vacío
  51 |     const emptyMsg = page.locator('text="Tu carrito está vacío"');
  52 |     await expect(emptyMsg).toBeVisible({ timeout: 5000 });
  53 |   });
  54 | });
  55 | 
```