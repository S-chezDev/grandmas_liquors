# Trazabilidad Pedidos

## Alcance revisado
- HU_174 a HU_203

## Resultado
- Parcial

## Evidencia
- [src/components/pages/ventas/Pedidos.tsx](src/components/pages/ventas/Pedidos.tsx)
- [backend/src/controllers/pedidos.controllers.js](backend/src/controllers/pedidos.controllers.js)
- [backend/src/routes/pedidos.routes.js](backend/src/routes/pedidos.routes.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)

## Observaciones
- El backend persiste pedidos y sus detalles, y la pantalla soporta alta, edicion, cambio de estado, cancelacion, detalle y PDF textual.
- Hay una brecha funcional en el detalle PDF y en la vista de abonos: el componente sigue referenciando mockAbonos, que no forma parte del contrato real.
- En edicion se inicializan productos de ejemplo en lugar de reutilizar los detalles reales del pedido, por lo que parte del flujo sigue siendo demostrativo.

## Conclusion
- El bloque esta cerca de completo, pero queda parcial por dependencia de datos mock en subflujos de detalle y abonos.
