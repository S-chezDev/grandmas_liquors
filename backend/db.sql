-- ========================================
-- LIQUEUR SALES MANAGEMENT DATABASE SCHEMA
-- PostgreSQL Script
-- ========================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS detalle_compras CASCADE;
DROP TABLE IF EXISTS detalle_pedidos CASCADE;
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

-- ========================================
-- TABLA: categorias
-- ========================================
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: productos
-- ========================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 10,
    imagen_url VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: clientes
-- ========================================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
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
    tipo_persona VARCHAR(20) NOT NULL, -- 'Natural' o 'Jurídica'
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: pedidos
-- ========================================
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    fecha_entrega DATE,
    detalles TEXT,
    total DECIMAL(10, 2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, En Proceso, Completado, Cancelado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_pedidos
-- ========================================
CREATE TABLE detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: ventas
-- ========================================
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'Directa' o 'Por Pedido'
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    metodopago VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Completada', -- Completada, Cancelada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_ventas
-- ========================================
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: abonos
-- ========================================
CREATE TABLE abonos (
    id SERIAL PRIMARY KEY,
    numero_abono VARCHAR(50) UNIQUE NOT NULL,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE RESTRICT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    monto DECIMAL(10, 2) NOT NULL,
    fecha DATE NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Registrado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: domicilios
-- ========================================
CREATE TABLE domicilios (
    id SERIAL PRIMARY KEY,
    numero_domicilio VARCHAR(50) UNIQUE NOT NULL,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE RESTRICT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    direccion TEXT NOT NULL,
    repartidor VARCHAR(100),
    fecha DATE NOT NULL,
    hora TIME,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, En Camino, Entregado, Cancelado
    detalle TEXT,
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
    subtotal DECIMAL(10, 2) DEFAULT 0,
    iva DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, Recibida, Cancelada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_compras
-- ========================================
CREATE TABLE detalle_compras (
    id SERIAL PRIMARY KEY,
    compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: insumos
-- ========================================
CREATE TABLE insumos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    cantidad DECIMAL(10, 2) DEFAULT 0,
    unidad VARCHAR(20) NOT NULL, -- Litros, Kilos, Unidades, etc.
    stock_minimo DECIMAL(10, 2) DEFAULT 10,
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: entregas_insumos
-- ========================================
CREATE TABLE entregas_insumos (
    id SERIAL PRIMARY KEY,
    numero_entrega VARCHAR(50) UNIQUE NOT NULL,
    insumo_id INTEGER NOT NULL REFERENCES insumos(id) ON DELETE RESTRICT,
    cantidad DECIMAL(10, 2) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    operario VARCHAR(100),
    fecha DATE NOT NULL,
    hora TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: produccion
-- ========================================
CREATE TABLE produccion (
    id SERIAL PRIMARY KEY,
    numero_produccion VARCHAR(50) UNIQUE NOT NULL,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL,
    fecha DATE NOT NULL,
    responsable VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, En Proceso, Completada
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================

-- Índices para productos
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_estado ON productos(estado);

-- Índices para clientes
CREATE INDEX idx_clientes_documento ON clientes(documento);
CREATE INDEX idx_clientes_estado ON clientes(estado);

-- Índices para pedidos
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha DESC);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);

-- Índices para ventas
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_pedido ON ventas(pedido_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha DESC);

-- Índices para detalles
CREATE INDEX idx_detalle_pedidos_pedido ON detalle_pedidos(pedido_id);
CREATE INDEX idx_detalle_ventas_venta ON detalle_ventas(venta_id);
CREATE INDEX idx_detalle_compras_compra ON detalle_compras(compra_id);

-- Índices para abonos y domicilios
CREATE INDEX idx_abonos_pedido ON abonos(pedido_id);
CREATE INDEX idx_domicilios_pedido ON domicilios(pedido_id);

-- ========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ========================================

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion, estado) VALUES
('Licores Cremas', 'Cremas de licor artesanales', 'Activo'),
('Licores Fuertes', 'Licores con alta graduación alcohólica', 'Activo'),
('Licores Frutales', 'Licores con sabores frutales', 'Activo');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, categoria_id, descripcion, precio, stock, stock_minimo, estado) VALUES
('Crema de Whisky 750ml', 1, 'Crema de whisky artesanal', 45000, 50, 10, 'Activo'),
('Aguardiente Tradicional 750ml', 2, 'Aguardiente de alta calidad', 35000, 100, 15, 'Activo'),
('Licor de Mora 750ml', 3, 'Licor artesanal de mora', 30000, 30, 10, 'Activo');

-- ========================================
-- COMENTARIOS FINALES
-- ========================================

COMMENT ON TABLE categorias IS 'Categorías de productos de licores';
COMMENT ON TABLE productos IS 'Catálogo de productos disponibles';
COMMENT ON TABLE clientes IS 'Registro de clientes';
COMMENT ON TABLE proveedores IS 'Registro de proveedores';
COMMENT ON TABLE pedidos IS 'Pedidos realizados por clientes';
COMMENT ON TABLE ventas IS 'Ventas completadas';
COMMENT ON TABLE abonos IS 'Abonos realizados a pedidos';
COMMENT ON TABLE domicilios IS 'Entregas a domicilio';
COMMENT ON TABLE compras IS 'Compras realizadas a proveedores';
COMMENT ON TABLE insumos IS 'Insumos para producción';
COMMENT ON TABLE produccion IS 'Registro de producción de licores';

-- Fin del script