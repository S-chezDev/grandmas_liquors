dame el plan siguiente:
Plan de ejecución (prioridad: no modificar el diseño original del frontend, solo validar la correcta integración del consumo de la API del backend)

Paso 1:
Landing / inicio web debe consumir los datos de la api backend de las tablas: productos, categorías y auth.

Paso 2:
Dashboard.
Rebemos retirar Inicio ya que se repuite su contenido (/ — mismo componente que dashboard) y dedjar a Dashboard con Panel / métricas/ medicion para que en dasboar tenga el siguiente diseño:

Ventas del Mes, Ventas Hoy, Pedidos Activos, Clientes Activos

Ventas Mensuales

Distribución por Categoría

Productos Más Vendidos

Pedidos Recientes
(que todo lo anterior sea consumido desde el backend).

Paso 3:
Usuarios / gestión usuarios:

La tabla que lista los usuarios debe ser: Nombre Completo, Documento, Email, Teléfono, Rol, Estado, Acciones.

La acción de ver detalle debe mostrar todos los datos del usuario sin problema.

La acción de editar debe: permitir editar correctamente y, al ser seleccionada, debe mostrar los formularios cargando los datos actuales de ese usuario y debe permitir que estos sean editados y guardados, y los campos deben contar con sus validaciones lógicas.

Retirar el icono de cambiar estado de usuario y permitir que el estado se cambie desde la columna estado (activo/inactivo como se implementa el estado de proveedores) y que al cambiar el estado se pida motivo de cambio de estado del usuario (mín. 10, máx. 50 caracteres).

La acción eliminar: solicite motivo de eliminación y permita eliminar solo si el usuario que va a ser eliminado no tiene pedidos, abonos, domicilios pendientes; todo debe estar en completado para poder eliminarlo y debe mostrar sus correctas alertas y validaciones, y la eliminación del usuario debe usar la petición Delete de usuario.

+Nuevo usuario: su formulario debe contar con todos los datos para el nuevo usuario e incluir sus validaciones en cada campo y debe mostrar la notificación.

Barra de búsqueda funcional a partir de dos caracteres y debe tener filtros para filtrar por (Rol y estado).

(Todo lo anterior debe tener sus respectivas notificaciones de éxito o error y motivos).

Paso 4:
Compras/Proveedores:

La tabla que lista los proveedores debe mostrar los datos: Tipo, Nombre/Razón Social, NIT/Documento, Teléfono, Email, Preferente, Estado, Acciones.

La columna de preferente debe poder cambiar su estado rápidamente desde la lista del proveedor (si/no debe cambiar entre preferente o no con un solo clic).

El estado debe poder cambiar entre activo/inactivo y debe pedir el motivo de cambio de estado (mín. 10 a máx. 50 caracteres), y una vez que el estado cambie a inactivo, este proveedor que pasó a estar inactivo no debe aparecer en ningún otro proceso relacionado con listar los proveedores (forma lógica, inactivo es inactivo completamente hasta que cambie su estado a activo y en ese caso debe mostrarse correctamente).

En la acción ver detalle debe cargar todos los datos del proveedor completos + historias de cambios y sus motivos.

En la acción editar debe cargar los datos del proveedor actuales y debe permitir modificar cualquier campo a excepción del "NIT", debe mostrar su advertencia en tiempo real de por qué no permite editar ese campo de NIT y cada campo debe contar con sus validaciones, alertas, y envío de datos correctos luego de guardar o confirmar los cambios; entonces debe mostrar la notificación (todo debe ser intuitivo para el usuario final).

Eliminar proveedor: debe pedir motivo (mín. 10 a máx. 50 caracteres) y debe confirmar la eliminación; luego de la eliminación, mostrar la notificación de éxito o error y su motivo.

+Nuevo proveedor: el formulario debe contar con todas las validaciones claras y en tiempo real para los datos que se van ingresando y debe mostrar sus notificaciones de éxito o error y el motivo.

La barra de buscador debe funcionar con más de dos caracteres y máximo 50 caracteres y contar con filtros rápidos por: tipo, estado, preferente.

Compras/Compras:

