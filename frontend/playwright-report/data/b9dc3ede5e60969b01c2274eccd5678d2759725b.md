# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_326.spec.ts >> HU_326: Ver Estado y Cancelar Pedido (Cliente) >> CA_326_01 y CA_326_02: Cliente ve el estado de los pedidos y cancela uno pendiente
- Location: e2e\hu_326.spec.ts:92:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('HU_326: Ver Estado y Cancelar Pedido (Cliente)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  6   |     page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  7   | 
  8   |     // 1. Inyectar sessionStorage para evitar modal de edad
  9   |     await page.addInitScript(() => {
  10  |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  11  |     });
  12  | 
  13  |     // Mock API para el listado de pedidos: 1 pendiente, 1 completado
  14  |     await page.route('**/api/pedidos', async route => {
  15  |       if (route.request().method() === 'GET') {
  16  |         await route.fulfill({
  17  |           status: 200,
  18  |           contentType: 'application/json',
  19  |           body: JSON.stringify({
  20  |             success: true,
  21  |             data: [
  22  |               {
  23  |                 id: 101,
  24  |                 estado: 'Pendiente',
  25  |                 total: 50000,
  26  |                 fecha_creacion: new Date().toISOString(),
  27  |               },
  28  |               {
  29  |                 id: 102,
  30  |                 estado: 'Completado',
  31  |                 total: 75000,
  32  |                 fecha_creacion: new Date().toISOString(),
  33  |               }
  34  |             ]
  35  |           })
  36  |         });
  37  |       } else {
  38  |         await route.continue();
  39  |       }
  40  |     });
  41  | 
  42  |     // Mock para obtener detalles de pedido (GET) y actualizar (PUT)
  43  |     await page.route('**/api/pedidos/*', async route => {
  44  |       const method = route.request().method();
  45  |       const url = route.request().url();
  46  |       const id = url.endsWith('101') ? 101 : 102;
  47  |       
  48  |       if (method === 'GET') {
  49  |         await route.fulfill({
  50  |           status: 200,
  51  |           contentType: 'application/json',
  52  |           body: JSON.stringify({
  53  |             success: true,
  54  |             data: {
  55  |               id: id,
  56  |               estado: id === 101 ? 'Pendiente' : 'Completado',
  57  |               total: id === 101 ? 50000 : 75000,
  58  |               fecha_creacion: new Date().toISOString(),
  59  |               metodo_pago: 'Efectivo',
  60  |               esquema_abono: '100%',
  61  |               detalles: [{ id: 1, pedido_id: id, inventario_id: 1, cantidad: 2, precio_unitario: id === 101 ? 25000 : 37500, subtotal: id === 101 ? 50000 : 75000, producto_nombre: 'Test Product' }]
  62  |             }
  63  |           })
  64  |         });
  65  |       } else if (method === 'PUT') {
  66  |         await route.fulfill({
  67  |           status: 200,
  68  |           contentType: 'application/json',
  69  |           body: JSON.stringify({
  70  |             success: true,
  71  |             message: 'Pedido actualizado'
  72  |           })
  73  |         });
  74  |       } else {
  75  |         await route.continue();
  76  |       }
  77  |     });
  78  | 
> 79  |     await page.goto('/');
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  80  | 
  81  |     // Iniciar sesión (real)
  82  |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  83  |     await page.fill('input[name="email"]', 'cliente@example.com');
  84  |     await page.fill('input[name="password"]', 'password123');
  85  |     await page.click('button[type="submit"]');
  86  | 
  87  |     // Esperar a que el login sea exitoso
  88  |     const profileBtn = page.locator('button[title="Mi perfil"]');
  89  |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
  90  |   });
  91  | 
  92  |   test('CA_326_01 y CA_326_02: Cliente ve el estado de los pedidos y cancela uno pendiente', async ({ page }) => {
  93  |     // 1. Abrir menú lateral
  94  |     const menuBtn = page.locator('button').first();
  95  |     await menuBtn.click();
  96  |     
  97  |     // 2. Clic en "Mis Pedidos"
  98  |     const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
  99  |     await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
  100 |     await misPedidosMenuItem.click();
  101 | 
  102 |     // 3. Verificar estado del pedido 101 (Pendiente) y 102 (Completado)
  103 |     await expect(page.locator('h4:has-text("Pedido P101")')).toBeVisible();
  104 |     await expect(page.locator('h4:has-text("Pedido P102")')).toBeVisible();
  105 | 
  106 |     // 4. Verificar que el botón Cancelar existe para P101 pero NO para P102
  107 |     // En MyOrdersModal, los pedidos se mapean en un contenedor con .border
  108 |     const pedido101Container = page.locator('div.border.rounded-lg').filter({ hasText: 'Pedido P101' });
  109 |     const pedido102Container = page.locator('div.border.rounded-lg').filter({ hasText: 'Pedido P102' });
  110 | 
  111 |     await expect(pedido101Container.locator('button:has-text("Cancelar Pedido")')).toBeVisible();
  112 |     await expect(pedido102Container.locator('button:has-text("Cancelar Pedido")')).not.toBeVisible();
  113 | 
  114 |     // 5. Cancelar pedido P101
  115 |     // Manejar el popup de window.confirm
  116 |     page.once('dialog', async dialog => {
  117 |       expect(dialog.message()).toContain('¿Está seguro de que desea cancelar este pedido?');
  118 |       await dialog.accept();
  119 |     });
  120 | 
  121 |     await pedido101Container.locator('button:has-text("Cancelar Pedido")').click();
  122 | 
  123 |     // La función refreshPedidos será llamada. Como es mock, simplemente asumimos 
  124 |     // que la UI reaccionó (o en la práctica, se recargarían con el nuevo estado)
  125 |     // Para simplificar, verificamos que el test llega aquí sin fallar y acepta el diálogo.
  126 |   });
  127 | });
  128 | 
```