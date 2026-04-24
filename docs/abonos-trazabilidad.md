# Trazabilidad Abonos

## Alcance revisado
- HU_162 a HU_174

## Resultado
- Parcial

## Evidencia
- [src/components/pages/ventas/Abonos.tsx](src/components/pages/ventas/Abonos.tsx)
- [backend/src/controllers/abonos.controllers.js](backend/src/controllers/abonos.controllers.js)
- [backend/src/routes/abonos.routes.js](backend/src/routes/abonos.routes.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)

## Observaciones
- El modulo permite listar, ver detalle, registrar, anular y generar comprobante textual.
- El backend persiste registro, actualizacion y eliminacion, pero la pantalla solo expone alta y anulacion; no se vio una edicion completa en la interfaz.
- La consulta por pedido existe en backend y API, aunque la vista actual no la usa como flujo principal.

## Conclusion
- El modulo es funcional, pero queda parcial si la matriz exige edicion completa o exploracion por pedido desde la UI.
