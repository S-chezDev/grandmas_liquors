-- Migración 012: Cambiar constraints a ON DELETE CASCADE
-- Esto permite eliminar productos con sus detalles asociados
-- (solo cuando no hay ventas pendientes, controlado por backend)

BEGIN TRANSACTION;

-- Cambiar constraint en detalle_ventas
ALTER TABLE detalle_ventas
DROP CONSTRAINT detalle_ventas_producto_id_fkey;

ALTER TABLE detalle_ventas
ADD CONSTRAINT detalle_ventas_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;

-- Cambiar constraint en detalle_pedidos
ALTER TABLE detalle_pedidos
DROP CONSTRAINT detalle_pedidos_producto_id_fkey;

ALTER TABLE detalle_pedidos
ADD CONSTRAINT detalle_pedidos_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;

-- Cambiar constraint en detalle_compras
ALTER TABLE detalle_compras
DROP CONSTRAINT detalle_compras_producto_id_fkey;

ALTER TABLE detalle_compras
ADD CONSTRAINT detalle_compras_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;

-- Cambiar constraint en produccion
ALTER TABLE produccion
DROP CONSTRAINT produccion_producto_id_fkey;

ALTER TABLE produccion
ADD CONSTRAINT produccion_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;

COMMIT;
