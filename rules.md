---
bridge_rules_version: 1
---

# Reglas de integración — UI (Figma/React) ↔ Backend (API real)

Integración priorizando **frontend/Figma como fuente de verdad** y **API completamente funcional**, sin mocks en flujos productivos ni recortes de diseño por limitaciones del backend.

---

## Arquitectura y estilo

### Principio rector

- El **frontend objetivo** y **Figma** son la fuente de verdad **visual y funcional**.
- Ninguna pantalla/flujo del frontend objetivo se descarta: si el backend no soporta algo, se **implementa o ajusta** el backend.
- No se permite **mock permanente** ni features **parcialmente conectadas** en producción.
- Regla de decisión: ante desalineación frontend-backend, se **preserva frontend/diseño** y se **adapta backend**.

### Fuentes oficiales y prioridad

| Prioridad | Rol | Ruta / referencia |
|-----------|-----|-------------------|
| Fuente 1 (funcional) | Frontend objetivo clonado | `C:\Users\User\repos\Liqueursalesmanagementapp` |
| Fuente 2 (visual/UX) | Maqueta Figma oficial | Enlace y frames definidos en `input.md` |
| Fuente 3 (integración) | Backend | `C:\Users\User\repos\Liqueursalesmanagementapp\backend` |

- Si hay conflicto, se mantiene la experiencia del **frontend/Figma** y se corrige **backend** para cumplirla sin degradar **seguridad** ni **consistencia de datos**.

### Estructura obligatoria de frontend (React)

- Estructura **clara, escalable** y coherente con buenas prácticas React y la documentación del repo.
- Capas separadas (ajustar nombres a lo que ya exista en el proyecto, sin mezclar responsabilidades):
  - `components` — presentación
  - `pages` — orquestación de pantalla
  - `services` — API / adaptadores (única capa HTTP por dominio)
  - `hooks` — lógica reutilizable
  - `context` — estado global cuando aplique
  - `types` — contratos / DTOs alineados al backend
  - `utils` — helpers puros
  - `styles` — estilos / tokens
- **Prohibido** mezclar lógica de negocio o llamadas API dentro de componentes puramente visuales.
- Toda llamada HTTP debe **centralizarse** en servicios por dominio.

### Diseño Figma inmutable (fidelidad visual)

- Mantener el diseño **100% alineado** con Figma y el frontend objetivo (layout, spacing, tipografías, tamaños, colores, jerarquía, estados, interacciones, flujo UX).
- **No** cambiar la maqueta ni introducir variaciones visuales **sin aprobación explícita**.
- Integrar backend **sin** alterar lo definido en diseño; el backend evoluciona para servir al UI, no al revés en lo visual.

### Manejo de errores sin alterar diseño

- Errores robustos **sin** modificar estructura visual ni inventar componentes fuera del sistema existente.
- Reutilizar **patrones visuales ya definidos** (toasts, banners, estados en componentes Figma) para 4xx/5xx y errores de negocio.
- **No** añadir elementos disruptivos “solo para errores” que rompan coherencia con Figma.

---

## Consumo de API

### Regla de cobertura 1:1 (Frontend / Figma → Backend)

Por cada **vista/acción** debe existir:

- endpoint **real** y estable;
- validación de entrada/salida;
- manejo de errores de negocio;
- permiso/rol aplicable en servidor;
- prueba automatizada mínima acordada.

Si una acción **no** tiene endpoint: documentar **GAP** e **implementar backend** antes de cerrar el módulo.

### Respuesta estándar y versionado

- Objetivo de envelope: `success`, `message`, `data`, `errorCode` (cuando aplique), alineado con lo que el frontend ya consume o el contrato acordado.
- **Prohibido** cambiar el shape sin **plan de migración** y versionado (path o header de versión).

### Alineación `try/catch` y respuestas en frontend

- Todo flujo async en frontend debe mapear **explícitamente**:
  - éxito;
  - validación fallida;
  - no autorizado / prohibido;
  - conflicto de negocio;
  - error interno.
- Los mensajes y códigos deben venir del **contrato backend**, no inventados en UI.
- Si el frontend requiere un campo o forma de error no expuesta, se **ajusta backend** (sin romper diseño).

### Política de cero mocks (obligatoria)