Su tabla que lista las compras debe mostrar los datos: ID Compra, Proveedor, Fecha, Productos, Total, Estado, Acciones.

Ver detalle debe mostrar todos los datos completos de la compra: Proveedor, Fecha de Compra, Fecha de Creación, Estado, Subtotal, IVA (19%), Total; Productos con: Producto, Cantidad, Precio Unit., Subtotal.

La compra debe poder cambiar entre los estados: pendiente, recibida, cancelada. Para cambiar el estado a cancelada debe pedir motivo de cancelación de la compra; para el estado recibida debe pedir confirmación de que los productos llegaron completos y, cuando se cambie a el estado recibida y se confirme, entonces los productos comprados ingresen a stock de productos y que el estado de esa compra no se pueda modificar después de recibida.

Debe funcionar su barra de búsqueda a partir de dos caracteres y un máx. de 50 caracteres, debe tener filtros rápidos por: fecha, estado.

+Nueva compra debe permitir crearse correctamente en estado pendiente por default; su formulario debe contar con las validaciones en tiempo real y de los datos que se están ingresando, el campo Proveedor solo debe listar los proveedores activos, el campo Fecha no debe permitir escoger fechas anteriores a la actual (no fechas ni horas pasadas), el campo Ganancia (%) debemos retirarlo de ahí y moverlo a nuevacompra/agregar productos y a agregar productos hagamosle los siguientes puntos:
En el formulario de nueva compra, en Agregar Productos:

El campo Producto solo debe permitir seleccionar productos activos.

El campo Cantidad solo debe permitir números positivos (no -1, -2, etc.) y debe poder permitir borrar el "0" con el que se inicia ese campo de cantidad para poder ingresar la cantidad que el usuario desee.

El campo de precio unitario cambiemoslo por: precio de compra.

Precio de compra debe permitir ingresar el precio por el usuario y siempre debe ser números positivos (cada campo del formulario nueva compra debe tener sus validaciones en tiempo real y de el tipo de dato mostrando sus alertas).

Luego de establecer el precio de compra le agregamos el campo de Ganancia (%) al lado del campo de precio de compra y que el campo de Ganancia (%) solo permita números positivos y que este campo también cuente con su validación y nada de valores negativos.

Debe tener el botón para agregar el producto.

Para poder crear la compra debe al menos contener 1 producto y debe notificar la creación de la compra (éxito o error y su motivo).

La compra se crea en estado pendiente y, cuando se cambie el estado de esta compra a recibida, entonces incrementar en stock la cantidad de los productos que se compraron (sea un solo producto o más de 1).

La barra de búsqueda se activa con más de 2 caracteres y máx. 50 y debe tener filtros rápidos como: fecha, estado.

Compras/Productos:

La lista debe cargar todos los productos activos/inactivos.

La tabla con la lista de productos debe tener: Producto, Categoría, Typo, Precio, Stock, Estado, Acciones.

Ver detalle de producto debe contar con todos los datos del producto e historias de modificaciones.

Estado debe poder cambiarse entre activo/inactivo y, al cambiarse el estado, debe pedir el motivo de activación o inactivación del producto (mín. 10 a máx. 50 caracteres).

Editar debe cargar todos los datos actuales del producto y debe permitir editar cualquiera de los campos del producto y poder guardar los cambios realizados y pedir una confirmación; luego de confirmación, debe mostrar la notificación de éxito o error y motivo.

Eliminar (petición delete) debe pedir un motivo de la eliminación del producto y debe confirmar la eliminación; cuando se confirme la eliminación, debe notificar éxito o error y motivo.

La barra de búsqueda debe permitir buscar a partir de 2 caracteres y máx. 50 caracteres, además debe contar con filtros rápidos como: categoría, estado, precio.

El formulario de Nuevo Producto debe contar con todos los campos para poder crear el producto correctamente y cada uno de los campos debe tener sus validaciones en tiempo real y de el tipo de dato correcto, y debe poder permitir borrar el 0 para que el usuario ingrese el stock mínimo (no permitir números negativos).

El campo de Stock Actual va a ser por default 0 cuando se está creando el producto y este incrementa solo cuando se recibe la compra de ese producto.

