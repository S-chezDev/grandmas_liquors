-- Migración 013: Cambiar constraint de categoria_id a ON DELETE CASCADE
-- Permite eliminar categorías y sus productos asociados se eliminarán en cascada

BEGIN TRANSACTION;

-- Cambiar constraint en productos para categoria_id
ALTER TABLE productos
DROP CONSTRAINT productos_categoria_id_fkey;

ALTER TABLE productos
ADD CONSTRAINT productos_categoria_id_fkey
FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE;

COMMIT;
