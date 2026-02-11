-- ========================================
-- LIQUEUR SALES MANAGEMENT DATABASE SCHEMA
-- PostgreSQL Script
-- ========================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS usuarios CASCADE;
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
DROP TABLE IF EXISTS roles CASCADE;

-- ========================================
-- TABLA: roles
-- ========================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos TEXT[], -- Array de permisos
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================

-- Índices para roles
CREATE INDEX idx_roles_nombre ON roles(nombre);
CREATE INDEX idx_roles_estado ON roles(estado);

-- Índices para usuarios
CREATE INDEX idx_usuarios_documento ON usuarios(documento);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);

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
-- DATOS DE EJEMPLO - LICORES COLOMBIANOS
-- ========================================

-- Insertar roles del sistema
INSERT INTO roles (nombre, descripcion, permisos, estado) VALUES
('Administrador', 'Acceso total al sistema', 
 ARRAY['Ver Dashboard','Ver Usuarios','Crear Usuarios','Editar Usuarios','Eliminar Usuarios','Ver Roles','Asignar Permisos','Ver Proveedores','Crear Proveedores','Editar Proveedores','Ver Compras','Registrar Compras','Anular Compras','Ver Productos','Crear Productos','Editar Productos','Ver Categorías','Crear Categorías','Ver Insumos','Entregar Insumos','Ver Producción','Registrar Producción','Ver Clientes','Crear Clientes','Editar Clientes','Ver Ventas','Registrar Ventas','Anular Ventas','Ver Abonos','Registrar Abonos','Ver Pedidos','Crear Pedidos','Ver Domicilios','Gestionar Domicilios'],
 'Activo'),
('Asesor', 'Gestión de ventas y clientes',
 ARRAY['Ver Dashboard','Ver Clientes','Crear Clientes','Editar Clientes','Ver Ventas','Registrar Ventas','Ver Abonos','Registrar Abonos','Ver Pedidos','Crear Pedidos'],
 'Activo'),
('Productor', 'Gestión de producción e insumos',
 ARRAY['Ver Dashboard','Ver Insumos','Entregar Insumos','Ver Producción','Registrar Producción','Ver Productos'],
 'Activo'),
('Repartidor', 'Gestión de domicilios',
 ARRAY['Ver Dashboard','Ver Domicilios','Gestionar Domicilios','Ver Pedidos'],
 'Activo'),
('Cliente', 'Acceso cliente',
 ARRAY['Ver Dashboard','Ver Pedidos'],
 'Activo');

-- Insertar usuarios del sistema (contraseñas hasheadas con bcrypt)
-- Contraseñas: admin123, asesor123, productor123, repartidor123, cliente123
INSERT INTO usuarios (nombre, apellido, tipo_documento, documento, direccion, email, telefono, password_hash, rol_id, estado) VALUES
('Carlos', 'Rodríguez', 'CC', '1010123456', 'Carrera 50 #20-30, Bogotá', 'admin@grandmas.com', '3001234567', '$2b$10$rDz5yH8O3L4pqZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ', 1, 'Activo'),
('María', 'González', 'CC', '1020234567', 'Calle 45 #12-15, Medellín', 'asesor@grandmas.com', '3009876543', '$2b$10$aSz5yH8O3L4pqZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qa', 2, 'Activo'),
('Juan', 'Martínez', 'CC', '1030345678', 'Avenida 6 #8-20, Cali', 'productor@grandmas.com', '3158765432', '$2b$10$pSz5yH8O3L4pqZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qp', 3, 'Activo'),
('Pedro', 'López', 'CC', '1040456789', 'Calle 10 #5-10, Barranquilla', 'repartidor@grandmas.com', '3207654321', '$2b$10$rEz5yH8O3L4pqZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qr', 4, 'Activo'),
('Ana', 'Pérez', 'CC', '1050567890', 'Carrera 7 #14-25, Bogotá', 'cliente@grandmas.com', '3156543210', '$2b$10$cLz5yH8O3L4pqZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qZ7X3qc', 5, 'Activo');

-- Insertar categorías de licores colombianos
INSERT INTO categorias (nombre, descripcion, estado) VALUES
('Aguardientes', 'Aguardientes tradicionales colombianos', 'Activo'),
('Cremas de Licor', 'Cremas de licor artesanales', 'Activo'),
('Licores Frutales', 'Licores artesanales con sabores frutales típicos', 'Activo'),
('Ron Colombiano', 'Rones producidos en Colombia', 'Activo'),
('Destilados Premium', 'Destilados de alta calidad', 'Activo'),
('Cócteles Preparados', 'Cócteles embotellados listos para servir', 'Activo');

