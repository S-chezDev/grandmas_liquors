# Trazabilidad roles

Estado de revision sobre el bloque de roles del Excel.

| HU | Alcance | Estado | Evidencia |
| --- | --- | --- | --- |
| HU_01 | Listar roles | Parcial | La tabla muestra rol, descripcion, permisos, usuarios, estado y ultima modificacion, pero no ID ni fecha de creacion; la paginacion es solo un placeholder y la busqueda no exige 3 caracteres. |
| HU_02 | Ver detalle de rol | Parcial | El modal muestra nombre, estado, descripcion, usuarios, permisos y ultima modificacion, ademas de auditoria; no hay botones Editar/Cancelar dentro del detalle y los permisos no se agrupan por categoria en la vista de detalle. |
| HU_03 | Crear rol | Cumple | Formulario con nombre, descripcion, estado y permisos; valida unicidad, minimo de 3 caracteres, al menos un permiso y estado por defecto Activo. |
| HU_04 | Editar rol | Parcial | El modal precarga datos, permite editar nombre/descripcion/estado/permisos, valida unicidad y registra auditoria; no existe edicion directa desde la vista de detalle. |
| HU_05 | Cambiar estado rol | Cumple | Selector de estado con confirmacion, motivo opcional, bloqueo si tiene usuarios asignados y actualizacion backend con auditoria. |
| HU_06 | Buscar rol | Parcial | Existe busqueda en la tabla con filtro sin distincion de acentos/case, pero no se activa solo a partir de 2 o 3 caracteres y la paginacion sigue sin implementarse. |
| HU_07 | Gestionar permisos rol | Cumple | Modal con permisos agrupados por modulo, checkboxes, filtrado por modulo, seleccion multiple, guardar y cancelar, con validacion de al menos un permiso. |
| HU_08 | Quitar permisos rol | Parcial | La UI evita quitar el unico permiso de un modulo critico y pide confirmacion para permisos criticos, pero no hay una vista separada solo de desasignacion. |
| HU_09 | Ver permisos agrupados | Parcial | Los permisos si estan agrupados por modulo en los modales, pero la tabla principal no muestra el listado completo de permisos por modulo como indica el criterio. |
| HU_10 | Eliminar rol | Cumple | Modal de confirmacion con motivo obligatorio de 10 a 200 caracteres, bloqueo si hay usuarios asignados y feedback posterior; el backend registra auditoria de eliminacion. |

## Observaciones

- El backend de roles si expone auditoria en `/api/roles/:id/auditoria` y actualiza `updated_at` en cambios.
- La pantalla de roles sigue teniendo una brecha clara en HU_01 por paginacion real y columnas exactas del listado.
- La busqueda del componente reutilizable es case-insensitive, pero no respeta el umbral minimo de caracteres que pide el Excel.
- Queda pendiente seguir con el siguiente bloque del inventario: HU_11-HU_32 y luego los demas modulos del workbook.