-- Agrega soporte para observaciones y control de aprobaciones en compras.

ALTER TABLE compras
  ADD COLUMN IF NOT EXISTS observaciones TEXT,
  ADD COLUMN IF NOT EXISTS requiere_aprobacion BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS aprobacion_extraordinaria BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS motivo_aprobacion TEXT;