- **Prohibido** datos mock, hardcode, fake o predefinidos en **flujos funcionales** y vistas productivas.
- Toda data de negocio visible debe provenir de la **API del backend**.
- Antes de cerrar módulo: eliminar restos de `mock`, `dummy`, `fake`, `predefinido`, credenciales simuladas y estado local que **sustituya** persistencia real.

### Clasificación obligatoria por módulo (gating)

- Estados: `MOCK_ONLY` → `PARTIAL_API` → `API_READY`.
- Un módulo solo pasa a **DONE** en **`API_READY`** con backend real y sin mocks funcionales.

---

## Contratos y validaciones

### Contrato API obligatorio

- Endpoints usados por frontend **documentados** y **versionados** (OpenAPI recomendado).
- Requests/responses con esquema estricto: tipos, `required`, `enums`, `nullable` explícitos.
- Sin ambigüedad en datos críticos: estados, método de pago, tipo de documento, rol → **enums canónicos**.
- Fechas, moneda, decimales y zona horaria con **formato único** documentado.
- Mapeos legacy solo por compatibilidad temporal, marcados **deprecated** y con fecha de retiro si aplica.

### Seguridad y acceso (contrato de autorización)

- Rutas privadas: autenticación y validación de sesión en servidor.
- Acciones sensibles: autorización por rol/permiso en **backend** (no basta ocultar en UI).
- **Ownership** para rol cliente: solo sus pedidos, compras, domicilios, perfil, etc.
- Rate limit / lockout en login y recuperación de credenciales.
- **Nunca** exponer secretos ni datos sensibles en respuestas.

### Integridad transaccional

- Operaciones compuestas (venta+ítems, compra+ítems, registro cliente+usuario, …) **transaccionales**.
- Sin estados intermedios corruptos ante fallo parcial.
- Estados de negocio con **máquina de transición** explícita (sin saltos inválidos).

### Estrategia de compatibilidad y migración

- Si el frontend exige campos o acciones nuevas: migraciones, backfill si aplica, compatibilidad temporal controlada.
- **Prohibido** romper compatibilidad sin plan explícito de transición.

### Observabilidad mínima

- Logs estructurados por request con `requestId`.
- Mapeo de errores coherente (4xx funcional vs 5xx técnico).
- Métricas en endpoints críticos (latencia, errores, volumen).
- Auditoría en entidades sensibles (usuarios, roles, compras, producción, ventas, …).

### Performance y móvil

- Listados: paginación, filtros y orden cuando aplique.
- Evitar payloads innecesarios para vistas móviles.
- SLO/SLA por endpoint crítico (ej. p95 &lt; 500 ms en consultas comunes) donde el equipo lo defina.

### Definition of Done por módulo

Un módulo solo se marca listo si cumple **todo**:

- UI frontend/Figma conectada **sin mocks** funcionales.
- Endpoints implementados/ajustados y contratos cerrados.
- Validaciones y reglas de negocio completas.
- Permisos, seguridad y ownership verificados.
- Casos borde y errores controlados y reflejados en UI **sin romper diseño**.
- Tests unit + integración + e2e del flujo principal.
- Documentación de API actualizada.
- Checklist de aceptación cerrado.

---

## Checklist que el agente debe ejecutar por cada módulo

- **Inventario** de frontend objetivo y Figma: pantallas, interacciones, loading / empty / error / success.
- **Matriz funcional:** `pantalla → acción → endpoint → método → request → response → permisos`.
- **Gap analysis:** `EXISTE`, `AJUSTAR`, `CREAR`.
- **Clasificación:** `MOCK_ONLY`, `PARTIAL_API`, `API_READY`.
- **Backend:** endpoints, validaciones, migraciones, permisos, auditoría.
- **Frontend:** consumo real de API **sin** alterar diseño; retiro de mocks.
- **Pruebas:** unitarias de reglas, integración de API, e2e del flujo.
- **Cierre:** cobertura acordada y **cero mocks** en el módulo.

---

## Prohibiciones explícitas

- Declarar “completo” si hay acción UI sin soporte backend real.
- Ocultar GAPs críticos o altos.
- Usar mocks como solución final.
- Modificar diseño frontend/Figma para “encajar” con limitaciones del backend.
- Cerrar módulo con datos simulados en flujo productivo.
