# ✅ Configuración Completada - Frontend S3 + CloudFront

## 📋 Resumen de Cambios

### 🔧 Archivos Modificados/Creados

**Configuración Core:**
- ✅ `vite.config.ts` - Actualizado con HTTPS y variables de ambiente
- ✅ `.env` - Nuevo (desarrollo local)
- ✅ `.env.production` - Nuevo (S3/CloudFront)
- ✅ `.env.example` - Nuevo (template)

**Código:**
- ✅ `src/app/services/http.ts` - Actualizado con resolver de URLs

**Deployment:**
- ✅ `cloudfront-config.json` - Nuevo (especificación CloudFront)
- ✅ `deploy.sh` - Nuevo (script Linux/Mac)
- ✅ `deploy.ps1` - Nuevo (script Windows)
- ✅ `S3_CLOUDFRONT_DEPLOYMENT.md` - Nuevo (guía completa)
- ✅ `FRONTEND_SETUP.md` - Nuevo (quick reference)

---

## 🎯 Cómo Funciona Ahora

### Desarrollo Local (`npm run dev`)
```
Browser → Frontend Dev Server (port 3000)
                ↓
            Vite Proxy
                ↓
    https://grandmas-api.us-east-2.elasticbeanstalk.com/api/*
```

### Producción (S3 + CloudFront)
```
Browser (HTTPS) → CloudFront Distribution
                        ↓
                ┌───────┴────────┐
                ↓                 ↓
            S3 Frontend    Elastic Beanstalk API
         (HTML/JS/CSS)    (/api/*, /uploads/*)
```

---

## 🚀 Pasos Para Desplegar

### 1️⃣ Build Local (Validar)
```bash
cd frontend
npm install
npm run build
ls dist/  # Debe existir
```

### 2️⃣ AWS S3 (Crear Bucket)
```bash
aws s3 mb s3://grandmas-liquors-frontend --region us-east-2
aws s3api put-public-access-block \
  --bucket grandmas-liquors-frontend \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 3️⃣ CloudFront (Crear Distribution)
Ve a: https://console.aws.amazon.com/cloudfront/

**Configurar:**
- ✅ Origin 1: S3 bucket `grandmas-liquors-frontend`
- ✅ Origin 2: Elastic Beanstalk `grandmas-api.us-east-2.elasticbeanstalk.com`
- ✅ Behavior `/api/*` → EB origin
- ✅ Behavior `/uploads/*` → EB origin
- ✅ Error pages: 403 y 404 → /index.html
- ✅ Obtener Distribution ID y Domain Name

### 4️⃣ Backend CORS (Actualizar)
```bash
# AWS EB Configuration → Environment Properties
CORS_ORIGINS=https://d1a2b3c4d5e6f7.cloudfront.net
# (Usa el Domain Name real de CloudFront)
```

### 5️⃣ Deploy Inicial
**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh YOUR_DISTRIBUTION_ID
```

**Windows:**
```powershell
.\deploy.ps1 -DistributionId "YOUR_DISTRIBUTION_ID"
```

**Manual:**
```bash
aws s3 sync dist/ s3://grandmas-liquors-frontend/ \
  --delete --region us-east-2 \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://grandmas-liquors-frontend/index.html \
  --region us-east-2 --content-type "text/html" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 6️⃣ Verificar
```bash
# En el navegador:
https://d1a2b3c4d5e6f7.cloudfront.net

# Consola del navegador:
fetch('/api/auth/me').then(r => r.json()).then(console.log)
```

---

## 📊 Configuración Actual

| Variable | Valor |
|----------|-------|
| **Backend API** | `https://grandmas-api.us-east-2.elasticbeanstalk.com` |
| **S3 Bucket** | `grandmas-liquors-frontend` |
| **AWS Region** | `us-east-2` |
| **Vite Proxy Target** (dev) | `https://grandmas-api.us-east-2.elasticbeanstalk.com` |
| **CloudFront Domain** | `d1a2b3c4d5e6f7.cloudfront.net` (TBD) |
| **CORS_ORIGINS** (prod) | Tu dominio de CloudFront |

---

## ⚡ Quick Deploy (Futuro)

Una vez configurado, cada actualización es tan simple como:

```bash
cd frontend
npm run build
./deploy.sh DISTRIBUTION_ID
```

¡Listo! En 1-2 minutos está online.

---

## 📚 Documentación

| Archivo | Propósito |
|---------|-----------|
| `FRONTEND_SETUP.md` | ⭐ **Comienza aquí** - Quick reference |
| `S3_CLOUDFRONT_DEPLOYMENT.md` | 📖 Guía completa paso a paso |
| `cloudfront-config.json` | 🔧 Especificación técnica |
| `vite.config.ts` | ⚙️ Configuración de Vite |
| `deploy.sh` / `deploy.ps1` | 🚀 Scripts de deploy |

---

## ✅ Estado de la Configuración

- ✅ Frontend completamente configurado para S3 + CloudFront
- ✅ URLs de API corregidas a HTTPS
- ✅ Variables de ambiente configuradas
- ✅ Scripts de deploy listos
- ✅ Documentación completa
- ⏳ **Pendiente**: Crear S3 bucket y CloudFront distribution en AWS
- ⏳ **Pendiente**: Actualizar CORS_ORIGINS en Elastic Beanstalk

---

## 🎯 Próximos Pasos

1. **Crear S3 + CloudFront** (pasos 2-4)
2. **Deploy inicial** (paso 5)
3. **Validar funcionamiento** (paso 6)
4. **Configurar dominio personalizado** (opcional)
5. **Configurar CI/CD** (futuro)

¡Todo el frontend está listo para producción! 🚀
