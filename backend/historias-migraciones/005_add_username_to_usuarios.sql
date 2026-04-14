-- Agrega username unico y lo autogenera para usuarios existentes.

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS username VARCHAR(120);

DO $$
DECLARE
  registro RECORD;
  base_username TEXT;
  candidate TEXT;
  counter INTEGER;
BEGIN
  FOR registro IN
    SELECT id, email, username
    FROM usuarios
    ORDER BY id
  LOOP
    IF registro.username IS NULL OR TRIM(registro.username) = '' THEN
      base_username := LOWER(
        REGEXP_REPLACE(
          SPLIT_PART(COALESCE(registro.email, 'usuario_' || registro.id::text), '@', 1),
          '[^a-z0-9._-]',
          '',
          'g'
        )
      );

      IF base_username IS NULL OR base_username = '' THEN
        base_username := 'usuario_' || registro.id::text;
      END IF;

      candidate := base_username;
      counter := 1;

      WHILE EXISTS (
        SELECT 1
        FROM usuarios
        WHERE LOWER(username) = LOWER(candidate)
          AND id <> registro.id
      ) LOOP
        candidate := base_username || '_' || counter::text;
        counter := counter + 1;
      END LOOP;

      UPDATE usuarios
      SET username = candidate,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = registro.id;
    END IF;
  END LOOP;
END $$;

ALTER TABLE usuarios
  ALTER COLUMN username SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_username_unique
  ON usuarios (LOWER(username));
