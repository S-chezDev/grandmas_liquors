PLAN DE EJECUCIÓN INTEGRADO
Prioridad: No modificar el diseño original del frontend, solo validar la correcta integración del consumo de la API del backend.

Paso 1: Landing / inicio web
Requisito:
Landing / inicio web debe consumir los datos de la API backend de las tablas: productos, categorías y auth.

Ajustes de base de datos:

No se requieren cambios en la estructura. Las tablas productos, categorias y usuarios (auth) ya contienen los campos necesarios. Se debe verificar que la API entregue los endpoints correspondientes con los datos públicos (productos activos, categorías activas y la autenticación de usuarios).

Paso 2: Dashboard
Requisito:
Rebemos retirar Inicio ya que se repuite su contenido (/ — mismo componente que dashboard) y dedjar a Dashboard con Panel / métricas/ medicion para que en dasboar tenga el siguiente diseño:

Ventas del Mes, Ventas Hoy, Pedidos Activos, Clientes Activos

Ventas Mensuales

Distribución por Categoría

Productos Más Vendidos

Pedidos Recientes

(Que todo lo anterior sea consumido desde el backend).

Ajustes de base de datos:

El backend debe exponer endpoints de agregación que calculen:

Ventas del Mes y Ventas Hoy a partir de la tabla ventas.

Pedidos Activos y Clientes Activos contando desde pedidos y clientes con filtro por estado.

Ventas Mensuales (gráficos de series de tiempo).

Distribución por Categoría (unión de detalle_ventas → productos → categorias).

Productos Más Vendidos (top productos por suma de cantidad en detalle_ventas).

Pedidos Recientes (últimos N registros de pedidos).

No se requieren cambios en las tablas existentes para este Paso.

Paso 3: Usuarios / gestión usuarios
Requisitos
La tabla que lista los usuarios debe ser: Nombre Completo, Documento, Email, Teléfono, Rol, Estado, Acciones.

La acción de ver detalle debe mostrar todos los datos del usuario sin problema.

La acción de editar debe: permitir editar correctamente y, al ser seleccionada, debe mostrar los formularios cargando los datos actuales de ese usuario y debe permitir que estos sean editados y guardados, y los campos deben contar con sus validaciones lógicas.

Retirar el icono de cambiar estado de usuario y permitir que el estado se cambie desde la columna estado (activo/inactivo como se implementa el estado de proveedores) y que al cambiar el estado se pida motivo de cambio de estado del usuario (mín. 10, máx. 50 caracteres).

La acción eliminar: solicite motivo de eliminación y permita eliminar solo si el usuario que va a ser eliminado no tiene pedidos, abonos, domicilios pendientes; todo debe estar en completado para poder eliminarlo y debe mostrar sus correctas alertas y validaciones, y la eliminación del usuario debe usar la petición Delete de usuario.

+Nuevo usuario: su formulario debe contar con todos los datos para el nuevo usuario e incluir sus validaciones en cada campo y debe mostrar la notificación.

Barra de búsqueda funcional a partir de dos caracteres y debe tener filtros para filtrar por (Rol y estado).

(Todo lo anterior debe tener sus respectivas notificaciones de éxito o error y motivos).

Ajustes de base de datos
Eliminación restringida por dependencias: Actualmente las claves foráneas desde clientes, pedidos, abonos, domicilios y ventas hacia usuarios o clientes estaban en CASCADE. Para evitar que un usuario con pedidos/abonos/domicilios pendientes sea eliminado automáticamente, se cambian a RESTRICT. La aplicación debe verificar que el usuario no tenga registros activos pendientes antes de eliminar.

Auditoría de cambios de estado: El motivo del cambio de estado se almacenará en usuarios_auditoria dentro del JSON cambios.

Las tablas afectadas por los cambios de FKs son: clientes, pedidos, abonos, domicilios, ventas y productos (para categorías). Ver sección “Script de migración” al final.

Estructura final de la tabla usuarios (sin cambios, solo se muestra para referencia):

sql
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
Estructura final de clientes (para relación usuario-cliente):

sql
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE RESTRICT,  -- Cambiado de CASCADE
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
Tabla usuarios_auditoria existente, no requiere cambios.

Restricciones adicionales: Ninguna.

