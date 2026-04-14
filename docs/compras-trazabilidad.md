# Trazabilidad compras

Estado de revisión sobre el bloque de compras del Excel.

| HU | Alcance | Estado | Evidencia |
| --- | --- | --- | --- |
| HU_047 | Registrar compra (asesor) | Cumple | Creación de compra con subtotal/IVA/total, más detalle por productos asociados. |
| HU_048 | Listar compras (asesor) | Cumple | Tabla con carga desde backend, columnas de compra y estado visible. |
| HU_049 | Buscar compra (asesor) | Cumple | Búsqueda integrada en la grilla de compras. |
| HU_050 | Ver detalle compra (asesor) | Cumple | Modal de detalle con ítems, subtotal, IVA y total, más vista tipo impresión/PDF. |
| HU_055 | Gestion compras admin | Parcial | El modulo reutiliza la misma pantalla y backend de compras, pero la accion de anular solo cambia estado en memoria del frontend; no persiste la anulacion en el backend. |

## Observaciones

- El flujo de compra está soportado por frontend y backend sin brechas funcionales visibles en el bloque revisado.
- La compra se arma con catálogo de productos y proveedores, y luego se persiste el detalle por ítems.
- La accion de anular compra del frontend es local; si el criterio admin exige persistencia de anulacion, queda como brecha funcional.
- Queda fuera de este tramo la evaluación de módulos posteriores del Excel.