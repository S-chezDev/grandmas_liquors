# Trazabilidad categorias

Estado de revisión sobre el bloque de categorias de productos del Excel.

| HU | Alcance | Estado | Evidencia |
| --- | --- | --- | --- |
| HU_77 | Gestion de Categorias de Productos | Parcial | La pantalla lista, crea, edita, busca y muestra detalle de categorias; el borrado de categorias con productos asociados solo esta bloqueado en la UI, no en el backend. |
| HU_84 | Categoria de Productos Admin | Parcial | El perfil admin reutiliza la misma pantalla y backend de categorias, con acceso habilitado por permisos de compras en la aplicacion, pero la proteccion de borrado sigue siendo solo del lado cliente. |

## Observaciones

- El flujo de categorias funciona correctamente en pantalla para listar, crear, editar, buscar y ver detalle.
- Existe una brecha funcional en el borrado: la regla de "no eliminar si hay productos asociados" se aplica en el frontend, pero el backend permite la eliminacion directa.
- Queda pendiente seguir con el siguiente bloque del inventario: HU_91-HU_100.