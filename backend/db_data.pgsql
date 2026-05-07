-- ========================================
-- Grandmas Liquors — esquema + seed de DEMOSTRACIÓN
-- Misma DDL que db.pgsql, más datos de ejemplo (categorías, productos,
-- pedidos, ventas, domicilio, compra, insumo, producción).
-- Incluye además usuario productor@grandmas.com (contraseña productor123).
-- Para un entorno limpio use solo backend/db.pgsql.
-- ========================================

DROP TABLE IF EXISTS schema_migrations CASCADE;
DROP TABLE IF EXISTS usuarios_login_intentos CASCADE;
DROP TABLE IF EXISTS usuarios_password_resets CASCADE;
DROP TABLE IF EXISTS usuarios_password_historial CASCADE;
DROP TABLE IF EXISTS usuarios_backup CASCADE;
DROP TABLE IF EXISTS usuarios_sesiones CASCADE;
DROP TABLE IF EXISTS usuarios_auditoria CASCADE;
DROP TABLE IF EXISTS roles_auditoria CASCADE;
DROP TABLE IF EXISTS proveedores_auditoria CASCADE;
DROP TABLE IF EXISTS compras_estado_historial CASCADE;
DROP TABLE IF EXISTS productos_auditoria CASCADE;
DROP TABLE IF EXISTS categorias_auditoria CASCADE;
DROP TABLE IF EXISTS clientes_auditoria CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS detalle_compras CASCADE;
DROP TABLE IF EXISTS detalle_pedidos CASCADE;
DROP TABLE IF EXISTS producto_insumos CASCADE;
DROP TABLE IF EXISTS entregas_insumos CASCADE;
DROP TABLE IF EXISTS produccion CASCADE;
DROP TABLE IF EXISTS domicilios CASCADE;
DROP TABLE IF EXISTS abonos CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS compras CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS insumos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ========================================
-- TABLA: roles
-- ========================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos TEXT[],
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: schema_migrations
-- ========================================
CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) UNIQUE,
    version VARCHAR(255) UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: categorias (con UNIQUE nombre)
