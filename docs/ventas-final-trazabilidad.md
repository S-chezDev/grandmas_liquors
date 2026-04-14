# Trazabilidad Ventas Finales

## Alcance revisado
- HU_280 a HU_298

## Resultado
- HU_280 Gestion de Ventas Admin: Parcial
- HU_288 Gestion de Ventas Asesor: Parcial
- HU_296 Gestion de Ventas Cliente: Parcial
- HU_297 Historial de Compras Cliente: No cumple
- HU_298 Factura / historial de ventas Cliente: Parcial

## Evidencia
- [src/components/pages/ventas/Ventas.tsx](src/components/pages/ventas/Ventas.tsx)
- [src/components/pages/cliente/TiendaCliente.tsx](src/components/pages/cliente/TiendaCliente.tsx)
- [src/components/pages/cliente/MisPedidos.tsx](src/components/pages/cliente/MisPedidos.tsx)
- [src/components/pages/cliente/MiPerfil.tsx](src/components/pages/cliente/MiPerfil.tsx)
- [backend/src/controllers/ventas.controllers.js](backend/src/controllers/ventas.controllers.js)
- [backend/src/routes/ventas.routes.js](backend/src/routes/ventas.routes.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)
- [src/components/AuthContext.tsx](src/components/AuthContext.tsx)

## Observaciones
- La pantalla de ventas administrativa crea ventas, agrega detalles, lista, muestra detalle, genera comprobante y anula en backend.
- El flujo existe para admin y asesor a nivel de permisos y ruta, pero no hay una edición completa del registro de venta en la UI.
- En cliente, la tienda permite crear pedidos desde el catalogo, y Mis Pedidos permite consultar y editar pedidos propios; eso cubre una parte del ciclo comercial, pero no una vista de ventas real separada.
- No se encontro una pantalla de historial de compras del cliente en el workspace; por eso HU_297 no tiene soporte funcional dedicado.
- La factura existe como comprobante textual en la pantalla de ventas, pero no hay historial de facturas o ventas cliente persistido como modulo propio.

## Conclusion
- El bloque de ventas final cubre la operacion principal, pero queda parcial por falta de edicion completa, falta de historial de compras cliente y falta de un historial de facturas cliente dedicado.
