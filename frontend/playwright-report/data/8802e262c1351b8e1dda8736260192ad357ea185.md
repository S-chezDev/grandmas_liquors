# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_322.spec.ts >> HU_322: Listar Pedidos (Cliente) >> CA_322_01: Cliente ve la lista de sus pedidos
- Location: e2e\hu_322.spec.ts:75:3

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
  3  | test.describe('HU_322: Listar Pedidos (Cliente)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  6  |     page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  7  |     page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure()?.errorText));
  8  | 
  9  |     // 1. Inyectar sessionStorage para evitar modal de edad
  10 |     await page.addInitScript(() => {
  11 |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  12 |     });
  13 | 
  14 |     // Mock the API to return a list of orders
  15 |     await page.route('**/api/pedidos', async route => {
  16 |       console.log('INTERCEPTED ROUTE LIST:', route.request().url());
  17 |       if (route.request().method() === 'GET') {
  18 |         await route.fulfill({
  19 |           status: 200,
  20 |           contentType: 'application/json',
  21 |           body: JSON.stringify({
  22 |             success: true,
  23 |             data: [
  24 |               {
  25 |                 id: 101,
  26 |                 estado: 'Pendiente',
  27 |                 total: 50000,
  28 |                 fecha_creacion: new Date().toISOString(),
  29 |               }
  30 |             ]
  31 |           })
  32 |         });
  33 |       } else {
  34 |         await route.continue();
  35 |       }
  36 |     });
  37 | 
  38 |     // Mock the API to return order details
  39 |     await page.route('**/api/pedidos/*', async route => {
  40 |       console.log('INTERCEPTED ROUTE DETAIL:', route.request().url());
  41 |       if (route.request().method() === 'GET') {
  42 |         await route.fulfill({
  43 |           status: 200,
  44 |           contentType: 'application/json',
  45 |           body: JSON.stringify({
  46 |             success: true,
  47 |             data: {
  48 |               id: 101,
  49 |               estado: 'Pendiente',
  50 |               total: 50000,
  51 |               fecha_creacion: new Date().toISOString(),
  52 |               detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 1, precio_unitario: 50000, producto_nombre: 'Aguardiente Antioqueño' }]
  53 |             }
  54 |           })
  55 |         });
  56 |       } else {
  57 |         await route.continue();
  58 |       }
  59 |     });
  60 | 
  61 |     // 2. Navegar al inicio
> 62 |     await page.goto('/');
     |                ^ Error: page.goto: Could not connect to server
  63 | 
  64 |     // 3. Iniciar sesión como Cliente
  65 |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  66 |     await page.fill('input[name="email"]', 'cliente@example.com');
  67 |     await page.fill('input[name="password"]', 'password123');
  68 |     await page.click('button[type="submit"]');
  69 |     
  70 |     // Esperar a que el login sea exitoso
  71 |     const profileBtn = page.locator('button[title="Mi perfil"]');
  72 |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  73 |   });
  74 | 
  75 |   test('CA_322_01: Cliente ve la lista de sus pedidos', async ({ page }) => {
  76 |     // 1. Abrir menú lateral
  77 |     const menuBtn = page.locator('button').first();
  78 |     await menuBtn.click();
  79 |     
  80 |     // 2. Clic en "Mis Pedidos"
  81 |     const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
  82 |     await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
  83 |     await misPedidosMenuItem.click();
  84 | 
  85 |     // 3. Verificar que el modal de Mis Pedidos se abre
  86 |     const modalTitle = page.locator('h3:has-text("Mis Pedidos")');
  87 |     await expect(modalTitle).toBeVisible({ timeout: 5000 });
  88 | 
  89 |     // 4. Verificar que se lista el pedido mockeado
  90 |     const orderTitle = page.locator('h4:has-text("Pedido P101")');
  91 |     await expect(orderTitle).toBeVisible({ timeout: 5000 });
  92 | 
  93 |     // 5. Verificar que se muestran los detalles básicos del pedido
  94 |     const productName = page.locator('text="Aguardiente Antioqueño"');
  95 |     await expect(productName).toBeVisible();
  96 |   });
  97 | });
  98 | 
```