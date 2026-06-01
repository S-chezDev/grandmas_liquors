# 🍷 Grandmas Liquors - Sistema de Gestión Empresarial

Aplicación Flutter para la gestión completa de un negocio de licores con módulos de ventas, compras, producción y configuración.

## 🏗️ Arquitectura - Clean Architecture

La aplicación sigue el patrón **Clean Architecture** con las siguientes capas:

### 1. **Core Layer** (`lib/core/`)
Contiene configuraciones globales, constantes y excepciones.

```
core/
├── config/
│   └── theme/
│       └── app_theme.dart         # ThemeData personalizado (Blanco y Rojo)
├── constants/
│   └── app_constants.dart         # URL API y constantes globales
├── errors/
│   └── exceptions.dart            # Excepciones personalizadas
└── utils/
    └── logger.dart                # Utilidades de logging
```

**Archivo clave: `app_constants.dart`**
```dart
static const String apiBaseUrl = 'http://192.168.40.76:3002';
```

### 2. **Data Layer** (`lib/data/`)
Gestiona el acceso a datos (API REST, almacenamiento local).

```
data/
├── datasources/
│   ├── local/
│   │   └── secure_storage.dart    # FlutterSecureStorage para JWT
│   └── remote/
│       └── api_service.dart       # Cliente HTTP con Dio
├── models/                        # Modelos con fromJson/toJson
│   ├── auth/
│   ├── usuarios/
│   ├── roles/
│   ├── productos/
│   ├── compras/
│   ├── ventas/
│   ├── ordenes_produccion/
│   └── dashboard/
└── repositories/                  # Repositorios que integran datasources
    └── auth_repository.dart       # Gestión de autenticación
```

**Flujo de datos:**
```
Presentation (UI) 
    ↓
Providers (Riverpod)
    ↓
Repositories (Lógica de negocio)
    ↓
DataSources (API/Storage)
```

### 3. **Presentation Layer** (`lib/presentation/`)
Interfaz de usuario con Riverpod para state management.

```
presentation/
├── providers/                     # Riverpod StateNotifiers
│   ├── auth_provider.dart        # Autenticación y autorización
│   └── menu_provider.dart        # Menú dinámico basado en permisos
├── pages/
│   ├── login/                    # Pantalla de inicio de sesión
│   ├── home/                     # Página principal
│   ├── dashboard/                # Métricas y gráficas
│   ├── configuracion/            # Roles y usuarios
│   ├── compras/                  # Compras y productos
│   ├── produccion/               # Órdenes de producción
│   ├── ventas/                   # Ventas, clientes, abonos
│   └── splash/                   # Pantalla de carga
├── widgets/
│   ├── app_drawer.dart          # Menú lateral dinámico
│   └── app_widgets.dart         # Widgets reutilizables
└── styles/
    └── app_colors.dart          # Paleta de colores (Rojo #800020)
```

## 🎨 Paleta de Colores

| Nombre | Código | RGB |
|--------|--------|-----|
| Primary Red | #800020 | 128, 0, 32 |
| Sidebar Red | #941434 | 148, 20, 52 |
| White | #FFFFFF | 255, 255, 255 |
| Success | #4CAF50 | - |
| Error | #F44336 | - |

## 🔐 Sistema de Permisos (RBAC)

### Estructura de Permisos:
```dart
class PermisoModel {
  String modulo;      // dashboard, configuration, purchases, production, sales
  String accion;      // view, create, edit, delete, approve
  bool activo;
}
```

### Módulos Disponibles:
1. **Dashboard** - Métricas y reportes
2. **Configuration** - Gestión de roles y usuarios
3. **Purchases** - Compras, productos, proveedores
4. **Production** - Órdenes de producción, insumos
5. **Sales** - Ventas, clientes, abonos, pedidos

## 🔑 Autenticación JWT

### Flujo de Login:
```
1. Usuario ingresa email/contraseña
2. API retorna JWT token + refresh token
3. Tokens se guardan en SecureStorage
4. JWT se incluye en todos los headers: Authorization: Bearer <token>
5. Si token expira, se usa refresh token para obtener nuevo
```

