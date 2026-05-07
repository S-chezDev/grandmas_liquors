quiero que hagamos los siguientes ajustes dandole prioridad a no modificar nada de el diseño original de frontend solo validar que el frontend tenga correctamente integraso su consumo de la api de backend:

paso 1:
Landing / inicio web  debe consumir los datos de la api backend de las tablas: productos, categorias  y auth  

paso2: 
Dashboard 
rebemos retirar Inicio ya que se repuite su contenido (/ — mismo componente que dashboard) y dedjar a Dashboard con Panel / métricas/ medicion para que en dasboar tenga el siguiente diseño: 
* Ventas del Mes,Ventas Hoy, Pedidos Activos, Clientes Activos 
* Ventas Mensuales
*Distribución por Categoría
*Productos Más Vendidos
*Pedidos Recientes
(que todo lo anterior sea consumido desde el backend )

paso3: Usuarios / gestion usuarios 
*la tabla que lista los usuarios debe ser: Nombre Completo	Documento	Email	Teléfono	Rol	Estado	Acciones 
*la accion de ver detalle debe mostrar todos los datos de el usuario sin problema
*la accion de editar debe de: permitir editar correctamente y al ser precoinada debe mostrar los formularios cargando los datos actuales de ese ususario  y debe permitir que estos sean editados y guardados y los campos deben contar con sus validaciones logicas
*retirar el icono de cambiar estado de usuario y permitir que el estado se cambie desde la cuolumna estado (activo/inactivo como se implementa el estado de proveedores) y que al cambiar el estado se pida motivo de cambio de estado de el ususario min 10 max 50 caracteres
*la accion eliminar, solicite motivo de eliminacion y  permita eliminar solo si el ususario que va a ser eliminado no tiene pedidos, abonos, domicilios pendientes todo debe estar en completado para poder eliminarlo y debe mostrar sus correctas alertas y validaciones y la aliminacion de el usuario debe usar la peticion Delete de usuario 
*+nuevo usuario: su formulario debe contar con todos los datos para el nuevo usuaro e incluir sus validaciones en cada campo ydebe mostrar dar la notificacion 
*barra de busqueda funcional apartir de dos caracteres y debe tener filtros para filtrar por (Rol y estado) 
*(todo lo anterior debe tener sus respectivas notificaciones de exito o error y motivos)
paso 4: 
Compras/Proveedores

*la tabla que lista los proveedores debe mostrar los datos: Tipo	Nombre/Razón Social	NIT/Documento	Teléfono	Email	Preferente	Estado	Acciones

*la colunma de preferente debe poder canbiar su estado rapidamente desde la lista de el proveedor (si/no debe cambiar entre preferente o no con un solo click)

*el estado debe poder cambiar entre activo/inactivo y debe pedir el motico de camibo de estado (min 10 a max 50 caracteres), y una vez que el estado cambie a inactivo este proveedor que paso a estar inactivo no debe aparecer en ningun otro proceso relacionado con listar los proveedores(forma logica, inactivo es inactivo completamente hasta que cambie su estado a activo y en ese caso debe mostrarse correctamente)

*en la accion ver detalles debe cargar todos los datos de el proveedor completos + historias de cambios y sus motivos 

*en la accion editar debe cargar los datos de el proveedor actuales y debe permitir modificar cualquier campo a exepcion de el "NIT" debe mostrar su adventencia en tiempo real de por que no permite editar ese campo de NIT y cada campo debe contar con sus validaciones, alertas, y envio de datos correctos luego de guardar o confirmar los cambio entonces debe mostrar la notificaion (todo debe ser intuiticvo para el ususario final)

*eliminar proveedor debe pedir motivo(min 10 a max 50 caracteres) y debe confirmar la eliminacion luego de la eliminacion mostrar la notificacion de exito o error y su motivo

*el +Nuevo proveedor el formulario debe contar con todas las validaciones claras y en tiempo real para los datos que se van ingresando y debe mostrar sus notificaiones de ecito o error y el motivo

*la barra de buscardor debe funcioanr con mas de dos caracteres y maxmo 50 caracteres y contar con filtros rapidos por: tipo, estado, preferente 

