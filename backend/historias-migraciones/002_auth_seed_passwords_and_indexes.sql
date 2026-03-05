-- Normaliza contraseñas de usuarios semilla para login real con bcrypt
UPDATE usuarios SET password_hash = '$2b$10$daRpprFSigFXU34AXr373.Gvdt0RlgdxpfUQVJfEVryy9GelL44D.' WHERE email = 'admin@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$fCleeax8rmS4IUK0r8EGIeUqiIPwvOFnwtZcEwkSNwyYxPdXTAJgi' WHERE email = 'asesor@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$BqMzPs/8cfg.zBsMFN74BO.DvY6tLytfLC9bTHguSrRS9D/fvHlmC' WHERE email = 'productor@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$0Vp0jalq0.0S/vJGca7clOMzV56viKWQ7gFZ9JDv/EiHUeIMenwCS' WHERE email = 'repartidor@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$eWo/CIcCUCYGPLz6FjfH..KqPEDBbRWOlfKkZNkyEQACGsyC3Wn8O' WHERE email = 'cliente@grandmas.com';

-- Asegura unicidad de email en clientes (solo cuando no es null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_email_unique
ON clientes (LOWER(email))
WHERE email IS NOT NULL;

-- Asegura unicidad case-insensitive de usuarios por email
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email_unique_lower
ON usuarios (LOWER(email));

-- Mejora consulta por documento de cliente
CREATE INDEX IF NOT EXISTS idx_clientes_documento_lookup
ON clientes (documento);