-- Insertar productos - Licores Colombianos
INSERT INTO productos (nombre, categoria_id, descripcion, precio, stock, stock_minimo, estado) VALUES
-- Aguardientes
('Aguardiente Antioqueño 750ml', 1, 'Aguardiente tradicional antioqueño sin azúcar', 38000, 150, 30, 'Activo'),
('Aguardiente Cristal 750ml', 1, 'Aguardiente del Valle del Cauca', 35000, 120, 25, 'Activo'),
('Aguardiente Néctar 750ml', 1, 'Aguardiente premium de Cundinamarca', 42000, 80, 20, 'Activo'),
('Aguardiente Tapa Roja 375ml', 1, 'Media botella de aguardiente tradicional', 22000, 100, 20, 'Activo'),
('Aguardiente Blanco del Valle 750ml', 1, 'Aguardiente suave del Valle', 36000, 90, 20, 'Activo'),
-- Cremas de Licor
('Crema de Whisky Abuelita 750ml', 2, 'Crema de whisky artesanal con receta familiar', 45000, 60, 15, 'Activo'),
('Crema de Café Colombiano 750ml', 2, 'Crema de licor con café 100% colombiano', 48000, 50, 12, 'Activo'),
('Crema de Arequipe 750ml', 2, 'Dulce crema de licor con arequipe', 42000, 55, 15, 'Activo'),
('Crema de Coco 750ml', 2, 'Crema tropical de coco', 40000, 45, 10, 'Activo'),
-- Licores Frutales
('Licor de Mora 750ml', 3, 'Licor artesanal de mora de Castilla', 35000, 70, 15, 'Activo'),
('Licor de Lulo 750ml', 3, 'Licor con el sabor único del lulo colombiano', 36000, 65, 15, 'Activo'),
('Licor de Maracuyá 750ml', 3, 'Licor tropical de maracuyá', 34000, 60, 15, 'Activo'),
('Licor de Café 750ml', 3, 'Licor de café colombiano premium', 52000, 40, 10, 'Activo'),
('Licor de Guanábana 750ml', 3, 'Licor suave de guanábana', 35000, 50, 12, 'Activo'),
('Licor de Feijoa 750ml', 3, 'Licor de feijoa colombiana', 38000, 45, 10, 'Activo'),
-- Ron Colombiano
('Ron Viejo de Caldas 8 Años 750ml', 4, 'Ron añejo colombiano de 8 años', 75000, 30, 8, 'Activo'),
('Ron Medellín 3 Años 750ml', 4, 'Ron joven suave', 48000, 50, 12, 'Activo'),
('Ron Caldas 750ml', 4, 'Ron tradicional colombiano', 42000, 60, 15, 'Activo'),
('Ron Tres Esquinas 750ml', 4, 'Ron del Quindío', 55000, 35, 10, 'Activo'),
-- Destilados Premium  
('Ginebra Colombiana Premium 750ml', 5, 'Ginebra artesanal con botánicos locales', 85000, 25, 8, 'Activo'),
('Vodka Andino 750ml', 5, 'Vodka premium destilado en Los Andes', 65000, 30, 10, 'Activo'),
-- Cócteles Preparados
('Canelazo Listo 1L', 6, 'Bebida caliente tradicional lista para calentar', 28000, 40, 10, 'Activo'),
('Sabajón 750ml', 6, 'Sabajón tradicional colombiano', 32000, 45, 12, 'Activo'),
('Refajo Preparado 1L', 6, 'Mezcla de cerveza y colombiana lista', 15000, 80, 20, 'Activo');