Paso 4: Compras
4.1 Compras/Proveedores
Requisitos
La tabla que lista los proveedores debe mostrar los datos: Tipo, Nombre/Razón Social, NIT/Documento, Teléfono, Email, Preferente, Estado, Acciones.

La columna de preferente debe poder cambiar su estado rápidamente desde la lista del proveedor (si/no debe cambiar entre preferente o no con un solo clic).

El estado debe poder cambiar entre activo/inactivo y debe pedir el motivo de cambio de estado (mín. 10 a máx. 50 caracteres), y una vez que el estado cambie a inactivo, este proveedor que pasó a estar inactivo no debe aparecer en ningún otro proceso relacionado con listar los proveedores.

En la acción ver detalle debe cargar todos los datos del proveedor completos + historias de cambios y sus motivos.

En la acción editar debe cargar los datos del proveedor actuales y debe permitir modificar cualquier campo a excepción del "NIT", debe mostrar su advertencia en tiempo real de por qué no permite editar ese campo de NIT y cada campo debe contar con sus validaciones, alertas, y envío de datos correctos luego de guardar o confirmar los cambios; entonces debe mostrar la notificación.

Eliminar proveedor: debe pedir motivo (mín. 10 a máx. 50 caracteres) y debe confirmar la eliminación; luego de la eliminación, mostrar la notificación de éxito o error y su motivo.

+Nuevo proveedor: el formulario debe contar con todas las validaciones claras y en tiempo real para los datos que se van ingresando y debe mostrar sus notificaciones de éxito o error y el motivo.

La barra de buscador debe funcionar con más de dos caracteres y máximo 50 caracteres y contar con filtros rápidos por: tipo, estado, preferente.

Ajustes de base de datos
La tabla proveedores ya posee todos los campos necesarios, incluido el booleano preferente y el estado.

Se utilizará la tabla proveedores_auditoria para guardar historiales de cambios (cada modificación debe insertar un registro con el JSON de los campos modificados y el motivo si aplica).

Para la eliminación, la FK de compras a proveedores tiene ON DELETE SET NULL, lo cual es aceptable, pero debe validarse en la aplicación si hay compras activas pendientes antes de eliminar.

No se requieren cambios estructurales en la tabla proveedores.

sql
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
4.2 Compras/Compras
Requisitos
Tabla listar: ID Compra, Proveedor, Fecha, Productos, Total, Estado, Acciones.

Ver detalle: todos los datos completos de la compra + productos con: Producto, Cantidad, Precio Unit., Subtotal.

Cambio de estados: Pendiente, Recibida, Cancelada. Cancelada pide motivo. Recibida confirma productos completos y aumenta stock; luego no se puede modificar.

Barra de búsqueda a partir de 2 caracteres, máx. 50, filtros: fecha, estado.

Nueva compra: estado pendiente por default. Proveedor solo activos. Fecha sin fechas pasadas. Ganancia (%) se mueve al formulario de Agregar Productos.

Agregar Productos: Producto solo activos. Cantidad solo positivos, se puede borrar el 0. Precio unitario pasa a “Precio de compra”. Nuevo campo Ganancia (%) al lado, solo positivos. Botón agregar.

Al menos 1 producto para crear.

Al cambiar a Recibida, incrementar stock.

Barra de búsqueda (vista lista): 2-50 car., filtros fecha, estado.

Ajustes de base de datos
La tabla detalle_compras tiene la columna porcentaje_ganancia; se debe agregar un CHECK para que sea ≥ 0.

El procedimiento de recepción de compra debe aumentar el stock de productos. Eso se maneja en la aplicación.

Se debe asegurar que el campo numero_compra sea único (ya lo es por constraint UNIQUE).

La tabla compras_estado_historial almacenará los cambios de estado y motivos.

Cambios en DB:

sql
ALTER TABLE detalle_compras ADD CONSTRAINT ck_porcentaje_ganancia_no_negativo CHECK (porcentaje_ganancia >= 0);
Estructura final relevante:

