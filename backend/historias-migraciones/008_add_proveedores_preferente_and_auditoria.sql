-- Agrega preferencia y historial de cambios para proveedores.

ALTER TABLE proveedores
ADD COLUMN IF NOT EXISTS preferente BOOLEAN DEFAULT FALSE;

ALTER TABLE proveedores
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);

ALTER TABLE proveedores
ADD COLUMN IF NOT EXISTS observaciones TEXT;

CREATE TABLE IF NOT EXISTS proveedores_auditoria (
  id SERIAL PRIMARY KEY,
  proveedor_id INTEGER,
  accion VARCHAR(20) NOT NULL,
  usuario_id INTEGER,
  cambios JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);