# 📑 ÍNDICE DE ARCHIVOS - Grandmas Liquors Mobile

## 📊 Resumen
- **Total de archivos**: 63+
- **Líneas de código**: 3000+
- **Archivos de documentación**: 5

---

## 📚 ARCHIVOS DE DOCUMENTACIÓN

### Raíz del Proyecto
| Archivo | Tamaño | Propósito |
|---------|--------|----------|
| [README.md](./README.md) | ~2KB | Portada principal |
| [QUICK_START.md](./QUICK_START.md) | ~8KB | Instalación rápida |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | ~12KB | Diseño técnico completo |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | ~15KB | Guía de desarrollo |
| [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md) | ~10KB | Resumen de lo hecho |
| [INDEX.md](./INDEX.md) | ~5KB | Este archivo |

**Total Documentación**: 52 KB

---

## 🏗️ CORE LAYER - `lib/core/`

### Config - Configuración Global
```
lib/core/config/
├── theme/
│   └── app_theme.dart ..................... 200 líneas
│       • ThemeData global
│       • TextTheme predefinido
│       • ColorScheme corporativo
│       • Estilos de botones, inputs, cards
│
└── [más configs en el futuro]
```

### Constants - Constantes de Aplicación
```
lib/core/constants/
└── app_constants.dart ..................... 50 líneas
    • API_BASE_URL = http://192.168.40.76:3002
    • Endpoints de API
    • Claves de almacenamiento
    • Módulos disponibles (5)
    • Acciones de permisos
```

### Errors - Manejo de Errores
```
lib/core/errors/
└── exceptions.dart ....................... 120 líneas
    • AppException (base)
    • AuthenticationException
    • AuthorizationException
    • NotFoundException
    • ValidationException
    • ServerException
    • NetworkException
    • TokenExpiredException
```

### Utils - Utilidades [TODO]
```
lib/core/utils/
└── logger.dart ........................... [PENDIENTE]
```

---

## 💾 DATA LAYER - `lib/data/`

### DataSources - Acceso a Datos

#### Local Storage
```
lib/data/datasources/local/
└── secure_storage.dart ................... 80 líneas
    • SecureStorageService wrapper
    • Métodos: saveToken, getToken, deleteToken
    • Gestión de refresh tokens
    • Almacenamiento de usuario y permisos
    • clearAll() para logout
```

#### Remote API
```
lib/data/datasources/remote/
└── api_service.dart ..................... 280 líneas
    • ApiService con Dio
    • BaseUrl centralizada
    • Interceptores para JWT
    • Manejo de 401 con refresh automático
    • Métodos: get, post, put, patch, delete
    • Mapeo de errores HTTP específicos
    • Retry logic
```

### Models - Modelos de Datos (14 total)

#### Auth Models
```
lib/data/models/auth/
└── auth_models.dart ..................... 150 líneas
    ✅ LoginRequest
    ✅ LoginResponse
    ✅ UsuarioModel (con rol y permisos)
    ✅ RolModel (con permisos asignados)
    ✅ PermisoModel (modulo + accion)
```

#### Productos
```
lib/data/models/productos/
└── producto_models.dart ................. 80 líneas
    ✅ ProductoModel
    ✅ CategoriaModel
```

#### Compras
```
lib/data/models/compras/
└── compra_models.dart ................... 120 líneas
    ✅ ProveedorModel
    ✅ CompraModel
    ✅ DetalleCompraModel
    ✅ InsumoModel
```

#### Ventas
```
lib/data/models/ventas/
└── venta_models.dart .................... 140 líneas
    ✅ ClienteModel
    ✅ VentaModel
    ✅ DetalleVentaModel
    ✅ AbonoModel
    ✅ PedidoModel
```

#### Órdenes de Producción
```
lib/data/models/ordenes_produccion/
└── orden_produccion_models.dart ......... 90 líneas
    ✅ OrdenProduccionModel
    ✅ EntregaInsumoModel
```

#### Dashboard
```
lib/data/models/dashboard/
└── dashboard_models.dart ................ 70 líneas
    ✅ DashboardMetricasModel
    ✅ VentaMensualModel
    ✅ VentaPorCategoriaModel
```

### Repositories - Repositorios

#### Auth Repository
```
lib/data/repositories/
└── auth_repository.dart ................. 180 líneas
    • login(email, password)
    • logout()
    • getCurrentUser()
    • getPermissions()
    • hasPermission(modulo, accion)
    • getAccessibleModules()
    • refreshUser()
    • clearSession()
```

#### [Otros Repositorios] [TODO]
```
lib/data/repositories/
├── usuario_repository.dart ............. [PENDIENTE]
├── rol_repository.dart ................. [PENDIENTE]
├── producto_repository.dart ............ [PENDIENTE]
├── compra_repository.dart .............. [PENDIENTE]
├── venta_repository.dart ............... [PENDIENTE]
├── dashboard_repository.dart ........... [PENDIENTE]
└── orden_produccion_repository.dart .... [PENDIENTE]
```

---

