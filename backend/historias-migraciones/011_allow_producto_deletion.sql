-- Migración 011: Permitir eliminación de productos con control en backend
-- Cambiar constraints de ON DELETE RESTRICT a ON DELETE SET NULL
-- Esto permite que se eliminen productos desde la aplicación, con validaciones en el backend
-- La validación en backend verifica que no haya ventas pendientes asociadas al producto

BEGIN TRANSACTION;

-- Cambiar constraint en detalle_ventas
ALTER TABLE detalle_ventas
DROP CONSTRAINT detalle_ventas_producto_id_fkey;

ALTER TABLE detalle_ventas
ADD CONSTRAINT detalle_ventas_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL;

-- Cambiar constraint en detalle_pedidos
ALTER TABLE detalle_pedidos
DROP CONSTRAINT detalle_pedidos_producto_id_fkey;

ALTER TABLE detalle_pedidos
ADD CONSTRAINT detalle_pedidos_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL;

-- Cambiar constraint en detalle_compras
ALTER TABLE detalle_compras
DROP CONSTRAINT detalle_compras_producto_id_fkey;

ALTER TABLE detalle_compras
ADD CONSTRAINT detalle_compras_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL;

-- Cambiar constraint en produccion
ALTER TABLE produccion
DROP CONSTRAINT produccion_producto_id_fkey;

ALTER TABLE produccion
ADD CONSTRAINT produccion_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL;

COMMIT;