-- Insertar clientes
INSERT INTO clientes (nombre, apellido, tipo_documento, documento, telefono, email, direccion, estado) VALUES
('Sofía', 'Ramírez', 'CC', '52123456', '3101234567', 'sofia.ramirez@email.com', 'Calle 72 #10-30, Bogotá', 'Activo'),
('Carlos', 'Mendoza', 'CC', '79234567', '3209876543', 'carlos.mendoza@email.com', 'Carrera 43A #34-50, Medellín', 'Activo'),
('Laura', 'Torres', 'CC', '63345678', '3158765432', 'laura.torres@email.com', 'Avenida 5N #23-50, Cali', 'Activo'),
('Diego', 'Vargas', 'CC', '1060678901', '3007654321', 'diego.vargas@email.com', 'Calle 85 #48-21, Barranquilla', 'Activo'),
('Valentina', 'Castro', 'CC', '1070789012', '3156543210', 'valentina.castro@email.com', 'Carrera 15 #88-45, Bogotá', 'Activo'),
('Andrés', 'Moreno', 'CC', '1080890123', '3205432109', 'andres.moreno@email.com', 'Calle 33 #70-20, Medellín', 'Activo'),
('Camila', 'Herrera', 'CC', '52901234', '3154321098', 'camila.herrera@email.com', 'Carrera 100 #15-30, Cali', 'Activo'),
('Santiago', 'Rojas', 'CC', '79012345', '3103210987', 'santiago.rojas@email.com', 'Calle 45 #29-50, Bucaramanga', 'Activo'),
('Isabella', 'Gómez', 'CC', '1091234567', '3202109876', 'isabella.gomez@email.com', 'Avenida 19 #102-50, Bogotá', 'Activo'),
('Mateo', 'Silva', 'CC', '1102345678', '3151098765', 'mateo.silva@email.com', 'Carrera 70 #52-40, Medellín', 'Activo');

-- Insertar proveedores
INSERT INTO proveedores (tipo_persona, nombre_empresa, nit, nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, estado) VALUES
('Jurídica', 'Destilería Antioqueña S.A.', '890123456-1', 'Roberto', 'Sánchez', 'CC', '71123456', '6045551234', 'ventas@destileriaan.com', 'Zona Industrial, Medellín', 'Activo'),
('Jurídica', 'Licores del Valle Ltda', '890234567-2', 'Patricia', 'Mejía', 'CC', '66234567', '6025552345', 'comercial@licoresvalle.com', 'Parque Industrial, Yumbo', 'Activo'),
('Natural', NULL, NULL, 'Fernando', 'Quintero', 'CC', '79345678', '3101112233', 'fernando.quintero@email.com', 'Vereda La Esperanza, Caldas', 'Activo'),
('Jurídica', 'Frutos de Colombia S.A.S', '890345678-3', 'Mónica', 'Arbeláez', 'CC', '43456789', '6015553456', 'pedidos@frutoscol.com', 'Calle 50 #25-30, Bogotá', 'Activo'),
('Jurídica', 'Embotelladora Nacional', '890456789-4', 'Jorge', 'Montoya', 'CC', '1113567890', '6045554567', 'ventas@embnacional.com', 'Zona Franca, Rionegro', 'Activo'),
('Natural', NULL, NULL, 'Carmen', 'Ospina', 'CC', '39678901', '3209998877', 'carmen.ospina@email.com', 'Finca El Roble, Manizales', 'Activo');

-- Insertar insumos para producción
INSERT INTO insumos (nombre, descripcion, cantidad, unidad, stock_minimo, estado) VALUES
('Alcohol Potable 96°', 'Alcohol etílico para destilación', 500, 'Litros', 100, 'Activo'),
('Agua Purificada', 'Agua tratada para mezclas', 1000, 'Litros', 200, 'Activo'),
('Azúcar Refinada', 'Azúcar para jarabes', 200, 'Kilos', 50, 'Activo'),
('Anís Estrellado', 'Anís para aguardientes', 15, 'Kilos', 5, 'Activo'),
('Pulpa de Mora', 'Pulpa natural de mora de Castilla', 50, 'Kilos', 10, 'Activo'),
('Pulpa de Lulo', 'Pulpa natural de lulo', 40, 'Kilos', 10, 'Activo'),
('Pulpa de Maracuyá', 'Pulpa natural de maracuyá', 45, 'Kilos', 10, 'Activo'),
('Café Molido Premium', 'Café 100% colombiano para licor', 30, 'Kilos', 10, 'Activo'),
('Crema de Leche', 'Crema para licores cremosos', 80, 'Litros', 20, 'Activo'),
('Arequipe', 'Dulce de leche para cremas', 25, 'Kilos', 8, 'Activo'),
('Coco Rallado', 'Coco natural para cremas', 20, 'Kilos', 5, 'Activo'),
('Botellas 750ml', 'Botellas de vidrio transparente', 500, 'Unidades', 100, 'Activo'),
('Tapas de Rosca', 'Tapas metálicas para botellas', 500, 'Unidades', 100, 'Activo'),
('Etiquetas Personalizadas', 'Etiquetas con marca', 600, 'Unidades', 150, 'Activo'),
('Cajas de Cartón', 'Cajas para embalaje x12 botellas', 50, 'Unidades', 15, 'Activo');