Compras/compras
*Su tabla que lista las compras debe mostrar Los datos: 
ID Compra	Proveedor	Fecha	Productos	Total	Estado	Acciones

*ver detalle debe mostrar todos los datos completos de la compra: 
Proveedor, Fecha de Compra, Fecha de Creación, Estado, Subtotal, IVA (19%), Total
Productos con: Producto	Cantidad	Precio Unit.	Subtotal

*compra debe poder cambiar entre los estados: pendiente,recibida, cancelada
para cambiar el estado a cancelada debe pedir motivo de cancelacion de la compra, para el estado recibida debe pedir confirmacion de que los productos llegaron completos y cuando se cambie a el estado recibida y se confirme entonces los productos comprados ingresen a stock de productos  y que el estado de esa compra no se pueda modificar despues de recibida

*debe funcionar su barra de busqueda apartir de dos caracteres y un max de 50 caracteres, debe tener filtros rapidos por; fecha, estado 

*+Nueva compra debe permitir crearse correctamente en estado pendiente por default, su su formulario debe contar con las validacionesen tiempo real y de los datos que se estan ingresando, el campo  
*Proveedor 
 solo debe listar los proveedores activos 
*el campo Fecha no debe permitir escoger fechas anteriores a la actual(no fechas ni horas pasadas) 
*el campo Ganancia (%)  debemos retitrarlo de ahi y moverlo a nuevacompra/agregar productos  y a agregar productos hagamosle los siguientes puntos

en el formulario de nueva compra en Agregar Productos:
*el campo Producto solo debe permitir seleccionar productos activos 
*el campo Cantidad solo debe permitir numeros positivos (no -1,-2-etc) y debe poder permitir poder borrar el "0" con el que se inicia ese campo de cantidad  para poder ingresar la cantidad que el usuario desee 
*el campo de 
precio unirario cambiemoslo por: precio de compra
*Precio de compra debe permitir ingresar el precio por el usuario y siempre debe ser numeros positivos
(cada campo de el formulario nueva compra debe tener sus validaciones en tiempo real y de el tipo de dato mostrando sus alertas ) 
*luego de establecer el precio de compra le agregamos el campo de Ganancia (%)  al lado de el campo de precio de compra  y que el campo de Ganancia (%) * solo permita numeros positicos y que este campo tambien cuente con su validacion y nada de valores negativos
*debe tener el boton para agregar el producto 
*para poder crear la compra debe almenos contener 1 producto y debe notificar la creacion de la compra (exito o error y su motivo)
*la compra de crea en estado pendiente y cuando se cambie el estado de esta compra a recibida entonces incrementar en stock la cantidad de los productos que se compraron (sea un solo producto o mas de 1)
*la barra de busqueda se activa con mas de 2 caracteres y max 50 y debe tener filtros rapidos como: fecha, estado

Compras/productos
*la lista debe cargar todos los productos activos/incactivos
*la tabla con la lista de productos debe tener:  
Producto	 Categoría	typo     Precio	Stock	Estado	Acciones

*ver detalle de produtco debe contar con todos los datos de el producto e historias de modificaiones

*estado debe poder cambiarse entre activo/incativo y al cambiarse el estado debe pedir el motivo de activacion o inactivacion de el producto(min 10 a max 50 caracteres)

*editar debe cargar todos los datos actuales de el producto y debe permitir editar cualquiera de los campos de el producto y poder guardar los cambios realizados y pedir una confirmacion y luego de confirmacion debe mostrar la notificaion de exito o error y motivo 

*eliminar (peticion delete) debe pedir un motivo de la eliminacion de el producto y debe confirmar la elimicacion, cuando se confirme la eliminacion debe notificar exito o error y motivo

*la barra de busqueda debe permitir buscar apartir de 2 caracteres y max 50 caracteres ademas debe contar con filtros rapidos como categoria, estado, precio

*el formulario de Nuevo Producto debe contar con todos los campos para poder crear el producto correctamente y cada uno de los campos debe tener sus validaciones en tiempo real y de el tipo de dato correcto, y  debe poder permitir borrar el 0 para que el usuario ingrese el stock minimo (no permitir numeros negativos)

