# Backend - Liqueur Sales Management App

## Descripción

Backend completo para la aplicación de Gestión de Ventas de Licores. Proporciona una API REST con endpoints para gestionar:

- Categorías y Productos
- Clientes y Proveedores
- Pedidos, Ventas y Abonos
- Domicilios/Entregas
- Compras a Proveedores
- Insumos y Producción

---

## Estructura del Proyecto

```
backend/
├── index.js              # Entrada principal del servidor
├── config.js             # Configuración (variables de entorno)
├── db.js                 # Pool de conexiones MySQL
├── models.js             # Modelos de datos (CRUD)
├── controllers.js        # Controladores de rutas
├── routes.js             # Definición de rutas API
├── schema.sql            # Script de base de datos
├── .env                  # Variables de entorno
├── API_ENDPOINTS.md      # Documentación de endpoints
└── README.md             # Este archivo
```

---

## Requisitos Previos

- **Node.js** (v14 o superior)
- **MySQL** (v5.7 o superior)
- **npm** o **yarn**

---

## Instalación

### 1. Instalar Dependencias

```bash
npm install
```

O si usas yarn:

```bash
yarn install
```

### 2. Configurar Base de Datos

#### Opción A: Importar schema automáticamente

```bash
npm run setup-db
```

#### Opción B: Importar manualmente en MySQL

```bash
mysql -u root -p liqueur_sales < backend/schema.sql
```

### 3. Configurar Variables de Entorno

Actualiza el archivo `.env` con tus credenciales:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=liqueur_sales

# Configuración del Servidor
PORT=5000
NODE_ENV=development
```

---

## Dependencias Requeridas

```json
{
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "mysql2": "^3.0.0",
  "dotenv": "^16.0.0"
}
```

**Instalar todas:**

```bash
npm install express cors mysql2 dotenv
```

---

## Ejecutar el Servidor

### Desarrollo

```bash
npm start
```

o con nodemon (actualizaciones automáticas):

```bash
npm run dev
```

### Producción

```bash
npm run prod
```

---

## Resultado Esperado

Al iniciar el servidor, deberías ver:

```
╔════════════════════════════════════════════════════════════╗
║        LIQUEUR SALES MANAGEMENT APP - BACKEND              ║
╚════════════════════════════════════════════════════════════╝

✓ Servidor Backend iniciado exitosamente
✓ Puerto: 5000
✓ Ambiente: development
✓ Base de Datos: Conectada
✓ Conexión App-Backend: Establecida

📋 ENDPOINTS DISPONIBLES:
   - GET    /api/health                 (Verificar estado)
   - GET    /api/categorias             (Listar categorías)
   - GET    /api/productos              (Listar productos)
   - GET    /api/clientes               (Listar clientes)
   ...más endpoints...

🌐 URL Base: http://localhost:5000

════════════════════════════════════════════════════════════
```

---

## Arquitetura

### Flujo de Datos

```
Cliente (Frontend)
    ↓
    ├─→ Express API (routes.js)
    ├─→ Controladores (controllers.js)
    ├─→ Modelos (models.js)
    └─→ Base de Datos MySQL
```

### Capas

1. **Rutas** (`routes.js`): Define endpoints HTTP
2. **Controladores** (`controllers.js`): Maneja la lógica de solicitudes
3. **Modelos** (`models.js`): Interactúa con la base de datos
4. **Base de Datos** (`db.js`): Pool de conexiones MySQL

---

## Endpoints Disponibles

### Health Check
```
GET /api/health
```

### CRUD Operations

#### Categorías
```
GET    /api/categorias          - Obtener todas
GET    /api/categorias/:id      - Obtener por ID
POST   /api/categorias          - Crear
PUT    /api/categorias/:id      - Actualizar
DELETE /api/categorias/:id      - Eliminar
```

#### Productos
```
GET    /api/productos           - Obtener todas
GET    /api/productos/:id       - Obtener por ID
GET    /api/productos/categoria/:categoryId - Por categoría
POST   /api/productos           - Crear
PUT    /api/productos/:id       - Actualizar
DELETE /api/productos/:id       - Eliminar
```

*Ver [API_ENDPOINTS.md](./API_ENDPOINTS.md) para documentación completa*

---

## Variables de Entorno

```env
# Base de Datos
DB_HOST          # Host del servidor MySQL (default: localhost)
DB_PORT          # Puerto MySQL (default: 3306)
DB_USER          # Usuario MySQL (default: root)
DB_PASSWORD      # Contraseña MySQL
DB_NAME          # Nombre de la base de datos (default: liqueur_sales)

# Servidor
PORT             # Puerto del servidor (default: 5000)
NODE_ENV         # Ambiente: development, production (default: development)
```

---

## Manejo de Errores

### Respuesta de Error Estándar

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": { /* Detalles en desarrollo */ }
}
```

### Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Solicitud inválida |
| 404 | No encontrado |
| 500 | Error del servidor |

---

## Seguridad

### Recomendaciones

1. **CORS**: Configurado para accept requests desde cualquier origen (modificar en producción)
2. **Variables de Entorno**: Nunca commitar `.env` con credenciales reales
3. **Validación**: Implementar validación de entrada en producción
4. **Autenticación**: Agregar JWT u otro sistema de autenticación
5. **Rate Limiting**: Considerar agregar límite de solicitudes

---

## Testing

### Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### Test Crear Cliente

```bash
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "documento": "123456789",
    "email": "juan@example.com",
    "estado": "Activo"
  }'
```

---

## Troubleshooting

### Problema: "Cannot find module 'mysql2'"
**Solución:**
```bash
npm install mysql2
```

### Problema: "ECONNREFUSED - MySQL no está corriendo"
**Solución:**
```bash
# En Windows
net start MySQL80

# En Mac/Linux
brew services start mysql
# o
sudo systemctl start mysql
```

### Problema: "Access denied for user 'root'"
**Solución:**
- Verifica las credenciales en `.env`
- Asegúrate de que el usuario MySQL tiene permisos apropiados

### Problema: "Database does not exist"
**Solución:**
```bash
mysql -u root -p -e "CREATE DATABASE liqueur_sales;"
mysql -u root -p liqueur_sales < backend/schema.sql
```

---

## Próximas Mejoras

- [ ] Autenticación JWT
- [ ] Validación de entrada mejorada
- [ ] Rate limiting
- [ ] Logging mejorado
- [ ] Tests unitarios
- [ ] Documentación Swagger/OpenAPI
- [ ] Caché con Redis
- [ ] Notificaciones en tiempo real (WebSockets)

---

## Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Licencia

Este proyecto está bajo licencia MIT.

---

## Contacto

Para preguntas o sugerencias sobre el backend, contacta al equipo de desarrollo.

---

**Última actualización:** 12 de Diciembre de 2024
