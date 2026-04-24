-- Garantiza soporte de relacion produccion -> pedidos para consultas y CRUD actuales.

ALTER TABLE produccion
  ADD COLUMN IF NOT EXISTS pedido_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'produccion_pedido_id_fkey'
      AND conrelid = 'produccion'::regclass
  ) THEN
    ALTER TABLE produccion
      ADD CONSTRAINT produccion_pedido_id_fkey
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_produccion_pedido ON produccion(pedido_id);