-- Insertar pedidos
INSERT INTO pedidos (numero_pedido, cliente_id, fecha, fecha_entrega, detalles, total, estado) VALUES
('PED-2024-001', 1, '2024-02-01', '2024-02-05', 'Pedido para evento familiar', 420000, 'Completado'),
('PED-2024-002', 2, '2024-02-03', '2024-02-08', 'Pedido corporativo', 850000, 'Completado'),
('PED-2024-003', 3, '2024-02-05', '2024-02-10', 'Compra para tienda', 1200000, 'En Proceso'),
('PED-2024-004', 4, '2024-02-07', '2024-02-12', 'Pedido boda', 2500000, 'Pendiente'),
('PED-2024-005', 5, '2024-02-08', '2024-02-13', 'Evento empresarial', 1800000, 'En Proceso'),
('PED-2024-006', 6, '2024-02-09', '2024-02-14', 'Cumpleaños', 380000, 'Pendiente'),
('PED-2024-007', 7, '2024-02-10', '2024-02-15', 'Aniversario', 520000, 'Completado'),
('PED-2024-008', 8, '2024-02-11', NULL, 'Pedido especial navideño', 950000, 'Cancelado');

-- Insertar detalles de pedidos
INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
-- PED-2024-001
(1, 1, 6, 38000, 228000),
(1, 11, 4, 35000, 140000),
(1, 23, 2, 32000, 64000),
-- PED-2024-002
(2, 6, 10, 45000, 450000),
(2, 13, 8, 52000, 416000),
-- PED-2024-003
(3, 1, 20, 38000, 760000),
(3, 2, 10, 35000, 350000),
(3, 3, 5, 42000, 210000),
-- PED-2024-004
(4, 16, 15, 75000, 1125000),
(4, 6, 20, 45000, 900000),
(4, 7, 10, 48000, 480000),
-- PED-2024-005
(5, 17, 12, 48000, 576000),
(5, 18, 15, 42000, 630000),
(5, 13, 12, 52000, 624000);

-- Insertar ventas
INSERT INTO ventas (numero_venta, tipo, cliente_id, pedido_id, fecha, metodopago, total, estado) VALUES
('VEN-2024-001', 'Por Pedido', 1, 1, '2024-02-05', 'Transferencia', 420000, 'Completada'),
('VEN-2024-002', 'Directa', 2, NULL, '2024-02-06', 'Efectivo', 228000, 'Completada'),
('VEN-2024-003', 'Por Pedido', 2, 2, '2024-02-08', 'Tarjeta', 850000, 'Completada'),
('VEN-2024-004', 'Directa', 5, NULL, '2024-02-09', 'Efectivo', 176000, 'Completada'),
('VEN-2024-005', 'Por Pedido', 7, 7, '2024-02-15', 'Transferencia', 520000, 'Completada'),
('VEN-2024-006', 'Directa', 9, NULL, '2024-02-16', 'Efectivo', 315000, 'Completada');

-- Insertar detalles de ventas
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
-- VEN-2024-002
(2, 1, 6, 38000, 228000),
-- VEN-2024-004
(4, 2, 4, 35000, 140000),
(4, 11, 2, 36000, 72000),
-- VEN-2024-006
(6, 10, 5, 35000, 175000),
(6, 12, 4, 34000, 136000);

-- Insertar abonos
INSERT INTO abonos (numero_abono, pedido_id, cliente_id, monto, fecha, metodo_pago, estado) VALUES
('ABO-2024-001', 4, 4, 1000000, '2024-02-08', 'Transferencia', 'Registrado'),
('ABO-2024-002', 4, 4, 500000, '2024-02-10', 'Efectivo', 'Registrado'),
('ABO-2024-003', 5, 5, 900000, '2024-02-09', 'Tarjeta', 'Registrado'),
('ABO-2024-004', 3, 3, 600000, '2024-02-06', 'Transferencia', 'Registrado');