*el campo de  Stock Actual  va a ser por default 0 cuando se esta creando el producto y este incrementa solo cuando se recibe la compra de ese producto 

*agregar un campo "Typo" que sea un select que permita elejir si el producto es terminado o de preparacion solo las dos opciones anteriores

*el select de Categoria debe solo mostrar categorias activas

*al crear pedido debe validar que todos los datos obligatorios esten completos y tener sus validaciones 

*el campo de 
Nombre del Producto * debe validar en tiempo real que no se repita ese nombre con otro producto

*debe confirmar cuando se cree el produccto notificacion exito o error y motivo 

Compras/categorias de producto

*la lista de las categias debe cargar con todos los datos: Categoría	Descripción	Productos	Estado	Acciones 

*estado debe permitir seleccionar y cambiar el estado entre (activo/inactivo) y pedir motivo de el cambio de el estdo de min 10 a max 50 caracteres  

*ver detalle debe mostrar todos los datos de la categoria y historias de modificaiones 

*editar debe cargar los datos actuales de la categoria y debe permitir aditar cualquiera de los campos y todos los campos deben tener sus validaciones en tiempo real y de tipo de dato corecto y luego permitir guardr los cambios realizados (actualizar) el campo de nombre de categoria no debe permitir nombres de categorias repetidos

*elimiar (peticion delete) debe pedir motivo de eliminacion de la categoria y confirmacion luego de confirmar la eliminacion debe mostrar la notificacion exito o error y motivo

*+nueva categoria debe mostrar su formulario con los datos correctos para poder crear la nueva categoria correctamente y cada uno de sus campos debe tener las validaciones en tiempo real y de el tipo de dato correcto  y al crar la categoria debe mostrar su notificaion exito o error y motivo

*la barra de busqueda debe funcionar desde 2 caracteres a max 50  y debe tener filtro rapido por:  estado, categoria 

paso4:
*integrar una nueva gestion dentro de Produccion  llamada "insumos"

produccion/ produccion
*+nueva orden debe mostrar el formulario para crear la nueva orden y el formulario debe contar con todas las validaciones en tiempo real y de el tipo de dato 

*el formulario de Nueva orden en el campo Producto * debe solo listar los productos que hayan sido creados con el typo "de preparacion"  y que esten activos  
*en el formulario de nueva orden en el campo "Cantidad "  debe permitir borrar el 0 y dejar que el ususario ingrese la cantidad que va a pedir de ese produto de preparacion sin permitir valores negativos
*en el formulario de nueva orden el campo "Lote " reemplacemoslo IdOrden y no debe ser ingresado por el usuario debe crearse automaticamente con autoincrement 
*en el formulario de nueva orden el campo  
"Operario Responsable" reemplazarlo por Productor  
*en el formulario de nueva orden el campo  
Productos(antes Operario Responsable * ) solo debe listar ususarios con rol Productor 
y que esten activos

*en el formulario de nueva orden el campo 
Fecha de Inicio * solo debe permitir fechas validas(no fechas o horas ya pasadas) 

*en el formulario de nueva orden el campo 
"Fecha de finalizacion"  reemplazar ese campo por tiempo de preparacion en minutos (ej tiempo de preparacion 25min)

*al crear la nueva orden mostrar notificaion de exito o error y el motivo 

* la tabla que lista las ordenes de produccion debe mostrar ID Orden	Producto	Cantidad	Operario Responsable	Fecha Inicio	Estado	Acciones 

*debe poder cambiar el estado de la columna estado con un select que permita estados como: pendiente, en proceso, completa ,cancelada(cuando se crea se crea en estado pendiente)
cuando el estado cambie a cancelada debe pedir el motivo y este debe ser entre min 10 a max 50 caracteres y cuando el estado cambie  a completada no debe permitir cambiarle el estado(es el estado final de la orden) y retiremos el boton de cambiar de estado de la lista de acciones 

*debe permitir cambiar el estado correctamente (pendiente, en proceso, completada, cancelada)

*debe poder ver detalles de la produccion 
y este debe cargar todos los datos de la orden de produccion

