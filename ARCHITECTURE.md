# 🏗️ Arquitectura de Despliegue - Frontend Grandma's Liquors

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIOS FINALES                         │
│                     (Navegadores / Clientes)                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    HTTPS (puerto 443)
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │      AWS CloudFront Distribution           │
        │   (CDN Global - Caché Distribuida)        │
        │  Domain: d1a2b3c4d5e6f7.cloudfront.net    │
        └────────────────────────────────────────────┘
                    │                       │
         ┌──────────┴───────────┐           │
         │                      │           │
    GET /                    GET /api/*     │
    HTML,JS,CSS             GET /uploads    │
         │                      │           │
         ▼                      ▼           ▼
    ┌──────────────────┐  ┌─────────────────────┐
    │  AWS S3 Bucket   │  │ Elastic Beanstalk   │
    │ grandmas-liquors │  │      API Backend    │
    │   -frontend      │  │ https://grandmas    │
    │                  │  │ -api.us-east-2.     │
    │ - dist/          │  │ elasticbeanstalk.   │
    │   - index.html   │  │ com                 │
    │   - main.js      │  │                     │
    │   - main.css     │  │ - PostgreSQL DB     │
    │   - images/      │  │ - Node.js Backend   │
    │   - assets/      │  │ - Port 443 (HTTPS)  │
    └──────────────────┘  └─────────────────────┘
         ▲                        ▲
         │                        │
         │    OAC Policy          │ CORS Policy
         │    (Signed Requests)   │ Origin: CloudFront domain
         │                        │
    ┌─────┴────────┬─────────────┘
    │              │
    │         ┌────┴─────────────────┐
    │         │  AWS IAM Roles &     │
    │         │  Security Groups     │
    │         └──────────────────────┘
    │
    └─ Versioning: Content-Hash en nombres de archivos
       Cache: index.html (0s), assets (1 año), API (0s)
```

---

## Flujo de Peticiones

### 1. Cargar Página HTML

```
Browser                           CloudFront                    S3
   │                                │                           │
   ├─ GET / ────────────────────────►                           │
   │                                │                           │
   │                                ├─ Check Cache              │
   │                                │  Not found                │
   │                                │                           │
   │                                ├─ GET dist/index.html ────►
   │                                │◄───── Response ────────────
   │                                │  (max-age=0)              │
   │                                │                           │
   │◄───────── Response ─────────────┤                           │
   │  <html>...</html>               │                          │
   │                                 │                          │
   ├─ Parse HTML                     │                          │
   ├─ Fetch main.js                  │                          │
   ├─ Fetch main.css                 │                          │
   │   (con content hashing)         │                          │
   │                                 │                          │
```

### 2. Petición a API

```
Browser                       CloudFront                   EB API
   │                            │                          │
   ├─ fetch('/api/auth/me') ───►│                          │
   │                            │                          │
   │                            ├─ Route Match: /api/*     │
   │                            │  Origin: EB API          │
   │                            │                          │
   │                            ├─ GET /api/auth/me ──────►│
   │                            │                          │
   │                            │◄─ Response ──────────────┤
   │                            │  {success: true, ...}    │
   │                            │  (no cache)              │
   │                            │                          │
   │◄──── Response ─────────────┤                          │
   │  {success: true, ...}      │                          │
   │                            │                          │
```

### 3. Desarrollo Local (npm run dev)

```
Browser                    Vite Dev Server              EB API
   │                            │                      │
   ├─ fetch('/api/auth/me') ───►│                      │
   │                            │                      │
   │                            ├─ Proxy Match: /api/* │
   │                            │                      │
   │                            ├─ Forward Request ───►│
   │                            │  (con credentials)   │
   │                            │                      │
   │                            │◄─ Response ─────────┤
   │                            │  {success: true}    │
   │                            │                      │
   │◄──── Response ─────────────┤                      │
   │  {success: true, ...}      │                      │
   │                            │                      │
```

---

## Rutas y Comportamientos CloudFront

```
Path Pattern          Origin              Cache        Methods
─────────────────────────────────────────────────────────────────
/                     S3                  max-age=0    GET, HEAD
*.html                S3                  max-age=0    GET, HEAD
/assets/*             S3                  1 año        GET, HEAD
*.js                  S3                  1 año        GET, HEAD
*.css                 S3                  1 año        GET, HEAD
*.woff*               S3                  1 año        GET, HEAD
/images/*             S3                  1 año        GET, HEAD

/api/*                EB API              0 (no cache) GET,POST,PUT,
                                                       PATCH,DELETE

/uploads/*            EB API              30 min       GET, HEAD
```

---

## Configuración de CORS

```
Backend (Elastic Beanstalk)
├── CORS_ORIGINS = https://d1a2b3c4d5e6f7.cloudfront.net
│   (Reemplaza con tu dominio real)
│
├── Métodos Permitidos:
│   ✅ GET, POST, PUT, PATCH, DELETE
│
├── Headers Permitidos:
│   ✅ Content-Type, Authorization, Cookie
│
└── Credenciales:
    ✅ Incluidas (fetch with credentials: 'include')
```

---

## Estrategia de Caché

### index.html (SPA Entry Point)
```
Cache-Control: public, max-age=0, must-revalidate
Content-Type: text/html

→ NUNCA se cachea en navegador
→ CloudFront siempre solicita S3
→ Garantiza obtener versión más reciente
```

### Assets Estáticos (JS/CSS/Fonts)
```
Cache-Control: public, max-age=31536000  (1 año)
Nombre: main.HASH123.js

→ CloudFront: cachea indefinidamente
→ Navegador: cachea 1 año
→ Si cambia contenido, Vite crea nuevo archivo con nuevo hash
→ Versión anterior sigue siendo accesible
```

### API Responses
```
Cache-Control: public, max-age=0, must-revalidate

→ NUNCA se cachea
→ CloudFront siempre solicita EB
→ Datos siempre frescos
```

---

## Seguridad y Optimización

| Aspecto | Configuración |
|--------|------------------|
| **HTTPS** | ✅ Obligatorio (Redirect HTTP → HTTPS) |
| **Compression** | ✅ gzip para JS, CSS, HTML, JSON, fonts |
| **HTTP/2** | ✅ Habilitado en CloudFront |
| **Public Access** | ✅ S3 bloqueado, acceso solo por CloudFront (OAC) |
| **WAF** | ⏳ Recomendado (futuro) |
| **DDoS Protection** | ✅ CloudFront proporciona |
| **Content-Type** | ✅ Correcto para cada archivo |
| **CORS** | ✅ Configurado en backend |
| **CSP** | ⏳ Recomendado (futuro) |

---

## Estadísticas de Performance

```
Métrica                  Esperado       Herramienta
────────────────────────────────────────────────────
Time to First Byte       < 200ms        CloudFront
First Contentful Paint   < 1s           Lighthouse
Largest Contentful Paint < 2.5s         Lighthouse
Cumulative Layout Shift  < 0.1          Lighthouse
Speed Index              < 3s           PageSpeed

Bundle Size Estimado:
  - main.js    ~250KB (gzipped)
  - main.css   ~50KB (gzipped)
  - HTML       ~20KB (gzipped)
  - Total      ~320KB (gzipped)
```

---

## Monitoreo y Alertas (Futuro)

```
┌─────────────────────────────────────────┐
│     AWS CloudWatch / CloudTrail          │
├─────────────────────────────────────────┤
│ Métricas:                               │
│ ├─ Requests/min                        │
│ ├─ Cache Hit Ratio                     │
│ ├─ Average Latency                     │
│ ├─ 4xx / 5xx Errors                    │
│ └─ Data Transfer Out                   │
│                                         │
│ Alertas:                                │
│ ├─ Error Rate > 5%                     │
│ ├─ Latency > 1000ms                    │
│ └─ Backend Unreachable                 │
└─────────────────────────────────────────┘
```

---

## Escala y Crecimiento

```
Día 1-30: Solo CloudFront + S3
  └─ Soporta 1M requests/día

Mes 2-3: Agregar WAF
  └─ Protección contra ataques

Mes 4+: Agregar Lambda@Edge
  └─ Optimización de imágenes
  └─ Rewrite inteligente de URLs
  └─ Rate limiting
```

---

## Resumen Técnico

✅ **Configuración Completa**
- Frontend: Vite + React
- Hosting: S3 + CloudFront
- Backend: Node.js EB
- Database: PostgreSQL RDS
- All HTTPS, CORS configured

✅ **Performance**
- CDN Global (CloudFront)
- Cache strategy optimized
- Compression enabled
- HTTP/2 enabled

✅ **Seguridad**
- S3 private (OAC)
- HTTPS only
- CORS strict
- DDoS protection (CloudFront)

⏳ **Mejoras Futuras**
- WAF (Web Application Firewall)
- Lambda@Edge (image optimization)
- CI/CD (GitHub Actions)
- Monitoring (CloudWatch)
- Custom domain + SSL
