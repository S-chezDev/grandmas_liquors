# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_323.spec.ts >> HU_323: Buscar Pedidos (Cliente) >> CA_323_01: Cliente busca sus pedidos y se filtran correctamente
- Location: e2e\hu_323.spec.ts:101:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button[title="Mi perfil"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - img "Background" [ref=e5]
    - generic [ref=e8]:
      - button "Volver al inicio" [ref=e10]:
        - img [ref=e11]
        - generic [ref=e13]: Volver al inicio
      - generic [ref=e14]:
        - img "Grandma's Liqueurs Logo" [ref=e16]
        - heading "Grandma's Liqueurs" [level=1] [ref=e17]
        - paragraph [ref=e18]: Bienvenido
      - generic [ref=e19]:
        - button "Iniciar Sesión" [ref=e20]
        - button "Registrarse" [ref=e21]
      - generic [ref=e22]:
        - generic [ref=e23]:
          - img [ref=e25]
          - generic [ref=e28]:
            - heading "Bienvenido" [level=3] [ref=e29]
            - paragraph [ref=e30]: Ingresa tus credenciales
        - generic [ref=e31]:
          - generic [ref=e32]:
            - generic [ref=e33]: Correo Electrónico *
            - textbox "Correo Electrónico *" [ref=e34]:
              - /placeholder: usuario@example.com
              - text: cliente@example.com
            - generic [ref=e35]:
              - img [ref=e36]
              - generic [ref=e38]: Máximo 60 caracteres (19/60).
          - generic [ref=e39]:
            - generic [ref=e40]: Contraseña *
            - generic [ref=e41]:
              - textbox "Contraseña *" [ref=e42]:
                - /placeholder: ••••••••
                - text: password123
              - button "Mostrar contraseña" [ref=e43]:
                - img [ref=e44]
            - generic [ref=e47]:
              - img [ref=e48]
              - generic [ref=e50]: Máximo 60 caracteres (11/60).
          - button "Iniciar Sesión" [ref=e52]:
            - img [ref=e54]
            - text: Iniciar Sesión
        - button "¿Olvidaste tu contraseña?" [ref=e58]
      - generic [ref=e59]:
        - paragraph [ref=e60]: "Calle 104 # 79D – 65, Medellín, Laureles"
        - paragraph [ref=e61]: "Tel: 324 610 2339"
    - dialog [ref=e64]:
      - generic [ref=e65]:
        - heading "Credenciales no válidas" [level=2] [ref=e66]
        - button [ref=e67]:
          - img [ref=e68]
      - generic [ref=e72]:
        - generic [ref=e73]:
          - img [ref=e75]
          - generic [ref=e79]: No encontramos un usuario activo con esas credenciales. Verifica el correo y la contraseña o regístrate en la aplicación.
        - button "Entendido" [ref=e81]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('HU_323: Buscar Pedidos (Cliente)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  6   |     page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  7   | 
  8   |     // 1. Inyectar sessionStorage para evitar modal de edad
  9   |     await page.addInitScript(() => {
  10  |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  11  |     });
  12  | 
  13  |     // Mock the API to return a list of multiple orders
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
  27  |                 detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 1, precio_unitario: 50000, producto_nombre: 'Aguardiente Antioqueño' }]
  28  |               },
  29  |               {
  30  |                 id: 102,
  31  |                 estado: 'Completado',
  32  |                 total: 120000,
  33  |                 fecha_creacion: new Date().toISOString(),
  34  |                 detalles: [{ id: 2, pedido_id: 102, inventario_id: 2, cantidad: 2, precio_unitario: 60000, producto_nombre: 'Ron Viejo de Caldas' }]
  35  |               }
  36  |             ]
  37  |           })
  38  |         });
  39  |       } else {
  40  |         await route.continue();
  41  |       }
  42  |     });
  43  | 
  44  |     // Mock API para el detalle de cada pedido (necesario por getAllWithDetails)
  45  |     await page.route('**/api/pedidos/*', async route => {
  46  |       if (route.request().method() === 'GET') {
  47  |         const url = route.request().url();
  48  |         const id = url.split('/').pop();
  49  |         if (id === '101') {
  50  |           await route.fulfill({
  51  |             status: 200,
  52  |             contentType: 'application/json',
  53  |             body: JSON.stringify({
  54  |               success: true,
  55  |               data: {
  56  |                 id: 101,
  57  |                 estado: 'Pendiente',
  58  |                 total: 50000,
  59  |                 fecha_creacion: new Date().toISOString(),
  60  |                 detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 1, precio_unitario: 50000, producto_nombre: 'Aguardiente Antioqueño' }]
  61  |               }
  62  |             })
  63  |           });
  64  |         } else if (id === '102') {
  65  |           await route.fulfill({
  66  |             status: 200,
  67  |             contentType: 'application/json',
  68  |             body: JSON.stringify({
  69  |               success: true,
  70  |               data: {
  71  |                 id: 102,
  72  |                 estado: 'Completado',
  73  |                 total: 120000,
  74  |                 fecha_creacion: new Date().toISOString(),
  75  |                 detalles: [{ id: 2, pedido_id: 102, inventario_id: 2, cantidad: 2, precio_unitario: 60000, producto_nombre: 'Ron Viejo de Caldas' }]
  76  |               }
  77  |             })
  78  |           });
  79  |         } else {
  80  |           await route.continue();
  81  |         }
  82  |       } else {
  83  |         await route.continue();
  84  |       }
  85  |     });
  86  | 
  87  |     // 2. Navegar al inicio
  88  |     await page.goto('/');
  89  | 
  90  |     // 3. Iniciar sesión como Cliente
  91  |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  92  |     await page.fill('input[name="email"]', 'cliente@example.com');
  93  |     await page.fill('input[name="password"]', 'password123');
  94  |     await page.click('button[type="submit"]');
  95  |     
  96  |     // Esperar a que el login sea exitoso
  97  |     const profileBtn = page.locator('button[title="Mi perfil"]');
