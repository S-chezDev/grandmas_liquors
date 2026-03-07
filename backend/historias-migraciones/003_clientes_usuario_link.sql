-- Enlaza perfiles de cliente con usuarios para soportar modelo usuario-base + perfil-rol.

ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS usuario_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'clientes'
      AND constraint_name = 'fk_clientes_usuario'
  ) THEN
    ALTER TABLE clientes
      ADD CONSTRAINT fk_clientes_usuario
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_usuario_id_unique
  ON clientes(usuario_id)
  WHERE usuario_id IS NOT NULL;

-- Vincular clientes ya existentes con usuarios cliente por email.
UPDATE clientes c
SET usuario_id = u.id
FROM usuarios u
JOIN roles r ON r.id = u.rol_id
WHERE c.usuario_id IS NULL
  AND r.nombre = 'Cliente'
  AND c.email IS NOT NULL
  AND LOWER(c.email) = LOWER(u.email);

-- Si no existe cliente para un usuario con rol Cliente, crearlo automaticamente.
INSERT INTO clientes (
  usuario_id,
  nombre,
  apellido,
  tipo_documento,
  documento,
  telefono,
  email,
  direccion,
  estado
)
SELECT
  u.id,
  u.nombre,
  u.apellido,
  u.tipo_documento,
  u.documento,
  u.telefono,
  u.email,
  u.direccion,
  COALESCE(u.estado, 'Activo')
FROM usuarios u
JOIN roles r ON r.id = u.rol_id
LEFT JOIN clientes c ON c.usuario_id = u.id OR (c.usuario_id IS NULL AND c.email IS NOT NULL AND LOWER(c.email) = LOWER(u.email))
WHERE r.nombre = 'Cliente'
  AND c.id IS NULL;

-- Trigger para mantener sincronizado el perfil cliente cuando se crea/edita un usuario Cliente.
CREATE OR REPLACE FUNCTION sync_cliente_from_usuario()
RETURNS TRIGGER AS $$
DECLARE
  cliente_role_id INTEGER;
BEGIN
  SELECT id INTO cliente_role_id FROM roles WHERE nombre = 'Cliente' LIMIT 1;

  IF cliente_role_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.rol_id = cliente_role_id THEN
    UPDATE clientes
    SET usuario_id = NEW.id,
        nombre = COALESCE(nombre, NEW.nombre),
        apellido = COALESCE(apellido, NEW.apellido),
        tipo_documento = COALESCE(tipo_documento, NEW.tipo_documento),
        documento = COALESCE(documento, NEW.documento),
        telefono = COALESCE(NEW.telefono, telefono),
        direccion = COALESCE(NEW.direccion, direccion),
        estado = COALESCE(NEW.estado, estado),
        updated_at = CURRENT_TIMESTAMP
    WHERE usuario_id IS NULL
      AND email IS NOT NULL
      AND LOWER(email) = LOWER(NEW.email);

    IF NOT EXISTS (SELECT 1 FROM clientes WHERE usuario_id = NEW.id) THEN
      INSERT INTO clientes (
        usuario_id,
        nombre,
        apellido,
        tipo_documento,
        documento,
        telefono,
        email,
        direccion,
        estado
      ) VALUES (
        NEW.id,
        NEW.nombre,
        NEW.apellido,
        NEW.tipo_documento,
        NEW.documento,
        NEW.telefono,
        NEW.email,
        NEW.direccion,
        COALESCE(NEW.estado, 'Activo')
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_cliente_from_usuario ON usuarios;

CREATE TRIGGER trg_sync_cliente_from_usuario
AFTER INSERT OR UPDATE OF rol_id, nombre, apellido, tipo_documento, documento, telefono, email, direccion, estado
ON usuarios
FOR EACH ROW
EXECUTE FUNCTION sync_cliente_from_usuario();
