-- Normaliza datos existentes para mantener estructura semantica y tipos consistentes.
-- Esta migracion es idempotente: puede ejecutarse varias veces sin efectos adversos.

-- =========================
-- Normalizacion de identidad/contacto
-- =========================

-- Emails en minuscula y sin espacios.
UPDATE usuarios
SET email = LOWER(TRIM(email))
WHERE email IS NOT NULL
  AND email <> LOWER(TRIM(email));

UPDATE clientes
SET email = LOWER(TRIM(email))
WHERE email IS NOT NULL
  AND email <> LOWER(TRIM(email));

UPDATE proveedores
SET email = LOWER(TRIM(email))
WHERE email IS NOT NULL
  AND email <> LOWER(TRIM(email));

-- Documentos y telefonos con formato numerico estandar.
UPDATE usuarios
SET tipo_documento = UPPER(TRIM(tipo_documento)),
    documento = REGEXP_REPLACE(TRIM(documento), '[^0-9]', '', 'g'),
    telefono = NULLIF(REGEXP_REPLACE(TRIM(COALESCE(telefono, '')), '[^0-9+]', '', 'g'), '')
WHERE TRUE;

UPDATE clientes
SET tipo_documento = UPPER(TRIM(tipo_documento)),
    documento = REGEXP_REPLACE(TRIM(documento), '[^0-9]', '', 'g'),
    telefono = NULLIF(REGEXP_REPLACE(TRIM(COALESCE(telefono, '')), '[^0-9+]', '', 'g'), '')
WHERE TRUE;

UPDATE proveedores
SET tipo_documento = NULLIF(UPPER(TRIM(COALESCE(tipo_documento, ''))), ''),
    numero_documento = NULLIF(REGEXP_REPLACE(TRIM(COALESCE(numero_documento, '')), '[^0-9]', '', 'g'), ''),
    telefono = NULLIF(REGEXP_REPLACE(TRIM(COALESCE(telefono, '')), '[^0-9+]', '', 'g'), ''),
    tipo_persona = CASE
      WHEN LOWER(TRIM(COALESCE(tipo_persona, ''))) IN ('natural') THEN 'Natural'
      WHEN LOWER(TRIM(COALESCE(tipo_persona, ''))) IN ('juridica', 'juridica', 'jurídica') THEN 'Juridica'
      ELSE NULLIF(TRIM(tipo_persona), '')
    END
WHERE TRUE;

-- Campos opcionales vacios a NULL para mantener consistencia.
UPDATE clientes
SET direccion = NULLIF(TRIM(COALESCE(direccion, '')), ''),
    foto_url = NULLIF(TRIM(COALESCE(foto_url, '')), '')
WHERE TRUE;

UPDATE usuarios
SET direccion = NULLIF(TRIM(COALESCE(direccion, '')), '')
WHERE TRUE;

UPDATE proveedores
SET direccion = NULLIF(TRIM(COALESCE(direccion, '')), ''),
    nombre_empresa = NULLIF(TRIM(COALESCE(nombre_empresa, '')), ''),
    nit = NULLIF(TRIM(COALESCE(nit, '')), ''),
    nombre = NULLIF(TRIM(COALESCE(nombre, '')), ''),
    apellido = NULLIF(TRIM(COALESCE(apellido, '')), '')
WHERE TRUE;

-- =========================
-- Normalizacion de estados
-- =========================

-- Estados base con activo/inactivo.
UPDATE roles
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

UPDATE categorias
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

UPDATE productos
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

UPDATE clientes
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

UPDATE proveedores
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

UPDATE insumos
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

UPDATE usuarios
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('activo', 'activa') THEN 'Activo'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('inactivo', 'inactiva') THEN 'Inactivo'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Activo')
END
WHERE TRUE;

-- Estados transaccionales.
UPDATE pedidos
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('pendiente') THEN 'Pendiente'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('en proceso', 'enproceso', 'en_proceso') THEN 'En Proceso'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('completado', 'completada', 'entregado') THEN 'Completado'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('cancelado', 'cancelada', 'anulado', 'anulada') THEN 'Cancelado'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Pendiente')
END
WHERE TRUE;