Agregar un campo "Typo" que sea un select que permita elegir si el producto es terminado o de preparación, solo las dos opciones anteriores.

El select de Categoría debe solo mostrar categorías activas.

Al crear pedido debe validar que todos los datos obligatorios estén completos y tener sus validaciones.

El campo de Nombre del Producto debe validar en tiempo real que no se repita ese nombre con otro producto.

Debe confirmar cuando se cree el producto: notificación éxito o error y motivo.

Compras/Categorías de producto:

La lista de las categorías debe cargar con todos los datos: Categoría, Descripción, Productos, Estado, Acciones.

Estado debe permitir seleccionar y cambiar el estado entre (activo/inactivo) y pedir motivo del cambio del estado de mín. 10 a máx. 50 caracteres.

Ver detalle debe mostrar todos los datos de la categoría e historias de modificaciones.

Editar debe cargar los datos actuales de la categoría y debe permitir editar cualquiera de los campos y todos los campos deben tener sus validaciones en tiempo real y de tipo de dato correcto y luego permitir guardar los cambios realizados (actualizar); el campo de nombre de categoría no debe permitir nombres de categorías repetidos.

Eliminar (petición delete) debe pedir motivo de eliminación de la categoría y confirmación; luego de confirmar la eliminación, debe mostrar la notificación éxito o error y motivo.

+Nueva categoría debe mostrar su formulario con los datos correctos para poder crear la nueva categoría correctamente y cada uno de sus campos debe tener las validaciones en tiempo real y de el tipo de dato correcto y al crear la categoría debe mostrar su notificación éxito o error y motivo.

La barra de búsqueda debe funcionar desde 2 caracteres a máx. 50 y debe tener filtro rápido por: estado, categoría.

Paso 4 (continuación):
Integrar una nueva gestión dentro de Producción llamada "insumos".

Producción/Producción:

+Nueva orden debe mostrar el formulario para crear la nueva orden y el formulario debe contar con todas las validaciones en tiempo real y de el tipo de dato.

El formulario de Nueva orden en el campo Producto debe solo listar los productos que hayan sido creados con el typo "de preparación" y que estén activos.

En el formulario de nueva orden, en el campo "Cantidad", debe permitir borrar el 0 y dejar que el usuario ingrese la cantidad que va a pedir de ese producto de preparación sin permitir valores negativos.

En el formulario de nueva orden, el campo "Lote": reemplacemoslo por IdOrden y no debe ser ingresado por el usuario, debe crearse automáticamente con autoincrement.

En el formulario de nueva orden, el campo "Operario Responsable": reemplazarlo por Productor.

En el formulario de nueva orden, el campo Productos (antes Operario Responsable*) solo debe listar usuarios con rol Productor y que estén activos.

En el formulario de nueva orden, el campo Fecha de Inicio solo debe permitir fechas válidas (no fechas o horas ya pasadas).

En el formulario de nueva orden, el campo "Fecha de finalización": reemplazar ese campo por tiempo de preparación en minutos (ej. tiempo de preparación 25 min).

Al crear la nueva orden, mostrar notificación de éxito o error y el motivo.

La tabla que lista las órdenes de producción debe mostrar: ID Orden, Producto, Cantidad, Operario Responsable, Fecha Inicio, Estado, Acciones.

Debe poder cambiar el estado de la columna estado con un select que permita estados como: pendiente, en proceso, completa, cancelada (cuando se crea se crea en estado pendiente); cuando el estado cambie a cancelada debe pedir el motivo y este debe ser entre mín. 10 a máx. 50 caracteres, y cuando el estado cambie a completada no debe permitir cambiarle el estado (es el estado final de la orden) y retiremos el botón de cambiar de estado de la lista de acciones.

Debe permitir cambiar el estado correctamente (pendiente, en proceso, completada, cancelada).

Debe poder ver detalles de la producción y este debe cargar todos los datos de la orden de producción.

Eliminemos el botón de eliminar de las acciones de producción/producción, ya que en caso tal la orden se cancela, pero no se debe permitir eliminar; entonces retiremos el botón.

