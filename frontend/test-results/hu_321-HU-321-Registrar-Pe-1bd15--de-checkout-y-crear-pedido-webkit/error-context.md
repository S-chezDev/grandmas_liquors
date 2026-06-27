# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_321.spec.ts >> HU_321: Registrar Pedido (Cliente) >> CA_321_01: Completar flujo de checkout y crear pedido
- Location: e2e\hu_321.spec.ts:24:3

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('HU_321: Registrar Pedido (Cliente)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // 1. Inyectar sessionStorage para evitar modal de edad
  6   |     await page.addInitScript(() => {
  7   |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  8   |     });
  9   | 
  10  |     // 2. Navegar al inicio
> 11  |     await page.goto('/');
      |                ^ Error: page.goto: Could not connect to server
  12  | 
  13  |     // 3. Iniciar sesión como Cliente
  14  |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  15  |     await page.fill('input[name="email"]', 'cliente@example.com');
  16  |     await page.fill('input[name="password"]', 'password123');
  17  |     await page.click('button[type="submit"]');
  18  |     
  19  |     // Esperar a que el login sea exitoso
  20  |     const profileBtn = page.locator('button[title="Mi perfil"]');
  21  |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  22  |   });
  23  | 
  24  |   test('CA_321_01: Completar flujo de checkout y crear pedido', async ({ page }) => {
  25  |     // 1. Añadir producto al carrito
  26  |     const productButton = page.locator('button:has-text("Agregar")').first();
  27  |     await productButton.waitFor({ state: 'visible', timeout: 10000 });
  28  |     await productButton.click();
  29  |     
  30  |     // 2. Abrir el carrito
  31  |     const cartBtn = page.locator('nav').locator('button').last();
  32  |     await cartBtn.click();
  33  | 
  34  |     // 3. Hacer clic en Realizar Pedido
  35  |     const realizarPedidoBtn = page.locator('button:has-text("Realizar Pedido")');
  36  |     await realizarPedidoBtn.waitFor({ state: 'visible', timeout: 5000 });
  37  |     await realizarPedidoBtn.click();
  38  | 
  39  |     // 4. Llenar formulario de checkout
  40  |     const checkoutModal = page.locator('h3:has-text("Finalizar Pedido")');
  41  |     await expect(checkoutModal).toBeVisible({ timeout: 5000 });
  42  | 
  43  |     // Esperar a que el input sea visible antes de llenarlo
  44  |     await page.locator('input[name="checkout-direccion"]').waitFor({ state: 'visible' });
  45  |     await page.fill('input[name="checkout-direccion"]', 'Calle 123 # 45-67, Medellín');
  46  |     await page.fill('input[name="checkout-telefono"]', '3001234567');
  47  |     
  48  |     // Fecha de entrega para mañana
  49  |     const tomorrow = new Date();
  50  |     tomorrow.setDate(tomorrow.getDate() + 1);
  51  |     const dateStr = tomorrow.toISOString().split('T')[0];
  52  |     await page.fill('input[name="checkout-fecha-entrega"]', dateStr);
  53  | 
  54  |     // Mock de subida de comprobante
  55  |     await page.route('**/api/pedidos/comprobante', async route => {
  56  |       await route.fulfill({
  57  |         status: 200,
  58  |         contentType: 'application/json',
  59  |         body: JSON.stringify({
  60  |           success: true,
  61  |           data: { comprobante_url: 'https://mocked-url.com/comprobante.jpg' }
  62  |         })
  63  |       });
  64  |     });
  65  | 
  66  |     // Mock de creación de pedido
  67  |     await page.route('**/api/pedidos', async route => {
  68  |       if (route.request().method() === 'POST') {
  69  |         await route.fulfill({
  70  |           status: 201,
  71  |           contentType: 'application/json',
  72  |           body: JSON.stringify({
  73  |             success: true,
  74  |             data: { id: 999, estado: 'Pendiente' }
  75  |           })
  76  |         });
  77  |       } else {
  78  |         await route.continue();
  79  |       }
  80  |     });
  81  | 
  82  |     await page.locator('input[name="checkout-comprobante"]').setInputFiles({
  83  |       name: 'comprobante.jpg',
  84  |       mimeType: 'image/jpeg',
  85  |       buffer: Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08]) // dummy jpeg header
  86  |     });
  87  | 
  88  |     // Esperar a que la imagen de vista previa aparezca (indica que la subida mockeada terminó)
  89  |     const previewImg = page.locator('img[alt="Vista previa del comprobante"]');
  90  |     await expect(previewImg).toBeVisible({ timeout: 5000 });
  91  | 
  92  |     // 5. Confirmar el pedido
  93  |     const confirmarBtn = page.locator('button:has-text("Confirmar Pedido")');
  94  |     await confirmarBtn.click();
  95  | 
  96  |     // 6. Verificar que aparece un mensaje de éxito o que el carrito se limpia
  97  |     // Debería salir un toast de éxito, podemos verificar el texto "Pedido confirmado"
  98  |     const successToast = page.locator('text="Pedido confirmado"');
  99  |     await expect(successToast).toBeVisible({ timeout: 10000 });
  100 |   });
  101 | });
  102 | 
```