UPDATE domicilios
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('pendiente') THEN 'Pendiente'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('en camino', 'encamino') THEN 'En Camino'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('entregado', 'completado', 'completada') THEN 'Entregado'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('cancelado', 'cancelada', 'anulado', 'anulada') THEN 'Cancelado'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Pendiente')
END
WHERE TRUE;

UPDATE ventas
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('pendiente') THEN 'Pendiente'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('completada', 'completado', 'entregado') THEN 'Completada'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('anulada', 'anulado') THEN 'Anulada'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('cancelada', 'cancelado') THEN 'Cancelada'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Completada')
END
WHERE TRUE;

UPDATE compras
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('pendiente') THEN 'Pendiente'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('recibida', 'completada', 'completado') THEN 'Recibida'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('cancelada', 'cancelado') THEN 'Cancelada'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('anulada', 'anulado') THEN 'Anulada'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Pendiente')
END
WHERE TRUE;

UPDATE produccion
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('pendiente') THEN 'Pendiente'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('en proceso', 'enproceso', 'en_proceso') THEN 'En Proceso'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('completada', 'completado', 'entregado') THEN 'Completada'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('cancelada', 'cancelado', 'anulada', 'anulado') THEN 'Cancelada'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Pendiente')
END
WHERE TRUE;

UPDATE abonos
SET estado = CASE
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('registrado') THEN 'Registrado'
  WHEN LOWER(TRIM(COALESCE(estado, ''))) IN ('cancelada', 'cancelado', 'anulada', 'anulado') THEN 'Cancelado'
  ELSE COALESCE(NULLIF(TRIM(estado), ''), 'Registrado')
END
WHERE TRUE;

-- =========================
-- Normalizacion de metodo de pago
-- =========================

UPDATE ventas
SET metodopago = CASE
  WHEN LOWER(TRIM(COALESCE(metodopago, ''))) IN ('efectivo') THEN 'Efectivo'
  WHEN LOWER(TRIM(COALESCE(metodopago, ''))) IN ('transferencia', 'transferencia bancaria') THEN 'Transferencia'
  WHEN LOWER(TRIM(COALESCE(metodopago, ''))) IN ('contraentrega', 'contra entrega') THEN 'Contraentrega'
  WHEN LOWER(TRIM(COALESCE(metodopago, ''))) IN ('tarjeta', 'credito', 'crédito', 'debito', 'débito') THEN 'Tarjeta'
  WHEN LOWER(TRIM(COALESCE(metodopago, ''))) IN ('nequi') THEN 'Nequi'
  WHEN LOWER(TRIM(COALESCE(metodopago, ''))) IN ('daviplata') THEN 'Daviplata'
  ELSE COALESCE(NULLIF(INITCAP(TRIM(COALESCE(metodopago, ''))), ''), 'Efectivo')
END
WHERE TRUE;

UPDATE abonos
SET metodo_pago = CASE
  WHEN LOWER(TRIM(COALESCE(metodo_pago, ''))) IN ('efectivo') THEN 'Efectivo'
  WHEN LOWER(TRIM(COALESCE(metodo_pago, ''))) IN ('transferencia', 'transferencia bancaria') THEN 'Transferencia'
  WHEN LOWER(TRIM(COALESCE(metodo_pago, ''))) IN ('contraentrega', 'contra entrega') THEN 'Contraentrega'
  WHEN LOWER(TRIM(COALESCE(metodo_pago, ''))) IN ('tarjeta', 'credito', 'crédito', 'debito', 'débito') THEN 'Tarjeta'
  WHEN LOWER(TRIM(COALESCE(metodo_pago, ''))) IN ('nequi') THEN 'Nequi'
  WHEN LOWER(TRIM(COALESCE(metodo_pago, ''))) IN ('daviplata') THEN 'Daviplata'
  ELSE COALESCE(NULLIF(INITCAP(TRIM(COALESCE(metodo_pago, ''))), ''), 'Efectivo')
END
WHERE TRUE;
