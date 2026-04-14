-- Registra sesiones activas de usuarios para controlar cambios de estado.

CREATE TABLE IF NOT EXISTS usuarios_sesiones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  jti VARCHAR(120) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_sesiones_usuario_activa
  ON usuarios_sesiones (usuario_id, revoked_at, expires_at);