*eliminemos el boton de eliminar de las acciones de produccion/produccion ya que en caso tan la orden se cancela pero no se dbe permitir eliminar entonces retiremos el boton

*barra de busqueda funciona apartir de 2 caracteres maximo 50 caracteres y que cuente con filtros rapido como: estado, fecha

*que todo lo anterior cuente con su notificacion de exito o error y motivo 

produccion/entrega de insumos
*+Nueva entrega debe mostrar en su formulario todos los campos completos para poder crear una nueva entrega de insumos, cada campo debe tener sus validaciones en tiempo real y de tipo de dato ingresado en el campo y no deben permitir numeros negaritos 

*debe pedir confirmacion de creacion de la entrega de insumos y al confirmase la creacion debe mostrar la notificaicon de exito o error y el motivo


*la tabla que lista las entregas debe cargar los datos: Insumo	Cantidad	Operario	Fecha	Hora	Acciones 

* ver detalles debe cargar todos los datos de la entrega de insumos: Entregado a,  insumo (insumo o lista de insumos entregados en la entrega), Cantidad,  ID Entrega, Fecha de Entrega y Hora de Entrega

*eliminar entrega de insumos debe pedir motivo de eliminacion de la orden min 10 a max 50 caracteres (debe pedir confirmacion de eliminacion)  y al confirmar elimina la orden (peticion delete)


*la barra de busqueda debe activarse desde 2 caracteres a max 50 caracteres y contar con filtro rapidos como: por operacio


PRODUCCION / insumos (la nueva gestion agregada)
*en su tabla principal debe listar:
nombre de el insumo, cantidad de el insumo, Operario, Fecha 

ATENCION: ESTA TABLA DEBE IR RELACIONADA CON LOS PRODUCTOS DE TYPO "de preparacion" ya que el flujo va a ser el siguiente: 
se crea la entrea de insumos y se registra 
dentro de la tabla insumos, cuando se cree una nueva orden de produccion, se descuenten los insumos de la tabla de insumos segun el producto (de preparacion) que se haya agregado a la orden
la idea es que produccion gestione las odenes, entrega de insumos gestione la en la entrega de los insumos y que la gestion insumos y su tabla sirva como el medidor de los insumos que se van gastando estos dependiendo de que tipo de producto(de preparacion) se vaya agregando a una nuyeva orden de produccion o sea pedido por el cliente desde el carrito

*la gestion que agregamos no debe tener acciones de ningun tipo ni eliminar insumo, ni editar insumo, solo debe listarlos y permitir ver los detalles de el insumo y mostrar la alerta y notificaion cuando el insumo se acaba y solicitar crear una entrega de insumos con ese insumo para poder preparar el producto de preparacion

*debe tener barra de busqueda apartir de dos caracteres y filtro rapido como: fecha, productor responsable

paso 5: 
Ventas
Ventas/Clientes 
*la tabla debe cargar con los datos:TipoDoc.		Nombre 	Teléfono	Email	Compras	Estado	Acciones

*+nuevo cliente 
debe cargar el formulario con todos los datos para crear el cliente correctamente(los mismos datos de el formulario de registrarse al lado de login)

*debe poder permitir cambiar el estado entre (activo / inactivo) y debe pedir motivo de cambio de estado min 10 caracteres a max 50 caracteres (si el cliente esta incactivo no debe listarse en los demas select donde se listen los clientes y debe indicarle a el cliente que esta inactivo cuando se quiere loguear en estado inactivo) 

*ver detalle debe cargar todos los datos de el cliente completos :
 ID Cliente
Nombre Completo
Tipo de Documento
Documento
Teléfono
Email
Dirección
Compras Realizadas
Última Compra
Estado

historial de cambios

*editar debe cargar todos los datos actuales  de el cliente y sus campos deben tener validaciones en tiempo real y debe permitir guardar los cambios realizados y mostrar notificacion de exito o error y el motivo

*eliminar debe solicitar motivo de eliminacion de el cliente  y debe pedir confirmacion de la eliminacion   y mostrar notificaion de exito o error y motivo 

