-- Agregar campo estado a la tabla entregas_insumos
-- Permite anular entregas de forma irreversible

ALTER TABLE entregas_insumos 
ADD COLUMN estado VARCHAR(20) DEFAULT 'Activo';

-- Crear índice para mejorar queries por estado
CREATE INDEX idx_entregas_insumos_estado ON entregas_insumos(estado);
