# Guía de Migración a AWS - Grandma's Liquors

## Arquitectura Objetivo
- **Frontend**: S3 + CloudFront (CDN)
- **Backend**: Elastic Beanstalk (API REST)
- **Base de Datos**: Amazon RDS (PostgreSQL)

## Orden de Despliegue
1. S3 + CloudFront (Frontend)
2. RDS (Base de Datos)
3. Elastic Beanstalk (Backend)

---

## PASO 1: Desplegar Frontend en S3 + CloudFront

### 1.1 Crear Bucket S3

1. Iniciar sesión en AWS Console
2. Ir a **S3** → **Create bucket**
3. Configurar:
   - **Bucket name**: `grandmas-liquors-frontend` (debe ser único globalmente)
   - **Region**: us-east-2 (Ohio) - misma región que RDS
   - **Block Public Access settings**: Deshabilitar (necesario para hosting estático)
   - **Bucket Versioning**: Enable (opcional, recomendado)
4. Click en **Create bucket**

### 1.2 Configurar Bucket para Hosting Estático

1. Ir al bucket creado → **Properties**
2. Scroll a **Static website hosting**
3. Click en **Edit** → **Enable**
4. Configurar:
   - **Index document**: `index.html`
   - **Error document**: `index.html` (para SPA routing)
5. Click en **Save changes**

### 1.3 Configurar Política de Bucket

