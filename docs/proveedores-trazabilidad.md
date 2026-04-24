# Trazabilidad proveedores

Estado de revisión sobre el bloque de proveedores del Excel.

| HU | Alcance | Estado | Evidencia |
| --- | --- | --- | --- |
| HU_033 | Registrar proveedor (asesor) | Cumple | Alta con soporte para persona jurídica y natural, normalización de payload y validación backend. |
| HU_034 | Listar proveedores (asesor) | Cumple | Tabla con carga completa desde backend, columnas clave y estado visible. |
| HU_035 | Buscar proveedor (asesor) | Cumple | Búsqueda global integrada en la grilla de la pantalla de proveedores. |
| HU_036 | Ver detalle proveedor (asesor) | Cumple | Modal de detalle con datos completos según tipo de proveedor. |
| HU_037 | Actualizar proveedor (asesor) | Cumple | Edición con limpieza de campos según tipo de persona y actualización backend. |
| HU_038 | Cambiar estado proveedor (asesor) | Cumple | Cambio de activo/inactivo con confirmación explícita desde la interfaz. |
| HU_039 | Eliminar proveedor (asesor) | Cumple | Eliminación con confirmación y recarga de la tabla tras completar la acción. |

| HU_040 | Gestion proveedores admin | Cumple | El perfil admin reutiliza la misma pantalla y backend de proveedores, con acceso habilitado por permisos de compras en la aplicacion. |
## Observaciones

- El bloque de proveedores no muestra brechas funcionales relevantes frente a los criterios visibles del Excel.
- La pantalla contempla los dos tipos de proveedor exigidos: jurídica y natural.
- No existe una vista separada para admin; el criterio HU_40 queda cubierto por el mismo flujo y por el acceso del rol Administrador al modulo compras.
- No se detectó una necesidad adicional de flujo alterno fuera de la UI existente para este bloque.