## 🎨 PRESENTATION LAYER - `lib/presentation/`

### Providers - Riverpod State Management

#### Auth Provider
```
lib/presentation/providers/
└── auth_provider.dart ................... 220 líneas
    • AuthState (modelo del estado)
    • AuthNotifier (StateNotifier)
    • authProvider (Provider principal)
    • isAuthenticatedProvider (selector)
    • currentUserProvider (selector)
    • userPermissionsProvider (selector)
    • userModulesProvider (selector)
    • isLoadingProvider (selector)
    
    Métodos:
    • login(email, password)
    • logout()
    • refreshUser()
    • hasPermission(modulo, accion)
    • hasModuleAccess(modulo)
    • clearError()
```

#### Menu Provider
```
lib/presentation/providers/
└── menu_provider.dart ................... 200 líneas
    • MenuItemModel (estructura del menú)
    • dynamicMenuProvider (genera menú)
    
    Lógica:
    • Itera por módulos del usuario
    • Filtra submenu por permisos
    • Genera items solo si hay acceso
    
    Módulos:
    ✅ Dashboard
    ✅ Configuración (Roles, Usuarios)
    ✅ Compras (Proveedores, Compras, Productos)
    ✅ Producción (Órdenes, Insumos, Entregas)
    ✅ Ventas (Clientes, Ventas, Abonos, Pedidos)
```

#### [Otros Providers] [TODO]
```
lib/presentation/providers/
├── usuario_provider.dart ............... [PENDIENTE]
├── rol_provider.dart ................... [PENDIENTE]
├── producto_provider.dart .............. [PENDIENTE]
├── compra_provider.dart ................ [PENDIENTE]
├── venta_provider.dart ................. [PENDIENTE]
├── dashboard_provider.dart ............. [PENDIENTE]
└── orden_produccion_provider.dart ...... [PENDIENTE]
```

### Pages - Páginas/Vistas

#### Login
```
lib/presentation/pages/login/
└── login_page.dart ...................... 180 líneas
    ✅ Implementado
    • Formulario email/password
    • Validación de email con regex
    • Visibilidad de contraseña toggle
    • Manejo de errores
    • Loading state
    • Credenciales de demo
    • Navegación automática a /home
```

#### Home
```
lib/presentation/pages/home/
└── home_page.dart ....................... 160 líneas
    ✅ Implementado
    • Bienvenida personalizada con avatar
    • Card con datos del usuario
    • Grid de accesos rápidos (4 items)
    • Descripción de la app
```

#### Dashboard
```
lib/presentation/pages/dashboard/
└── dashboard_page.dart .................. 170 líneas
    ✅ Implementado (Template)
    • Métricas cards (4): Ventas mes, Ventas hoy, Pedidos, Clientes
    • Placeholders para gráficas (fl_chart)
    • Actividades recientes (5 items mock)
```

#### Splash
```
lib/presentation/pages/splash/
└── splash_page.dart ..................... 110 líneas
    ✅ Implementado
    • Animaciones de entrada
    • Logo escalado
    • Navegación automática
    • Verifica autenticación
```

#### [Otros Modulos] [TODO]
```
lib/presentation/pages/
├── configuracion/
│   ├── roles_page.dart ................. [PENDIENTE]
│   └── usuarios_page.dart .............. [PENDIENTE]
├── compras/
│   ├── proveedores_page.dart ........... [PENDIENTE]
│   ├── compras_page.dart ............... [PENDIENTE]
│   ├── productos_page.dart ............. [PENDIENTE]
│   └── categorias_page.dart ............ [PENDIENTE]
├── produccion/
│   ├── ordenes_page.dart ............... [PENDIENTE]
│   ├── insumos_page.dart ............... [PENDIENTE]
│   └── entregas_page.dart .............. [PENDIENTE]
└── ventas/
    ├── clientes_page.dart .............. [PENDIENTE]
    ├── ventas_page.dart ................ [PENDIENTE]
    ├── abonos_page.dart ................ [PENDIENTE]
    └── pedidos_page.dart ............... [PENDIENTE]
```

### Widgets - Componentes Reutilizables

#### App Drawer
```
lib/presentation/widgets/
└── app_drawer.dart ..................... 180 líneas
    ✅ Implementado
    • Header con avatar del usuario
    • Menú dinámico por permisos
    • Iconografía por módulo
    • ExpansionTile para submenu
    • Botón logout con diálogo
```

#### App Widgets
```
lib/presentation/widgets/
└── app_widgets.dart ..................... 120 líneas
    ✅ Implementado
    • AppLoadingWidget
    • AppErrorWidget
    • AppEmptyWidget
```

### Styles - Estilos

#### Colors
```
lib/presentation/styles/
└── app_colors.dart ...................... 40 líneas
    ✅ Implementado
    • Primary: #800020
    • Secondary: #941434
    • Neutral colors
    • Status colors
    • Gradients
```

### Models
```
lib/presentation/models/
└── menu_item_model.dart ................. 5 líneas
    • Placeholder (definido en menu_provider.dart)
```