### Implementación:
```dart
// En ApiService con Dio Interceptors
Future<void> _onRequest(RequestOptions options, ...) {
  final token = await _secureStorage.getToken();
  if (token != null) {
    options.headers['Authorization'] = 'Bearer $token';
  }
}
```

## 📱 Modelos de Datos

### Core Models:

**UsuarioModel**
```dart
- id, nombre, email, apellido, telefono
- activo: bool
- rol: RolModel
- permisos: List<PermisoModel>
```

**RolModel**
```dart
- id, nombre, descripcion
- activo: bool
- permisos: List<PermisoModel>
```

**ProductoModel**
```dart
- id, nombre, categoria, tipo
- precio: double
- stock: int
- activo: bool
```

**VentaModel**
```dart
- id, numeroVenta, clienteId
- total, pagado, saldo: double
- estado: string (pendiente, completado, etc)
- detalles: List<DetalleVentaModel>
```

## 🚀 Menú Dinámico

El menú se genera automáticamente basado en los permisos del usuario:

```dart
final dynamicMenuProvider = Provider<List<MenuItemModel>>((ref) {
  final modulos = ref.watch(userModulesProvider);
  
  // Si usuario tiene acceso a 'dashboard', se añade el menú
  if (modulos.contains('dashboard')) {
    menuItems.add(MenuItemModel(...));
  }
  
  return menuItems;
});
```

## 📊 Dashboard

Muestra:
- ✅ Métricas de venta del mes
- ✅ Ventas de hoy
- ✅ Pedidos/clientes activos
- ✅ Gráficas de ventas mensuales (placeholder para fl_chart)
- ✅ Distribución por categoría

## 🔧 Instalación y Ejecución

### 1. Clonar repositorio
```bash
git clone <repo-url>
cd grandmas_liquors_movil
```

### 2. Instalar dependencias
```bash
flutter pub get
```

### 3. Generar código (si es necesario)
```bash
flutter pub run build_runner build
```

### 4. Ejecutar la aplicación
```bash
flutter run
```

### 5. Ejecutar en plataforma específica
```bash
# Android
flutter run -d android

# iOS
flutter run -d ios

# Web
flutter run -d web
```

## 📦 Dependencias Principales

```yaml
flutter_riverpod: ^2.4.0      # State Management
dio: ^5.3.1                   # HTTP Client
flutter_secure_storage: ^9.0.0 # Almacenamiento seguro
intl: ^0.19.0                 # Internacionalización
logger: ^2.0.0                # Logging
```

## 🧪 Testing

Para ejecutar tests:
```bash
flutter test
```

## 📝 Estructura de Rutas

```
/splash           → Pantalla de carga
/login            → Login
/home             → Página principal
/dashboard        → Dashboard
/configuration/roles
/configuration/usuarios
/purchases/proveedores
/purchases/compras
/purchases/productos
/purchases/categorias
/production/ordenes
/production/insumos
/production/entregas
/sales/clientes
/sales/ventas
/sales/abonos
/sales/pedidos
```

## 🔄 Flujo de Inicialización

1. **SplashPage** - Verifica si hay token válido
2. Si ✅ token → **HomePage**
3. Si ❌ token → **LoginPage**
4. AuthProvider mantiene estado de sesión
5. MenuProvider genera menú dinámico basado en permisos

## 🎯 Próximos Pasos

- [ ] Implementar DataTables para listas de datos
- [ ] Agregar gráficas con fl_chart
- [ ] Implementar páginas de CRUD para cada módulo
- [ ] Agregar validaciones de formularios
- [ ] Implementar búsqueda y filtros
- [ ] Agregar internacionalización (es/en)
- [ ] Implementar notificaciones push
- [ ] Agregar temas oscuro/claro

## 📞 Contacto API

**Base URL:** `http://192.168.40.76:3002`

**Endpoints principales:**
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/refresh` - Refresh token

## 📄 Licencia

Todos los derechos reservados © 2026 Grandmas Liquors
