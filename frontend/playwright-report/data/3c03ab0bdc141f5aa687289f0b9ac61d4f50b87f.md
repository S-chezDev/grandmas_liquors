# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_328.spec.ts >> HU_328: Eliminar productos del pedido (Cliente) >> CA_328_01, CA_328_02, CA_328_03: Confirmar, eliminar y recalcular total
- Location: e2e\hu_328.spec.ts:18:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Page snapshot

```yaml
- article "Unable to connect" [ref=e3]:
  - img "Illustration of a fox looking at disconnected network cables." [ref=e5]
  - generic [ref=e7]:
    - heading "Unable to connect" [level=1] [ref=e8]
    - paragraph [ref=e9]:
      - text: Nightly can’t connect to the server at
      - strong [ref=e10]: localhost:3000
    - generic [ref=e11]:
      - heading "What can you do about it?" [level=3] [ref=e12]
      - list [ref=e13]:
        - listitem [ref=e14]: The site could be temporarily unavailable or too busy. Try again in a few moments.
        - listitem [ref=e15]: If you are unable to load any pages, check your computer’s network connection.
        - listitem [ref=e16]: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
    - button "Try Again" [ref=e19]:
      - generic [ref=e21]:
        - generic: Try Again
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('HU_328: Eliminar productos del pedido (Cliente)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // 1. Navegar a la página de login
> 6  |     await page.goto('/login');
     |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  7  |     
  8  |     // 2. Iniciar sesión como Cliente
  9  |     // Nota: Reemplazar con credenciales de prueba válidas en la BD
  10 |     await page.fill('input[name="email"]', 'cliente@example.com');
  11 |     await page.fill('input[name="password"]', 'password123');
  12 |     await page.click('button[type="submit"]');
  13 |     
  14 |     // 3. Esperar a estar en el portal del cliente (tienda o inicio)
  15 |     await page.waitForURL(/.*(tienda|cliente|dashboard).*/);
  16 |   });
  17 | 
  18 |   test('CA_328_01, CA_328_02, CA_328_03: Confirmar, eliminar y recalcular total', async ({ page }) => {
  19 |     // 1. Ir a la tienda y añadir un producto al carrito
  20 |     // Ajustar los selectores según la implementación real del frontend
  21 |     const productButton = page.locator('button:has-text("Agregar al carrito")').first();
  22 |     if (await productButton.isVisible()) {
  23 |         await productButton.click();
  24 |     }
  25 |     
  26 |     // 2. Abrir el carrito
  27 |     await page.click('button:has-text("Carrito"), .cart-icon');
  28 | 
  29 |     // Extraer el total inicial
  30 |     const totalElement = page.locator('.cart-total, [data-testid="cart-total"]');
  31 |     await expect(totalElement).toBeVisible();
  32 |     const totalInicial = await totalElement.innerText();
  33 | 
  34 |     // 3. Eliminar producto del carrito (CA_328_01)
  35 |     const btnEliminar = page.locator('button:has-text("Eliminar"), [aria-label="Eliminar producto"]').first();
  36 |     await btnEliminar.click();
  37 | 
  38 |     // 4. Confirmación de eliminación (CA_328_02)
  39 |     // Asumimos que hay un modal o alert dialog
  40 |     const btnConfirmar = page.locator('button:has-text("Confirmar"), button:has-text("Sí, eliminar")');
  41 |     if (await btnConfirmar.isVisible()) {
  42 |       await btnConfirmar.click();
  43 |     }
  44 | 
  45 |     // 5. Verificar que el producto desapareció
  46 |     await expect(btnEliminar).toHaveCount(0, { timeout: 3000 }); // CA_328_01 (en menos de 2s aprox)
  47 | 
  48 |     // 6. Recalcular total (CA_328_03)
  49 |     // El total debe ser distinto al inicial (o 0 si era el único producto)
  50 |     await expect(totalElement).not.toHaveText(totalInicial);
  51 |   });
  52 | });
  53 | 
```