Barra de búsqueda funciona a partir de 2 caracteres, máximo 50 caracteres, y que cuente con filtros rápidos como: estado, fecha.

Que todo lo anterior cuente con su notificación de éxito o error y motivo.

Producción/Entrega de insumos:

+Nueva entrega debe mostrar en su formulario todos los campos completos para poder crear una nueva entrega de insumos, cada campo debe tener sus validaciones en tiempo real y de tipo de dato ingresado en el campo y no deben permitir números negativos.

Debe pedir confirmación de creación de la entrega de insumos y, al confirmarse la creación, debe mostrar la notificación de éxito o error y el motivo.

La tabla que lista las entregas debe cargar los datos: Insumo, Cantidad, Operario, Fecha, Hora, Acciones.

Ver detalles debe cargar todos los datos de la entrega de insumos: Entregado a, Insumo (insumo o lista de insumos entregados en la entrega), Cantidad, ID Entrega, Fecha de Entrega y Hora de Entrega.

Eliminar entrega de insumos debe pedir motivo de eliminación de la orden (mín. 10 a máx. 50 caracteres), debe pedir confirmación de eliminación y al confirmar elimina la orden (petición delete).

La barra de búsqueda debe activarse desde 2 caracteres a máx. 50 caracteres y contar con filtros rápidos como: por operario.

PRODUCCIÓN / Insumos (la nueva gestión agregada):

En su tabla principal debe listar: nombre del insumo, cantidad del insumo, Operario, Fecha.

ATENCIÓN: ESTA TABLA DEBE IR RELACIONADA CON LOS PRODUCTOS DE TYPO "de preparación", ya que el flujo va a ser el siguiente: se crea la entrega de insumos y se registra dentro de la tabla insumos; cuando se cree una nueva orden de producción, se descuenten los insumos de la tabla de insumos según el producto (de preparación) que se haya agregado a la orden. La idea es que producción gestione las órdenes, entrega de insumos gestione la entrega de los insumos y que la gestión insumos y su tabla sirva como el medidor de los insumos que se van gastando, estos dependiendo de qué tipo de producto (de preparación) se vaya agregando a una nueva orden de producción o sea pedido por el cliente desde el carrito.

La gestión que agregamos no debe tener acciones de ningún tipo ni eliminar insumo, ni editar insumo, solo debe listarlos y permitir ver los detalles del insumo y mostrar la alerta y notificación cuando el insumo se acaba y solicitar crear una entrega de insumos con ese insumo para poder preparar el producto de preparación.

Debe tener barra de búsqueda a partir de dos caracteres y filtro rápido como: fecha, productor responsable.

Paso 5:
Ventas.

Ventas/Clientes:

La tabla debe cargar con los datos: TipoDoc., Nombre, Teléfono, Email, Compras, Estado, Acciones.

+Nuevo cliente: debe cargar el formulario con todos los datos para crear el cliente correctamente (los mismos datos del formulario de registrarse al lado de login).

Debe poder permitir cambiar el estado entre (activo / inactivo) y debe pedir motivo de cambio de estado (mín. 10 caracteres a máx. 50 caracteres); si el cliente está inactivo, no debe listarse en los demás select donde se listen los clientes y debe indicarle al cliente que está inactivo cuando se quiere loguear en estado inactivo.

Ver detalle debe cargar todos los datos del cliente completos: ID Cliente, Nombre Completo, Tipo de Documento, Documento, Teléfono, Email, Dirección, Compras Realizadas, Última Compra, Estado, historial de cambios.

Editar debe cargar todos los datos actuales del cliente y sus campos deben tener validaciones en tiempo real y debe permitir guardar los cambios realizados y mostrar notificación de éxito o error y el motivo.

Eliminar: debe solicitar motivo de eliminación del cliente y debe pedir confirmación de la eliminación y mostrar notificación de éxito o error y motivo.

Debe tener barra de búsqueda funcional a partir de 2 caracteres a máx. 50 y tener filtro rápido combinado como: Tipo Doc., Estado.

Ventas/Ventas:

La tabla debe listar los datos completos: Tipo, Cliente, Fecha, Productos, Total, Método Pago, Estado.

