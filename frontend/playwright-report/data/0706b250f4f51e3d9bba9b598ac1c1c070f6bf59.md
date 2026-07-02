# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu_324.spec.ts >> HU_324: Ver Detalles del Pedido (Cliente) >> CA_324_01: Cliente ve los detalles de su pedido
- Location: e2e\hu_324.spec.ts:78:3

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
  3   | test.describe('HU_324: Ver Detalles del Pedido (Cliente)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  6   |     page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  7   | 
  8   |     // 1. Inyectar sessionStorage para evitar modal de edad
  9   |     await page.addInitScript(() => {
  10  |       window.sessionStorage.setItem('grandmas_mayor_edad', '1');
  11  |     });
  12  | 
  13  |     // Mock the API to return a list of orders
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
  27  |               }
  28  |             ]
  29  |           })
  30  |         });
  31  |       } else {
  32  |         await route.continue();
  33  |       }
  34  |     });
  35  | 
  36  |     // Mock the API to return order details
  37  |     await page.route('**/api/pedidos/*', async route => {
  38  |       if (route.request().method() === 'GET') {
  39  |         await route.fulfill({
  40  |           status: 200,
  41  |           contentType: 'application/json',
  42  |           body: JSON.stringify({
  43  |             success: true,
  44  |             data: {
  45  |               id: 101,
  46  |               estado: 'Pendiente',
  47  |               total: 50000,
  48  |               fecha_creacion: new Date().toISOString(),
  49  |               fecha_entrega: new Date().toISOString(),
  50  |               direccion: 'Calle Falsa 123',
  51  |               telefono: '3001234567',
  52  |               metodo_pago: 'Efectivo',
  53  |               esquema_abono: '100%',
  54  |               monto_abonado: 50000,
  55  |               saldo: 0,
  56  |               detalles: [{ id: 1, pedido_id: 101, inventario_id: 1, cantidad: 2, precio_unitario: 25000, subtotal: 50000, producto_nombre: 'Vino Tinto Reserva' }]
  57  |             }
  58  |           })
  59  |         });
  60  |       } else {
  61  |         await route.continue();
  62  |       }
  63  |     });
  64  | 
  65  |     await page.goto('/');
  66  | 
  67  |     // Iniciar sesión (real)
  68  |     await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  69  |     await page.fill('input[name="email"]', 'cliente@example.com');
  70  |     await page.fill('input[name="password"]', 'password123');
  71  |     await page.click('button[type="submit"]');
  72  | 
  73  |     // Esperar a que el login sea exitoso
  74  |     const profileBtn = page.locator('button[title="Mi perfil"]');
> 75  |     await profileBtn.waitFor({ state: 'visible', timeout: 15000 });
      |                      ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  76  |   });
  77  | 
  78  |   test('CA_324_01: Cliente ve los detalles de su pedido', async ({ page }) => {
  79  |     // 1. Abrir menú lateral
  80  |     const menuBtn = page.locator('button').first();
  81  |     await menuBtn.click();
  82  |     
  83  |     // 2. Clic en "Mis Pedidos"
  84  |     const misPedidosMenuItem = page.locator('button:has-text("Mis Pedidos")').first();
  85  |     await misPedidosMenuItem.waitFor({ state: 'visible', timeout: 5000 });
  86  |     await misPedidosMenuItem.click();
  87  | 
  88  |     // 3. Verificar que se lista el pedido mockeado
  89  |     const orderTitle = page.locator('h4:has-text("Pedido P101")');
  90  |     await expect(orderTitle).toBeVisible({ timeout: 5000 });
  91  | 
  92  |     // 4. Verificar que se muestran los detalles específicos del pedido
  93  |     await expect(page.locator('text="Vino Tinto Reserva"')).toBeVisible();
  94  |     await expect(page.locator('text="Cantidad: 2"')).toBeVisible();
  95  |     await expect(page.locator('text="Calle Falsa 123"')).toBeVisible();
  96  |     await expect(page.locator('text="3001234567"')).toBeVisible();
  97  |     await expect(page.locator('text=efectivo')).toBeVisible();
  98  |     await expect(page.locator('text=Pago total 100%')).toBeVisible();
  99  |   });
  100 | });
  101 | 
```