-- Insertar domicilios
INSERT INTO domicilios (numero_domicilio, pedido_id, cliente_id, direccion, repartidor, fecha, hora, estado, detalle) VALUES
('DOM-2024-001', 1, 1, 'Calle 72 #10-30, Bogotá', 'Pedro López', '2024-02-05', '14:30', 'Completado', 'Entregado en portería'),
('DOM-2024-002', 2, 2, 'Carrera 43A #34-50, Medellín', 'Pedro López', '2024-02-08', '10:00', 'Completado', 'Recibido por el cliente'),
('DOM-2024-003', 3, 3, 'Avenida 5N #23-50, Cali', 'Pedro López', '2024-02-10', '16:00', 'En Camino', 'En ruta de entrega'),
('DOM-2024-004', 5, 5, 'Carrera 15 #88-45, Bogotá', 'Pedro López', '2024-02-13', '11:00', 'Pendiente', 'Programado para entrega'),
('DOM-2024-005', 7, 7, 'Carrera 100 #15-30, Cali', 'Pedro López', '2024-02-15', '15:30', 'Completado', 'Entrega exitosa');

-- Insertar compras a proveedores
INSERT INTO compras (numero_compra, proveedor_id, fecha, subtotal, iva, total, estado) VALUES
('COM-2024-001', 1, '2024-01-15', 5000000, 950000, 5950000, 'Recibida'),
('COM-2024-002', 2, '2024-01-20', 3500000, 665000, 4165000, 'Recibida'),
('COM-2024-003', 4, '2024-01-25', 2800000, 532000, 3332000, 'Recibida'),
('COM-2024-004', 5, '2024-02-01', 1500000, 285000, 1785000, 'Pendiente'),
('COM-2024-005', 3, '2024-02-05', 4200000, 798000, 4998000, 'Recibida');

-- Insertar detalles de compras
INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
-- COM-2024-001
(1, 1, 200, 25000, 5000000),
-- COM-2024-002
(2, 10, 100, 23000, 2300000),
(2, 11, 50, 24000, 1200000),
-- COM-2024-003
(3, 6, 80, 35000, 2800000),
-- COM-2024-005
(5, 16, 60, 50000, 3000000),
(5, 17, 30, 40000, 1200000);

-- Insertar entregas de insumos
INSERT INTO entregas_insumos (numero_entrega, insumo_id, cantidad, unidad, operario, fecha, hora) VALUES
('ENT-2024-001', 1, 50, 'Litros', 'Juan Martínez', '2024-02-01', '08:00'),
('ENT-2024-002', 5, 10, 'Kilos', 'Juan Martínez', '2024-02-02', '09:30'),
('ENT-2024-003', 9, 20, 'Litros', 'Juan Martínez', '2024-02-03', '10:00'),
('ENT-2024-004', 8, 5, 'Kilos', 'Juan Martínez', '2024-02-04', '08:30'),
('ENT-2024-005', 12, 100, 'Unidades', 'Juan Martínez', '2024-02-05', '11:00'),
('ENT-2024-006', 3, 25, 'Kilos', 'Juan Martínez', '2024-02-06', '09:00');

-- Insertar registros de producción
INSERT INTO produccion (numero_produccion, producto_id, cantidad, fecha, responsable, estado, notes) VALUES
('PROD-2024-001', 10, 50, '2024-02-01', 'Juan Martínez', 'Completada', 'Lote de mora procesado correctamente'),
('PROD-2024-002', 6, 30, '2024-02-02', 'Juan Martínez', 'Completada', 'Crema de whisky lista para embotellar'),
('PROD-2024-003', 7, 25, '2024-02-03', 'Juan Martínez', 'Completada', 'Crema de café con excelente aroma'),
('PROD-2024-004', 11, 40, '2024-02-04', 'Juan Martínez', 'En Proceso', 'Maceración de lulo en proceso'),
('PROD-2024-005', 13, 20, '2024-02-05', 'Juan Martínez', 'Pendiente', 'Pendiente adquisición de café premium'),
('PROD-2024-006', 8, 35, '2024-02-06', 'Juan Martínez', 'Completada', 'Crema de arequipe terminada y embotellada');

-- ========================================
-- COMENTARIOS FINALES
-- ========================================

COMMENT ON TABLE roles IS 'Roles de usuarios del sistema';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema';
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