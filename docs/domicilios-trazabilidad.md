# Trazabilidad Domicilios

## Alcance revisado
- HU_206 a HU_224

## Resultado
- Parcial

## Evidencia
- [src/components/pages/ventas/Domicilios.tsx](src/components/pages/ventas/Domicilios.tsx)
- [backend/src/controllers/domicilios.controllers.js](backend/src/controllers/domicilios.controllers.js)
- [backend/src/routes/domicilios.routes.js](backend/src/routes/domicilios.routes.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)

## Observaciones
- El backend persiste domicilios con pedido, cliente, direccion, repartidor, fecha, hora, estado y detalle.
- La pantalla permite listar, ver, editar, crear, cambiar estado y eliminar.
- El reinicio de formularios mezcla campos de otro contrato (pedido, cliente) con el estado real (pedido_id, direccion, repartidor, fecha, hora, estado, detalle), lo que no rompe el flujo, pero si deja una inconsistencia de mantenimiento.

## Conclusion
- El modulo funciona, pero se documenta como parcial por inconsistencias de estado y reseteo del formulario.