sql
CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    numero_compra VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) DEFAULT 0,
    iva DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    requiere_aprobacion BOOLEAN DEFAULT FALSE,
    aprobacion_extraordinaria BOOLEAN DEFAULT FALSE,
    motivo_aprobacion TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_compras (
    id SERIAL PRIMARY KEY,
    compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    porcentaje_ganancia NUMERIC(12,2) DEFAULT 0 CHECK (porcentaje_ganancia >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
4.3 Compras/Productos
Requisitos
Lista: todos los productos activos/inactivos. Columnas: Producto, Categoría, Typo, Precio, Stock, Estado, Acciones.

Ver detalle: todos los datos + historial de modificaciones.

Estado: cambiar activo/inactivo con motivo (10-50 car.).

Editar: cargar datos actuales, permitir editar cualquier campo, pedir confirmación, notificar.

Eliminar: motivo, confirmación, notificación (usa delete).

Barra de búsqueda: 2-50 car., filtros rápidos: categoría, estado, precio.

Nuevo producto: validaciones en tiempo real, stock mínimo permite borrar 0. Stock Actual default 0, solo incrementa al recibir compras.

Campo "Typo": select Terminado / de preparación.

Categoría solo activas.

Nombre del Producto valida no repetido en tiempo real.

Notificaciones de éxito/error.

Ajustes de base de datos
Unicidad del nombre: Agregar constraint UNIQUE en productos.nombre.

Auditoría: Crear tabla productos_auditoria para guardar historiales de cambios (incluye acciones como INSERT, UPDATE, DELETE, CAMBIO_ESTADO) con JSON cambios.

Tipo de producto: La columna tipo_producto ya existe con CHECK ('terminado','preparacion'), cumple con el requisito.

FK a categorías: Actualmente categoria_id REFERENCES categorias(id) ON DELETE CASCADE. Para evitar que al borrar una categoría se eliminen todos sus productos, se cambia a ON DELETE RESTRICT. La aplicación debe manejar la eliminación de categorías si no tiene productos asociados.

Cambios en DB:

sql
ALTER TABLE productos ADD CONSTRAINT uq_productos_nombre UNIQUE (nombre);
ALTER TABLE productos DROP CONSTRAINT productos_categoria_id_fkey;
ALTER TABLE productos ADD CONSTRAINT productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT;
Nueva tabla de auditoría:

sql
CREATE TABLE productos_auditoria (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Estructura final de productos:

sql
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) UNIQUE NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 10,
    imagen_url VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'Activo',
    tipo_producto VARCHAR(30) NOT NULL DEFAULT 'terminado' CHECK (tipo_producto IN ('terminado','preparacion')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
4.4 Compras/Categorías de producto
Requisitos
Lista: Categoría, Descripción, Productos, Estado, Acciones.

Estado: cambiar activo/inactivo con motivo (10-50 car.).

Ver detalle: datos completos + historial de modificaciones.

Editar: cargar datos actuales, no permitir nombres repetidos, guardar con confirmación.

Eliminar: motivo, confirmación, notificación.

Nueva categoría: validaciones en tiempo real, nombre no repetido, notificación.

Barra de búsqueda: 2-50 car., filtro estado, categoría.

Ajustes de base de datos
Unicidad del nombre: Agregar UNIQUE en categorias.nombre.

Auditoría: Crear tabla categorias_auditoria.

Eliminación: Debido al cambio de FK en productos a ON DELETE RESTRICT, no se podrá eliminar una categoría que tenga productos asociados, lo cual es deseable.

Cambios en DB:

sql
ALTER TABLE categorias ADD CONSTRAINT uq_categorias_nombre UNIQUE (nombre);
Nueva tabla:

sql
CREATE TABLE categorias_auditoria (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Paso 4 (continuación): Producción e Insumos
Producción/Producción
Requisitos
Nueva orden: producto solo “de preparación” activos. Cantidad: borrar 0, sin negativos. ID Orden (auto). Productor (usuarios con rol Productor activos). Fecha inicio sin horas pasadas. Tiempo de preparación en minutos (reemplaza Fecha finalización). Notificar creación.

Tabla lista: ID Orden, Producto, Cantidad, Operario Responsable, Fecha Inicio, Estado, Acciones.

Estado: select (Pendiente, En Proceso, Completada, Cancelada). Cancelada pide motivo (10-50). Completada no permite más cambios y no se muestra botón cambiar.

No se permite eliminar.

Ver detalles carga todos los datos.

Barra búsqueda: 2-50, filtros estado, fecha.

Ajustes de base de datos
Estado: El CHECK actual permitía ‘Orden Recibida’, ‘Orden en preparacion’, ‘Orden Lista’, ‘Cancelada’. Se debe cambiar a los nuevos literales: ‘Pendiente’, ‘En Proceso’, ‘Completada’, ‘Cancelada’. Valor por defecto: ‘Pendiente’.

Operario Responsable: Eliminar columna responsable (varchar). Agregar productor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL.

La columna tiempo_preparacion_minutos ya existe, cumple.

El campo numero_produccion (ID Orden) puede seguir usándose, el plan dice que sea autoincremental; se usará el id serial como ID Orden visible.

Cambios en DB:

sql
-- Actualizar CHECK de estado
ALTER TABLE produccion DROP CONSTRAINT IF EXISTS produccion_estado_check;
ALTER TABLE produccion ADD CONSTRAINT ck_produccion_estado CHECK (estado IN ('Pendiente','En Proceso','Completada','Cancelada'));
ALTER TABLE produccion ALTER COLUMN estado SET DEFAULT 'Pendiente';

-- Reemplazar responsable por productor_id
ALTER TABLE produccion DROP COLUMN responsable;
ALTER TABLE produccion ADD COLUMN productor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
Estructura final:

sql
CREATE TABLE produccion (
    id SERIAL PRIMARY KEY,
    numero_produccion VARCHAR(50) UNIQUE NOT NULL,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha DATE NOT NULL,
    productor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    tiempo_preparacion_minutos INTEGER DEFAULT 1 CHECK (tiempo_preparacion_minutos > 0),
    estado VARCHAR(30) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','En Proceso','Completada','Cancelada')),
    notes TEXT,
    insumos_gastados JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Producción/Entrega de insumos
Requisitos
Nueva entrega: validaciones, números no negativos, confirmación, notificación.

Tabla: Insumo, Cantidad, Operario, Fecha, Hora, Acciones.

Ver detalle: Entregado a, Insumo(s), Cantidad, ID Entrega, Fecha, Hora.

Eliminar: motivo (10-50), confirmación, delete.

Barra búsqueda: 2-50, filtro operario.

Ajustes de base de datos
La tabla entregas_insumos ya contiene todos los campos necesarios, incluido operario_id (FK a usuarios). No se requieren cambios.

sql
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
PRODUCCIÓN / Insumos (nueva gestión)
Requisitos
Tabla principal: nombre del insumo, cantidad del insumo, Operario, Fecha.

Relación con productos "de preparación": al crear orden de producción se descuentan los insumos según receta (producto_insumos).

Función: medir stock de insumos, alertar cuando se acaben.

Sin acciones de editar/eliminar, solo listar y ver detalle.

Barra búsqueda: 2 car., filtro fecha, productor responsable.

Ajustes de base de datos
Agregar columnas ultimo_operario_id y ultima_fecha a la tabla insumos para registrar quién y cuándo fue la última actualización (útil para la vista).

La tabla producto_insumos ya modela la receta (producto de preparación -> insumos necesarios). Al crear una orden de producción, la lógica de negocio debe:

Consultar producto_insumos para el producto seleccionado.
Multiplicar cantidad requerida por la cantidad de la orden.
Descontar de insumos.cantidad (verificando stock suficiente).
Actualizar ultimo_operario_id y ultima_fecha.
Cambios:

sql
ALTER TABLE insumos ADD COLUMN ultimo_operario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE insumos ADD COLUMN ultima_fecha TIMESTAMP;
Estructura final de insumos:

sql
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
Paso 5: Ventas
5.1 Ventas/Clientes
Requisitos
Tabla: TipoDoc., Nombre, Teléfono, Email, Compras, Estado, Acciones.

Nuevo cliente: formulario como el registro de login.

Cambio estado activo/inactivo con motivo (10-50). Inactivo no aparece en selects ni puede loguearse.

Ver detalle: datos completos + historial de cambios.

Editar: validaciones, guardar cambios, notificar.

Eliminar: motivo, confirmación, notificación.

Búsqueda: 2-50 car., filtros Tipo Doc., Estado.

Ajustes de base de datos
Auditoría: Crear clientes_auditoria.

FK de clientes a usuarios ya se cambió a RESTRICT (ver Paso 3).

El campo compras en la tabla será calculado (cantidad de ventas del cliente), no es una columna.

El login debe verificar que el cliente esté activo consultando clientes.estado mediante el usuario_id.

Nueva tabla:

sql
CREATE TABLE clientes_auditoria (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER,
    accion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    cambios JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
5.2 Ventas/Ventas
Requisitos
Lista: Tipo, Cliente, Fecha, Productos, Total, Método Pago, Estado.

Nueva venta:

Tipo de Venta: Directa o Por Pedido.

Directa: seleccionar cliente (select+búsqueda). Producto, Cantidad, Precio (se carga automático). Método de pago: efectivo o transferencia. Pago 100%, estado Completada. Mínimo 1 producto.

Por Pedido: select de Número de Pedido existente (o pegar ID). Carga datos del pedido. Estado Pendiente. Se completa cuando el domiciliario cambia estado a Completada.

Validaciones: sin números negativos, fechas correctas.

Barra búsqueda: 2-50, filtros tipo venta, estado, fecha, método pago.

Retirar método de pago tarjeta (solo efectivo/transferencia).

Ajustes de base de datos
La tabla ventas tiene columna metodo_pago; los valores permitidos serán manejados por la aplicación, no se restringen por CHECK en DB.

El flujo de “venta por pedido” requiere que pedido_id esté presente en ventas. La FK ya existe.

Para la creación de venta directa, el pedido_id quedará NULL.

La conexión con domicilios se explica en la sección 5.4.

Estructura de ventas:

sql
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE RESTRICT,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    metodopago VARCHAR(50), -- campo heredado; se podría eliminar o mantener
    metodo_pago VARCHAR(50),
    esquema_abono VARCHAR(20),
    abono_recibido DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Completada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
5.3 Ventas/Abonos
Requisitos
Lista: id Pedido, Monto abonado y porcentaje, Fecha, Método Pago, Estado, Acciones.

El estado no se cambia manualmente (ligado al proceso pedido-domicilio-venta).

Ver detalle muestra: ID Abono, Pedido, Monto abonado y %, Valor completo del pedido, Fecha, Método Pago, Estado.

Nuevo abono: lógica del carrito, mínimo 50% del valor del pedido. Al crear abono se inserta también el pedido. Validaciones: no negativos, monto > 50% total.

Búsqueda: 2 car., filtros método pago, estado.

Ajustes de base de datos
La tabla abonos ya está correctamente relacionada con pedidos y clientes. No necesita cambios estructurales.

La validación del 50% se hará en aplicación.

5.4 Ventas/Pedidos
Requisitos
Lista: ID Pedido, Cliente, Productos (cantidad), método pago, Fecha Pedido, Fecha Entrega, Estado, Acciones.

Estado modificable hasta completado; completado es final.

Ver detalle: ID Pedido, Cliente, Productos (lista), método pago, % abono, Total, Fecha Pedido, Fecha Entrega, Estado.

Editar solo si está Pendiente.

Nuevo pedido: cliente solo rol Cliente activos. Fecha pedido automática. Establecer abono 50% o 100% y método pago. Fecha entrega solo futura. Al crear, si es 50% de abono, se inserta automáticamente en tabla abonos.

Búsqueda: 2-50, filtros estado, método pago, fecha.

Ajustes de base de datos
pedidos ya contiene esquema_abono y metodo_pago.

La creación automática del abono se maneja en la lógica de negocio, insertando en abonos con los datos del pedido recién creado.

5.5 Ventas/Domicilios
Requisitos
Conectar estado del pedido, venta, abono y domicilio.

El domicilio se ingresa a la venta solo cuando el repartidor cambia estado a Completada (él cobra o toma foto del restante).

El cambio en domicilio debe actualizar los estados relacionados.

Lista: ID Pedido, Cliente, Productos, Total, Fecha Pedido, Fecha Entrega, Estado.

Cambiar estado de domicilio: Completado o Cancelado. Cancelado pide motivo (10-50). Al completar, la venta correspondiente pasa a Completada.

Búsqueda: 2 car., filtros estado, repartidor.

Ajustes de base de datos
Agregar repartidor_id (FK a usuarios) y motivo_cancelacion en domicilios.

La lógica de actualización en cascada (venta, pedido) se implementa mediante triggers o en la API.

FK de domicilios a clientes ya se cambió a RESTRICT.

Cambios:

sql
ALTER TABLE domicilios ADD COLUMN repartidor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE domicilios ADD COLUMN motivo_cancelacion VARCHAR(100);
Estructura final de domicilios:

sql
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
GENERAL
Todo lo anterior debe contar con validaciones y notificaciones de forma clara para cada acción y su notificación de confirmación o error y el motivo del error. Las reglas de oro son: nada de inputs negativos ni fechas pasadas.

Todo debe tener un flujo claro y que agilice los procesos del pedido y los módulos relacionados con el pedido.

Estandarizar todos los iconos que se usan dentro de las tablas, ya que varios que hacen la misma acción se ven diferente.

Script completo de migración
A continuación se presenta el script consolidado que aplica todos los cambios mencionados sobre la base de datos original. Ejecutar en orden y con precaución, respaldando los datos primero.

sql
-- =====================================================
-- MIGRACIÓN: AJUSTES DB SEGÚN PLAN DE GESTIÓN
-- =====================================================

-- 1. Unicidad en nombres
ALTER TABLE productos ADD CONSTRAINT uq_productos_nombre UNIQUE (nombre);
ALTER TABLE categorias ADD CONSTRAINT uq_categorias_nombre UNIQUE (nombre);

-- 2. CHECK porcentaje de ganancia no negativo
ALTER TABLE detalle_compras ADD CONSTRAINT ck_porcentaje_ganancia_no_negativo CHECK (porcentaje_ganancia >= 0);

-- 3. Tablas de auditoría
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

-- 4. Ajustes en producción
ALTER TABLE produccion DROP CONSTRAINT IF EXISTS produccion_estado_check;
ALTER TABLE produccion ADD CONSTRAINT ck_produccion_estado CHECK (estado IN ('Pendiente','En Proceso','Completada','Cancelada'));
ALTER TABLE produccion ALTER COLUMN estado SET DEFAULT 'Pendiente';
ALTER TABLE produccion DROP COLUMN responsable;
ALTER TABLE produccion ADD COLUMN productor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;

-- 5. Columnas de trazabilidad en insumos
ALTER TABLE insumos ADD COLUMN ultimo_operario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE insumos ADD COLUMN ultima_fecha TIMESTAMP;

-- 6. Domicilios: repartidor FK y motivo cancelación
ALTER TABLE domicilios ADD COLUMN repartidor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE domicilios ADD COLUMN motivo_cancelacion VARCHAR(100);

-- 7. Cambios en claves foráneas para evitar eliminación en cascada
ALTER TABLE clientes DROP CONSTRAINT fk_clientes_usuario;
ALTER TABLE clientes ADD CONSTRAINT fk_clientes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT;

ALTER TABLE pedidos DROP CONSTRAINT pedidos_cliente_id_fkey;
ALTER TABLE pedidos ADD CONSTRAINT pedidos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT;

ALTER TABLE abonos DROP CONSTRAINT abonos_cliente_id_fkey;
ALTER TABLE abonos ADD CONSTRAINT abonos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT;

ALTER TABLE domicilios DROP CONSTRAINT domicilios_cliente_id_fkey;
ALTER TABLE domicilios ADD CONSTRAINT domicilios_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT;

ALTER TABLE ventas DROP CONSTRAINT ventas_cliente_id_fkey;
ALTER TABLE ventas ADD CONSTRAINT ventas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT;

ALTER TABLE productos DROP CONSTRAINT productos_categoria_id_fkey;
ALTER TABLE productos ADD CONSTRAINT productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT;

-- 8. Índices adicionales para rendimiento
CREATE INDEX idx_produccion_productor ON produccion(productor_id);
CREATE INDEX idx_insumos_operario ON insumos(ultimo_operario_id);
CREATE INDEX idx_domicilios_repartidor ON domicilios(repartidor_id);
Con esta integración, cada paso del plan queda vinculado directamente a los cambios que requiere la base de datos, y las tablas finales reflejan exactamente la estructura necesaria para que todos los módulos funcionen según lo especificado, sin modificar el diseño original del frontend.