*debe tener barra de busqueda funcional apartir de 2 caracterez a max 50 y tener filtro rapodi convinado como: 
Tipo Doc., Estado

Ventas/ventas 

*la tabla debe listar los datos completos:
Tipo	Cliente	Fecha	Productos	Total	Método Pago	Estado 

* +Nueva venta debe mostrar su formulario de el siguiente modo ATENCION AQUI: 
el formulario de Nueva venta debe cargar con los campos: Tipo de Venta, Cliente, Método de Pago
*Tipo de Venta es un select que permite escoger entre Venta directa O venta Por pedido
- si es venta directa entonces el formulario debe permitir seleccionar en el capo Cliente poder  elejir el cliente de la lista select o buscar tambien escribiendo el nombre para una busqueda mas rapida(las dos opciones deben funcionar)

Agregar Productos con: 

-Método de Pago
un select entre (efectibo o trasnferencia)
Producto(un select de los productos existentes creados y que esten activos), cantidad (debe poder borrar el 0  que esta en el campo y escribir sobre el para ingresar la cantidad que el usuario desee ), el precio debe cargarse al seleccionar el producto ya que  en ese campo va el precio de venta de el producto
si es venta directa debe solicitar el pago de el 100%  
y que al crear la venta como venta directa se cree con estado de completada


*si es Tipo de Venta  es por pedido que el formulario le muestre un select en el campo Número de Pedido  y que este selec solo liste los pedidos que estan creados en pedidos, y que tambien pueda pegar el id de el pedido en este campo para facilitar la busqueda y que al seleccionar el pedido por su id entonces se carguen los datos con los que se creo el pedido
el cliente que hizo el pedido, los productos con los que se creo el pedido, los precios, (todos los datos de el pedido)
y que permita crear la nueva venta pero en estado de Pendiente, ya que  en el pedido que hizo el cliente por medio de el carrito ya establecio el metodo de pago y la cantidad que abono que debe ser mayor a el 50% de valor de el pedido o de el 100% si el cliente lo desea, pero se cambia el estado de la venta a completada cuando el domiciliario a el que se le entrego ese domicilio entonces lo entrege y cambie su estado a Completada

el caso de todo lo anterior es que desde el formulario de nueva venta se dirija la venta en el select de Tipo de Venta 
ya que tipo de venta directa es una venta directa como su nombre lo dice y en ella se tienen que escoger los productos para esa venta que se esta creando 
y 
si la venta es de tipo por pedido entonces es que esa venta se va a crean en base a todo un pedido que ya esta creado en pedidos

*ambos tipos  ventas deben tener sus validaciones en tiempo real, no deben permitir ingreso de numeros negaritivos, y deben ser creados con su estado indicado 

*para crear la venta directa debe tenerse minimo un producto seleccionado agregado

*ambos tipos de venta deben crearse corrrectamente  con su estado correcto

*debe contener la barra de busqueda funcional apartir de 2 caracteres y max 50 caracteres y filtros repidos como: por  tipo de venta, estado. fecha metodo de pago 

*retirar de todo lado el metodo de pago de tarjeta(no lo requeire)

Ventas/Abonos 
*debe tener la tabla donde se linten todos los abonos con los siguientes datos: id Pedido	Monto abonado y porcentaje  	Fecha	Método Pago	Estado	Acciones

*debe cargarse el dato de el Id de el pedido a el que va relacionado el abono

*el estado no debe poder cambiarse desde la tabla  que los lista solo debe poder visualizarce ya que el estado va unido a como vaya el proceso en, pedido -> domicilio -> venta 

*entonces de la forma logica queiro que lo relacionemos abonos con los pedidos que se hagan con un abono desde el carrito o desde crear venta como pedido desde la gestion de ventas

*en ver detalle debe cargar los datos completos de :
ID Abono
Pedido

Monto abonado y % 
Valor completo de el pedido
Fecha
Método de Pago
Estado


*en +Nuevo abono
se debe seguir la mismoa logica que maneja el carrito para el cliente y poder crear el abono y al crear el abono insertarlo como un pedido en la gestion de pedidos

