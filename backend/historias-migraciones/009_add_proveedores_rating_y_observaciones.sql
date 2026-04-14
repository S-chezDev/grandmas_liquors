-- Agrega rating y observaciones para proveedores existentes.

ALTER TABLE proveedores
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);

ALTER TABLE proveedores
ADD COLUMN IF NOT EXISTS observaciones TEXT;