-- ========================================
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: productos (nombre UNIQUE, FK RESTRICT categorias)
-- ========================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    descripcion TEXT,
    precio DECIMAL(18,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 10,
    imagen_url VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'Activo',
    tipo_producto VARCHAR(30) NOT NULL DEFAULT 'terminado'
        CHECK (tipo_producto IN ('terminado','preparacion')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: usuarios
-- ========================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: clientes (FK usuario_id RESTRICT)
-- ========================================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE RESTRICT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    foto_url VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: proveedores
-- ========================================
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    tipo_persona VARCHAR(20) NOT NULL,
    nombre_empresa VARCHAR(150),
    nit VARCHAR(20),
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(20),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    estado VARCHAR(20) DEFAULT 'Activo',
    preferente BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: pedidos (FK cliente_id RESTRICT)
-- ========================================
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    fecha_entrega DATE,
    detalles TEXT,
    total DECIMAL(10,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    metodo_pago VARCHAR(50) DEFAULT 'Efectivo',
    esquema_abono VARCHAR(20) DEFAULT '100%',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_pedidos
-- ========================================
CREATE TABLE detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: ventas (FK cliente_id RESTRICT)
-- ========================================
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE RESTRICT,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    metodopago VARCHAR(50),
    metodo_pago VARCHAR(50),
    esquema_abono VARCHAR(20),
    abono_recibido DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Completada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_ventas
-- ========================================
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(18,2) NOT NULL,
    subtotal DECIMAL(18,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: abonos (FK cliente_id RESTRICT)
-- ========================================
CREATE TABLE abonos (
    id SERIAL PRIMARY KEY,
    numero_abono VARCHAR(50) UNIQUE NOT NULL,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Registrado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: domicilios (FK cliente_id RESTRICT, repartidor_id, motivo_cancelacion)
-- ========================================
CREATE TABLE domicilios (
    id SERIAL PRIMARY KEY,
    numero_domicilio VARCHAR(50) UNIQUE NOT NULL,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    direccion TEXT NOT NULL,
    repartidor VARCHAR(100),
    repartidor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    hora TIME,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    detalle TEXT,
    motivo_cancelacion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: compras
-- ========================================
CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    numero_compra VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(18,2) DEFAULT 0,
    iva DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL,
    observaciones TEXT,
    requiere_aprobacion BOOLEAN DEFAULT FALSE,
    aprobacion_extraordinaria BOOLEAN DEFAULT FALSE,
    motivo_aprobacion TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_compras (CHECK porcentaje_ganancia >= 0)
-- ========================================
CREATE TABLE detalle_compras (
    id SERIAL PRIMARY KEY,
    compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(18,2) NOT NULL,
    subtotal DECIMAL(18,2) NOT NULL,
    porcentaje_ganancia NUMERIC(12,2) DEFAULT 0 CHECK (porcentaje_ganancia >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: insumos (con ultimo_operario_id y ultima_fecha)
-- ========================================
CREATE TABLE insumos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    cantidad DECIMAL(10,2) DEFAULT 0,
    unidad VARCHAR(20) NOT NULL,
    stock_minimo DECIMAL(10,2) DEFAULT 10,
    estado VARCHAR(20) DEFAULT 'Activo',
    ultimo_operario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    ultima_fecha TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: producto_insumos (receta)
-- ========================================
CREATE TABLE producto_insumos (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    insumo_id INTEGER NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
    cantidad_requerida DECIMAL(12,4) NOT NULL CHECK (cantidad_requerida > 0),
    unidad VARCHAR(20) NOT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (producto_id, insumo_id)
);

-- ========================================
-- TABLA: entregas_insumos
-- ========================================
CREATE TABLE entregas_insumos (
    id SERIAL PRIMARY KEY,
    numero_entrega VARCHAR(50) UNIQUE NOT NULL,
    insumo_id INTEGER NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    operario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    hora TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: produccion (nuevo CHECK de estados, productor_id)
-- ========================================
CREATE TABLE produccion (
    id SERIAL PRIMARY KEY,
    numero_produccion VARCHAR(50) UNIQUE NOT NULL,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha DATE NOT NULL,
    productor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    tiempo_preparacion_minutos INTEGER DEFAULT 1 CHECK (tiempo_preparacion_minutos > 0),
    estado VARCHAR(30) DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente','En Proceso','Completada','Cancelada')),
    notes TEXT,
    insumos_gastados JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLAS DE AUDITORÍA
-- ========================================
CREATE TABLE productos_auditoria (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias_auditoria (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes_auditoria (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proveedores_auditoria (
    id SERIAL PRIMARY KEY,
    proveedor_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compras_estado_historial (
    id SERIAL PRIMARY KEY,
    compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    motivo TEXT,
    usuario_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles_auditoria (
    id SERIAL PRIMARY KEY,
    rol_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    actor_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_sesiones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    jti VARCHAR(120) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(64),
    user_agent TEXT
);

CREATE TABLE usuarios_backup (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    actor_id INTEGER,
    reason TEXT,
    snapshot JSONB NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_password_historial (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_password_resets (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_login_intentos (
    email VARCHAR(255) PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 0,
    blocked_until TIMESTAMP NULL,
    last_attempt_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- FUNCIONES Y TRIGGERS DE SINCRONIZACIÓN
-- ========================================

-- 1. Trigger: sync_cliente_from_usuario (crea/actualiza cliente cuando se crea/edita un usuario Cliente)
CREATE OR REPLACE FUNCTION sync_cliente_from_usuario()
RETURNS TRIGGER AS $$
DECLARE
    cliente_role_id INTEGER;
BEGIN
    SELECT id INTO cliente_role_id FROM roles WHERE nombre = 'Cliente' LIMIT 1;
    IF cliente_role_id IS NULL THEN RETURN NEW; END IF;
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
                usuario_id, nombre, apellido, tipo_documento, documento, telefono, email, direccion, estado
            ) VALUES (
                NEW.id, NEW.nombre, NEW.apellido, NEW.tipo_documento, NEW.documento,
                NEW.telefono, NEW.email, NEW.direccion, COALESCE(NEW.estado,'Activo')
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_cliente_from_usuario ON usuarios;
CREATE TRIGGER trg_sync_cliente_from_usuario
    AFTER INSERT OR UPDATE OF rol_id, nombre, apellido, tipo_documento, documento, telefono, email, direccion, estado
    ON usuarios FOR EACH ROW EXECUTE FUNCTION sync_cliente_from_usuario();

-- 2. Trigger: sync_domicilio_to_venta_pedido (completa venta y pedido cuando el domicilio se entrega)
CREATE OR REPLACE FUNCTION sync_domicilio_to_venta_pedido()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'Entregado' AND OLD.estado <> 'Entregado' THEN
        -- Actualizar la venta relacionada a Completada
        UPDATE ventas
        SET estado = 'Completada',
            updated_at = CURRENT_TIMESTAMP
        WHERE pedido_id = NEW.pedido_id
          AND tipo = 'Por Pedido'
          AND estado = 'Pendiente';

        -- Actualizar el pedido a Completado
        UPDATE pedidos
        SET estado = 'Completado',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.pedido_id
          AND estado <> 'Completado'
          AND estado <> 'Cancelado';

        -- Actualizar el abono a 'Aplicado' si estaba Registrado
        UPDATE abonos
        SET estado = 'Aplicado',
            updated_at = CURRENT_TIMESTAMP
        WHERE pedido_id = NEW.pedido_id
          AND estado = 'Registrado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_domicilio ON domicilios;
CREATE TRIGGER trg_sync_domicilio
    AFTER UPDATE OF estado ON domicilios
    FOR EACH ROW EXECUTE FUNCTION sync_domicilio_to_venta_pedido();

-- ========================================
-- VALIDACIÓN DE DEPENDENCIAS PARA INACTIVACIÓN
-- ========================================
CREATE OR REPLACE FUNCTION check_inactivacion(
    p_tipo VARCHAR,
    p_id INTEGER
) RETURNS JSONB AS $$
DECLARE
    v_count INTEGER;
    v_motivo TEXT := '';
BEGIN
    CASE p_tipo
        WHEN 'usuario' THEN
            SELECT COUNT(*) INTO v_count
            FROM pedidos
            WHERE cliente_id IN (SELECT id FROM clientes WHERE usuario_id = p_id)
              AND estado NOT IN ('Completado','Cancelado');
            IF v_count > 0 THEN v_motivo := 'El usuario tiene ' || v_count || ' pedido(s) pendiente(s).'; END IF;

            IF v_motivo = '' THEN
                SELECT COUNT(*) INTO v_count
                FROM domicilios
                WHERE cliente_id IN (SELECT id FROM clientes WHERE usuario_id = p_id)
                  AND estado NOT IN ('Entregado','Cancelado');
                IF v_count > 0 THEN v_motivo := 'El usuario tiene ' || v_count || ' domicilio(s) pendiente(s).'; END IF;
            END IF;

            IF v_motivo = '' THEN
                SELECT COUNT(*) INTO v_count
                FROM abonos
                WHERE cliente_id IN (SELECT id FROM clientes WHERE usuario_id = p_id)
                  AND estado <> 'Aplicado';
                IF v_count > 0 THEN v_motivo := 'El usuario tiene ' || v_count || ' abono(s) pendiente(s).'; END IF;
            END IF;

        WHEN 'cliente' THEN
            SELECT COUNT(*) INTO v_count FROM pedidos WHERE cliente_id = p_id AND estado NOT IN ('Completado','Cancelado');
            IF v_count > 0 THEN v_motivo := 'El cliente tiene ' || v_count || ' pedido(s) pendiente(s).'; END IF;

            IF v_motivo = '' THEN
                SELECT COUNT(*) INTO v_count FROM domicilios WHERE cliente_id = p_id AND estado NOT IN ('Entregado','Cancelado');
                IF v_count > 0 THEN v_motivo := 'El cliente tiene ' || v_count || ' domicilio(s) pendiente(s).'; END IF;
            END IF;

            IF v_motivo = '' THEN
                SELECT COUNT(*) INTO v_count FROM ventas WHERE cliente_id = p_id AND estado = 'Pendiente';
                IF v_count > 0 THEN v_motivo := 'El cliente tiene ' || v_count || ' venta(s) pendiente(s).'; END IF;
            END IF;

        WHEN 'proveedor' THEN
            SELECT COUNT(*) INTO v_count
            FROM compras
            WHERE proveedor_id = p_id
              AND estado IN ('Pendiente','Recibida');
            IF v_count > 0 THEN v_motivo := 'El proveedor tiene ' || v_count || ' compra(s) en proceso o pendiente(s).'; END IF;

        WHEN 'producto' THEN
            SELECT COUNT(*) INTO v_count
            FROM detalle_pedidos dp
            JOIN pedidos p ON dp.pedido_id = p.id
            WHERE dp.producto_id = p_id
              AND p.estado NOT IN ('Completado','Cancelado');
            IF v_count > 0 THEN v_motivo := 'El producto está en ' || v_count || ' pedido(s) activo(s).'; END IF;

            IF v_motivo = '' THEN
                SELECT COUNT(*) INTO v_count
                FROM produccion
                WHERE producto_id = p_id
                  AND estado NOT IN ('Completada','Cancelada');
                IF v_count > 0 THEN v_motivo := 'El producto está en ' || v_count || ' orden(es) de producción activa(s).'; END IF;
            END IF;

        WHEN 'categoria' THEN
            SELECT COUNT(*) INTO v_count FROM productos WHERE categoria_id = p_id AND estado = 'Activo';
            IF v_count > 0 THEN v_motivo := 'La categoría tiene ' || v_count || ' producto(s) activo(s). Inactívelos primero.'; END IF;

        ELSE
            v_motivo := 'Tipo no soportado.';
    END CASE;

    IF v_motivo = '' THEN
        RETURN jsonb_build_object('permitido', true, 'motivo', '');
    ELSE
        RETURN jsonb_build_object('permitido', false, 'motivo', v_motivo);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ÍNDICES (se incluyen los nuevos para rendimiento)
-- ========================================
CREATE INDEX idx_roles_nombre ON roles(nombre);
CREATE INDEX idx_roles_estado ON roles(estado);
CREATE INDEX idx_usuarios_documento ON usuarios(documento);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);
CREATE INDEX idx_usuarios_rol_estado ON usuarios(rol_id, estado);
CREATE UNIQUE INDEX idx_usuarios_email_unique_lower ON usuarios(LOWER(email));
CREATE INDEX idx_usuarios_sesiones_usuario_activa ON usuarios_sesiones(usuario_id, revoked_at, expires_at);
CREATE INDEX idx_usuarios_password_historial_usuario ON usuarios_password_historial(usuario_id, created_at DESC);
CREATE INDEX idx_usuarios_password_resets_usuario ON usuarios_password_resets(usuario_id, created_at DESC);
CREATE INDEX idx_usuarios_password_resets_token ON usuarios_password_resets(token_hash);
CREATE INDEX idx_usuarios_auditoria_usuario_fecha ON usuarios_auditoria(usuario_id, created_at DESC);
CREATE INDEX idx_proveedores_auditoria_proveedor_fecha ON proveedores_auditoria(proveedor_id, created_at DESC);
CREATE INDEX idx_roles_auditoria_rol_fecha ON roles_auditoria(rol_id, created_at DESC);
CREATE INDEX idx_compras_estado_historial_compra_fecha ON compras_estado_historial(compra_id, created_at DESC);
CREATE INDEX idx_productos_auditoria_producto_fecha ON productos_auditoria(producto_id, created_at DESC);
CREATE INDEX idx_categorias_auditoria_categoria_fecha ON categorias_auditoria(categoria_id, created_at DESC);
CREATE INDEX idx_clientes_auditoria_cliente_fecha ON clientes_auditoria(cliente_id, created_at DESC);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_estado ON productos(estado);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_clientes_documento ON clientes(documento);
CREATE INDEX idx_clientes_estado ON clientes(estado);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE UNIQUE INDEX idx_clientes_email_unique ON clientes(LOWER(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_clientes_usuario_id_unique ON clientes(usuario_id) WHERE usuario_id IS NOT NULL;
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha DESC);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_cliente_fecha ON pedidos(cliente_id, fecha DESC);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_pedido ON ventas(pedido_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha DESC);
CREATE INDEX idx_ventas_cliente_fecha ON ventas(cliente_id, fecha DESC);
CREATE INDEX idx_compras_fecha ON compras(fecha DESC);
CREATE INDEX idx_compras_proveedor_fecha ON compras(proveedor_id, fecha DESC);
CREATE INDEX idx_producto_insumos_producto ON producto_insumos(producto_id);
CREATE INDEX idx_producto_insumos_insumo ON producto_insumos(insumo_id);
CREATE INDEX idx_entregas_insumos_fecha ON entregas_insumos(fecha DESC);
CREATE INDEX idx_produccion_fecha ON produccion(fecha DESC);
CREATE INDEX idx_produccion_pedido ON produccion(pedido_id);
CREATE INDEX idx_produccion_productor ON produccion(productor_id);
CREATE INDEX idx_detalle_pedidos_pedido ON detalle_pedidos(pedido_id);
CREATE INDEX idx_detalle_ventas_venta ON detalle_ventas(venta_id);
CREATE INDEX idx_detalle_compras_compra ON detalle_compras(compra_id);
CREATE INDEX idx_abonos_pedido ON abonos(pedido_id);
CREATE INDEX idx_abonos_fecha ON abonos(fecha DESC);
CREATE INDEX idx_abonos_cliente_fecha ON abonos(cliente_id, fecha DESC);
CREATE INDEX idx_domicilios_pedido ON domicilios(pedido_id);
CREATE INDEX idx_domicilios_fecha ON domicilios(fecha DESC);
CREATE INDEX idx_domicilios_cliente_fecha ON domicilios(cliente_id, fecha DESC);
CREATE INDEX idx_domicilios_repartidor ON domicilios(repartidor_id);
CREATE INDEX idx_insumos_operario ON insumos(ultimo_operario_id);
CREATE INDEX idx_proveedores_nit ON proveedores(nit);
CREATE INDEX idx_proveedores_numero_documento ON proveedores(numero_documento);
CREATE INDEX idx_proveedores_email_lower ON proveedores(LOWER(COALESCE(email, '')));
CREATE INDEX idx_proveedores_telefono_digits ON proveedores((regexp_replace(COALESCE(telefono, ''), '\\D', '', 'g')));

-- ========================================
-- Catálogo de roles (referencia obligatoria; la app espera estos nombres)
-- ========================================
INSERT INTO roles (nombre, descripcion, permisos, estado) VALUES
('Administrador', 'Acceso total al sistema',
 ARRAY['Ver Dashboard','Ver Usuarios','Crear Usuarios','Editar Usuarios','Eliminar Usuarios','Ver Roles','Asignar Permisos','Ver Proveedores','Crear Proveedores','Editar Proveedores','Ver Compras','Registrar Compras','Anular Compras','Ver Productos','Crear Productos','Editar Productos','Ver Categorías','Crear Categorías','Ver Insumos','Entregar Insumos','Ver Producción','Registrar Producción','Ver Clientes','Crear Clientes','Editar Clientes','Ver Ventas','Registrar Ventas','Anular Ventas','Ver Abonos','Registrar Abonos','Ver Pedidos','Crear Pedidos','Ver Domicilios','Gestionar Domicilios'],
 'Activo'),
('Asesor', 'Gestión de ventas y clientes',
 ARRAY['Ver Dashboard','Ver Clientes','Crear Clientes','Editar Clientes','Ver Ventas','Registrar Ventas','Ver Abonos','Registrar Abonos','Ver Pedidos','Crear Pedidos'],
 'Activo'),
('Repartidor', 'Gestión de domicilios',
 ARRAY['Ver Dashboard','Ver Domicilios','Gestionar Domicilios','Ver Pedidos'],
 'Activo'),
('Cliente', 'Acceso cliente',
 ARRAY['Ver Dashboard','Ver Tienda','Ver Mis Pedidos','Ver Mis Lista de Compras','Ver Mis Domicilios'],
 'Activo'),
('Productor', 'Producción e insumos',
 ARRAY['Ver Dashboard','Ver Insumos','Entregar Insumos','Ver Producción','Registrar Producción'],
 'Activo');

-- ========================================
-- Usuarios (único INSERT de datos operativos; crea cliente vía trigger si rol Cliente)
-- Contraseñas (todas bcrypt cost 10):
--   admin@grandmas.com        → admin123
--   asesor@grandmas.com       → asesor123
--   repartidor@grandmas.com   → repartidor123
--   domiciliario@grandmas.com → domicilio123  (rol Repartidor en la UI)
--   cliente@grandmas.com      → cliente123
-- ========================================
INSERT INTO usuarios (nombre, apellido, tipo_documento, documento, direccion, email, telefono, password_hash, rol_id, estado) VALUES
('Carlos', 'Rodríguez', 'CC', '1010123456', 'Carrera 50 #20-30, Bogotá', 'admin@grandmas.com', '3001234567', '$2b$10$4GJ/dyScA5T.oe5YXNh7ROx56KVYDkdLmQNcOpOGz3v3Hw7/XCHny', (SELECT id FROM roles WHERE nombre = 'Administrador' LIMIT 1), 'Activo'),
('María', 'González', 'CC', '1020234567', 'Calle 45 #12-15, Medellín', 'asesor@grandmas.com', '3009876543', '$2b$10$5tQd1StaI0uEPVpKh8pcNO6ERWJuZXVcA8qSVHY3w4cxKAkzs3Qz.', (SELECT id FROM roles WHERE nombre = 'Asesor' LIMIT 1), 'Activo'),
('Pedro', 'López', 'CC', '1040456789', 'Calle 10 #5-10, Barranquilla', 'repartidor@grandmas.com', '3207654321', '$2b$10$xLA7gMJp3iyU2kAJQaE9auEcqCrtZXpH9t3Vv59IWvH8KACUReYDG', (SELECT id FROM roles WHERE nombre = 'Repartidor' LIMIT 1), 'Activo'),
('Diego', 'Ramírez', 'CC', '1040456790', 'Calle 11 #6-11, Barranquilla', 'domiciliario@grandmas.com', '3207654322', '$2b$10$bscbZDQbVgYIXwoVpPrfS.jPet01mPTPgcg6GMMZR0fQJ/lGoFxPq', (SELECT id FROM roles WHERE nombre = 'Repartidor' LIMIT 1), 'Activo'),
('Ana', 'Pérez', 'CC', '1050567890', 'Carrera 7 #14-25, Bogotá', 'cliente@grandmas.com', '3156543210', '$2b$10$fqDuOAL0nDlyypAENBdxTeY/KDrg0k69JrjVSH8DIgJKyKkkWvh.K', (SELECT id FROM roles WHERE nombre = 'Cliente' LIMIT 1), 'Activo');

-- ========================================
-- Usuario demo adicional para módulo Producción / Insumos
-- productor@grandmas.com / productor123
-- ========================================
INSERT INTO usuarios (nombre, apellido, tipo_documento, documento, direccion, email, telefono, password_hash, rol_id, estado) VALUES
('Luis', 'Molina', 'CC', '1060678901', 'Medellín', 'productor@grandmas.com', '3112223344', '$2b$10$WCtiYG5bo55Kl9NdjblUM.mXNuhuB.1izMo6L.yl3UpO2u3RBNjLe', (SELECT id FROM roles WHERE nombre = 'Productor' LIMIT 1), 'Activo');

-- ========================================
-- Catálogo demo
-- ========================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Whisky', 'Ejemplos de licores demo'),
('Vodka', 'Destilados demo'),
('Cerveza', 'Cervezas demo');

INSERT INTO productos (nombre, categoria_id, descripcion, precio, stock, stock_minimo, estado, tipo_producto) VALUES
('Whisky Reserva Demo 750ml', (SELECT id FROM categorias WHERE nombre = 'Whisky' LIMIT 1), 'Etiqueta reserva ejemplo', 245000.00, 52, 4, 'Activo', 'terminado'),
('Vodka Premium Demo 750ml', (SELECT id FROM categorias WHERE nombre = 'Vodka' LIMIT 1), 'Destilación triple demo', 89500.00, 76, 6, 'Activo', 'terminado'),
('Sixpack IPA Demo 330ml', (SELECT id FROM categorias WHERE nombre = 'Cerveza' LIMIT 1), 'Artesanal muestra QA', 12000.00, 144, 12, 'Activo', 'terminado');

-- ========================================
-- Proveedores y cliente sin cuenta (punto mostrador)
-- ========================================
INSERT INTO proveedores (tipo_persona, nombre_empresa, nit, nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, estado)
VALUES
('Juridica', 'Distribuidora Licores Centro SA', '9005554455', NULL, NULL, NULL, NULL, '6019876600', 'compras@distdemo.gl', 'Zona Industrial, Bogotá', 'Activo'),
('Natural', NULL, NULL, 'Carlos', 'Vega Mercado', 'CC', '7980123456', '3147650099', NULL, 'Calle 80 #45, Bogotá', 'Activo');

INSERT INTO clientes (usuario_id, nombre, apellido, tipo_documento, documento, telefono, email, direccion, estado) VALUES
(NULL, 'Jorge', 'Martínez', 'CC', '1090876543', '3115559900', 'jorge.demo@grandmas.local', 'Calle 100 #45-20', 'Activo');

-- ========================================
-- Pedido + detalle + venta asociada (cliente Ana / cliente@grandmas.com)
-- ========================================
INSERT INTO pedidos (numero_pedido, cliente_id, fecha, fecha_entrega, detalles, total, estado, metodo_pago, esquema_abono)
SELECT 'PED-DEMO-0001', c.id, CURRENT_DATE - 2, CURRENT_DATE + 3, 'Pedido demo QA', 191000.00, 'Pendiente', 'Efectivo', '50%'
FROM clientes c
JOIN usuarios u ON c.usuario_id = u.id
WHERE u.email = 'cliente@grandmas.com'
LIMIT 1;

INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT p.id, pr.id, 2, 89500.00, 179000.00
FROM pedidos p, productos pr
WHERE p.numero_pedido = 'PED-DEMO-0001' AND pr.nombre = 'Vodka Premium Demo 750ml';

INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT p.id, pr.id, 1, 12000.00, 12000.00
FROM pedidos p, productos pr
WHERE p.numero_pedido = 'PED-DEMO-0001' AND pr.nombre = 'Sixpack IPA Demo 330ml';

INSERT INTO ventas (numero_venta, tipo, cliente_id, pedido_id, fecha, metodopago, metodo_pago, esquema_abono, abono_recibido, total, estado)
SELECT 'VEN-DEMO-PED-PEND',
  'Por Pedido',
  p.cliente_id,
  p.id,
  CURRENT_DATE,
  'Transferencia',
  'Transferencia',
  '50%',
  95500.00,
  191000.00,
  'Pendiente'
FROM pedidos p WHERE p.numero_pedido = 'PED-DEMO-0001';

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, pr.id, 2, 89500.00, 179000.00
FROM ventas v, productos pr
WHERE v.numero_venta = 'VEN-DEMO-PED-PEND' AND pr.nombre = 'Vodka Premium Demo 750ml';

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, pr.id, 1, 12000.00, 12000.00
FROM ventas v, productos pr
WHERE v.numero_venta = 'VEN-DEMO-PED-PEND' AND pr.nombre = 'Sixpack IPA Demo 330ml';

INSERT INTO abonos (numero_abono, pedido_id, cliente_id, monto, fecha, metodo_pago, estado)
SELECT 'ABO-DEMO-0001', p.id, p.cliente_id, 95500.00, CURRENT_DATE - 1, 'Transferencia', 'Registrado'
FROM pedidos p WHERE p.numero_pedido = 'PED-DEMO-0001';

INSERT INTO domicilios (numero_domicilio, pedido_id, cliente_id, direccion, repartidor, repartidor_id, fecha, hora, estado, detalle)
SELECT 'DOM-DEMO-0001',
  p.id,
  p.cliente_id,
  'Carrera 7 #14-25, Bogotá',
  'Pedro López',
  ur.id,
  CURRENT_DATE + 2,
  '17:30:00',
  'Pendiente',
  'Entrega ventana tarde.'
FROM pedidos p
JOIN usuarios ur ON ur.email = 'repartidor@grandmas.com'
WHERE p.numero_pedido = 'PED-DEMO-0001';

-- ========================================
-- Venta directa (cliente Jorge) + compra a proveedor
-- ========================================
INSERT INTO ventas (numero_venta, tipo, cliente_id, pedido_id, fecha, metodopago, metodo_pago, esquema_abono, abono_recibido, total, estado)
SELECT 'VEN-DEMO-DIRECT-01',
  'Directa',
  c.id,
  NULL,
  CURRENT_DATE - 5,
  'Efectivo',
  'Efectivo',
  '100%',
  245000.00,
  245000.00,
  'Completada'
FROM clientes c WHERE c.email = 'jorge.demo@grandmas.local' LIMIT 1;

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, pr.id, 1, 245000.00, 245000.00
FROM ventas v, productos pr
WHERE v.numero_venta = 'VEN-DEMO-DIRECT-01' AND pr.nombre = 'Whisky Reserva Demo 750ml';

INSERT INTO compras (numero_compra, proveedor_id, fecha, subtotal, iva, total, observaciones, estado)
SELECT 'COM-DEMO-0001',
  (SELECT id FROM proveedores WHERE nit = '9005554455' LIMIT 1),
  CURRENT_DATE - 7,
  179000.00,
  34010.00,
  213010.00,
  'Reposición inventario QA',
  'Recibida';

INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal, porcentaje_ganancia)
SELECT c.id,
  (SELECT id FROM productos WHERE nombre = 'Vodka Premium Demo 750ml' LIMIT 1),
  20,
  8950.00,
  179000.00,
  22.50
FROM compras c WHERE c.numero_compra = 'COM-DEMO-0001';

-- ========================================
-- Insumo, entrega y orden de producción (productor Luis)
-- ========================================
INSERT INTO insumos (nombre, descripcion, cantidad, unidad, stock_minimo, estado, ultimo_operario_id, ultima_fecha)
SELECT 'Espiritu neutro mol base', NULL, 80.50, 'L', 18.00, 'Activo', u.id, CURRENT_TIMESTAMP - INTERVAL '10 days'
FROM usuarios u WHERE u.email = 'productor@grandmas.com' LIMIT 1;

INSERT INTO entregas_insumos (numero_entrega, insumo_id, cantidad, unidad, operario_id, fecha, hora)
SELECT 'ENT-DEMO-0001', i.id, 12.00, 'L', u.id, CURRENT_DATE - 3, TIME '09:15:00'
FROM insumos i CROSS JOIN usuarios u
WHERE i.nombre = 'Espiritu neutro mol base' AND u.email = 'productor@grandmas.com'
LIMIT 1;

INSERT INTO produccion (numero_produccion, producto_id, pedido_id, cantidad, fecha, productor_id, tiempo_preparacion_minutos, estado, notes, insumos_gastados)
SELECT 'PRO-DEMO-0001',
  (SELECT id FROM productos WHERE nombre = 'Vodka Premium Demo 750ml' LIMIT 1),
  (SELECT id FROM pedidos WHERE numero_pedido = 'PED-DEMO-0001'),
  6,
  CURRENT_DATE,
  (SELECT id FROM usuarios WHERE email = 'productor@grandmas.com' LIMIT 1),
  45,
  'En Proceso',
  'Lote muestra desarrollo.',
  '[{"nombre":"Mol base","cantidad":"2"}]'::jsonb;