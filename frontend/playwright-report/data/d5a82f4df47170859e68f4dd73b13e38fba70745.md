# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_322.spec.ts >> HU_322: Listar Pedidos (Cliente) >> CA_322_01: Cliente ve la lista de sus pedidos
- Location: e2e\hu_322.spec.ts:75:3

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
        - generic [ref=e14]: Volver al inicio
      - generic [ref=e15]:
        - img "Grandma's Liqueurs Logo" [ref=e17]
        - heading "Grandma's Liqueurs" [level=1] [ref=e18]
        - paragraph [ref=e19]: Bienvenido
      - generic [ref=e20]:
        - button "Iniciar Sesión" [ref=e21]
        - button "Registrarse" [ref=e22]
      - generic [ref=e23]:
        - generic [ref=e24]:
          - img [ref=e26]
          - generic [ref=e30]:
            - heading "Bienvenido" [level=3] [ref=e31]
            - paragraph [ref=e32]: Ingresa tus credenciales
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic [ref=e35]: Correo Electrónico *
            - textbox "Correo Electrónico *" [ref=e36]:
              - /placeholder: usuario@example.com
              - text: cliente@example.com
            - generic [ref=e37]:
              - img [ref=e38]
              - generic [ref=e42]: Máximo 60 caracteres (19/60).
          - generic [ref=e43]:
            - generic [ref=e44]: Contraseña *
            - generic [ref=e45]:
              - textbox "Contraseña *" [ref=e46]:
                - /placeholder: ••••••••
                - text: password123
              - button "Mostrar contraseña" [ref=e47]:
                - img [ref=e48]
            - generic [ref=e51]:
              - img [ref=e52]
              - generic [ref=e56]: Máximo 60 caracteres (11/60).
          - button "Iniciar Sesión" [ref=e58]:
            - img [ref=e60]
            - text: Iniciar Sesión
        - button "¿Olvidaste tu contraseña?" [ref=e65]
      - generic [ref=e66]:
        - paragraph [ref=e67]: "Calle 104 # 79D – 65, Medellín, Laureles"
        - paragraph [ref=e68]: "Tel: 324 610 2339"
    - dialog [ref=e71]:
      - generic [ref=e72]:
        - heading "Acceso bloqueado temporalmente" [level=2] [ref=e73]
        - button [ref=e74]:
          - img [ref=e75]
      - generic [ref=e79]:
        - generic [ref=e80]:
          - img [ref=e82]
          - generic [ref=e87]: Demasiadas solicitudes. Intenta de nuevo en 874 segundos.
        - button "Entendido" [ref=e89]
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
  62 |     await page.goto('/');
  63 | 
  64 |     // 3. Iniciar sesión como Cliente
  65 |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  66 |     await page.fill('input[name="email"]', 'cliente@example.com');
  67 |     await page.fill('input[name="password"]', 'password123');
  68 |     await page.click('button[type="submit"]');
  69 |     
  70 |     // Esperar a que el login sea exitoso
  71 |     const profileBtn = page.locator('button[title="Mi perfil"]');
> 72 |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
     |                      ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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