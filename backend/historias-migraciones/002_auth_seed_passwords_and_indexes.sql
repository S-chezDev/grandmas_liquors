-- Normaliza contraseñas de usuarios semilla para login real con bcrypt
UPDATE usuarios SET password_hash = '$2b$10$4GJ/dyScA5T.oe5YXNh7ROx56KVYDkdLmQNcOpOGz3v3Hw7/XCHny' WHERE email = 'admin@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$5tQd1StaI0uEPVpKh8pcNO6ERWJuZXVcA8qSVHY3w4cxKAkzs3Qz.' WHERE email = 'asesor@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$vKe0cbnBT4BF7Xsu/.icPefxJGx8LwrYyV924uYvIcLo19/Nt0NX.' WHERE email = 'productor@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$xLA7gMJp3iyU2kAJQaE9auEcqCrtZXpH9t3Vv59IWvH8KACUReYDG' WHERE email = 'repartidor@grandmas.com';
UPDATE usuarios SET password_hash = '$2b$10$fqDuOAL0nDlyypAENBdxTeY/KDrg0k69JrjVSH8DIgJKyKkkWvh.K' WHERE email = 'cliente@grandmas.com';

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
