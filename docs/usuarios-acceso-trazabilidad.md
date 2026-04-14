# Trazabilidad usuarios y acceso

Estado de revisión sobre los criterios del bloque de usuarios/acceso del Excel.

| HU | Alcance | Estado | Evidencia |
| --- | --- | --- | --- |
| HU_11 | Registrar usuario | Cumple | Creación con username autogenerado, contraseña temporal o personalizada, validación de documento/correo y auditoría en backend. |
| HU_12 | Actualizar usuario | Cumple | Validación de unicidad, actualización de datos y bloqueo del cambio de estado desde el formulario. |
| HU_13 | Cambiar estado usuario | Cumple | Modal dedicado, validación de notificación obligatoria, control de sesiones activas y envío de correo. |
| HU_14 | Eliminar usuario | Cumple | Análisis de impacto, motivo obligatorio, eliminación lógica/física y backup automático para física. |
| HU_15 | Listar usuarios | Cumple | Tabla con orden por fecha de creación descendente, filtros por estado y rol, y exportación CSV. |
| HU_16 | Buscar usuarios | Cumple | Búsqueda global con consulta al backend y filtro por texto en toda la grilla. |
| HU_17 | Ver detalle usuario | Cumple | Detalle completo con historial, sesiones, IP, agente y datos base del usuario. |
| HU_18 | Registrar usuario admin | Cumple | Misma base funcional de alta con validaciones, rol asignable y registro de auditoría. |
| HU_19 | Actualizar usuario admin | Cumple | Misma base funcional de actualización con control de correo/documento y auditoría. |
| HU_20 | Cambiar estado usuario admin | Cumple | Misma base funcional de estado con notificación y fuerza opcional. |
| HU_21 | Eliminar usuario admin | Cumple | Misma base funcional de eliminación con impacto, backup y modo lógico/físico. |
| HU_22 | Listar usuarios admin | Cumple | Misma tabla con filtros mínimos exigidos y orden descendente por creación. |
| HU_23 | Buscar usuarios admin | Cumple | Búsqueda global por backend. |
| HU_24 | Ver detalle usuario admin | Cumple | Detalle completo con actividad y sesiones. |
| HU_29 | Login | Cumple | Autenticación con JWT, bloqueo por intentos fallidos y registro de sesión con IP y user-agent. |
| HU_30 | Logout | Cumple | Cierre de sesión individual o masivo y revocación de sesión en backend. |
| HU_31 | Cambiar contraseña | Cumple | Validación de contraseña actual, reglas de fortaleza y no reutilización reciente. |
| HU_32 | Restablecer contraseña | Cumple | Solicitud y confirmación de reset con token temporal y correo. |

## Observaciones

- La tabla de usuarios ya no expone `rol_id`; solo quedan filtros por estado y rol.
- El detalle de usuario ya consolida historial de actividad, sesiones e IPs.
- La eliminación física solo queda disponible cuando el impacto y la antigüedad del usuario lo permiten, salvo que se omitan validaciones de forma explícita.
- La ruta `/usuarios/accesos` es solo una vista de presentación; los flujos reales de login, logout, cambio de contraseña y reset viven en `src/components/pages/Login.tsx`, `src/components/AuthContext.tsx` y `backend/src/controllers/auth.controllers.js`.
- Quedan fuera de esta revisión los módulos del Excel distintos de usuarios/acceso.