# Trazabilidad Abonos Finales

## Alcance revisado
- HU_268 a HU_274

## Resultado
- HU_268 Gestion de Abonos Admin: Parcial
- HU_274 Gestion de Abonos Asesor: Parcial

## Evidencia
- [src/components/pages/ventas/Abonos.tsx](src/components/pages/ventas/Abonos.tsx)
- [src/components/pages/ventas/Pedidos.tsx](src/components/pages/ventas/Pedidos.tsx)
- [backend/src/controllers/abonos.controllers.js](backend/src/controllers/abonos.controllers.js)
- [backend/src/routes/abonos.routes.js](backend/src/routes/abonos.routes.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)
- [src/components/AuthContext.tsx](src/components/AuthContext.tsx)

## Observaciones
- El modulo permite listar, ver detalle, registrar, anular y generar comprobante textual.
- La persistencia en backend esta presente para create, update, delete y consulta por pedido.
- La interfaz no expone una edicion completa desde la tabla, y el flujo de consulta por pedido queda mas visible en backend que en UI.
- Para el asesor, el acceso existe por permisos del modulo `ventas`, pero usa la misma pantalla base sin una variacion funcional distinta.

## Conclusion
- Los abonos estan operativos, pero quedan parciales porque la UI no cubre toda la capacidad del backend ni separa un flujo exclusivo por rol.