*los campos de el formulario de Nuevo Abono deben contar con la validacion en tiempo real, deben validar que no se ingresen numeros negativos y en el campo de Monto del Abono  debe permitir borrar el "0 " para escribir sobre el campo sin problema el valor de el abono

*el campo de  monto de el abono debe tener su validacion de que sea mayor a el 50% de el valor de los pductos de el pedido

*al crear el abono debe mostrar la notificaion de exito o error y el motivo

*la barra de busqueda debe funcionar apartir de 2 caracteres y debe permitir filtrar rapido por : metodo de pago, estado


Ventas/Pedidos
*la tabla donde se listan los pedidos debe mostrar los datos completos: ID Pedido	Cliente	Productos(cantidad de productos)	metodo de pago	Fecha Pedido	Fecha Entrega	Estado	Acciones 

*el estado de el pedido debe poder modificarse de forma correcta, y los estados de el pedido deben estar correctametne unidos entre modulos, al cambiar el estado a completado debe pedir confirmacion de cambio de estado y avisar que al cambiar a a el estado completado ya no se podra reversar el cambio ya que es el estado final

*en ver detalles de la venta debe mostrar los datos completos
ID Pedido
Cliente
Productos (lista de los productos seleccionados)
metodo de pago
%de el abono
Total
Fecha Pedido
Fecha Entrega
Estado

*en editar pedido solo de debe poder editar su el pedido esta en pendiente, si el pedido ya cambio a el siguiente estado no se debe poder editar el pedido y debe mostrar la notificacion o advertencias de el por que no se puede editar el pedido si cambia de estado inicial, que ya se deberia crear otro pedido nuevo

*en nuevo pedido debe mostar el formulario completo correcto para poder crear el nuevo pedido

*al seleccionar el cliente debe salir solo usuarios con rol de cliente  y que esten activos en el select de el campo Cliente
y tambien debe poder permitir escribir para una busqueda mas rapida


*Fecha Pedido  no debe poder ingresarse por el usuario, ese dato se ingresa automaticamente con los datos de el pc en ese momento 

*en el formulatrio nuevo pedido tambien debe establecer si 
hace un abono de el 50% o si lo hace de el 100% de el valor de el pedido y el metodo de pago 

*fehca de entrega debe permitir fechas a futuro solamente (nada de fechas ni horas en el pasado)

*en el formulario de nuevo pedido al tener un producto seleccionado para crear el pedido al precionar el "CREAR PEDIDO" Debe mostrar una notificaion de exito o error y el motivo

*los Nuevos pedidos que se hacen con el 50% de abono deben ingresar automaticamente a la tabla que lista los abonos en ventas/abonos con su estadi correcto

*la barra de buscar debe funcionar apartir de 2 caracteres max 50 caracteres y debe tener filtros de rapidos como: por estado, metodo de pago, fecha

Ventas/domilicios
a este modulo requiero que me   ayudes a conectarlo con el estado de el pedido, el estado de la venta, el estado de el abono. y el estado de el momicilio ya que va a variar si el cliente hizo el pago de el 50% o de el 100% 
solo se debe ingresar a la venta el domicilio de el pedido cuando el repartidor cambie su estado a completada, ya que el debe cobrar o tomarle foto a el recibo de el restante de el pedido 
              
cuando el estado cambie en el domicilio, debe cambiar el estado de lo relacionado con ese domicilio de ese pedido

*debe listar en la tabla los datos completos de el pedido ID Pedido	Cliente	Productos	Total	Fecha Pedido	Fecha Entrega	Estado 

*debe permitir cambiar el estado de el mocilio a completado o a cancelado, de ser cancelado debe pedir motivo min 10 caracteres max 50 caraxteres
de cambiar de estado a completada, entonces ingresa a  la tabla ventas   cambia su estado a completada

*La barra de busqueda debe funcioanr correctamente apartir de dos caracteres y debe poder filtrar rapido por: estado, repartidor

(TODO LO ANTERIOR DEBE contar con validaciones y notificaiones de forma clara para cada accion y su notificaion de confirmacion o error y el motiivo de el error)
las reglas de oro son. nada de imputs negativos ni fechas pasadas 

