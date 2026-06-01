# 🍷 Grandmas Liquors Mobile

**Sistema de Gestión Empresarial** - Aplicación Flutter para administrar ventas, compras, producción y configuración.

[![Flutter](https://img.shields.io/badge/Flutter-3.11.5-02569B?logo=flutter)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.11.5-0175C2?logo=dart)](https://dart.dev)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#licencia)

---

## 📸 Características Principales

✨ **Autenticación JWT** con refresh tokens automáticos  
🔐 **Sistema RBAC** dinámico (5 módulos, múltiples permisos)  
📊 **Dashboard** con métricas y gráficas  
📱 **Interfaz Responsiva** optimizada para móvil  
🎨 **Tema Corporativo** Rojo (#800020) y Blanco  
⚡ **Clean Architecture** con Riverpod state management  

---

## 🚀 Inicio Rápido

### 1. Requisitos
- Flutter SDK 3.11.5+
- Dart SDK (incluido)
- API corriendo en una URL accesible desde la app

### 1.1 Configuración de API
La app toma la URL del backend desde `API_BASE_URL`.

Ejemplo:
```bash
flutter run --dart-define=API_BASE_URL=http://192.168.40.76:3002
```

Si no se define, en web usa `http://localhost:3002` y en otras plataformas conserva la URL local por defecto.

### 2. Instalación
```bash
cd grandmas_liquors_movil
flutter pub get
flutter run
```

### 3. Credenciales de Prueba
```
Email: admin@example.com
Contraseña: password123
```

Para más detalles, ver [QUICK_START.md](./QUICK_START.md)

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [**QUICK_START.md**](./QUICK_START.md) | ⚡ Instalación en 5 pasos |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | 📐 Diseño y estructura completa |
| [**DEVELOPMENT_GUIDE.md**](./DEVELOPMENT_GUIDE.md) | 🔧 Guía de desarrollo |
| [**RESUMEN_EJECUTIVO.md**](./RESUMEN_EJECUTIVO.md) | 📊 Resumen de lo implementado |

---

## 🏗️ Arquitectura

```
Clean Architecture (3 Capas)
├── Presentation Layer (UI + State Management)
├── Data Layer (API + Storage)
└── Core Layer (Config + Utilities)
```

**Stack Tecnológico:**
- State Management: `flutter_riverpod`
- HTTP Client: `dio` (con JWT)
- Almacenamiento: `flutter_secure_storage`
- Serialización: `json_annotation`

[→ Ver diagrama completo](./ARCHITECTURE.md)

---

## 📱 Módulos Disponibles

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Dashboard** | Métricas y reportes | ✅ Template |
| **Configuración** | Gestión de Roles y Usuarios | ✅ Framework |
| **Compras** | Proveedores, compras, productos | ✅ Framework |
| **Producción** | Órdenes, insumos, entregas | ✅ Framework |
| **Ventas** | Clientes, ventas, abonos, pedidos | ✅ Framework |

---

## 🔐 Seguridad

- ✅ JWT guardado en `FlutterSecureStorage`
- ✅ Refresh tokens automáticos
- ✅ Validación de email
- ✅ Manejo centralizado de errores
- ✅ 8 tipos de excepciones específicas

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Archivos Creados | 60+ |
| Líneas de Código | 3000+ |
| Modelos de Datos | 14 |
| Providers | 10 |
| Excepciones | 8 |
| Documentación | 4 guías |

---

## 🎨 Paleta de Colores

```
Primary (Rojo)    #800020  ████
Secondary (Rojo)  #941434  ████
Background        #FFFFFF  ████
Text              #000000  ████
Success           #4CAF50  ████
Error             #F44336  ████
```

---

## 🗂️ Estructura de Carpetas

```
lib/
├── core/
│   ├── config/theme/app_theme.dart
│   ├── constants/app_constants.dart
│   └── errors/exceptions.dart
├── data/
│   ├── datasources/ (API + Storage)
│   ├── models/ (14 modelos)
│   └── repositories/
├── presentation/
│   ├── providers/ (Riverpod)
│   ├── pages/ (5 páginas)
│   ├── widgets/
│   └── styles/
└── main.dart
```

[→ Ver estructura completa](./DEVELOPMENT_GUIDE.md#-estructura-de-carpetas-completa)

---

## 🔄 Flujo de Autenticación

```
Usuario → Login → API → JWT + User Data
                         ↓
                   SecureStorage
                         ↓
                   APIService (Headers)
                         ↓
                   AuthProvider (State)
                         ↓
                   Menu Dinámico
```

[→ Ver diagrama detallado](./ARCHITECTURE.md#-flujo-de-autenticación-jwt)

---

## 🚀 Próximas Tareas

### Fase 2: Implementación
- [ ] Providers para cada módulo
- [ ] Páginas CRUD
- [ ] DataTables/ListView
- [ ] Búsqueda y filtros

### Fase 3: Enhancements
- [ ] Gráficas con `fl_chart`
- [ ] Paginación
- [ ] Modo offline
- [ ] Push notifications

### Fase 4: Polish
- [ ] Temas oscuro/claro
- [ ] Internacionalización
- [ ] Tests
- [ ] Analytics

---

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
flutter pub get

# Generar código
flutter pub run build_runner build

# Ejecutar app
flutter run

# Formato de código
flutter format lib/

# Análisis de código
flutter analyze

# Limpiar proyecto
flutter clean
```

---

## 📞 API Base

**URL:** configurable con `API_BASE_URL`

**Principales Endpoints:**
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/refresh` - Refresh token

---

## 📦 Dependencias Principales

```yaml
flutter_riverpod: ^2.4.0    # State Management
dio: ^5.3.1                 # HTTP Client
flutter_secure_storage: ^9.0.0  # Almacenamiento seguro
intl: ^0.19.0               # Internacionalización
logger: ^2.0.0              # Logging
```

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Crear rama feature: `git checkout -b feature/nueva-feature`
2. Commit cambios: `git commit -m 'Add nueva-feature'`
3. Push rama: `git push origin feature/nueva-feature`
4. Abrir Pull Request

---

## 📋 Checklist de Verificación

- ✅ Clean Architecture implementada
- ✅ Riverpod state management
- ✅ JWT Authentication
- ✅ Dynamic RBAC menu
- ✅ Secure token storage
- ✅ Color theme
- ✅ 14 Data models
- ✅ API Service robusto
- ✅ Error handling
- ✅ Documentación

---

## 📄 Licencia

Todos los derechos reservados © 2026 Grandmas Liquors

---

## 🆘 Soporte

¿Problemas? Revisa:
- [QUICK_START.md](./QUICK_START.md) - Instalación
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#-solución-de-problemas) - Troubleshooting
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diseño técnico

---

## 👨‍💻 Autor

**Diseño & Arquitectura**: Senior Software Architect  
**Tecnología**: Flutter + Riverpod + Clean Architecture  
**Actualizado**: Mayo 2026

---

**[⬆ Volver al inicio](#-grandmas-liquors-mobile)**