+Nueva venta debe mostrar su formulario del siguiente modo, ATENCIÓN AQUÍ: el formulario de Nueva venta debe cargar con los campos: Tipo de Venta, Cliente, Método de Pago.

Tipo de Venta es un select que permite escoger entre Venta directa o Venta por pedido.

Si es venta directa, entonces el formulario debe permitir seleccionar en el campo Cliente poder elegir el cliente de la lista select o buscar también escribiendo el nombre para una búsqueda más rápida (las dos opciones deben funcionar).

Agregar Productos con:

Método de Pago: un select entre (efectivo o transferencia).

Producto: un select de los productos existentes creados y que estén activos.

Cantidad: debe poder borrar el 0 que está en el campo y escribir sobre él para ingresar la cantidad que el usuario desee.

El precio debe cargarse al seleccionar el producto, ya que en ese campo va el precio de venta del producto.

Si es venta directa, debe solicitar el pago del 100% y que al crear la venta como venta directa se cree con estado de completada.

Si es Tipo de Venta por pedido, que el formulario le muestre un select en el campo Número de Pedido y que este select solo liste los pedidos que están creados en pedidos, y que también pueda pegar el id del pedido en este campo para facilitar la búsqueda y que al seleccionar el pedido por su id entonces se carguen los datos con los que se creó el pedido: el cliente que hizo el pedido, los productos con los que se creó el pedido, los precios (todos los datos del pedido). Y que permita crear la nueva venta pero en estado de Pendiente, ya que en el pedido que hizo el cliente por medio del carrito ya estableció el método de pago y la cantidad que abonó, que debe ser mayor al 50% del valor del pedido o del 100% si el cliente lo desea, pero se cambia el estado de la venta a completada cuando el domiciliario al que se le entregó ese domicilio entonces lo entregue y cambie su estado a Completada.

El caso de todo lo anterior es que desde el formulario de nueva venta se dirija la venta en el select de Tipo de Venta, ya que tipo de venta directa es una venta directa como su nombre lo dice y en ella se tienen que escoger los productos para esa venta que se está creando; y si la venta es de tipo por pedido, entonces es que esa venta se va a crear en base a todo un pedido que ya está creado en pedidos.

Ambos tipos de ventas deben tener sus validaciones en tiempo real, no deben permitir ingreso de números negativos, y deben ser creados con su estado indicado.

Para crear la venta directa debe tenerse mínimo un producto seleccionado agregado.

Ambos tipos de venta deben crearse correctamente con su estado correcto.

Debe contener la barra de búsqueda funcional a partir de 2 caracteres y máx. 50 caracteres y filtros rápidos como: por tipo de venta, estado, fecha, método de pago.

Retirar de todo lado el método de pago de tarjeta (no lo requiere).

Ventas/Abonos:

Debe tener la tabla donde se listen todos los abonos con los siguientes datos: id Pedido, Monto abonado y porcentaje, Fecha, Método Pago, Estado, Acciones.

Debe cargarse el dato del Id del pedido al que va relacionado el abono.

El estado no debe poder cambiarse desde la tabla que los lista, solo debe poder visualizarse, ya que el estado va unido a cómo vaya el proceso en: pedido -> domicilio -> venta.

Entonces, de la forma lógica, quiero que lo relacionemos: abonos con los pedidos que se hagan con un abono desde el carrito o desde crear venta como pedido desde la gestión de ventas.

En ver detalle debe cargar los datos completos de: ID Abono, Pedido, Monto abonado y %, Valor completo del pedido, Fecha, Método de Pago, Estado.

En +Nuevo abono se debe seguir la misma lógica que maneja el carrito para el cliente y poder crear el abono y, al crear el abono, insertarlo como un pedido en la gestión de pedidos.

Los campos del formulario de Nuevo Abono deben contar con la validación en tiempo real, deben validar que no se ingresen números negativos y en el campo de Monto del Abono debe permitir borrar el "0" para escribir sobre el campo sin problema el valor del abono.

El campo de monto del abono debe tener su validación de que sea mayor al 50% del valor de los productos del pedido.

