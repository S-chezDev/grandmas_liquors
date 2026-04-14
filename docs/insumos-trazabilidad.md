# Trazabilidad insumos

Estado de revisión sobre el bloque de entrega de insumos del Excel.

| HU | Alcance | Estado | Evidencia |
| --- | --- | --- | --- |
| HU_91 | Entrega de Insumos | Parcial | La pantalla permite listar, crear, ver detalle, generar PDF y eliminar entregas, pero el frontend consume `entrega.insumo` mientras el backend devuelve `insumo_nombre`, por lo que el detalle no queda alineado con el dato real. |
| HU_94 | Entrega de Insumos Asesor | Parcial | El mismo flujo queda disponible para el rol Asesor por permisos de produccion, pero comparte la misma brecha de mapeo entre `insumo_nombre` e `insumo`. |
| HU_100 | Entrega de Insumos Admin | Parcial | El perfil admin reutiliza la misma pantalla y backend de entregas, con acceso habilitado por permisos de produccion, pero la vista sigue usando opciones hardcodeadas y el detalle/PDF no reflejan el nombre real del insumo. |

## Observaciones

- El backend sí soporta CRUD de entregas de insumos y la ruta está montada en la aplicacion.
- La UI no carga insumos desde el backend para la seleccion, sino una lista fija de opciones.
- El detalle y el PDF dependen de un campo que no coincide con la respuesta del backend, por eso este bloque no queda como cumplimiento total.
- Queda pendiente seguir con el siguiente bloque del inventario: HU_106-HU_118.