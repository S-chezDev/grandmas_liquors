# Trazabilidad Clientes

## Alcance revisado
- HU_126 a HU_140

## Resultado
- Parcial

## Evidencia
- [src/components/pages/ventas/Clientes.tsx](src/components/pages/ventas/Clientes.tsx)
- [backend/src/controllers/clientes.controllers.js](backend/src/controllers/clientes.controllers.js)
- [backend/src/models/entities.models.js](backend/src/models/entities.models.js)
- [src/services/api.ts](src/services/api.ts)

## Observaciones
- El modulo permite listar, ver detalle, crear, editar, cambiar estado y eliminar clientes.
- El backend y el modelo soportan foto_url, pero la pantalla solo maneja una vista previa local y asigna foto en el estado, sin un flujo real de persistencia de imagen.
- La normalizacion de la API cubre tipo de documento y estado, pero no resuelve la carga real de archivo.

## Conclusion
- La gestion base de clientes esta cubierta, pero el manejo de foto queda parcial y no valida un flujo completo de archivo.
