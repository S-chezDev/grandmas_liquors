# ⚡ GUÍA DE INSTALACIÓN RÁPIDA

## 📋 Requisitos Previos

- Flutter SDK 3.11.5+ instalado
- Dart SDK incluido con Flutter
- Android Studio o Xcode (según la plataforma)
- Git
- Un editor de texto (VS Code recomendado)

Verificar instalación:
```bash
flutter --version
dart --version
```

## 🚀 Instalación en 5 Pasos

### Paso 1: Clonar el repositorio
```bash
cd ~/Desktop/repos/AplicacionMovil
cd grandmas_liquors_movil
```

### Paso 2: Limpiar flutter (Recomendado)
```bash
flutter clean
```

### Paso 3: Instalar dependencias
```bash
flutter pub get
```

### Paso 4: Generar código (Opcional pero recomendado)
```bash
flutter pub run build_runner build
```

### Paso 5: Ejecutar la aplicación
```bash
flutter run
```

## 📱 Ejecutar en Diferentes Plataformas

### Android
```bash
# En emulador
flutter run -d android

# En dispositivo conectado
flutter run
```

### iOS
```bash
flutter run -d ios
```

### Web
```bash
flutter run -d web
```

## 🔑 Credenciales de Prueba

Usa estos datos en la pantalla de login:

| Campo | Valor |
|-------|-------|
| **Email** | admin@example.com |
| **Contraseña** | password123 |

## ✅ Verificar Instalación

Después de ejecutar `flutter run`, deberías ver:

1. ✅ Splash screen con logo GL
2. ✅ Pantalla de login con formulario
3. ✅ Después de login → Home page
4. ✅ Drawer lateral con opciones dinámicas

## 🆘 Si Algo No Funciona

### Error: "Flutter command not found"
```bash
# Añadir Flutter a PATH
export PATH="$PATH:`flutter sdk path`/bin"
```

### Error: "Couldn't connect to X server"
```bash
# En Linux, usar DISPLAY
DISPLAY=:0 flutter run
```

### Error: "No devices found"
```bash
# Crear emulador Android
flutter emulators --create --name Pixel_4_API_30

# Listar emuladores
flutter emulators

# Ejecutar emulador
flutter emulators --launch Pixel_4_API_30
```

### Error: "Connection refused" en API
```bash
# Verificar que API está corriendo en:
# http://192.168.40.76:3002

# En emulador Android, usar:
# http://10.0.2.2:3002 (en lugar de localhost)

# Cambiar en: lib/core/constants/app_constants.dart
static const String apiBaseUrl = 'http://10.0.2.2:3002';
```

### Error: "MissingPluginException"
```bash
flutter pub get
flutter pub run build_runner build
flutter run
```

## 🔄 Hot Reload

Durante desarrollo, presiona `r` en la terminal para recargar sin reiniciar:
```
Connected to the application instance.
Reloading libraries for updates...
```

## 📊 Ver Logs

Los logs aparecen automáticamente en la consola de Flutter. Filtrar por tag:
```bash
# Ver solo errores
flutter run 2>&1 | grep -i error

# Ver logs de API
flutter run 2>&1 | grep -i "API"
```

## 🎯 Estructura después de instalación

```
grandmas_liquors_movil/
├── lib/                          # Código fuente
│   ├── core/                     # Configuración global
│   ├── data/                     # Modelos y repositorios
│   ├── presentation/             # UI y páginas
│   └── main.dart                 # Punto de entrada
├── android/                      # Código nativo Android
├── ios/                          # Código nativo iOS
├── web/                          # Código para web
├── test/                         # Tests
├── pubspec.yaml                  # Dependencias
├── pubspec.lock                  # Lock de dependencias
├── ARCHITECTURE.md               # Documentación
├── DEVELOPMENT_GUIDE.md          # Guía de desarrollo
├── RESUMEN_EJECUTIVO.md          # Este documento
└── [archivos de proyecto]
```

## 📦 Tamaño del Proyecto