---

## 🎯 ROOT FILES

### Main Entry Point
```
lib/main.dart ............................ 100 líneas
    ✅ Implementado
    • ProviderScope setup
    • MaterialApp config
    • Theme aplicado
    • Rutas de navegación (20+)
    • Splash como home
```

### Pubspec Configuration
```
pubspec.yaml ............................ Updated
    ✅ Implementado
    • flutter_riverpod: ^2.4.0
    • dio: ^5.3.1
    • flutter_secure_storage: ^9.0.0
    • intl: ^0.19.0
    • logger: ^2.0.0
    • json_annotation: ^4.8.1
    • [dev] build_runner, riverpod_generator
```

---

## 📊 ESTADÍSTICAS DETALLADAS

### Por Capa
```
Core Layer:
├── config/theme: 200 líneas
├── constants: 50 líneas
├── errors: 120 líneas
└── Total: ~370 líneas

Data Layer:
├── datasources: 360 líneas (local + remote)
├── models: 650 líneas (14 modelos)
├── repositories: 180 líneas
└── Total: ~1190 líneas

Presentation Layer:
├── providers: 420 líneas (auth + menu)
├── pages: 620 líneas (5 páginas)
├── widgets: 300 líneas (drawer + utils)
├── styles: 40 líneas
└── Total: ~1380 líneas

Main: 100 líneas

TOTAL: ~3040 líneas
```

### Por Tipo
```
Código Fuente: ~3000 líneas
Documentación: ~50 KB
Tests: 0 líneas [TODO]
```

---

## ✅ CHECKLIST DE COMPLETITUD

### Core Layer
- ✅ ThemeData con paleta corporativa
- ✅ Constantes centralizadas
- ✅ Excepciones personalizadas (8 tipos)
- ❌ Logger utility [TODO]

### Data Layer
- ✅ APIService con JWT + interceptores
- ✅ SecureStorage wrapper
- ✅ 14 Modelos con fromJson/toJson
- ✅ AuthRepository completo
- ❌ 7 Repositorios adicionales [TODO]

### Presentation Layer
- ✅ AuthProvider con Riverpod
- ✅ MenuProvider dinámico
- ✅ LoginPage funcional
- ✅ HomePage con accesos rápidos
- ✅ DashboardPage template
- ✅ SplashPage con animaciones
- ✅ AppDrawer dinámico
- ✅ Widgets reutilizables
- ✅ Paleta de colores completa
- ❌ 14 Páginas de módulos [TODO]
- ❌ 7 Providers adicionales [TODO]

---

## 🎯 PRÓXIMAS TAREAS POR PRIORIDAD

### ALTA PRIORIDAD (Fase 2)
- [ ] Providers para usuario, rol, producto, etc
- [ ] Páginas CRUD para todos los módulos
- [ ] DataTables/ListView optimizadas
- [ ] Búsqueda y filtros

### MEDIA PRIORIDAD (Fase 3)
- [ ] Gráficas con fl_chart
- [ ] Paginación
- [ ] Validaciones avanzadas
- [ ] Offline mode con Hive

### BAJA PRIORIDAD (Fase 4)
- [ ] Temas oscuro/claro
- [ ] Internacionalización
- [ ] Tests unitarios
- [ ] Analytics

---

## 📖 GUÍA DE LECTURA RECOMENDADA

### Para Nuevos Desarrolladores:
1. Empezar con: **README.md**
2. Luego: **QUICK_START.md** (instalación)
3. Estudiar: **ARCHITECTURE.md** (diseño)
4. Referencia: **DEVELOPMENT_GUIDE.md** (desarrollo)
5. Consulta: **Este INDEX.md**

### Para Entender el Código:
1. `lib/main.dart` - Punto de entrada
2. `lib/presentation/providers/auth_provider.dart` - State management
3. `lib/data/datasources/remote/api_service.dart` - Capa de API
4. `lib/presentation/pages/login/login_page.dart` - Ejemplo de página

### Para Agregar Nuevas Características:
1. Ver **DEVELOPMENT_GUIDE.md** sección "Flujo de Desarrollo Típico"
2. Seguir el patrón de AuthProvider
3. Reutilizar widgets de app_widgets.dart
4. Aplicar estilos de app_colors.dart

---

## 🔗 REFERENCIAS CRUZADAS

| Concepto | Archivos |
|----------|----------|
| **Autenticación** | auth_models.dart, auth_repository.dart, auth_provider.dart, login_page.dart |
| **Menú Dinámico** | menu_provider.dart, app_drawer.dart |
| **Almacenamiento** | secure_storage.dart, auth_repository.dart |
| **API** | api_service.dart, app_constants.dart |
| **Temas** | app_theme.dart, app_colors.dart |
| **Errores** | exceptions.dart, api_service.dart |

---

## 📞 INFORMACIÓN DE CONTACTO

**API Base**: http://192.168.40.76:3002  
**Versión**: 1.0.0  
**Actualizado**: Mayo 2026  

---

**[← Volver a README.md](./README.md)**
