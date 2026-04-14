# Trazabilidad Pedidos Finales

## Alcance revisado
- HU_237 a HU_265

## Resultado
- HU_237 Pedidos Admin: Parcial
- HU_247 Pedidos Asesor: Parcial
- HU_257 Pedidos Cliente: Parcial
- HU_265 Pedidos Productor: No cumple

## Evidencia
- [src/components/pages/ventas/Pedidos.tsx](src/components/pages/ventas/Pedidos.tsx)
- [src/components/pages/cliente/TiendaCliente.tsx](src/components/pages/cliente/TiendaCliente.tsx)
- [src/components/pages/cliente/MisPedidos.tsx](src/components/pages/cliente/MisPedidos.tsx)
- [src/components/AuthContext.tsx](src/components/AuthContext.tsx)
- [src/components/Sidebar.tsx](src/components/Sidebar.tsx)
- [backend/src/controllers/pedidos.controllers.js](backend/src/controllers/pedidos.controllers.js)
- [backend/src/routes/pedidos.routes.js](backend/src/routes/pedidos.routes.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)

## Observaciones
- La gestion administrativa de pedidos existe y persiste en backend, con alta, detalle, cambio de estado y cancelacion.
- La vista administrativa y la vista del asesor reutilizan la misma pantalla, pero el detalle y el PDF siguen dependiendo de `mockAbonos` para el resumen financiero, lo que deja una brecha funcional.
- El cliente puede crear pedidos desde la tienda y consultarlos en Mis Pedidos, con edicion limitada por estado y acceso real por permisos.
- No existe una pantalla o permiso especifico para un flujo de pedidos del Productor; el rol Productor queda fuera del modulo `ventas` en `AuthContext.tsx` y del menu lateral.

## Conclusion
- El bloque de pedidos esta implementado en el circuito principal, pero queda parcial por dependencias mock y por la ausencia de un flujo real de productor.