> 98  |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
      |                      ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  99  |   });
  100 | 
  101 |   test('CA_323_01: Cliente busca sus pedidos y se filtran correctamente', async ({ page }) => {
  102 |     // 1. Abrir menú lateral
  103 |     const menuBtn = page.locator('button').first();
  104 |     await menuBtn.click();
  105 |     
  106 |     // 2. Clic en "Mis Pedidos"
  107 |     const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
  108 |     await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
  109 |     await misPedidosMenuItem.click();
  110 | 
  111 |     // 3. Verificar que ambos pedidos están visibles
  112 |     await expect(page.locator('h4:has-text("Pedido P101")')).toBeVisible({ timeout: 5000 });
  113 |     await expect(page.locator('h4:has-text("Pedido P102")')).toBeVisible({ timeout: 5000 });
  114 | 
  115 |     // 4. Buscar pedido 101 en el input de búsqueda
  116 |     const searchInput = page.locator('input[name="search-pedidos"]');
  117 |     await searchInput.fill('101');
  118 | 
  119 |     // 5. Verificar que sólo P101 esté visible
  120 |     await expect(page.locator('h4:has-text("Pedido P101")')).toBeVisible({ timeout: 5000 });
  121 |     await expect(page.locator('h4:has-text("Pedido P102")')).toBeHidden({ timeout: 5000 });
  122 | 
  123 |     // 6. Buscar por estado
  124 |     await searchInput.fill('');
  125 |     await searchInput.fill('completado');
  126 | 
  127 |     // 7. Verificar que sólo P102 esté visible
  128 |     await expect(page.locator('h4:has-text("Pedido P101")')).toBeHidden({ timeout: 5000 });
  129 |     await expect(page.locator('h4:has-text("Pedido P102")')).toBeVisible({ timeout: 5000 });
  130 |   });
  131 | });
  132 | 
```