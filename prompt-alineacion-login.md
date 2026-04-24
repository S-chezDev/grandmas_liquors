Actua como un agente de codigo y corrige la desalineacion de configuracion para que el login funcione en una instalacion limpia del proyecto despues de importar la base de datos con backend/db.sql.

Objetivo:
- Backend en puerto 3002.
- Frontend en puerto 3000.
- Frontend apuntando al backend correcto por variable de entorno.
- Onboarding claro para clones nuevos.

Cambios obligatorios:
1. Revisar backend/config.js
- Dejar puerto por defecto en 3002.
- Mantener lectura de PORT por entorno.
- Asegurar CORS para http://localhost:3000 en desarrollo.

2. Revisar src/services/api.ts
- Mantener VITE_API_URL como prioridad.
- Dejar fallback a http://localhost:3002.
- Mantener credentials: include.

3. Revisar vite.config.ts
- Confirmar server.port = 3000.

4. Crear o corregir backend/.env.example con:
- NODE_ENV=development
- PORT=3002
- DB_HOST=localhost
- DB_PORT=5432
- DB_USER=postgres
- DB_PASSWORD=
- DB_DATABASE=grandmas_liquors
- DB_NAME=grandmas_liquors
- JWT_SECRET=dev_only_change_me_please_replace
- JWT_ISSUER=grandmas-liquors-api
- JWT_AUDIENCE=grandmas-liquors-web
- AUTH_COOKIE_NAME=gl_session
- AUTH_COOKIE_DOMAIN=
- AUTH_COOKIE_SAME_SITE=lax
- JWT_CLIENTE_TTL_MS=3600000
- JWT_STAFF_TTL_MS=10800000
- CORS_ORIGINS=http://localhost:3000
- MAIL_HOST=
- MAIL_PORT=587
- MAIL_SECURE=false
- MAIL_USER=
- MAIL_PASSWORD=
- MAIL_FROM=no-reply@grandmas-liquors.local

5. Crear o corregir .env.example en la raiz frontend con:
- VITE_API_URL=http://localhost:3002

6. Entregar pasos de arranque para clones:
- Crear base de datos PostgreSQL.
- Ejecutar backend/db.sql sobre esa base.
- Copiar backend/.env.example a backend/.env.
- Copiar .env.example a .env en la raiz frontend.
- Ejecutar backend y frontend.
- Probar login con usuarios semilla.

Validaciones:
- No dejar referencias locales activas a puerto 5000.
- Verificar comunicacion frontend -> backend en 3002.
- Confirmar login sin error de conexion.

Salida esperada:
- Lista de archivos tocados.
- Resumen del problema raiz.
- Checklist final para nuevos clones.