```
Android: ~50 MB (APK)
iOS: ~100 MB (IPA)
Web: ~15 MB (HTML/JS)
Source code: ~5 MB
Dependencies: ~200 MB (en pubspec.lock)
```

## 🚨 Configuración de API

Si necesitas cambiar la URL de API:

**Archivo**: `lib/core/constants/app_constants.dart`

```dart
// Cambiar esta línea
static const String apiBaseUrl = 'http://192.168.40.76:3002';

// A:
static const String apiBaseUrl = 'http://tu-url:puerto';
```

Luego:
```bash
flutter run
```

## 🎨 Tema de Colores

Si necesitas cambiar la paleta de colores:

**Archivo**: `lib/presentation/styles/app_colors.dart`

```dart
// Editar estas constantes
static const Color primaryRed = Color(0xFF800020);     // #800020
static const Color primaryRedDark = Color(0xFF941434); // #941434
```

## 📱 Testing Manual Rápido

### Test 1: Login
1. Ejecutar app
2. Ingresar email y contraseña
3. Presionar "Iniciar Sesión"
4. **Esperado**: Ir a Home page

### Test 2: Logout
1. Desde Home, abrir drawer (icono hamburguesa)
2. Presionar "Cerrar Sesión"
3. **Esperado**: Volver a Login

### Test 3: Menú Dinámico
1. Login exitoso
2. Ver drawer → solo módulos con acceso visibles
3. Expandir categorías
4. **Esperado**: Subcategorías correctas

### Test 4: Permiso Denagado
1. (Requiere backend con permisos limitados)
2. Navegar a módulo sin acceso
3. **Esperado**: Error 403 o acceso denegado

## 🔍 Debugging

### Ver AppBar
```dart
# En main.dart se puede cambiar:
debugShowCheckedModeBanner: false  // Quitar banner de DEBUG
```

### Ver Widget Tree
En VS Code con Flutter extension:
```
Ctrl+Shift+P → Flutter: Open DevTools
```

### Ver Network Requests
En DevTools → Network tab
Mostrar todos los requests a la API

## 💾 Guardado Automático

La app guarda automáticamente en SecureStorage:
- JWT Token
- Refresh Token
- Datos del usuario
- Permisos

Al cerrar sesión, se limpia todo.

## 🔐 Nota de Seguridad

**NO** guardes credenciales en:
- Variables de entorno globales
- Código fuente
- SharedPreferences (sin encriptar)

Siempre usa:
- FlutterSecureStorage ✅
- Variables de entorno locales ✅
- .gitignore para archivos sensibles ✅

## 📞 API de Prueba

Asegúrate que el backend esté corriendo:

```bash
# Verificar conectividad
curl http://192.168.40.76:3002/api/health

# Respuesta esperada
{"status": "ok"}
```

## 🎬 Próximos Pasos

1. ✅ Instalación completada
2. ⏭️ Lee DEVELOPMENT_GUIDE.md
3. ⏭️ Implementa tus primeros providers
4. ⏭️ Crea páginas CRUD
5. ⏭️ Conecta con tu API

## 📚 Recursos Útiles

- [Flutter Docs](https://flutter.dev/docs)
- [Riverpod Tutorial](https://riverpod.dev/docs/introduction)
- [Dio HTTP Client](https://pub.dev/packages/dio)
- [Flutter Secure Storage](https://pub.dev/packages/flutter_secure_storage)

## ✅ Checklist

- [ ] Flutter SDK instalado
- [ ] Proyecto clonado
- [ ] `flutter pub get` ejecutado
- [ ] API corriendo en http://192.168.40.76:3002
- [ ] `flutter run` ejecutado sin errores
- [ ] Login exitoso con credenciales de prueba
- [ ] Menú visible en drawer

---

**Estado**: ✅ Listo para usar
**Versión**: 1.0.0
**Última actualización**: Mayo 2026

¡**Disfruta desarrollando con Grandmas Liquors Mobile!** 🍷
