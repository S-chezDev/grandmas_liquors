# Trazabilidad Portal Cliente

## Alcance revisado
- HU_126 a HU_140
- HU_159, HU_194, HU_224, HU_257, HU_296 a HU_298

## Resultado
- Parcial

## Evidencia
- [src/components/pages/cliente/TiendaCliente.tsx](src/components/pages/cliente/TiendaCliente.tsx)
- [src/components/pages/cliente/MisPedidos.tsx](src/components/pages/cliente/MisPedidos.tsx)
- [src/components/pages/cliente/MiPerfil.tsx](src/components/pages/cliente/MiPerfil.tsx)
- [src/App.tsx](src/App.tsx)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)

## Observaciones
- La tienda del cliente carga catalogo real, resuelve el perfil del usuario autenticado y crea pedidos con detalle de productos.
- Mis pedidos consume el backend real, permite ver detalle y editar campos limitados del pedido cuando el estado lo permite.
- Mi perfil esta resuelto como pantalla local: muestra y edita datos en estado del componente, pero no persiste cambios ni cambio de contrasena contra el backend.
- El portal esta bien enroutado en App.tsx y no presenta errores de compilacion.

## Conclusion
- El portal cliente funciona para catalogo y consulta basica, pero sigue parcial por el perfil mock y por no cubrir aun un historial completo de ventas/compras con persistencia real.
