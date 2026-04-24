-- Agrega historial de cambios para usuarios.

CREATE TABLE IF NOT EXISTS usuarios_auditoria (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER,
  accion VARCHAR(20) NOT NULL,
  actor_id INTEGER,
  cambios JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
