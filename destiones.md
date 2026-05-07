Frontend: módulos y gestiones (pantallas)
Separo área pública / auth (sin menú lateral tipo staff) del resto, que es el “módulo” de negocio con Sidebar.

A. Público y autenticación (sin módulo de menú lateral)
Ámbito	Gestión / pantalla	Componente (referencia)
Público
Landing / inicio web
LandingPage
Público
Nosotros
NosotrosPage
Auth
Inicio de sesión y registro de cliente
Login
B. Dashboard (staff)
Módulo	Gestiones
Dashboard
Inicio (/ — mismo componente que dashboard)
Dashboard
Panel / métricas (/dashboard)
Dashboard
Variante ruta /medicion (misma pantalla Dashboard en App.tsx)
C. Configuración
Módulo	Gestiones
Configuración
Gestión de roles (/configuracion/roles)
D. Usuarios
Módulo	Gestiones
Usuarios
Gestión de usuarios (/usuarios/usuarios)
Usuarios
Gestión de roles (/usuarios/roles) (misma pantalla que configuración en código: componente Roles)
Usuarios
Gestión de accesos (/usuarios/accesos) — existe en App.tsx; no aparece como ítem en Sidebar.tsx
E. Compras
Módulo	Gestiones
Compras
Proveedores (/compras/proveedores)
Compras
Compras (/compras/compras)
Compras
Productos (/compras/productos)
Compras
Categorías de producto (/compras/categorias)
F. Producción
Módulo	Gestiones
Producción
Entrega de insumos (/produccion/insumos)
Producción
Producción (/produccion/produccion)
G. Ventas
Módulo	Gestiones
Ventas
Clientes (/ventas/clientes)
Ventas
Ventas (/ventas/ventas)
Ventas
Abonos (/ventas/abonos)
Ventas
Pedidos (/ventas/pedidos)
Ventas
Domicilios (/ventas/domicilios)
H. Cliente (rol Cliente en menú lateral)
Módulo	Gestiones
Cliente
Tienda (/cliente/tienda)
Cliente
Mis pedidos (/cliente/pedidos)
Cliente
Mi perfil (/cliente/perfil)