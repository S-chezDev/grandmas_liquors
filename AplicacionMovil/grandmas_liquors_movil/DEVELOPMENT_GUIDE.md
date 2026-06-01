# 🚀 Guía de Desarrollo Rápido - Grandmas Liquors Mobile

## Configuración Inicial

### 1. Instalación de dependencias
```bash
# En la carpeta raíz del proyecto
flutter pub get

# Generar código necesario (si es requerido)
flutter pub run build_runner build
```

### 2. Variables de entorno (Opcional)
Crear un archivo `.env` en la raíz (aunque no es obligatorio):
```
API_BASE_URL=http://192.168.40.76:3002
APP_NAME=Grandmas Liquors
```

### 3. Ejecutar la aplicación
```bash
# Por defecto
flutter run

# En Android
flutter run -d android

# En iOS
flutter run -d ios

# En web
flutter run -d web
```

## Credenciales de Prueba (Demo)

```
Email: admin@example.com
Contraseña: password123
```

## 📋 Estructura de Carpetas Completa

```
lib/
├── core/
│   ├── config/
│   │   ├── theme/
│   │   │   └── app_theme.dart ........... ✅ CREADO
│   │   └── [más configs aquí]
│   ├── constants/
│   │   └── app_constants.dart ........... ✅ CREADO
│   ├── errors/
│   │   └── exceptions.dart .............. ✅ CREADO
│   └── utils/
│       └── logger.dart ................. [TODO]
│
├── data/
│   ├── datasources/
│   │   ├── local/
│   │   │   └── secure_storage.dart ...... ✅ CREADO
│   │   └── remote/
│   │       └── api_service.dart ......... ✅ CREADO
│   ├── models/
│   │   ├── auth/
│   │   │   └── auth_models.dart ......... ✅ CREADO
│   │   ├── usuarios/
│   │   │   └── [TODO]
│   │   ├── roles/
│   │   │   └── [TODO]
│   │   ├── productos/
│   │   │   └── producto_models.dart ..... ✅ CREADO
│   │   ├── compras/
│   │   │   └── compra_models.dart ....... ✅ CREADO
│   │   ├── ventas/
│   │   │   └── venta_models.dart ........ ✅ CREADO
│   │   ├── ordenes_produccion/
│   │   │   └── orden_produccion_models.dart ✅ CREADO
│   │   └── dashboard/
│   │       └── dashboard_models.dart .... ✅ CREADO
│   └── repositories/
│       ├── auth_repository.dart ......... ✅ CREADO
│       ├── usuario_repository.dart ..... [TODO]
│       ├── rol_repository.dart ......... [TODO]
│       └── [más repos...]
│
├── presentation/
│   ├── providers/
│   │   ├── auth_provider.dart ........... ✅ CREADO
│   │   ├── menu_provider.dart ........... ✅ CREADO
│   │   ├── usuario_provider.dart .... [TODO]
│   │   ├── rol_provider.dart ........ [TODO]
│   │   ├── producto_provider.dart ... [TODO]
│   │   └── [más providers...]
│   ├── pages/
│   │   ├── login/
│   │   │   └── login_page.dart ......... ✅ CREADO
│   │   ├── home/
│   │   │   └── home_page.dart ......... ✅ CREADO
│   │   ├── dashboard/
│   │   │   └── dashboard_page.dart .... ✅ CREADO
│   │   ├── splash/
│   │   │   └── splash_page.dart ....... ✅ CREADO
│   │   ├── configuracion/
│   │   │   ├── roles_page.dart ........ [TODO]
│   │   │   └── usuarios_page.dart .... [TODO]
│   │   ├── compras/
│   │   │   ├── proveedores_page.dart . [TODO]
│   │   │   ├── compras_page.dart ..... [TODO]
│   │   │   ├── productos_page.dart ... [TODO]
│   │   │   └── categorias_page.dart .. [TODO]
│   │   ├── produccion/
│   │   │   ├── ordenes_page.dart ..... [TODO]
│   │   │   ├── insumos_page.dart ..... [TODO]
│   │   │   └── entregas_page.dart .... [TODO]
│   │   └── ventas/
│   │       ├── clientes_page.dart .... [TODO]
│   │       ├── ventas_page.dart ...... [TODO]
│   │       ├── abonos_page.dart ...... [TODO]
│   │       └── pedidos_page.dart ..... [TODO]
│   ├── widgets/
│   │   ├── app_drawer.dart ........... ✅ CREADO
│   │   └── app_widgets.dart ......... ✅ CREADO
│   ├── styles/
│   │   └── app_colors.dart .......... ✅ CREADO
│   └── models/
│       └── menu_item_model.dart ..... ✅ CREADO
│
├── main.dart ......................... ✅ CREADO
└── README.md ......................... ✅ CREADO
```

