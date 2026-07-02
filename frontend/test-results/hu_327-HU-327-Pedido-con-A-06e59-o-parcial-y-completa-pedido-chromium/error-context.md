# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_327.spec.ts >> HU_327: Pedido con Abono Parcial (Cliente) >> CA_327_01 y CA_327_02: Cliente selecciona abono parcial y completa pedido
- Location: e2e\hu_327.spec.ts:64:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('HU_327: Pedido con Abono Parcial (Cliente)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  6   |     page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  7   | 
  8   |     // 1. Inyectar sessionStorage para evitar modal de edad
  9   |     await page.addInitScript(() => {
  10  |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  11  |     });
  12  | 
  13  |     // Mock de subida de comprobante
  14  |     await page.route('**/api/pedidos/comprobante', async route => {
  15  |       if (route.request().method() === 'POST') {
  16  |         await route.fulfill({
  17  |           status: 200,
  18  |           contentType: 'application/json',
  19  |           body: JSON.stringify({
  20  |             success: true,
  21  |             data: { comprobante_url: '/uploads/fake-comprobante.png' }
  22  |           })
  23  |         });
  24  |       } else {
  25  |         await route.continue();
  26  |       }
  27  |     });
  28  | 
  29  |     // Mock API para interceptar la creación del pedido (POST)
  30  |     await page.route('**/api/pedidos', async route => {
  31  |       if (route.request().method() === 'POST') {
  32  |         const postData = route.request().postDataJSON();
  33  |         // Verificar que envíe el esquema_abono correcto
  34  |         expect(postData.esquema_abono).toBe('50%');
  35  |         
  36  |         await route.fulfill({
  37  |           status: 201,
  38  |           contentType: 'application/json',
  39  |           body: JSON.stringify({
  40  |             success: true,
  41  |             message: 'Pedido registrado con abono parcial',
  42  |             data: { id: 999 }
  43  |           })
  44  |         });
  45  |       } else {
  46  |         await route.continue();
  47  |       }
  48  |     });
  49  | 
  50  |     // 2. Navegar al inicio
> 51  |     await page.goto('/');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  52  | 
  53  |     // 3. Iniciar sesión como Cliente
  54  |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  55  |     await page.fill('input[name="email"]', 'cliente@example.com');
  56  |     await page.fill('input[name="password"]', 'password123');
  57  |     await page.click('button[type="submit"]');
  58  |     
  59  |     // Esperar a que el login sea exitoso
  60  |     const profileBtn = page.locator('button[title="Mi perfil"]');
  61  |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  62  |   });
  63  | 
  64  |   test('CA_327_01 y CA_327_02: Cliente selecciona abono parcial y completa pedido', async ({ page }) => {
  65  |     // 1. Añadir producto al carrito
  66  |     const productButton = page.locator('button:has-text("Agregar")').first();
  67  |     await productButton.waitFor({ state: 'visible', timeout: 10000 });
  68  |     await productButton.click();
  69  |     
  70  |     // 2. Abrir el carrito
  71  |     const cartBtn = page.locator('nav').locator('button').last();
  72  |     await cartBtn.click();
  73  | 
  74  |     // 3. Hacer clic en Realizar Pedido
  75  |     const realizarPedidoBtn = page.locator('button:has-text("Realizar Pedido")');
  76  |     await realizarPedidoBtn.waitFor({ state: 'visible', timeout: 5000 });
  77  |     await realizarPedidoBtn.click();
  78  | 
  79  |     // 4. Llenar formulario de checkout
  80  |     const checkoutModal = page.locator('h3:has-text("Finalizar Pedido")');
  81  |     await expect(checkoutModal).toBeVisible({ timeout: 5000 });
  82  | 
  83  |     await page.fill('input[name="checkout-direccion"]', 'Calle 123 # 45-67, Medellín');
  84  |     await page.fill('input[name="checkout-telefono"]', '3001234567');
  85  |     
  86  |     const tomorrow = new Date();
  87  |     tomorrow.setDate(tomorrow.getDate() + 1);
  88  |     const dateStr = tomorrow.toISOString().split('T')[0];
  89  |     await page.fill('input[name="checkout-fecha-entrega"]', dateStr);
  90  | 
  91  |     // 5. Seleccionar la opción de abono parcial (50%)
  92  |     const radioAbono = page.locator('input[name="percentage"]').nth(1);
  93  |     await radioAbono.check();
  94  |     await expect(radioAbono).toBeChecked();
  95  | 
  96  |     // Subir archivo "comprobante" de prueba para el abono
  97  |     const fileInput = page.locator('input#checkout-comprobante');
  98  |     await fileInput.setInputFiles({
  99  |       name: 'comprobante_test.png',
  100 |       mimeType: 'image/png',
  101 |       buffer: Buffer.from('fake-image-content')
  102 |     });
  103 |     
  104 |     // 6. Confirmar Pedido
  105 |     const confirmBtn = page.locator('button:has-text("Confirmar Pedido")');
  106 |     await expect(confirmBtn).not.toBeDisabled({ timeout: 10000 });
  107 |     await confirmBtn.click();
  108 | 
  109 |     // Verificar alerta de éxito
  110 |     await expect(page.locator('text="Pedido confirmado"')).toBeVisible({ timeout: 10000 });
  111 |   });
  112 | });
  113 | 
```