1. Ir a **Permissions** → **Bucket policy**
2. Click en **Edit**
3. Pegar la siguiente política (reemplazar `BUCKET_NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKET_NAME/*"
        }
    ]
}
```

4. Click en **Save changes**

### 1.4 Build del Frontend

```bash
cd frontend
npm install
npm run build
```

Esto generará la carpeta `dist/` con los archivos estáticos.

### 1.5 Subir Archivos a S3

**Opción A: Via AWS Console**
1. Ir al bucket S3
2. Click en **Upload**
3. Arrastrar todo el contenido de `frontend/dist/`
4. Click en **Upload**

**Opción B: Via AWS CLI (recomendado)**

```bash
# Instalar AWS CLI si no está instalado
# https://aws.amazon.com/cli/

# Configurar credenciales
aws configure

# Sincronizar archivos
aws s3 sync frontend/dist/ s3://grandmas-liquors-frontend/ --delete
```

### 1.6 Crear Distribución CloudFront

1. Ir a **CloudFront** → **Create distribution**
2. Configurar:
   - **Origin domain**: `BUCKET_NAME.s3-website-us-east-2.amazonaws.com`
   - **Origin protocol policy**: HTTP Only (S3 static website)
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS
   - **Cached HTTP methods**: GET, HEAD
   - **Compress objects automatically**: Yes
   - **Default root object**: `index.html`
3. Click en **Create distribution**

### 1.7 Configurar CloudFront para SPA

1. Ir a la distribución creada → **Behaviors** tab
2. Click en **Edit** en el default behavior
3. Scroll a **Cache key and origin requests**
4. En **Function associations**, agregar:
   - **Viewer request**: CloudFront Function (crear función para SPA routing)
5. Click en **Save changes**

**Crear CloudFront Function para SPA routing:**

```javascript
// Nombre: spa-routing
export function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Si es un archivo (tiene extensión), dejar pasar
    if (uri.includes('.')) {
        return request;
    }
    
    // Para SPA, redirigir a index.html
    request.uri = '/index.html';
    return request;
}
```

### 1.8 Actualizar Variables de Entorno del Frontend

1. Crear archivo `frontend/.env.production`:

```bash
VITE_API_BASE_URL=https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
VITE_API_PROXY_TARGET=https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
```

**Nota**: La URL de Elastic Beanstalk se obtendrá en el PASO 3. Por ahora, usar un placeholder.

### 1.9 Rebuild y Reupload

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://grandmas-liquors-frontend/ --delete
```

### 1.10 Invalidar Cache de CloudFront

1. Ir a la distribución CloudFront
2. Click en **Invalidations** tab → **Create invalidation**
3. **Invalidation paths**: `/*`
4. Click en **Create invalidation**

---

## PASO 2: Configurar Base de Datos RDS

**Nota**: Ya tienes una instancia RDS existente en `grandmas-db.cxsioou6me7v.us-east-2.rds.amazonaws.com`. Si vas a usar esta instancia, salta al PASO 3.

### 2.1 Crear Nueva Instancia RDS (si es necesario)

1. Ir a **RDS** → **Create database**
2. Configurar:
   - **Engine**: PostgreSQL
   - **Engine version**: 15.x o superior
   - **Template**: Free tier (para desarrollo) o Production
   - **Instance identifier**: `grandmas-liquors-db`
   - **Master username**: `postgres`
   - **Master password**: Generar contraseña segura (guardar en lugar seguro)
   - **Instance class**: db.t3.micro (free tier) o db.t3.small (producción)
   - **Storage**: 20 GB (free tier) o según necesidad
   - **VPC**: Default VPC
   - **Public access**: No (solo accesible desde VPC)
   - **VPC security group**: Crear nuevo security group
3. Click en **Create database**

### 2.2 Configurar Security Group de RDS

1. Ir a **EC2** → **Security Groups**
2. Buscar el security group creado para RDS
3. Click en **Edit inbound rules**
4. Agregar regla:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: Security group de Elastic Beanstalk (se creará en PASO 3)
5. Click en **Save rules**

### 2.3 Conectar a RDS y Migrar Datos

```bash
# Desde tu máquina local (con VPN o SSH a EC2 si RDS es privado)
psql -h grandmas-db.cxsioou6me7v.us-east-2.rds.amazonaws.com -U postgres -d postgres -f backend/db.pgsql
```

### 2.4 Verificar Conexión

```bash
psql -h grandmas-db.cxsioou6me7v.us-east-2.rds.amazonaws.com -U postgres -d postgres
```

---

## PASO 3: Desplegar Backend en Elastic Beanstalk

### 3.1 Preparar Aplicación para Elastic Beanstalk

1. Crear archivo `backend/.ebextensions/01-node.config`:

```yaml
commands:
  01_install_dependencies:
    command: "npm install --production"
    cwd: /var/app/current
  02_create_uploads_dir:
    command: "mkdir -p /var/app/current/uploads/comprobantes /var/app/current/uploads/perfiles /var/app/current/uploads/productos"
    cwd: /var/app/current

option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: "production"
    PORT: "3002"
```

2. Crear archivo `backend/.ebextensions/02-env.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DB_HOST: "$DB_HOST"
    DB_PORT: "$DB_PORT"
    DB_USER: "$DB_USER"
    DB_PASSWORD: "$DB_PASSWORD"
    DB_DATABASE: "$DB_DATABASE"
    DB_SSL: "true"
    JWT_SECRET: "$JWT_SECRET"
    CORS_CLOUDFRONT_URL: "$CORS_CLOUDFRONT_URL"
    CORS_CUSTOM_DOMAIN: "$CORS_CUSTOM_DOMAIN"
    CORS_ORIGINS: "$CORS_ORIGINS"
    PUBLIC_BASE_URL: "$PUBLIC_BASE_URL"
    MAIL_HOST: "$MAIL_HOST"
    MAIL_PORT: "$MAIL_PORT"
    MAIL_SECURE: "$MAIL_SECURE"
    MAIL_USER: "$MAIL_USER"
    MAIL_PASSWORD: "$MAIL_PASSWORD"
    MAIL_FROM: "$MAIL_FROM"
    SYSTEM_ADMIN_EMAIL: "$SYSTEM_ADMIN_EMAIL"
```

### 3.2 Crear Archivo .zip para Despliegue

```bash
cd backend
# Excluir node_modules y archivos locales
zip -r ../grandmas-liquors-backend.zip . -x "node_modules/*" ".git/*" ".env*" "uploads/*" "logs/*"
```

### 3.3 Crear Aplicación en Elastic Beanstalk

1. Ir a **Elastic Beanstalk** → **Create application**
2. Configurar:
   - **Application name**: `grandmas-liquors-api`
   - **Platform**: Node.js
   - **Platform branch**: Node.js 18 running on 64bit Amazon Linux 2023
   - **Application code**: Upload your code
   - **Local file**: Seleccionar `grandmas-liquors-backend.zip`
3. Click en **Create application**

### 3.4 Configurar Variables de Entorno en Elastic Beanstalk

1. Ir a la aplicación → **Configuration** → **Software**
2. Scroll a **Environment properties**
3. Agregar las siguientes variables:

```
DB_HOST = grandmas-db.cxsioou6me7v.us-east-2.rds.amazonaws.com
DB_PORT = 5432
DB_USER = postgres
DB_PASSWORD = TU_DB_PASSWORD
DB_DATABASE = postgres
DB_SSL = true
NODE_ENV = production
PORT = 3002
PUBLIC_BASE_URL = https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
CORS_CLOUDFRONT_URL = https://TU_DISTRIBUTION.cloudfront.net
CORS_CUSTOM_DOMAIN = 
CORS_ORIGINS = https://TU_DISTRIBUTION.cloudfront.net
UPLOADS_ROOT = /var/app/current/uploads
JWT_SECRET = TU_JWT_SECRET_MIN_32_CARACTERES
JWT_ISSUER = grandmas-liquors-api
JWT_AUDIENCE = grandmas-liquors-web
AUTH_COOKIE_NAME = gl_session
AUTH_COOKIE_SAME_SITE = lax
AUTH_COOKIE_DOMAIN = 
JWT_CLIENTE_TTL_MS = 3600000
JWT_STAFF_TTL_MS = 10800000
JWT_LONG_SESSION_TTL_MS = 604800000
SESSION_IDLE_TIMEOUT_MS = 1800000
RATE_LIMIT_ENABLED = true
MAIL_HOST = smtp.gmail.com
MAIL_PORT = 587
MAIL_SECURE = false
MAIL_USER = tu-email@gmail.com
MAIL_PASSWORD = TU_APP_PASSWORD
MAIL_FROM = "Grandma's Liquors <tu-email@gmail.com>"
SYSTEM_ADMIN_EMAIL = tu-email@gmail.com
```

4. Click en **Apply**

### 3.5 Configurar Security Group de Elastic Beanstalk

1. Ir a **EC2** → **Security Groups**
2. Buscar el security group de Elastic Beanstalk (usualmente empieza con `awseb-`)
3. Click en **Edit inbound rules**
4. Agregar reglas:
   - **Type**: HTTP
   - **Protocol**: TCP
   - **Port**: 80
   - **Source**: 0.0.0.0/0 (todo el tráfico)
   - **Type**: HTTPS
   - **Protocol**: TCP
   - **Port**: 443
   - **Source**: 0.0.0.0/0 (todo el tráfico)
5. Click en **Save rules**

### 3.6 Configurar Security Group de RDS para Permitir Acceso desde EB

1. Ir al security group de RDS
2. Click en **Edit inbound rules**
3. Agregar regla:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: Security group ID de Elastic Beanstalk
4. Click en **Save rules**

### 3.7 Obtener URL de Elastic Beanstalk

1. Ir a la aplicación Elastic Beanstalk
2. Copiar la URL del entorno (ej: `http://aplicationgl-env-1.eba-xxxxx.us-east-2.elasticbeanstalk.com`)

### 3.8 Actualizar Frontend con URL de EB

1. Editar `frontend/.env.production`:

```bash
VITE_API_BASE_URL=https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
VITE_API_PROXY_TARGET=https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
```

2. Rebuild y reupload:

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://grandmas-liquors-frontend/ --delete
```

3. Invalidar cache de CloudFront

### 3.9 Configurar SSL en Elastic Beanstalk (Opcional pero Recomendado)

1. Ir a la aplicación → **Configuration** → **Network**
2. Scroll a **Load balancer**
3. Cambiar a **Application load balancer**
4. Configurar certificado SSL en ACM (AWS Certificate Manager)
5. Click en **Apply**

---

## PASO 4: Verificación y Testing

### 4.1 Verificar Frontend

1. Abrir la URL de CloudFront en el navegador
2. Verificar que la aplicación carga correctamente
3. Verificar que las llamadas a la API funcionan

### 4.2 Verificar Backend

1. Abrir la URL de Elastic Beanstalk en el navegador
2. Debería ver un mensaje de error o respuesta JSON (es normal)
3. Probar endpoint de health check si existe

### 4.3 Verificar Conexión a Base de Datos

1. Revisar logs de Elastic Beanstalk:
   - Ir a la aplicación → **Logs** → **Request logs**
   - Verificar que no haya errores de conexión a DB

### 4.4 Probar Funcionalidades Críticas

1. Login/Logout
2. Creación de productos
3. Proceso de ventas
4. Gestión de compras

---

## Variables de Entorno Finales

### Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
VITE_API_PROXY_TARGET=https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
```

### Backend (Environment Properties en Elastic Beanstalk)
```
DB_HOST = grandmas-db.cxsioou6me7v.us-east-2.rds.amazonaws.com
DB_PORT = 5432
DB_USER = postgres
DB_PASSWORD = TU_DB_PASSWORD
DB_DATABASE = postgres
DB_SSL = true
NODE_ENV = production
PORT = 3002
PUBLIC_BASE_URL = https://TU_EB_ENV.us-east-2.elasticbeanstalk.com
CORS_CLOUDFRONT_URL = https://TU_DISTRIBUTION.cloudfront.net
CORS_CUSTOM_DOMAIN = 
CORS_ORIGINS = https://TU_DISTRIBUTION.cloudfront.net
UPLOADS_ROOT = /var/app/current/uploads
JWT_SECRET = TU_JWT_SECRET_MIN_32_CARACTERES
JWT_ISSUER = grandmas-liquors-api
JWT_AUDIENCE = grandmas-liquors-web
AUTH_COOKIE_NAME = gl_session
AUTH_COOKIE_SAME_SITE = lax
AUTH_COOKIE_DOMAIN = 
JWT_CLIENTE_TTL_MS = 3600000
JWT_STAFF_TTL_MS = 10800000
JWT_LONG_SESSION_TTL_MS = 604800000
SESSION_IDLE_TIMEOUT_MS = 1800000
RATE_LIMIT_ENABLED = true
MAIL_HOST = smtp.gmail.com
MAIL_PORT = 587
MAIL_SECURE = false
MAIL_USER = tu-email@gmail.com
MAIL_PASSWORD = TU_APP_PASSWORD
MAIL_FROM = "Grandma's Liquors <tu-email@gmail.com>"
SYSTEM_ADMIN_EMAIL = tu-email@gmail.com
```

---

## Comandos Útiles

### AWS CLI
```bash
# Sincronizar frontend a S3
aws s3 sync frontend/dist/ s3://grandmas-liquors-frontend/ --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation --distribution-id TU_DISTRIBUTION_ID --paths "/*"

# Ver logs de Elastic Beanstalk
aws elasticbeanstalk request-environment-info --environment-name TU_ENV_NAME --info-type tail

# Descargar logs de Elastic Beanstalk
aws elasticbeanstalk request-environment-info --environment-name TU_ENV_NAME --info-type bundle
```

### Generar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Costos Estimados (us-east-2)

- **S3**: ~$0.023/GB (almacenamiento) + $0.09/GB (transferencia)
- **CloudFront**: ~$0.0075/10,000 requests + $0.085/GB (transferencia)
- **RDS**: db.t3.micro (~$15/mes) o db.t3.small (~$35/mes)
- **Elastic Beanstalk**: db.t3.micro (~$15/mes) o db.t3.small (~$35/mes)

**Total estimado**: ~$30-80/mes dependiendo de la instancia

---

## Troubleshooting

### Error: CORS
- Verificar que `CORS_ORIGINS` incluya la URL de CloudFront
- Verificar que el backend tenga las configuraciones de CORS correctas

### Error: Conexión a Base de Datos
- Verificar que el security group de RDS permita conexiones desde el security group de EB
- Verificar que `DB_SSL=true` en producción

### Error: Uploads fallan
- Verificar que el directorio `/var/app/current/uploads` existe
- Verificar permisos del directorio

### Error: CloudFront no actualiza
- Invalidar cache después de cada deploy
- Verificar que la función de SPA routing esté configurada