## 🔑 Archivos Clave y su Propósito

### Core Layer

**`app_constants.dart`**
- Define la URL base de la API
- Constantes de endpoints
- Claves de almacenamiento
- Módulos disponibles

**`app_theme.dart`**
- ThemeData global con paleta Rojo (#800020) y Blanco
- Estilos de texto reutilizables
- Temas para botones, campos de entrada, etc.

**`app_colors.dart`**
- Definición de colores hexadecimales
- Gradientes predefinidos
- Colores de estado (success, error, warning)

### Data Layer

**`api_service.dart`**
- Cliente HTTP con Dio
- Gestión automática de JWT en headers
- Manejo de errores y retry
- Interceptores para refresh token

**`secure_storage.dart`**
- Almacenamiento seguro de tokens
- Métodos para guardar/obtener JWT
- Gestión de refresh tokens

**`auth_repository.dart`**
- Lógica de login/logout
- Gestión de permisos
- Cálculo de módulos accesibles

### Presentation Layer

**`auth_provider.dart`** (Riverpod)
- Estado de autenticación
- Métodos: login(), logout(), refreshUser()
- Selectors: isAuthenticatedProvider, currentUserProvider

**`menu_provider.dart`** (Riverpod)
- Generación dinámica de menú
- Filtra opciones según permisos
- Detecta módulos accesibles

**`login_page.dart`**
- Interfaz de login
- Validación de email
- Manejo de errores

**`app_drawer.dart`**
- Menú lateral dinámico
- Genera items basado en permisos
- Botón de logout

## ✅ Características Implementadas

- ✅ Clean Architecture
- ✅ State Management con Riverpod
- ✅ Autenticación JWT
- ✅ Sistema RBAC dinámico
- ✅ Almacenamiento seguro de tokens
- ✅ Menú dinámico basado en permisos
- ✅ Modelos completos con fromJson/toJson
- ✅ Paleta de colores Rojo y Blanco
- ✅ Manejo de errores centralizado
- ✅ Interceptores de API

## 🔄 Flujo de Desarrollo Típico

### 1. Crear una nueva página
```
1. Crear archivo: lib/presentation/pages/[modulo]/[feature]_page.dart
2. Extender ConsumerWidget o ConsumerStatefulWidget
3. Usar providers para acceder a datos
4. Añadir ruta en main.dart
```

### 2. Crear un nuevo provider
```
1. Crear archivo: lib/presentation/providers/[feature]_provider.dart
2. Crear StateNotifier si hay lógica compleja
3. Crear Provider o FutureProvider
4. Crear selectores si es necesario
```

### 3. Crear un nuevo modelo
```
1. Crear carpeta: lib/data/models/[entidad]/
2. Crear archivo: [entidad]_models.dart
3. Implementar fromJson y toJson
4. Incluir validaciones básicas
```

### 4. Crear un nuevo repositorio
```
1. Crear archivo: lib/data/repositories/[entidad]_repository.dart
2. Inyectar APIService y SecureStorage
3. Implementar métodos de CRUD
4. Manejar excepciones
```

## 🐛 Debugging

### Ver logs de API
```dart
// En app_service.dart, los logs se imprimirán en la consola:
print('[API Request] GET /api/endpoint');
print('[API Response] 200 /api/endpoint');
print('[API Error] 401 - Unauthorized');
```

### Verificar permisos actuales
```dart
// En el AuthProvider
bool hasPermission = authNotifier.hasPermission('sales', 'view');
bool hasModule = authNotifier.hasModuleAccess('dashboard');
```

### Simular expiración de token
```dart
// En SecureStorage, borra el token:
await secureStorage.deleteToken();
// El siguiente request disparará un 401 y usará refresh token
```

## 📱 Testing Manual

### Paso 1: Login
```
Email: admin@example.com
Contraseña: password123
```

### Paso 2: Verificar menú dinámico
- El menú debe mostrar solo módulos con acceso
- Expandir/contraer categorías

### Paso 3: Navegar entre secciones
- Verificar que los datos se cargan correctamente
- Comprobar que los errores se muestren correctamente

### Paso 4: Logout
- Presionar botón "Cerrar Sesión"
- Debe redirigir a /login
- Verificar que no hay datos cacheados

## 🔗 Endpoints API Esperados

```
POST   /api/auth/login              → {token, refreshToken, usuario}
POST   /api/auth/logout             → {success}
GET    /api/auth/me                 → {usuario}
POST   /api/auth/refresh            → {token}

GET    /api/usuarios                → [UsuarioModel]
POST   /api/usuarios                → {id, ...}
PUT    /api/usuarios/:id            → {usuario}
DELETE /api/usuarios/:id            → {success}

GET    /api/roles                   → [RolModel]
POST   /api/roles                   → {id, ...}
PUT    /api/roles/:id               → {rol}
DELETE /api/roles/:id               → {success}

GET    /api/productos               → [ProductoModel]
POST   /api/productos               → {id, ...}
PUT    /api/productos/:id           → {producto}
DELETE /api/productos/:id           → {success}

GET    /api/dashboard/metricas      → {ventasMes, ventasHoy, ...}
```

## 💡 Tips de Desarrollo

1. **Usar Riverpod Devtools**: Instala la extensión de Chrome para debugging
2. **Hot Reload**: Presiona `r` en la terminal para recargar rápidamente
3. **Formatear código**: `flutter format lib/`
4. **Analizar código**: `flutter analyze`
5. **Limpiar cache**: `flutter clean && flutter pub get`

## 🆘 Solución de Problemas

### Error: "No provider found"
- Asegurar que el Provider está importado correctamente
- Verificar que la sintaxis del Provider es correcta

### Error: "401 Unauthorized"
- El token ha expirado o no es válido
- Hacer login nuevamente
- Verificar que la URL de API es correcta

### Error: "Connection timeout"
- Verificar que la API está corriendo en `http://192.168.40.76:3002`
- Verificar que no hay firewall bloqueando la conexión
- Usar `http://localhost:3002` si está en emulador Android

### La UI no se actualiza
- Asegurar que usas `ConsumerWidget` o `ConsumerStatefulWidget`
- Verificar que el Provider es `StateNotifierProvider`
- Usar `.watch()` en lugar de `.read()` para actualización automática

## 📚 Referencias

- [Flutter Docs](https://flutter.dev/docs)
- [Riverpod Docs](https://riverpod.dev)
- [Dio Package](https://pub.dev/packages/dio)
- [Flutter Secure Storage](https://pub.dev/packages/flutter_secure_storage)

## 🎯 Próximas Tareas

1. Implementar repositories para cada módulo
2. Crear providers para cada entidad
3. Implementar páginas de CRUD
4. Agregar DataTables para listas
5. Implementar gráficas con fl_chart
6. Agregar validaciones de formularios
7. Implementar búsqueda y filtros
8. Añadir pruebas unitarias

---

**Última actualización**: Mayo 2026
**Versión**: 1.0.0
