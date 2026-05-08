# Módulo de producción: funcionamiento y flujo

Este documento describe cómo funcionan **Insumos**, **Entrega de insumos** y **Producción** en el proyecto, y el flujo operativo recomendado.

## Arquitectura de datos

- **`insumos`**: catálogo y stock lógico (`cantidad`).
- **`entregas_insumos`**: cada **entrada** de material; al **crear** una entrega se **suma** la cantidad a `insumos.cantidad` (transacción).
- **`producto_insumos`**: **receta** (insumos y cantidades por unidad producida).
- **`produccion`**: orden de producción; al **crear** la orden se valida stock y se **descuenta** insumo según receta × cantidad.

Solo productos con `tipo_producto = 'preparacion'` admiten orden de producción.

## 1. Insumos

- API: `GET/POST /api/insumos`, `PUT/DELETE /api/insumos/:id`, `GET /api/insumos/resumen-gestion`.
- Frontend: `/produccion/insumos` — la lista principal usa **resumen-gestion** y el botón **Nuevo insumo** permite dar de alta el ítem de catálogo (unidad, stock inicial opcional, mínimos, estado). El inventario también sube al registrar **entregas**.
- Reglas: nombre único; unidades permitidas definidas en el modelo; no eliminar si hay entregas registradas o si el figura en `producto_insumos`.

## 2. Entrega de insumos

- API: `/api/entregas-insumos` (CRUD).
- Frontend: `/produccion/entrega-insumos` — el insumo se elige del **catálogo** (activos); la **unidad** enviada al backend coincide con la del insumo. El **productor** queda como operario de la entrega.
- Al **crear**: insert + incremento de `insumos.cantidad`.
- Al **eliminar** o **actualizar**: el backend ajusta el inventario para mantener coherencia (no dejar `insumos.cantidad` negativo).

## 3. Producción

- API: `/api/produccion`.
- Frontend: `/produccion/produccion` — al elegir un producto de preparación, la **Nueva orden** muestra la **receta** (`producto_insumos`): consumo por unidad producida, total según la cantidad indicada y, opcionalmente, una **calculadora de envases** en ml para líneas en litros o mililitros (p. ej. envases de 100 ml). El detalle de orden incluye la misma vista de receta para la cantidad de esa orden. Si no hay receta definida, la UI avisa antes de crear la orden.
- **Crear orden**: bloqueo del producto, lectura de receta, validación de stock, descuento de insumos e inserción del registro.
- **Estados** (BD): Orden Recibida, Orden en preparacion, Orden Lista, Cancelada.
- **Transiciones**: Recibida → preparación o Cancelada; preparación → Lista o Cancelada; cancelar requiere motivo (≥ 10 caracteres).
- **Orden Lista**: incrementa `productos.stock` en la cantidad de la orden.
- **Cancelada**: devuelve al inventario los insumos descontados al crear la orden (según receta actual y cantidad de la orden).

## Flujo operativo recomendado

1. Definir insumos (catálogo y, si aplica, stock inicial o solo vía entregas).
2. Definir recetas en `producto_insumos` (API `/api/producto-insumos` o datos/SQL).
3. Registrar **entregas** cuando ingrese material.
4. Revisar inventario en **Insumos** (mínimos y demanda).
5. **Crear orden de producción** cuando el stock cubra `receta × cantidad`.
6. Avanzar estados hasta **Lista**; el stock de producto sube al marcar lista.
7. Si se **cancela** antes de lista, los insumos vuelven al inventario.

## Referencias de código

- Modelo: `backend/src/models/entities.models.js` (`Insumos`, `EntregasInsumos`, `Produccion`, `ProductoInsumos`).
- Rutas: `insumos.routes.js`, `entregas-insumos.routes.js`, `produccion.routes.js`, `producto-insumos.routes.js`.
