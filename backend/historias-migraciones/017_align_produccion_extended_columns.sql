-- Alinea produccion con el modelo vigente del backend y el esquema de db.sql.

ALTER TABLE produccion
  ADD COLUMN IF NOT EXISTS tiempo_preparacion_minutos INTEGER,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS insumos_gastados JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE produccion
SET tiempo_preparacion_minutos = COALESCE(tiempo_preparacion_minutos, 1)
WHERE tiempo_preparacion_minutos IS NULL;

ALTER TABLE produccion
  ALTER COLUMN tiempo_preparacion_minutos SET DEFAULT 1,
  ALTER COLUMN tiempo_preparacion_minutos SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_produccion_tiempo_preparacion_positivo'
      AND conrelid = 'produccion'::regclass
  ) THEN
    ALTER TABLE produccion
      ADD CONSTRAINT chk_produccion_tiempo_preparacion_positivo
      CHECK (tiempo_preparacion_minutos > 0);
  END IF;
END $$;