Al crear el abono debe mostrar la notificación de éxito o error y el motivo.

La barra de búsqueda debe funcionar a partir de 2 caracteres y debe permitir filtrar rápido por: método de pago, estado.

Ventas/Pedidos:

La tabla donde se listan los pedidos debe mostrar los datos completos: ID Pedido, Cliente, Productos (cantidad de productos), método de pago, Fecha Pedido, Fecha Entrega, Estado, Acciones.

El estado del pedido debe poder modificarse de forma correcta, y los estados del pedido deben estar correctamente unidos entre módulos; al cambiar el estado a completado, debe pedir confirmación de cambio de estado y avisar que, al cambiar al estado completado, ya no se podrá reversar el cambio ya que es el estado final.

En ver detalles de la venta debe mostrar los datos completos: ID Pedido, Cliente, Productos (lista de los productos seleccionados), método de pago, % del abono, Total, Fecha Pedido, Fecha Entrega, Estado.

En editar pedido solo se debe poder editar si el pedido está en pendiente; si el pedido ya cambió al siguiente estado, no se debe poder editar el pedido y debe mostrar la notificación o advertencias del por qué no se puede editar el pedido si cambia de estado inicial, que ya se debería crear otro pedido nuevo.

En nuevo pedido debe mostar el formulario completo correcto para poder crear el nuevo pedido.

Al seleccionar el cliente debe salir solo usuarios con rol de cliente y que estén activos en el select del campo Cliente, y también debe poder permitir escribir para una búsqueda más rápida.

Fecha Pedido no debe poder ingresarse por el usuario, ese dato se ingresa automáticamente con los datos del PC en ese momento.

En el formulario nuevo pedido también debe establecer si hace un abono del 50% o si lo hace del 100% del valor del pedido y el método de pago.

Fecha de entrega debe permitir fechas a futuro solamente (nada de fechas ni horas en el pasado).

En el formulario de nuevo pedido, al tener un producto seleccionado para crear el pedido, al presionar el "CREAR PEDIDO" debe mostrar una notificación de éxito o error y el motivo.

Los nuevos pedidos que se hacen con el 50% de abono deben ingresar automáticamente a la tabla que lista los abonos en ventas/abonos con su estado correcto.

La barra de buscar debe funcionar a partir de 2 caracteres, máx. 50 caracteres, y debe tener filtros rápidos como: por estado, método de pago, fecha.

Ventas/Domicilios:
A este módulo requiero que me ayudes a conectarlo con el estado del pedido, el estado de la venta, el estado del abono y el estado del domicilio, ya que va a variar si el cliente hizo el pago del 50% o del 100%. Solo se debe ingresar a la venta el domicilio del pedido cuando el repartidor cambie su estado a completada, ya que él debe cobrar o tomarle foto al recibo del restante del pedido. Cuando el estado cambie en el domicilio, debe cambiar el estado de lo relacionado con ese domicilio de ese pedido.

Debe listar en la tabla los datos completos del pedido: ID Pedido, Cliente, Productos, Total, Fecha Pedido, Fecha Entrega, Estado.

Debe permitir cambiar el estado del domicilio a completado o a cancelado; de ser cancelado, debe pedir motivo (mín. 10 caracteres, máx. 50 caracteres). De cambiar de estado a completada, entonces ingresa a la tabla ventas y cambia su estado a completada.

La barra de búsqueda debe funcionar correctamente a partir de dos caracteres y debe poder filtrar rápido por: estado, repartidor.

__GENERAL
1* (TODO LO ANTERIOR DEBE contar con validaciones y notificaciones de forma clara para cada acción y su notificación de confirmación o error y el motivo del error). Las reglas de oro son: nada de inputs negativos ni fechas pasadas.
2* TODO DEBE tener un flujo claro y que agilice los procesos del pedido y los módulos relacionados con el pedido.
3* Estandarizar todos los iconos que se usan dentro de las tablas, ya que varios que hacen la misma acción se ven diferente.

pero integrale sus puntos donde debe corregir la base de datos y como debe quedar su tabla en la db completa
todo para llevar cada aspecto claro en cada paso que se este ejecutando