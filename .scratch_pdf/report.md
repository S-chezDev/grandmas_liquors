# Reporte QA - Historias de Usuario

Se encontraron 287 Historias de Usuario.

## HU_01
**Descripción funcional:** Yo como administrador necesito listar los roles para poder optimizar la búsqueda

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_01`

### Casos de Prueba Ejecutados
- **CA_01_01**: La tabla debe mostrar columnas: ID, Nombre, Estado, Fecha Creación.
- **CA_01_02**: Debe incluir paginación que muestre el total correcto de registros.(A partir de 10)
- **CA_01_03**: Debe tener un botón ""Ver Detalles"" por cada fila.
- **CA_01_04**: Debe tener un campo de filtro de búsqueda que se active al ingresar 3 o más caracteres, no case-sensitive.
- **CA_01_05**: Los roles inactivos deben tener un indicador visual.
- **CA_01_06**: El tiempo de carga debe ser aproximado a 3 segundos para 100+ registros.
- **CA_01_07**: La navegación entre páginas debe ser fluida.
- **CA_01_08**: Los resultados filtrados deben cargar en un aproximado de 2 segundos.
- **CA_01_09**: Administrador" debe tener acceso a esta funcionalidad.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_02
**Descripción funcional:** Yo como administrador necesito ver los detalles para poder ver todos los detalles de cada rol 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_02`

### Casos de Prueba Ejecutados
- **CA_02_01**: La vista de detalle debe mostrar: Nombre, Descripción, Estado, Permisos asociados (agrupados por categoría), Fechas de creación y modificación.
- **CA_02_02**: Debe tener botones ""Editar"" y ""cancelar"".
- **CA_02_03**: Todos los campos deben cargar con información completa.
- **CA_02_04**: La página debe cargar en un aprox de 3 segundos.
- **CA_02_05**:  debe permitir edición directa desde esta vista.
- **CA_02_06**: Debe mostrar máximo 50 permisos por rol; si hay más, usar paginación o scroll.
- **CA_02_07**: El botón ""Editar"" debe estar habilitado tanto para  rol activo e inactivo

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_03
**Descripción funcional:** Yo como administrador necesito crear un rol para  poder garantizar seguridad al sistemas y evita permisos no autorizados por el administrador 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_03`

### Casos de Prueba Ejecutados
- **CA_03_01**: El formulario debe incluir campos: Nombre*, Descripción, Estado, Lista de permisos (checkboxes).
- **CA_03_02**: Debe tener botones ""crear rol"" y ""Cancelar"".
- **CA_03_03**: El nombre es obligatorio, único, entre 3 y 50 caracteres.
- **CA_03_04**: Al menos un permiso debe estar seleccionado para guardar.
- **CA_03_05**: Validaciones en tiempo real deben mostrar errores antes de enviar.
- **CA_03_06**: La interfaz debe permitir selección múltiple de permisos de forma fluida.
- **CA_03_07**: No se debe permitir crear un rol con nombre ya existente.
- **CA_03_08**: No se deben asignar permisos de nivel ""Administrador total"" a roles que no sean administradores.
- **CA_03_09**: Por defecto, el estado debe ser ""Activo"".

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_04
**Descripción funcional:** Yo como administrador necesito editar un rol para  poder Permitir cambiar los roles  

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_04`

### Casos de Prueba Ejecutados
- **CA_04_01**: El formulario debe cargar precargado con los datos existentes del rol.
- **CA_04_02**: Debe mostrar un indicador ""Última modificación por: [usuario]"".
- **CA_04_03**: Botones ""guardar cambios"" y ""Cancelar"".
- **CA_04_04**: Los datos existentes deben cargar correctamente.
- **CA_04_05**: Las validaciones son las mismas que en creación.
- **CA_04_06**: Solo debe actualizar si hubo cambios en los datos.
- **CA_04_07**: El tiempo de carga de datos debe ser aprox a 3 segundos.
- **CA_04_08**: El nombre debe seguir siendo único entre roles activos.
- **CA_04_09**: Cada cambio debe quedar registrado en la auditoría.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_05
**Descripción funcional:** Yo como administrador necesito cambiar estado de un rol para  poder Activar o desactivar accesos y necesidad de eliminar un rol

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_05`

### Casos de Prueba Ejecutados
- **CA_05_01**: Debe mostrar un selector de estado (Activo/Inactivo).
- **CA_05_02**: Al cambiar, debe pedir confirmación con un campo opcional para motivo.
- **CA_05_03**: Botones ""Confirmar"" y ""Cancelar"".
- **CA_05_04**: El estado actual debe ser visible antes del cambio.
- **CA_05_05**: El cambio debe reflejarse en aprox de 3 segundo.
- **CA_05_06**: Debe mostrar un mensaje claro de confirmación después del cambio.
- **CA_05_07**: No se debe permitir desactivar un rol si tiene usuarios activos asignados.
- **CA_05_08**: Solo el administrador puede reactivar un rol inactivo.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_06
**Descripción funcional:** Yo como administrador necesito buscar los roles para poder encontrar los roles por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_06`

### Casos de Prueba Ejecutados
- **CA_06_01**: Debe tener un campo de búsqueda por nombre.
- **CA_06_02**: Debe tener un boton ""Limpiar"".
- **CA_06_03**: La búsqueda debe activarse al escribir 2 o más caracteres.
- **CA_06_04**: Al hacer clic en ""Limpiar"", se debe restaurar la vista completa.
- **CA_06_05**: Los resultados deben mostrarse en la tabla aprox 3 segundos.
- **CA_06_06**: La búsqueda no debe bloquear la interfaz.
- **CA_06_07**: La búsqueda debe incluir roles activos e inactivos.
- **CA_06_08**: Debe priorizar coincidencias exactas en los resultados.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_07
**Descripción funcional:** Yo como adminsitrador necesito asociar los permisos para poder asociar los permisos requeridos 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_07`

### Casos de Prueba Ejecutados
- **CA_07_01**: Debe mostrar lista de permisos disponibles (no asignados aún).
- **CA_07_02**: Checkbox para selección de permisos.
- **CA_07_03**: Botones ""Guardar permisos"" y ""cancelar"".
- **CA_07_04**: Solo se deben mostrar permisos asignados y no asignados actualmente
- **CA_07_05**: Se debe exigir al menos un permiso seleccionado para guardar.
- **CA_07_06**: La carga de permisos debe hacerse en aprox de 3 segundos.
- **CA_07_07**: La selección múltiple debe ser fluida.
- **CA_07_08**: No se debe exceder el límite de 50 permisos por rol.
- **CA_07_09**: No se deben permitir asignaciones de permisos contradictorios (ej. acceso y denegación al mismo recurso).((redactar)

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_08
**Descripción funcional:** Yo como adminsitrador necesito eliminar permisos para poder eliminar los permisos de los roles 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_08`

### Casos de Prueba Ejecutados
- **CA_08_01**: Debe mostrar lista de permisos asignados actualmente.
- **CA_08_02**: Checkboxes para deselección.
- **CA_08_03**: Confirmación individual para cada permiso crítico (ej. permisos de seguridad).
- **CA_08_04**: Solo se deben mostrar permisos asignados.
- **CA_08_05**: La actualización tras eliminar un permiso debe reflejarse en aprox de 3 segundo.
- **CA_08_06**: No se debe permitir eliminar el único permiso que tiene un rol en un módulo crítico si eso dejaría el rol sin acceso a ese módulo.
- **CA_08_07**: Cada rol debe mantener al menos un permiso asignado.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_09
**Descripción funcional:** Yo como admisnitrador necesito listar permisos para poder ver todos los permisos 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_09`

### Casos de Prueba Ejecutados
- **CA_09_01**: La tabla debe mostrar columnas:  rol, Nombre, Descripción, permisos, usuarios y estado
- **CA_09_02**: los permisos deben estar separados por cada modulo
- **CA_09_03**: Todos los permisos deben cargar en la tabla.
- **CA_09_04**: Los filtros deben funcionar de manera combinada.
- **CA_09_05**: La carga completa debe ser aprox a 3 segundos.
- **CA_09_06**: El filtrado debe ser instantáneo (sin recarga completa).
- **CA_09_07**: Los permisos sensibles deben ocultarse para roles que no sean administradores.
- **CA_09_08**: El listado debe ordenarse alfabéticamente por módulo.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_10
**Descripción funcional:** Yo como administrador necesito Eliminar un rol  para  poder Controlar y manejar de roles no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_10`

### Casos de Prueba Ejecutados
- **CA_10_01**: Al eliminar, debe mostrar confirmación con advertencia.
- **CA_10_02**: Debe incluir campo ""Motivo eliminación""* (obligatorio, 10-200 caracteres).
- **CA_10_03**: Botones ""cancelar"" y ""Entendido"". (debe tener reuadro en el boton)
- **CA_10_04**: Para roles con usuarios asignados, se debe notificar que tiene usuarios asignados al rol
- **CA_10_05**: El proceso completo debe tomar aprox de 3 segundos.
- **CA_10_06**: Debe mostrar feedback claro después de la eliminación.
- **CA_10_07**: Solo se permite eliminar roles sin usuarios activos asignados.
- **CA_10_08**: La eliminación debe afectar la base de datos
- **CA_10_09**: Se recomienda hacer un backup manual antes de la eliminación.(opcional)

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_11
**Descripción funcional:** yo como asesor Necesito Registrar usuarios para poder crear usuarios nuevos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_11`

### Casos de Prueba Ejecutados
- **CA_11_01**: El formulario debe incluir: Nombres, Apellidos, Email*, Teléfono, Rol, Estado.
- **CA_11_02**: El email debe ser único y con formato válido.
- **CA_11_03**: Teléfono debe tener 10 dígitos, y formato colombiano
- **CA_11_04**: Todos los campos marcados con * son obligatorios.
- **CA_11_05**: El guardado debe completarse en menos de 2 segundos.
- **CA_11_06**: Debe haber validaciones en tiempo real.
- **CA_11_07**: Se debe enviar una contraseña temporal al email del usuario.
- **CA_11_08**: Por defecto, el estado debe ser ""Activo"".

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_12
**Descripción funcional:** yo como asesor necesito actualizar usuarios para poder permitir cambiar los usuarios

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_12`

### Casos de Prueba Ejecutados
- **CA_12_01**: El formulario debe cargar con los datos actuales del usuario.
- **CA_12_02**: Todos los campos deben ser editables
- **CA_12_03**: El email debe ser único y con formato válido.
- **CA_12_04**: El teléfono debe ser válido.
- **CA_12_05**: Los datos deben cargar en aprox en 3 segundos
- **CA_12_06**: El guardado debe completarse en aprox 2 segundos
- **CA_12_07**: Se debe guardar un historial de cambios.
- **CA_12_08**: Si el email cambia, se debe notificar al usuario.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_13
**Descripción funcional:** yo como asesor necesito cambiar de estado para poder cambiar de estado a cada usuario

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_13`

### Casos de Prueba Ejecutados
- **CA_13_01**: Debe mostrar un selector de estado.
- **CA_13_02**: Al cambiar, se debe pedir confirmación.
- **CA_13_03**: Solo se deben permitir estados posibles según reglas de negocio ( Activo, Inactivo,).
- **CA_13_04**: El cambio debe reflejarse aprox 3 segundos
- **CA_13_05**: Se debe permitir desactivar un usuario con sesión activa y finalizando sesion activa.
- **CA_13_06**: No se debe permitir reactivar un usuario sin motivo y sin confirmacion previa

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_14
**Descripción funcional:** yo como asesor necesito eliminar   usuarios para poder Eliminar los usuarios no desaedos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_14`

### Casos de Prueba Ejecutados
- **CA_14_01**: Al eliminar, debe mostrar confirmación con advertencia.
- **CA_14_02**: Debe incluir campo ""Motivo""* (obligatorio).
- **CA_14_03**: Debe verificar que el usuario no tenga relaciones activas (pedidos, compras, etc.).
- **CA_14_04**: El proceso debe completarse en menos de 3 segundos.
- **CA_14_05**: Solo se permite eliminar si el usuario no tiene transacciones en los últimos 30 días.
- **CA_14_06**: La eliminación es lógica.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_15
**Descripción funcional:** yo como asesor necesito listar usuarios para poder optimizar la busqueda de los usuarios

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_15`

### Casos de Prueba Ejecutados
- **CA_15_01**: La tabla debe mostrar: ID, Nombre, Email, Rol, Estado
- **CA_15_02**: Debe tener filtros por rol y estado.
- **CA_15_03**: Los datos deben mostrarse completos.
- **CA_15_04**: La paginación debe ser funcional.(a partir de 10 usuarios)
- **CA_15_05**: La carga debe ser aprox a 3 segundos para mostrar los usuarios
- **CA_15_06**: El asesor  debe ver usuarios bajo su gestión.
- **CA_15_07**: El orden por defecto debe ser fecha creación descendente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_16
**Descripción funcional:** yo como asesor necesito Buscar usuarios para poder Encontrar los usuarios por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_16`

### Casos de Prueba Ejecutados
- **CA_16_01**: Debe tener un campo de búsqueda por nombre/email.
- **CA_16_02**: La búsqueda debe activarse al escribir 2 o más caracteres.
- **CA_16_03**: Los resultados deben mostrarse en aprox  3 segundos.
- **CA_16_04**: La búsqueda solo debe mostrar todos los usuarios

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_17
**Descripción funcional:** yo como asesor necesito Ver detalle para poder ver todos los detalles de cada usuario

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_17`

### Casos de Prueba Ejecutados
- **CA_17_01**: La vista de detalle debe mostrar perfil completo 
- **CA_17_02**: Debe tener botones según permisos del asesor (editar, cambiar estado, etc.)
- **CA_17_03**: Todos los datos deben cargar correctamente.
- **CA_17_04**: La página debe cargar en aprox 3 segundos.
- **CA_17_05**: El asesor solo debe ver usuarios bajo su gestión.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_18
**Descripción funcional:** yo como administrador necesito registrar usuarios para poder crear usuarios nuevos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_18`

### Casos de Prueba Ejecutados
- **CA_18_01**: El formulario debe incluir: Nombres, Apellidos, Email*, Teléfono, Rol, Estado.
- **CA_18_02**: Email único, formato válido.
- **CA_18_03**: Teléfono 10 dígitos.
- **CA_18_04**: Todos los campos * obligatorios.
- **CA_18_05**: Guardado en aprox 3s.
- **CA_18_06**: Validaciones en tiempo real.
- **CA_18_07**: Las credenciales del usuario son su email y contraseña de registro
- **CA_18_08**: Contraseña temporal enviada.
- **CA_18_09**: Estado ""Activo"" por defecto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_19
**Descripción funcional:** yo como administador necesito actualizar los usuarios para poder perimitir cambiar los usuarios

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_19`

### Casos de Prueba Ejecutados
- **CA_19_01**: Todos los campos editables, incluso email.
- **CA_19_02**: Si se cambia el email, debe seguir siendo único.
- **CA_19_03**: Validaciones en tiempo real
- **CA_19_04**: Carga en aprox 2s, guardado en 3s.
- **CA_19_05**: El administrador puede modificar cualquier usuario.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_20
**Descripción funcional:** yo como administrador necesito cambiar estado para poder cambiar de estado a cada usuarios 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_20`

### Casos de Prueba Ejecutados
- **CA_20_01**: Selector de estado
- **CA_20_02**: Se puede cambiar estado con sesión activa 
- **CA_20_03**: Cambio instantáneo.
- **CA_20_04**: Puede reactivar sin restricciones.
- **CA_20_05**: Notificación obligatoria al usuario.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_21
**Descripción funcional:** yo como administrador necesito eliminar usuarios para poder eliminar los usuarios no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_21`

### Casos de Prueba Ejecutados
- **CA_21_01**: Confirmación avanzada con análisis de impacto.
- **CA_21_02**: Proceso en aprox 3 segundos
- **CA_21_03**: Eliminar  tanto usuarios  activos como inactivos 

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_22
**Descripción funcional:** yo como admisitrador necesito listar los usuarios para poder optimizar el proceso de busqueda de los usuarios 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_22`

### Casos de Prueba Ejecutados
- **CA_22_01**: Tabla completa con todos los campos.
- **CA_22_02**: Filtros avanzados (múltiples criterios).
- **CA_22_03**: Acceso a todos los registros.
- **CA_22_04**: Carga en aprox 4 segundos los usuarios
- **CA_22_05**: Ver todos los usuarios sin restricciones.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_23
**Descripción funcional:** yo como administrador necesito buscar usuarios para poder encontrar los usuarios por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_23`

### Casos de Prueba Ejecutados
- **CA_23_01**: Búsqueda global en todos los campos.
- **CA_23_02**: Filtros combinados.
- **CA_23_03**: Búsqueda en toda la base de datos.
- **CA_23_04**: Resultados en aprox 5 seg
- **CA_23_05**: Acceso sin restricciones.
- **CA_23_06**: La busqueda se realiza despues de  minimo dos y maximo 50.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_24
**Descripción funcional:** yo como administrador necesito ver detalles para poder ver todos los detalles de cada usuario

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_24`

### Casos de Prueba Ejecutados
- **CA_24_01**: Vista completa mas información de perfil y ultimo inicio de sesión
- **CA_24_02**: Todos los datos disponibles.
- **CA_24_03**: Carga <3s con todos los datos.
- **CA_24_04**: Acceso completo sin restricciones.
- **CA_24_05**: Puede resetear contraseña

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_25
**Descripción funcional:** yo como administrador necesito iniciar sesion para poder inciar sesion con cuentas registradas con cada rol 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_25`

### Casos de Prueba Ejecutados
- **CA_25_01**: Pantalla con campos: Email y Contraseña.
- **CA_25_02**: Las credenciales deben ser válidas y la cuenta activa.
- **CA_25_03**: Bloqueo tras 5 intentos fallidos (por 5 minutos).
- **CA_25_04**: Autenticación en aprox 3s.
- **CA_25_05**: Interfaz responsiva (web/móvil).
- **CA_25_06**: La sesión expira tras 30 minutos de inactividad.(por confirmar )

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_26
**Descripción funcional:** yo como usuario necesito cerrar sesion para poder cerrar la sesion y que no quede abierta en otros dispositivos 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_26`

### Casos de Prueba Ejecutados
- **CA_26_01**: Confirmación  cerrar sesión.
- **CA_26_02**: Termina sesión actual inmediatamente.
- **CA_26_03**: Cierre en aprox 2s con redirección automática.a la pagina de inicio

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_27
**Descripción funcional:** yo como usuario necesito cambiar la contraseña para poder tener control de la contraseña personal 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_27`

### Casos de Prueba Ejecutados
- **CA_27_01**: Formulario con campos: Contraseña actual, Nueva contraseña, Confirmar.
- **CA_27_02**: La nueva contraseña no debe ser igual a las últimas 3 utilizadas.
- **CA_27_03**: Debe cumplir: mínimo 8 caracteres, al menos una mayúscula, un número
- **CA_27_04**: Validación en tiempo real.
- **CA_27_05**: Cambio en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_28
**Descripción funcional:** yo como usuario necesito reestablecer la contraseña para poder reestablecerla por si pierde

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_28`

### Casos de Prueba Ejecutados
- **CA_28_01**: Ingresar email registrado.
- **CA_28_02**: Enviar código de verificación por email, de contraseña temporal (válido 2 horas).
- **CA_28_03**: Ingresar nueva contraseña después del código.
- **CA_28_04**: Email enviado en aprox 30s.
- **CA_28_05**: Proceso completo en aprox 5min.
- **CA_28_06**: Enlace válido 2 horas.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_29
**Descripción funcional:** yo como asesor necesito Registrar Proveedores para poder crear nuevos provedores

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_29`

### Casos de Prueba Ejecutados
- **CA_29_01**: Formulario con: RUC/NIT, Nombre, Dirección, Teléfono, Email
- **CA_29_02**: RUC único y válido (formato según país).
- **CA_29_03**: Email formato correcto.
- **CA_29_04**: Teléfono 10 dígitos.
- **CA_29_05**: Guardado en aprox 3s.
- **CA_29_06**: Validaciones en tiempo real.
- **CA_29_07**: Proveedor activo por defecto.
- **CA_29_08**: Alertar si RUC/NIT existe pero está inactivo.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_30
**Descripción funcional:** yo como asesor necesito  listar provedores para poder Ver todos los proveedores registrados

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_30`

### Casos de Prueba Ejecutados
- **CA_30_01**: Tabla con: RUC, Nombre, Contacto, Estado, telefono, proveedores
- **CA_30_02**: Filtros por estado y tipo.
- **CA_30_03**: Datos completos.
- **CA_30_04**: Paginación por defecto 10 registros.
- **CA_30_05**: Carga en aprox 3s .
- **CA_30_06**: Orden por ultima fecha de registro de proveedor
- **CA_30_07**: Destacar proveedores preferentes.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_31
**Descripción funcional:** yo como asesor necesito buscar proveedores para poder Encontrar proveedores mas facil con un filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_31`

### Casos de Prueba Ejecutados
- **CA_31_01**: Campo de búsqueda por RUC/Nombre.
- **CA_31_02**: Resultados con coincidencias parciales.
- **CA_31_03**: Búsqueda se activa con 2+ caracteres.
- **CA_31_04**: Resultados en  aprox 2s.
- **CA_31_05**: Priorizar proveedores activos.
- **CA_31_06**: Incluir inactivos solo si la búsqueda es explícita (ej. checkbox).

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_32
**Descripción funcional:** yo como asesor necesito ver detalle de proveedores para poder Ver todos los detalles de cada proveedor

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_32`

### Casos de Prueba Ejecutados
- **CA_32_01**: Vista con información completa 
- **CA_32_02**: Debe tener boton de cerrar
- **CA_32_03**: Todos los datos cargan.
- **CA_32_04**: Página carga aprox 3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_33
**Descripción funcional:** yo como asesor necesito Actualizar proveedores  para poder Actualizar informacion de cada proveedor

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_33`

### Casos de Prueba Ejecutados
- **CA_33_01**: Formulario editable excepto RUC.
- **CA_33_02**: RUC no editable.
- **CA_33_03**: Mismas validaciones cuando se edita el proveedor
- **CA_33_04**: Carga en aprox 1.5s, guardado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_34
**Descripción funcional:** yo como asesor necesitocambiar estado de proveedores para poder  Llevar el manejo de los estados de cada proveedor

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_34`

### Casos de Prueba Ejecutados
- **CA_34_01**: Selector de estado + motivo obligatorio.
- **CA_34_02**: Confirmación.
- **CA_34_03**: Motivo debe tener entre 10 y 50 caracteres.
- **CA_34_04**: Cambio en aprox 3s.
- **CA_34_05**: No desactivar con órdenes de compra pendientes.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_35
**Descripción funcional:** yo como asesor necesito eliminar proveedores para poder eliminar proveedores no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_35`

### Casos de Prueba Ejecutados
- **CA_35_01**: Confirmación con análisis de impacto.
- **CA_35_02**: Motivo detallado*.
- **CA_35_03**: Proceso aprox 4s.
- **CA_35_04**: Eliminación correcta en la base de datos.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_36
**Descripción funcional:** yo como administrador necesito registrar proveedores para poder tener proveedores nuevos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_36`

### Casos de Prueba Ejecutados
- **CA_36_01**: Formulario con RUC/NIT/Cc, Nombre, Dirección, Teléfono, Email
- **CA_36_02**: RUC único y válido para el país.
- **CA_36_03**: Email válido.
- **CA_36_04**: Teléfono 7-10 dígitos.
- **CA_36_05**: Guardado en <3s.
- **CA_36_06**: Validaciones en tiempo real.
- **CA_36_07**: Proveedor activo por defecto.
- **CA_36_08**: Alertar si RUC existe pero inactivo.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_37
**Descripción funcional:** yo como administrador necesito listar los proveedores para poder ver todos los proveedores registrados

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_37`

### Casos de Prueba Ejecutados
- **CA_37_01**: Tabla con: RUC, Nombre, Contacto, Estado, telefono, emal, preferente, 
- **CA_37_02**: Datos completos.
- **CA_37_03**: Paginación 10 por defecto.
- **CA_37_04**: Carga <3s 
- **CA_37_05**: Orden por ultima fecha de registro de proveedor
- **CA_37_06**: Destacar proveedores preferentes.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_38
**Descripción funcional:** Yo como administrador necesito buscar los proveedores para poder encontrar proveedores mas facil con filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_38`

### Casos de Prueba Ejecutados
- **CA_38_01**: Campo búsqueda por RUC/Nombre.
- **CA_38_02**: Coincidencias parciales.
- **CA_38_03**: Búsqueda con 2+ caracteres.
- **CA_38_04**: Resultados en <1.5s.
- **CA_38_05**: Priorizar activos.
- **CA_38_06**: Incluir inactivos solo si búsqueda explícita.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_39
**Descripción funcional:** yo como administrador necesito ver detalles de proveedore para poder ver todos los detalles de cada proveedor

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_39`

### Casos de Prueba Ejecutados
- **CA_39_01**: Información completa
- **CA_39_02**: Todos los datos cargan.
- **CA_39_03**: Página carga <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_40
**Descripción funcional:** yo como admnistrador necesito actualizar proveedores para poder actualizar la informacion de cada proveedor

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_40`

### Casos de Prueba Ejecutados
- **CA_40_01**: Formulario editable excepto RUC.
- **CA_40_02**: RUC no editable.
- **CA_40_03**: Mismas validaciones que creación.
- **CA_40_04**: Carga aprox 1.5s, guardado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_41
**Descripción funcional:** yo como administrador necesito cambiar estado de proveedores para poder llevar manejo de los estados de cada proveedor 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_41`

### Casos de Prueba Ejecutados
- **CA_41_01**: Selector estado + motivo obligatorio.
- **CA_41_02**: Confirmación.
- **CA_41_03**: Motivo 10-50 caracteres.
- **CA_41_04**: Cambio en en aprox 3s.
- **CA_41_05**: No desactivar con órdenes pendientes.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_42
**Descripción funcional:** yo como administrador necesito eliminar proveedores para poder eliminar proveedores no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_42`

### Casos de Prueba Ejecutados
- **CA_42_01**: Confirmación con análisis de impacto.
- **CA_42_02**: Motivo detallado*.
- **CA_42_03**: Proceso <4s. 
- **CA_42_04**: Eliminación correcta en la base de datos.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_43
**Descripción funcional:** yo como  asesor necesito Registrar una nueva compra para poder  garantizar inventario actualizado

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_43`

### Casos de Prueba Ejecutados
- **CA_43_01**: Formulario con: Proveedor, Fecha, Productos (código, cantidad, precio), Total, IVA, Observaciones.
- **CA_43_02**: Proveedor debe estar activo.
- **CA_43_03**: Cantidades >0.
- **CA_43_04**: Precios válidos.
- **CA_43_05**: Total calculado automáticamente.
- **CA_43_06**: Guardado en  aprox 5s.
- **CA_43_08**: Minimo 1 producto por compra.
- **CA_43_09**: Precios según contrato proveedor.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_44
**Descripción funcional:** yo como asesor necesito Listar todas las compras para poder controlar registros

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_44`

### Casos de Prueba Ejecutados
- **CA_44_01**: Tabla con: Id compra, Proveedor, Fecha,Items, Total, Estado, .
- **CA_44_02**: Filtros por, estado, proveedor.
- **CA_44_03**: Datos completos.
- **CA_44_04**: Paginación 10 por defecto.
- **CA_44_05**: Carga todas las compras, aprox 4s
- **CA_44_06**: Estados: Pendiente, Recibida, Cancelada

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_45
**Descripción funcional:** yo como  asesor necesito buscar una compra para poder encontrar una compra por filtro 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_45`

### Casos de Prueba Ejecutados
- **CA_45_01**: Búsqueda por Proveedor
- **CA_45_02**: Resultados con filtros combinados.
- **CA_45_03**: Resultados en aprox 2s.
- **CA_45_04**: Priorizar compras activas.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_46
**Descripción funcional:** yo como asesor necesito Ver detalle de una compra para poder ver toda la informacion de la compra

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_46`

### Casos de Prueba Ejecutados
- **CA_46_01**: Información completa + productos + impuestos + historial de estado.
- **CA_46_02**: Botones según estado actual.
- **CA_46_03**: Todos los datos cargan.
- **CA_46_04**: Productos listados con totales.
- **CA_46_05**: Página carga aprox 3s.
- **CA_46_06**: Detalles de todos los productos  y estados de la compra.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_47
**Descripción funcional:** yo como asesor necesito ver pdf compra para poder cumplir auditorías

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_47`

### Casos de Prueba Ejecutados
- **CA_47_01**: generar PDF con logo de empresa, datos empresa, detalles de compra, totales, firmas.
- **CA_47_02**: Descarga en Formato PDF estándar.
- **CA_47_03**: Incluir todos los datos de la compra.
- **CA_47_04**: Generación en <10s.
- **CA_47_05**: Numeración consecutiva acorde a Id.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_48
**Descripción funcional:** yo como asesor necesito Cancelar una compra  para poder Permitir invalidar compras realizadas por error.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_48`

### Casos de Prueba Ejecutados
- **CA_48_01**: Debe Solicitar El Motivo de cancelacion de la compra 
- **CA_48_02**: Confirmación.
- **CA_48_03**: Solo permitido si estado es ""Pendiente"".
- **CA_48_04**: Motivo obligatorio.
- **CA_48_05**: Anulación en aprox <3s.
- **CA_48_06**: Cancelacion de compra reversible.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_49
**Descripción funcional:** yo como asesor necesito Agregar productos a una compra para poder Permitir complementar una compra con más productos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_49`

### Casos de Prueba Ejecutados
- **CA_49_01**: Debe Listar  productos.
- **CA_49_02**: Se debe Permitir agregar un pruducto de la compra Solo si el estado  es ""Pendiente"".
- **CA_49_03**: Campos: producto, cantidad, precio unitario.
- **CA_49_04**: Recalcular total automáticamente.
- **CA_49_05**: Solo permitido si estado ""Pendiente"".
- **CA_49_06**: No permitir duplicados de productos.
- **CA_49_07**: Agregado en <2s.
- **CA_49_08**: Precios según contrato con el proveedor.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_50
**Descripción funcional:** yo como asesor necesito Eliminar productos de una compra para poder Permitir corregir la compra removiendo productos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_50`

### Casos de Prueba Ejecutados
- **CA_50_01**: Selección de productos a eliminar.
- **CA_50_02**: Confirmación individual.
- **CA_50_03**: Se debe Permitir eliminar un pruducto de la compra Solo si el estado  es ""Pendiente"".
- **CA_50_04**: Al menos un producto debe quedar en la compra.
- **CA_50_05**: Eliminación en <1s por producto.
- **CA_51_01**: Validaciones en tiempo real.
- **CA_51_02**: Montos limitados.
- **CA_51_03**: Guardado en <4s.
- **CA_51_04**: Acceso a todos los proveedores.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_52
**Descripción funcional:** Yo como Administrador necesito listar compras para poder ver el historial.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_52`

### Casos de Prueba Ejecutados
- **CA_52_01**: Tabla completa con columnas: id compra.proveedor, fecha, items, total, estado
- **CA_52_02**: Todos los datos sin filtros.
- **CA_52_03**: Carga aprox <5s las compras.
- **CA_52_04**: Ver todas las compras sin restricciones.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_53
**Descripción funcional:** Yo como Administrador necesito buscar compras por fecha, proveedor o ID.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_53`

### Casos de Prueba Ejecutados
- **CA_53_01**: Búsqueda avanzada con 2+ caracteres.
- **CA_53_02**: mantener filtros de búsqueda.
- **CA_53_03**: Resultados en aprox <3s .

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_54
**Descripción funcional:** Yo como Administrador necesito ver detalle de compras para poder validar información.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_54`

### Casos de Prueba Ejecutados
- **CA_54_01**: Vista completa con todos los productos, precios y detalles de la compra
- **CA_54_03**: Carga aprox <4s con historial completo.
- **CA_54_04**: Ver datos sensibles de costos.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_55
**Descripción funcional:** Yo como Administrador necesito generar PDF de compras para soportes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_55`

### Casos de Prueba Ejecutados
- **CA_55_01**: PDF con datos extendidos + costos reales contables.
- **CA_55_02**: Generación aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_56
**Descripción funcional:** Yo como Administrador, quiero cancelar una compra para poder corregir un registro incorrecto.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_56`

### Casos de Prueba Ejecutados
- **CA_56_01**: Puede cancelar cualquier estado a excepcion de  el estado "recibido".
- **CA_56_02**: Motivo obligatorio de la cancelacion.
- **CA_56_03**: Confirmacion de cancelacion de la compra aprox 2s.
- **CA_56_04**: Cancelacion en aprox <2s.
- **CA_56_05**: Cancelacion reversible.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_57
**Descripción funcional:** Yo como Administrador, quiero agregar productos a una compra para completarla.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_57`

### Casos de Prueba Ejecutados
- **CA_57_01**: Validaciones de cantidad en los productos min1
- **CA_57_02**: Agregado en <1s.
- **CA_57_03**: Permitir modificar precios.
- **CA_57_04**: Sin límite de productos.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_58
**Descripción funcional:** Yo como Administrador, quiero eliminar productos de una compra para poder corregir errores.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_58`

### Casos de Prueba Ejecutados
- **CA_58_01**: No Puede eliminar todos los productos (debe tener min1).
- **CA_58_02**: Cualquier producto eliminable.
- **CA_58_03**: Eliminación instantánea.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_59
**Descripción funcional:** yo como asesor necesito registrar un nuevo producto para poder Permitir crear nuevos productos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_59`

### Casos de Prueba Ejecutados
- **CA_59_01**: Formulario con:Nombre de producto, categoria, precio, stock actual, stock minimo, descripcion, imgen
- **CA_59_02**: Stock mínimo >=0.
- **CA_59_03**: Guardado en <3s.
- **CA_59_04**: Precios según política de la empresa.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_60
**Descripción funcional:** yo como asesor necesito Listar todos los productos para poder Facilitar la visualización de todos los productos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_60`

### Casos de Prueba Ejecutados
- **CA_60_01**: Tabla con: Nombre de producto, Categoría, Precio, Stock, Estado.
- **CA_60_02**: Filtros múltiples.
- **CA_60_03**: Datos completos.
- **CA_60_04**: Paginación 10 por defecto.
- **CA_60_05**: Carga aprox <3s de los productos.
- **CA_60_06**: Orden alfabetico por nombre.
- **CA_60_07**: Destacar productos bajo stock mínimo.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_61
**Descripción funcional:** yo como asesor necesito Buscar un producto  para poder  localizar un producto específico.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_61`

### Casos de Prueba Ejecutados
- **CA_61_01**: Búsqueda por nombre de producto
- **CA_61_02**: Búsqueda con 2+ caracteres.
- **CA_61_03**: Resultados en aprox 1.5s.
- **CA_61_04**: Incluir productos inactivos en búsqueda explícita.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_62
**Descripción funcional:** yo como asesor necesito Ver detalle de un producto para poder Ofrecer toda la información del producto.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_62`

### Casos de Prueba Ejecutados
- **CA_62_01**: Info completa de los detalles de producto
- **CA_62_02**: Todos los datos cargan.
- **CA_62_03**: Vista carga aprox <1s.
- **CA_62_04**: Alertas stock minimo crítico.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_63
**Descripción funcional:** yo como asesor necesito Actualizar la información de un producto para poder Mantener la información del producto correcta y actualizada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_63`

### Casos de Prueba Ejecutados
- **CA_63_01**: Formulario editable con todos los campos. 
- **CA_63_02**: Guardado en  aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_64
**Descripción funcional:** yo como asesor necesito Cambiar de estado a un producto para poder  activar o desactivar productos según disponibilidad.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_64`

### Casos de Prueba Ejecutados
- **CA_64_01**: Estados: Activo, Inactivo.
- **CA_64_02**: Motivo obligatorio (min 10 caracteres).
- **CA_64_03**: Cambio en <1s.
- **CA_64_04**: Productos inactivos no aparecen en ventas nuevas.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_65
**Descripción funcional:** yo como asesor necesito Eliminar un producto para poder Quitar productos que ya no se manejan.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_65`

### Casos de Prueba Ejecutados
- **CA_65_01**: Confirmación de la eliminacion
- **CA_65_02**: motivo de la emilinacion obligatorio
- **CA_65_03**: Validar no tiene ventas pendientes con el producto
- **CA_65_04**: Eliminacion aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_66
**Descripción funcional:** Yo como Administrador, quiero registrar un producto para poder agregarlo al inventario.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_66`

### Casos de Prueba Ejecutados
- **CA_66_01**: Campos con nombre de producto, categoria, precio, stock actual, stock minimo, descripcion, imagen producto
- **CA_66_02**: Validaciones en tiempo real.
- **CA_66_03**: Guardado en aprox <3s.
- **CA_66_04**: debe mostrar alerta de confirmacion de creacion

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_67
**Descripción funcional:** Yo como Administrador, quiero listar los productos para poder ver todos los productos existentes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_67`

### Casos de Prueba Ejecutados
- **CA_67_01**: Tabla con datos: nombre de producto, categoria, precio, stock, estado
- **CA_67_02**: Carga aprox <3s de los productos.
- **CA_67_03**: Ver todos los productos sin restricciones.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_68
**Descripción funcional:** Yo como Administrador, quiero buscar un producto para poder ubicarlo fácilmente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_68`

### Casos de Prueba Ejecutados
- **CA_68_01**: filtro avanzado por multiples criterios.
- **CA_68_02**: Caracteres apartir de 2+ criterios.
- **CA_68_03**: Resultados en  aprox <2s.
- **CA_68_05**: Filtros Combinados.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_69
**Descripción funcional:** Yo como Administrador, quiero ver detalle de un producto para poder conocer sus características.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_69`

### Casos de Prueba Ejecutados
- **CA_69_01**: informacion completa de los datos de el producto
- **CA_69_02**: Todos los datos cargan.
- **CA_69_03**: Vista carga aprox <1s.
- **CA_69_04**: Alertas de stock minimos criticos

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_70
**Descripción funcional:** Yo como Administrador, quiero actualizar un producto para poder mantener su información al día.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_70`

### Casos de Prueba Ejecutados
- **CA_70_01**: Formulario editable con todos los campos. 
- **CA_70_02**: Guardado en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_71
**Descripción funcional:** Yo como Administrador, quiero cambiar de estado un producto para poder controlar su uso.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_71`

### Casos de Prueba Ejecutados
- **CA_71_01**: Puede cambiar estados (activo, incactivo)
- **CA_71_02**: motivo obligatorio (min 10 caracteres).
- **CA_71_03**: Cambios aprox 1s
- **CA_71_04**: Productos inactivos no aparecen en ventas nuevas.
- **CA_71_05**: Puede reactivar productos inactivos.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_72
**Descripción funcional:** Yo como Administrador, quiero eliminar un producto para  poder depurar el inventario.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_72`

### Casos de Prueba Ejecutados
- **CA_72_01**: Confirmacion de la eliminacion
- **CA_72_02**: motivo de la emilinacion obligatorio 
- **CA_72_03**: Validar que no existan ventas pendientes con el producto.
- **CA_72_04**: Eliminar producto en aprox 3s

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_73
**Descripción funcional:** yo como asesor necesito Registrar categoría de producto para poder Organiza los productos en nuevas categorías.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_73`

### Casos de Prueba Ejecutados
- **CA_73_01**: Formulario con: Nombre*, Descripción
- **CA_73_02**: Nombre único con validacion en tiempo real.
- **CA_73_03**: Guardado en <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_74
**Descripción funcional:** yo como asesor necesito Listar las categorías para poder Permitir ver todas los productos y categorías existentes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_74`

### Casos de Prueba Ejecutados
- **CA_74_01**: Vista de con todas las categorias 
- **CA_74_02**: Columnas: categoria, Descripcion, Productos asociados, Estado.
- **CA_74_03**: Estructura clara visualmente.
- **CA_74_04**: Carga aprox <3s con todas las categorías.
- **CA_74_05**: Lista por ultima creada 
- **CA_74_06**: Mostrar contador de productos por categoría.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_75
**Descripción funcional:** yo como asesor necesito Buscar una categoría para poder Facilitar localizar una categoría.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_75`

### Casos de Prueba Ejecutados
- **CA_75_01**: Filtrar por estado de la categoria
- **CA_75_02**: Resultados con informacion completa.
- **CA_75_03**: Barra de Búsqueda por nombre de la categoria
- **CA_75_04**: Resultados en aprox 3s.
- **CA_75_05**: Incluir categorías inactivas en búsqueda explícita.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_76
**Descripción funcional:** yo como asesor necesito Ver detalle de una categoría registrada para poder Mostrar información completa de la categoría.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_76`

### Casos de Prueba Ejecutados
- **CA_76_01**: Info (id, nombre, descripcion, estado) + productos asociados 
- **CA_76_02**: Página carga aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_77
**Descripción funcional:** yo como asesor necesito Actualizar una categoría de producto para poder Mantener las categorías correctas y actualizadas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_77`

### Casos de Prueba Ejecutados
- **CA_77_01**: Formulario carga con todos los datos.
- **CA_77_02**: Validaciones en tiempo real de datos unicos
- **CA_77_03**: Guardado en aprox 1.5s.
- **CA_77_04**: debe mostrar alerta de confirmacion

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_78
**Descripción funcional:** yo como asesor necesito cambiar  estado de una categoría para poder Controlar si la categoría está activa o inactiva.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_78`

### Casos de Prueba Ejecutados
- **CA_78_01**: Estados: Activo, Inactivo.
- **CA_78_02**: Confirmación de cambio de estado.
- **CA_78_03**: No inactivar si tiene productos activos asociados.
- **CA_78_04**: Cambio en aprox 3s.
- **CA_78_05**: debe solicitar motivo de cambio de estado 

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_79
**Descripción funcional:** yo como asesor necesito Eliminar una categoría de producto para poder Permitir eliminar categorías que ya no se necesitan.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_79`

### Casos de Prueba Ejecutados
- **CA_79_01**: Motivo de eliminacion
- **CA_79_02**: Confirmación de eliminacion
- **CA_79_03**: Validaciones estrictas de relaciones con los productos con sus respectivas categorias
- **CA_79_04**: Proceso aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_80
**Descripción funcional:** Yo como Administrador, quiero registrar una categoría de producto para ordenar mejor los artículos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_80`

### Casos de Prueba Ejecutados
- **CA_80_01**: Formulario con: Nombre*, Descripción
- **CA_80_02**: Nombre único con validacion en tiempo real.
- **CA_80_03**: Guardado en <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_81
**Descripción funcional:** Yo como Administrador, quiero listar las categorías de producto para visualizar la organización.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_81`

### Casos de Prueba Ejecutados
- **CA_81_01**: Vista de con todas las categorias 
- **CA_81_02**: Columnas: categoria, Descripcion, Productos asociados, Estado.
- **CA_81_03**: Estructura clara visualmente.
- **CA_81_04**: Carga aprox <3s con todas las categorías.
- **CA_81_05**: Lista de acuerdo al ultimo registro 
- **CA_81_06**: Mostrar contador de productos por categoría.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_82
**Descripción funcional:** Yo como Administrador, quiero buscar una categoría de producto para encontrarla rápidamente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_82`

### Casos de Prueba Ejecutados
- **CA_82_01**: Filtrar por estado de la categoria
- **CA_82_02**: Resultados con informacion completa.
- **CA_82_03**: Barra de Búsqueda por nombre de la categoria
- **CA_82_04**: Resultados en aprox 3s.
- **CA_82_05**: Incluir categorías inactivas en búsqueda explícita.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_83
**Descripción funcional:** Yo como Administrador, quiero ver detalle de una categoría de producto para conocer sus datos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_83`

### Casos de Prueba Ejecutados
- **CA_83_01**: Info (id, nombre, descripcion, estado) + productos asociados 
- **CA_83_02**: Página carga aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_84
**Descripción funcional:** Yo como Administrador, quiero actualizar una categoría de producto para mantenerla vigente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_84`

### Casos de Prueba Ejecutados
- **CA_84_01**: Formulario carga con todos los datos.
- **CA_84_02**: Validaciones en tiempo real de datos unicos
- **CA_84_03**: Guardado en aprox 1.5s.
- **CA_84_04**: debe mostrar alerta de confirmacion

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_85
**Descripción funcional:** Yo como Administrador, quiero hacer camibio de estado en una categoría de producto para activarla o desactivarla.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_85`

### Casos de Prueba Ejecutados
- **CA_85_01**: Estados: Activo, Inactivo.
- **CA_85_02**: Confirmación de cambio de estado.
- **CA_85_03**: No inactivar si tiene productos activos asociados.
- **CA_85_04**: Cambio en aprox 3s.
- **CA_85_05**: debe solicitar motivo de cambio de estado 

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_86
**Descripción funcional:** Yo como Administrador, quiero eliminar una categoría de producto para depurar la organización.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_86`

### Casos de Prueba Ejecutados
- **CA_86_01**: Motivo de eliminacion
- **CA_86_02**: Confirmación de eliminacion
- **CA_86_03**: Validaciones estrictas de relaciones con los productos con sus respectivas categorias
- **CA_86_04**: Proceso aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_87
**Descripción funcional:** yo como productor necesito Listar entrega de insumos para poder  ver todas las entregas de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_87`

### Casos de Prueba Ejecutados
- **CA_87_01**: Tabla con: Id, cantidad, productor, fecha y hora
- **CA_87_02**: Datos básicos completos.
- **CA_87_03**: Paginación 10 por defecto.
- **CA_87_04**: Carga aprox 3s 
- **CA_87_05**: Orden por fecha descendente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_88
**Descripción funcional:** Yo como productor necesito buscar entrega de insumos para poder encontrar las entregas de isnumos por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_88`

### Casos de Prueba Ejecutados
- **CA_88_01**: Campo búsqueda por ID o tipo insumo.
- **CA_88_02**: Rango de fechas opcional.
- **CA_88_03**: Búsqueda con parámetros válidos.
- **CA_88_04**: Resultados en aprox 1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_89
**Descripción funcional:** Yo como productor necesito ver detalle  de insumos para poder ver todos los detalles de cada entrega de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_89`

### Casos de Prueba Ejecutados
- **CA_89_01**: Info básica + productos + cantidades 
- **CA_89_02**: Página carga aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_90
**Descripción funcional:** Yo como asesor necesito Registrar entrega de insumos para poder crear la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_90`

### Casos de Prueba Ejecutados
- **CA_90_01**: Formulario con: insumo, productor ,cantidad, unidad, fecha, hora.
- **CA_90_02**: Cantidades positivas.
- **CA_90_03**: Guardado en aprox 4s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_91
**Descripción funcional:** yo como asesor necesito Listar entrega de insumos para poder  ver todas las entregas de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_91`

### Casos de Prueba Ejecutados
- **CA_91_01**: Tabla con: Id, cantidad, operario, fecha y hora
- **CA_91_02**: Datos básicos completos.
- **CA_91_03**: Paginación 10 por defecto.
- **CA_91_04**: Carga aprox 3s 
- **CA_91_05**: Orden por fecha descendente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_92
**Descripción funcional:** yo como asesor necesito buscar entrega de insumos para poder encontrar las entregas de isnumos por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_92`

### Casos de Prueba Ejecutados
- **CA_92_01**: Campo búsqueda por ID o tipo insumo.
- **CA_92_02**: Rango de fechas opcional.
- **CA_92_03**: Búsqueda con parámetros válidos.
- **CA_92_04**: Resultados en aprox 1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_93
**Descripción funcional:** yo como asesor necesito ver detalle de insumos para poder ver todos los detalles de cada entrega de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_93`

### Casos de Prueba Ejecutados
- **CA_93_01**: Info básica + productos + cantidades 
- **CA_93_02**: Página carga aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_95
**Descripción funcional:** yo como asesor necesito anular entrega de insumos para poder cancelar las entregas de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_95`

### Casos de Prueba Ejecutados
- **CA_94_01**: Motivo anulación* .
- **CA_94_02**: Confirmación de anulacion
- **CA_94_03**: Anulación en aprox 3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_96
**Descripción funcional:** yo como administrador necesito registrar entrega de insumos para poder crear la cada entrega de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_96`

### Casos de Prueba Ejecutados
- **CA_95_01**: Formulario con: insumo, asesor ,cantidad, unidad, fecha, hora.
- **CA_95_02**: Cantidades positivas.
- **CA_95_03**: Guardado en aprox 4s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_97
**Descripción funcional:** yo como administrador necesito listar entrega de insumos para poder ver todas las entregas de isnumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_97`

### Casos de Prueba Ejecutados
- **CA_96_01**: Tabla con: Id, insumo, cantidad, productor, fecha y hora, estado
- **CA_96_02**: Datos básicos completos.
- **CA_97_03**: Paginación 10 por defecto.
- **CA_97_04**: Carga aprox 3s 
- **CA_97_05**: Orden por fecha descendente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_98
**Descripción funcional:** yo como administrador necesito buscar entrega de insumos para poder encontrar las entregas de insumos por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_98`

### Casos de Prueba Ejecutados
- **CA_98_01**: Campo búsqueda por ID o tipo insumo.
- **CA_98_02**: Rango de fechas opcional.
- **CA_98_03**: Búsqueda con parámetros válidos.
- **CA_98_04**: Resultados en aprox 1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_99
**Descripción funcional:** yo como administrador necesito ver detalle de entrega de insumos para poder ver detalle de cada entrega de insumos 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_99`

### Casos de Prueba Ejecutados
- **CA_99_01**: Info básica + productos + cantidades 
- **CA_99_02**: Página carga aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_101
**Descripción funcional:** yo como administrador necesito anular enntrega de insumos para poder cancelar las entregas de insumos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_101`

### Casos de Prueba Ejecutados
- **CA_100_01**: Motivo anulación* .
- **CA_100_02**: Confirmación de anulacion
- **CA_100_03**: Anulación en aprox 3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_102
**Descripción funcional:** yo como productor necesito Listar Produccion para poder ver la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_102`

### Casos de Prueba Ejecutados
- **CA_101_01**: Tabla con: Id produccion, nombre del producto, cantidad, productor, fecha, estado
- **CA_101_02**: Solo producciones asignadas.
- **CA_101_03**: Carga aprox 3seg
- **CA_101_04**: Orden por fecha más reciente.
- **CA_101_05**: Estados visibles: orden pendiente, orden en proceso, orden completada, cancelada

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_103
**Descripción funcional:** yo como productor necesito buscar produccion para poder encontrar la produccion por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_103`

### Casos de Prueba Ejecutados
- **CA_103_01**: Búsqueda por productor.
- **CA_103_02**: Rango fechas
- **CA_103_03**: Resultados en aprox 3s.
- **CA_103_04**: filtrar por productor.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_104
**Descripción funcional:** yo como productor necesito ver detalle de produccion  para poder ver los detalles de la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_104`

### Casos de Prueba Ejecutados
- **CA_104_01**: Info básica + insumos utilizados + observaciones 
- **CA_104_02**: Datos de producción básicos.
- **CA_104_03**: Página carga <2s.
- **CA_104_04**: No ver costos ni precios venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_105
**Descripción funcional:** yo como productor necesito cancelar produccion  para poder  cancelar las producciones necesarias 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_105`

### Casos de Prueba Ejecutados
- **CA_105_01**: Motivo cancelación
- **CA_105_02**: Confirmación de cancelacion
- **CA_105_03**: Solo si estado "En preparacion" o "orden recibida".
- **CA_105_04**: Cancelación en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_106
**Descripción funcional:** yo como asesor necesito  Listar Produccion para poder ver la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_106`

### Casos de Prueba Ejecutados
- **CA_106_01**: Tabla con: Id produccion, nombre del producto, cantidad, productor, fecha, estado
- **CA_106_02**: Solo producciones asignadas.
- **CA_106_03**: Carga aprox 3seg
- **CA_106_04**: Orden por fecha más reciente.
- **CA_106_05**: Estados visibles: orden recibida, orden en preparacion, orden lista, cancelada

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_107
**Descripción funcional:** yo como asesor necesito buscar produccion para poder encontrar la produccion por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_107`

### Casos de Prueba Ejecutados
- **CA_107_01**: Búsqueda por productor.
- **CA_107_02**: Rango fechas
- **CA_107_03**: Resultados en aprox 3s.
- **CA_107_04**: filtrar por productor.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_108
**Descripción funcional:** yo como asesor necesito  ver detalle de produccion para poder ver los detalles de la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_108`

### Casos de Prueba Ejecutados
- **CA_108_01**: Info básica + insumos utilizados + observaciones 
- **CA_108_02**: Datos de producción básicos.
- **CA_108_03**: Página carga aprox 2s.
- **CA_108_04**: No ver costos ni precios venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_109
**Descripción funcional:** yo como asesor necesito generar pdf de produccion para poder crear el pdf de cada produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_109`

### Casos de Prueba Ejecutados
- **CA_109_01**: PDF con datos de la produccion
- **CA_109_02**: Formato estándar.
- **CA_109_03**: Generación aprox 2s.
- **CA_109_04**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_110
**Descripción funcional:** yo como asesor necesito  cambiar de estado de produccion para poder cambiar el estado de cada produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_110`

### Casos de Prueba Ejecutados
- **CA_110_01**: Estados pendiente,proceso, completada y cancelada
- **CA_110_02**: Cambio en aprox 3s.
- **CA_110_03**: motivo del cambio de estado

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_111
**Descripción funcional:** yo como asesor necesito cancelar produccion para poder cancelar las producciones necesarias 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_111`

### Casos de Prueba Ejecutados
- **CA_111_01**: Motivo cancelación
- **CA_111_02**: Confirmación de cancelscion
- **CA_111_03**: Solo si estado "En preparacion" o "orden recibida".
- **CA_111_04**: Cancelación en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_112
**Descripción funcional:** yo como asesor necesito  Registrar produccion para poder Registrar la produccion 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_112`

### Casos de Prueba Ejecutados
- **CA_112_01**: Formulario con: producto, cantidad, productor, tiempo aprox de la produccion
- **CA_112_02**: Cantidades realistas.
- **CA_112_03**: tiempos aproximado realista
- **CA_112_04**: Guardado en aprox 3s

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_113
**Descripción funcional:** yo como administrador necesito listar la produccion para poder ver la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_113`

### Casos de Prueba Ejecutados
- **CA_113_01**: Tabla con: Id produccion, nombre del producto, cantidad, productor, fecha, estado
- **CA_113_02**: Solo producciones asignadas.
- **CA_113_03**: Carga aprox 3seg
- **CA_113_04**: Orden por fecha más reciente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_114
**Descripción funcional:** yo como administrador necesito buscar produccion para poder encontrar la produccion por filtro

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_114`

### Casos de Prueba Ejecutados
- **CA_114_01**: Búsqueda por productor.
- **CA_114_02**: Rango fechas
- **CA_114_03**: Resultados en aprox 3s.
- **CA_114_04**: filtrar por productor.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_115
**Descripción funcional:** yo como adminisitrador necesito ver detalle de la produccion para poder ver detalle los detalles de la produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_115`

### Casos de Prueba Ejecutados
- **CA_115_01**: Info básica + insumos utilizados + observaciones 
- **CA_115_02**: Datos de producción básicos.
- **CA_115_03**: Página carga aprox 2s.
- **CA_115_04**: No ver costos ni precios venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_116
**Descripción funcional:** yo como administrador necesito generar pdf de produccion para poder crear el pdf de cada produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_116`

### Casos de Prueba Ejecutados
- **CA_116_01**: PDF con datos de la produccion
- **CA_116_02**: Formato estándar.
- **CA_116_03**: Generación aprox 8s.
- **CA_116_04**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_117
**Descripción funcional:** yo como administrador necesito cambiar de estado de produccion para poder cambiar el estado de cada produccion

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_117`

### Casos de Prueba Ejecutados
- **CA_117_01**: Estados: preparacion, recibida lista y cancelada
- **CA_117_02**: Cambio en aprox 3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_118
**Descripción funcional:** yo como administrador necesito cancelar la produccion para poder cancelar las producciones necesarias 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_118`

### Casos de Prueba Ejecutados
- **CA_118_01**: Motivo cancelación
- **CA_118_02**: Confirmación de cancelscion
- **CA_118_03**: Solo si estado "En preparacion" o "orden recibida".
- **CA_118_04**: Cancelación en aprox 2s.
- **CA_118_05**: Cancelación con ajustes financieros automáticos.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_119
**Descripción funcional:** yo como administrador  necesito poder registrar los productos producidos  y el gasto de materia prima

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_119`

### Casos de Prueba Ejecutados
- **CA_119_01**: Formulario con: producto, cantidad, productor, tiempo aprox de la produccion
- **CA_119_02**: Cantidades realistas.
- **CA_119_03**: tiempos aproximado realista
- **CA_119_04**: Guardado en aprox 3s

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_120
**Descripción funcional:** Yo como Administrador necesito registrar clientes en la base de datos del sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_120`

### Casos de Prueba Ejecutados
- **CA_120_01**: Formulario con: nombre, apellido, tipo de doc, numero de documento, telefono, email, direccion,foto perfil
- **CA_120_02**: validacion en tiempo real Documento único.
- **CA_120_03**: Email válido si se proporciona.
- **CA_120_04**: Teléfono 10 dígitos formato COL.
- **CA_120_05**: Guardado prox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_121
**Descripción funcional:** Yo como Administrador necesito listar los clientes para revisar la información disponible en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_121`

### Casos de Prueba Ejecutados
- **CA_121_01**: Tabla con: nombre, apellido, tipo de doc, numero de documento, telefono, email, direccion,foto perfil
- **CA_121_02**: Datos completos.
- **CA_121_03**: Paginación 10 por defecto.
- **CA_121_04**: Carga aprox <3s con los clientes.
- **CA_121_05**: lista en Orden de fecha mas reciente 

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_122
**Descripción funcional:** Yo como Administrador necesito buscar clientes por nombre o documento para obtener información precisa.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_122`

### Casos de Prueba Ejecutados
- **CA_122_01**: Búsqueda por  nombre,documento, email
- **CA_122_02**: Coincidencias parciales.
- **CA_122_03**: Búsqueda con 2+ caracteres.
- **CA_122_04**: Resultados aprox <1.5s.
- **CA_122_05**: Incluir inactivos solo si búsqueda explícita.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_123
**Descripción funcional:** Yo como Administrador necesito ver el detalle del cliente para validar su información completa.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_123`

### Casos de Prueba Ejecutados
- **CA_123_01**: Info completa de los datos de el cliente.
- **CA_123_02**: Todos los datos cargan.
- **CA_123_03**: Página carga aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_124
**Descripción funcional:** Yo como Administrador necesito actualizar clientes para corregir o mejorar información registrada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_124`

### Casos de Prueba Ejecutados
- **CA_124_01**: Todos los campos editables.
- **CA_124_02**: validacion de Email único si cambia.
- **CA_124_03**: Guardado aprox <2s.
- **CA_124_04**: Confirmacion de cambios obligatoria.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_125
**Descripción funcional:** Yo como Administrador necesito cambiar el estado de los clientes para activar o desactivar registros.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_125`

### Casos de Prueba Ejecutados
- **CA_125_01**: Estados: Activo, Inactivo.
- **CA_125_02**: Motivo obligatorio para inactivar usuario.
- **CA_125_03**: No permitir inactivar si tiene abonos pendientes.
- **CA_125_04**: Cambio aprox <1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_126
**Descripción funcional:** Yo como Administrador necesito eliminar clientes para depurar registros duplicados o erróneos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_126`

### Casos de Prueba Ejecutados
- **CA_126_01**: Confirmación de eliminacion.
- **CA_126_02**: notificacion de eliminacion exitosa
- **CA_126_03**: Proceso aprox <4s.
- **CA_126_04**: no permitir eliminar cliente si tiene abonos pendientes

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_127
**Descripción funcional:** Yo como Asesor necesito registrar clientes en la base de datos del sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_127`

### Casos de Prueba Ejecutados
- **CA_127_01**: Formulario con: nombre, apellido, tipo de doc, numero de documento, telefono, email, direccion,foto perfil
- **CA_127_02**: validacion en tiempo real Documento único.
- **CA_127_03**: Email válido si se proporciona.
- **CA_127_04**: Teléfono 10 dígitos formato COL.
- **CA_127_05**: Guardado prox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_128
**Descripción funcional:** Yo como Asesor necesito listar los clientes para revisar la información disponible en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_128`

### Casos de Prueba Ejecutados
- **CA_128_01**: Tabla con: nombre, apellido, tipo de doc, numero de documento, telefono, email, direccion,foto perfil
- **CA_128_02**: Datos completos.
- **CA_128_03**: Paginación 10 por defecto.
- **CA_128_04**: Carga aprox <3s con los clientes.
- **CA_128_05**: lista en Orden fecha de creación  .

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_129
**Descripción funcional:** Yo como Asesor necesito buscar clientes por nombre o documento para obtener información precisa.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_129`

### Casos de Prueba Ejecutados
- **CA_129_01**: Búsqueda por  nombre,documento, email
- **CA_129_02**: Coincidencias parciales.
- **CA_129_03**: Búsqueda con 2+ caracteres.
- **CA_129_04**: Resultados aprox <1.5s.
- **CA_129_05**: Incluir inactivos solo si búsqueda explícita.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_130
**Descripción funcional:** Yo como Asesor necesito ver el detalle del cliente para validar su información completa.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_130`

### Casos de Prueba Ejecutados
- **CA_130_01**: Info completa de los datos de el cliente.
- **CA_130_02**: Todos los datos cargan.
- **CA_130_03**: Página carga aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_131
**Descripción funcional:** Yo como Asesor necesito actualizar clientes para corregir o mejorar información registrada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_131`

### Casos de Prueba Ejecutados
- **CA_131_01**: Todos los campos editables.
- **CA_131_02**: validacion de Email único si cambia.
- **CA_131_03**: Guardado aprox <2s.
- **CA_131_04**: Confirmacion de cambios obligatoria.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_132
**Descripción funcional:** Yo como Asesor necesito cambiar el estado de los clientes para activar o desactivar registros.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_132`

### Casos de Prueba Ejecutados
- **CA_132_01**: Estados: Activo, Inactivo.
- **CA_132_02**: Motivo obligatorio para inactivar usuario.
- **CA_132_03**: No permitir inactivar si tiene abonos pendientes.
- **CA_132_04**: Cambio aprox <1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_133
**Descripción funcional:** Yo como Asesor necesito eliminar clientes para depurar registros duplicados o erróneos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_133`

### Casos de Prueba Ejecutados
- **CA_133_01**: Confirmación de eliminacion.
- **CA_133_02**: notificacion de eliminacion exitosa
- **CA_133_03**: Proceso aprox <4s.
- **CA_133_04**: no permitir eliminar cliente si tiene abonos pendientes

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_134
**Descripción funcional:**  Yo como Cliente necesito registrarme en la base de datos del sistema para poder crear mi usuario en la tienda.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_134`

### Casos de Prueba Ejecutados
- **CA_134_01**: Formulario  de registro con: nombre, apellido, tipo de doc, numero de documento, telefono, email, direccion, contrantraseña y confirmacion de contraseña, foto de perfil
- **CA_134_02**: Email único.
- **CA_134_03**: Contraseña segura.
- **CA_134_04**: Datos obligatorios completos.
- **CA_134_05**: Registro aprox <5s.
- **CA_134_06**: confirmacion de registro exitoso 

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_135
**Descripción funcional:** Yo como Cliente necesito ver mis datos personales en el sistema para confirmar su exactitud.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_135`

### Casos de Prueba Ejecutados
- **CA_135_01**: Solo propio registro.
- **CA_135_02**: Verificación de datos.
- **CA_135_03**: Carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_136
**Descripción funcional:** Yo como Cliente necesito actualizar mis datos personales en el sistema para corregir o modificar mi información.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_136`

### Casos de Prueba Ejecutados
- **CA_136_01**: Todos los campos son editables
- **CA_136_02**: Email único si cambia 
- **CA_136_03**: Guardado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_137
**Descripción funcional:** Yo como Administrador necesito registrar ventas para mantener actualizado el historial de transacciones.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_137`

### Casos de Prueba Ejecutados
- **CA_137_01**: Formulario con: tipo de venta, cleinte, metodo de pago, agregar productos(seleccionar producto,cantidad, precio) 
- **CA_137_02**: la venta permite ser creada si el Cliente  esta activo.
- **CA_137_03**: no permitir ventas con productos sin Stock disponible.
- **CA_137_04**: subtotales y Totales >0.
- **CA_137_05**: Guardado aprox <5s, cálculos automáticos.
- **CA_137_06**: productos ilimitados por venta.
- **CA_137_07**: Precios según política de la empresa

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_138
**Descripción funcional:** Yo como Administrador necesito listar ventas para revisar movimientos de venta.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_138`

### Casos de Prueba Ejecutados
- **CA_138_01**: Tabla con datos: numero de venta, tipo, cliente, fehca, items, total, metodo de pago , estado de la venta.
- **CA_138_02**: Datos completos.
- **CA_138_03**: Paginación apartir de 10 registros
- **CA_138_04**: Carga aprox <4s con ventas.
- **CA_138_05**: Orden por fecha más reciente.
- **CA_138_06**: Estados: Pendiente, Completada, cancelada.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_139
**Descripción funcional:** Yo como Administrador necesito buscar ventas por numero de venta o cliente .

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_139`

### Casos de Prueba Ejecutados
- **CA_139_01**: Búsqueda por numero de venta o numero de cliente
- **CA_139_02**: Parámetros minimos +2 caracteres
- **CA_139_03**: Resultados en aprox <2s.
- **CA_139_04**: Filtrar por fechas, estado, metodo de pago

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_140
**Descripción funcional:** Yo como Administrador necesito ver el detalle de la venta para analizar los productos y las cantidades vendidos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_140`

### Casos de Prueba Ejecutados
- **CA_140_01**: Info completa + productos + iva + historial .
- **CA_140_02**: informacion de estado.
- **CA_140_03**: Todos los datos cargan.
- **CA_140_04**: Página carga  en aprox <3s.
- **CA_140_05**: Ver costos totales.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_141
**Descripción funcional:** Yo como Administrador necesito generar un PDF de la venta para entregar un comprobante al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_141`

### Casos de Prueba Ejecutados
- **CA_141_01**: Factura PDF con logo, datos de la venta , cliente, productos, totales.
- **CA_141_02**: Formato estandar vigente.
- **CA_141_03**: Numeración consecutiva segun id compra.
- **CA_141_04**: Generación aprox <5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_142
**Descripción funcional:** Yo como Administrador necesito cancelar una venta que se registre por error de el asesor, por error (ej: producto equivocado, duplicidad,cliente problematico exige su dinero)

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_142`

### Casos de Prueba Ejecutados
- **CA_142_01**: Motivo de cancelacion (min 10 caracteres).
- **CA_142_02**: Confirmación de cancelacion
- **CA_142_03**: Solo si estado "Pendiente" o "Completada".
- **CA_142_04**: Anulación en aprox <4s.
- **CA_142_05**: Cancelacion reversible.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_143
**Descripción funcional:** Yo como Administrador necesito agregar productos durante el proceso de venta para completar la transacción.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_143`

### Casos de Prueba Ejecutados
- **CA_143_01**: lista para seleccion de productos.
- **CA_143_02**: Campos: cantidad, precio
- **CA_143_03**: Calcular totales.
- **CA_143_04**: Solo si estado "Pendiente".
- **CA_143_05**: Solo permitir agregar productos con Stock disponible.
- **CA_143_06**: Agregado en aprox<2s.
- **CA_143_07**: Precios según politicas de la empresa.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_144
**Descripción funcional:** Yo como Administrador necesito eliminar productos durante el proceso de la venta para corregir errores en la selección.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_144`

### Casos de Prueba Ejecutados
- **CA_144_01**: seleccion unica de producto a eliminar.
- **CA_144_02**: Eliminacion instantanea
- **CA_144_03**: calcular totales.
- **CA_144_04**: Solo si estado "Pendiente".
- **CA_144_05**: Al menos 1 producto debe quedar.
- **CA_144_06**: Eliminación en  aprox<1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_145
**Descripción funcional:** Yo como Asesor necesito registrar ventas para facturar los productos que adquieren mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_145`

### Casos de Prueba Ejecutados
- **CA_145_01**: Formulario con: tipo de venta, cleinte, metodo de pago, agregar productos(seleccionar producto,cantidad, precio) 
- **CA_145_02**: la venta permite ser creada si el Cliente  esta activo.
- **CA_145_03**: no permitir ventas con productos sin Stock disponible.
- **CA_145_04**: subtotales y Totales >0.
- **CA_145_05**: Guardado aprox <5s, cálculos automáticos.
- **CA_145_06**: productos ilimitados por venta.
- **CA_145_07**: Precios según política de la empresa

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_146
**Descripción funcional:** Yo como Asesor necesito listar las ventas que fueron realizadas .

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_146`

### Casos de Prueba Ejecutados
- **CA_146_01**: Tabla con datos: numero de venta, tipo, cliente, fecha, items, total, metodo de pago , estado de la venta.
- **CA_146_02**: Datos completos.
- **CA_146_03**: Paginación  apartir de 10 registros 
- **CA_146_04**: Carga aprox <4s con ventas.
- **CA_146_05**: Orden por fecha más reciente.
- **CA_146_06**: Estados: Pendiente, Completada, cancelada.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_147
**Descripción funcional:** Yo como Asesor necesito buscar ventas por ID, cliente o fecha para atender consultas específicas de mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_147`

### Casos de Prueba Ejecutados
- **CA_147_01**: Búsqueda por numero de venta o numero de cliente
- **CA_147_02**: Parámetros minimos +2 caracteres
- **CA_147_03**: Resultados en aprox <2s.
- **CA_147_04**: Filtrar por fechas, estado, metodo de pago

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_148
**Descripción funcional:** Yo como Asesor necesito ver el detalles completos de la venta para garantizar cumplimiento de los productos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_148`

### Casos de Prueba Ejecutados
- **CA_148_01**: Info completa + productos + iva + historial .
- **CA_148_02**: informacion de estado.
- **CA_148_03**: Todos los datos cargan.
- **CA_148_04**: Página carga  en aprox <3s.
- **CA_148_05**: Ver costos totales.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_149
**Descripción funcional:** Yo como Asesor necesito generar e imprimir el PDF de la venta en el momento para entregar el comprobante físico al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_149`

### Casos de Prueba Ejecutados
- **CA_149_01**: Factura PDF con logo, datos de la venta , cliente, productos, totales.
- **CA_149_02**: Formato estandar vigente.
- **CA_149_03**: Numeración consecutiva segun id compra.
- **CA_149_04**: Generación aprox <5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_150
**Descripción funcional:** Yo como Asesor necesito agregar productos al instante de la venta en proceso.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_150`

### Casos de Prueba Ejecutados
- **CA_150_01**: lista para seleccion de productos.
- **CA_150_02**: Campos: cantidad, precio
- **CA_150_03**: Calcular totales.
- **CA_150_04**: Solo si estado "Pendiente".
- **CA_150_05**: Solo permitir agregar productos con Stock disponible.
- **CA_150_06**: Agregado en aprox<2s.
- **CA_150_07**: Precios según politicas de la empresa.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_151
**Descripción funcional:** Yo como Asesor necesito eliminar productos de una venta en proceso para corregir la selección antes de finalizarla.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_151`

### Casos de Prueba Ejecutados
- **CA_151_01**: seleccion unica de producto a eliminar.
- **CA_151_02**: Eliminacion instantanea
- **CA_151_03**: calcular totales.
- **CA_151_04**: Al menos 1 producto debe quedar.
- **CA_151_05**: Eliminación en  aprox<1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_152
**Descripción funcional:** Yo como clientre necesito agregar productos a mi carrito de compras para posteriormente realizar mi compra.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_152`

### Casos de Prueba Ejecutados
- **CA_152_01**: agregar productos seleccionados
- **CA_152_02**: calcular siubotales y totales.
- **CA_152_03**: permitir eliminar productos de el carrito
- **CA_152_04**: boton para proceder a el pago

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_153
**Descripción funcional:** yo como  cliente necesito listar mis compras para poder acceder a el historias de mis compras

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_153`

### Casos de Prueba Ejecutados
- **CA_153_01**: Solo compras propias.
- **CA_153_02**: Solo acceso a datos propios.
- **CA_153_03**: Resultados en aprox<1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_154
**Descripción funcional:** Yo como Cliente necesito completar una compra en el portal web para cualquier producto desponible.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_154`

### Casos de Prueba Ejecutados
- **CA_154_01**: debe contener almenos 1 producto para completar la compra
- **CA_154_02**: Solo ventas  propias.
- **CA_154_03**: Carga <2s con 100+ ventas.
- **CA_154_04**: Orden por fecha descendente.
- **CA_154_05**: Estados simplificados.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_155
**Descripción funcional:** Yo como Cliente necesito ver el historial de mis ventas (compras) realizadas para consultar detalles, precios o repetir pedidos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_155`

### Casos de Prueba Ejecutados
- **CA_155_01**: Factura con detalle completos.
- **CA_155_02**: Solo ventas propias.
- **CA_155_03**: Página carga  aprox<2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_156
**Descripción funcional:** Yo como Administrador necesito registrar abonos para llevar control de pagos parciales.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_156`

### Casos de Prueba Ejecutados
- **CA_156_01**: Formulario con: pedidoID , ClienteID, monto de el abono, metodo de pago, fecha
- **CA_156_02**: Monto de el abono >= 50%
- **CA_156_03**: Fecha de el abono.
- **CA_156_04**: Guardado en aprox <3s.
- **CA_156_05**: Actualizar automáticamente saldo venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_157
**Descripción funcional:** Yo como Administrador necesito listar abonos para revisar pagos realizados.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_157`

### Casos de Prueba Ejecutados
- **CA_157_01**: Tabla con: numeroAbono, pedidoID,monto,fehca, metodo pago, Estado.
- **CA_157_02**: Datos completos.
- **CA_157_03**: Paginación 10 por defecto.
- **CA_157_04**: Carga aprox <3s de abonos.
- **CA_157_05**: Orden por fecha más reciente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_158
**Descripción funcional:** Yo como Administrador necesito buscar abonos por venta o fecha.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_158`

### Casos de Prueba Ejecutados
- **CA_158_01**: Búsqueda por numeroAbono
- **CA_158_02**: Parámetros válidos apartir de +2 caracteres.
- **CA_158_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_159
**Descripción funcional:** Yo como Administrador necesito ver el detalle del abono para validar la información y montos registrada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_159`

### Casos de Prueba Ejecutados
- **CA_159_01**: Info completa. idAbono, numeroabono, cliente, monto, fecha, metodo de pago, estado
- **CA_159_02**: Todos los datos cargan.
- **CA_159_03**: Página carga en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_160
**Descripción funcional:** Yo como Administrador necesito generar un comprobante de pago (PDF) del abono para entregarlo al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_160`

### Casos de Prueba Ejecutados
- **CA_160_01**: Recibo PDF con datos empresa, cliente, abono, monto.
- **CA_160_02**: Formato profesional.
- **CA_160_03**: Numeración consecutiva acorde a el id de el abono.
- **CA_160_04**: Generación en aprox <5s.
- **CA_160_05**: PDF descargable
- **CA_161_02**: Confirmación de cancelacionde abono
- **CA_161_03**: Cancelacion en aprox <3s.
- **CA_161_04**: Cancelacion irreversible .

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_162
**Descripción funcional:** Yo como Asesor necesito registrar abonos para llevar un control preciso de los pagos parciales que realizan mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_162`

### Casos de Prueba Ejecutados
- **CA_162_01**: Formulario con: pedidoID , ClienteID, monto de el abono, metodo de pago, fecha
- **CA_162_02**: Monto de el abono >= 50%
- **CA_162_03**: Fecha de el abono.
- **CA_162_04**: Guardado en aprox <3s.
- **CA_162_05**: Actualizar automáticamente saldo venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_163
**Descripción funcional:** Yo como Asesor necesito listar los abonos para revisar y verificar los pagos que han realizado mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_163`

### Casos de Prueba Ejecutados
- **CA_163_01**: Tabla con: numeroAbono, monto,fehca, metodo pago, Estado.
- **CA_163_02**: Datos completos.
- **CA_163_03**: Paginación 10 por defecto.
- **CA_163_04**: Carga aprox <3s de abonos.
- **CA_163_05**: Orden por fecha más reciente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_164
**Descripción funcional:** Yo como Asesor necesito buscar abonos por cliente, venta o fecha para encontrar información de pagos específicos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_164`

### Casos de Prueba Ejecutados
- **CA_164_01**: Búsqueda por numeroAbono
- **CA_164_02**: Parámetros válidos apartir de +2 caracteres.
- **CA_164_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_165
**Descripción funcional:** Yo como Asesor necesito ver el detalle completo de un abono para confirmar su información y brindar un soporte claro al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_165`

### Casos de Prueba Ejecutados
- **CA_165_01**: Info completa. idAbono, numeroabono, cliente, monto, fecha, metodo de pago, estado
- **CA_165_02**: Todos los datos cargan.
- **CA_165_03**: Página carga en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_166
**Descripción funcional:** Yo como Asesor necesito generar un comprobante de pago (PDF) del abono para entregárselo al cliente y que tenga su respaldo.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_166`

### Casos de Prueba Ejecutados
- **CA_166_01**: Recibo PDF con datos empresa, cliente, abono, monto.
- **CA_166_02**: Formato profesional.
- **CA_166_03**: Numeración consecutiva acorde a el id de el abono.
- **CA_166_04**: Generación en aprox <5s.
- **CA_166_05**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_167
**Descripción funcional:** Yo como Asesor necesito cancelar abonos registrados por error para corregir la información financiera de la venta.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_167`

### Casos de Prueba Ejecutados
- **CA_167_01**: Formulario con: pedidoID , ClienteID, monto de el abono, metodo de pago, fecha
- **CA_167_02**: Monto de el abono >= 50%
- **CA_167_03**: Fecha de el abono.
- **CA_167_04**: Guardado en aprox <3s.
- **CA_167_05**: Actualizar automáticamente saldo venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_168
**Descripción funcional:** Yo como Administrador necesito registrar pedidos de clientes para cumplir con su orden.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_168`

### Casos de Prueba Ejecutados
- **CA_168_01**: Formulario con: select cliente, fecha de creacion de pedido, fecha de entrega, agregar productos(cantidad, precio, subtotal y total)
- **CA_168_02**: Cliente  debe estar activo para crear el pedido.
- **CA_168_03**: pedido minimo con 1 producto.
- **CA_168_04**: Guardado en aprox <4s.
- **CA_168_05**: productos ilimitados por pedido.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_169
**Descripción funcional:** Yo como Administrador necesitro listar los pedidos de los clientes para dale se seguimiento

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_169`

### Casos de Prueba Ejecutados
- **CA_169_01**: Tabla con: id pedido, cliente, productos, total, fecha de pedido, fecha entrega, estado.
- **CA_169_02**: Datos completos.
- **CA_169_03**: Paginación 10 por defecto.
- **CA_169_04**: Carga aprox <4s con pedidos.
- **CA_169_05**: Orden por fecha entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_170
**Descripción funcional:** Yo como Administrador necesito buscar pedidos por fecha o ID.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_170`

### Casos de Prueba Ejecutados
- **CA_170_01**: barra de Búsqueda por  cliente.
- **CA_170_02**: Parámetros válidos 2+ caracteres.
- **CA_170_03**: Resultados aprox <2s.
- **CA_170_04**: filtros combinados por fecha, estado

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_171
**Descripción funcional:** Yo como Administrador necesito ver el detalle del pedido para verificar productos y valores.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_171`

### Casos de Prueba Ejecutados
- **CA_171_01**: Info completa, id pedido, cliente, productos, total, fecha de pedido, fecha de entrega, estado.
- **CA_171_02**: Todos los datos cargan.
- **CA_171_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_172
**Descripción funcional:** Yo como Administrador necesito actualizar un pedido para poder agregar productos a la venta.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_172`

### Casos de Prueba Ejecutados
- **CA_172_01**: Campos editables: todos
- **CA_172_02**: Guardado en aprox <2s.
- **CA_172_03**: Confirmacion de cambios guardados.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_173
**Descripción funcional:** Yo como Administrador necesito generar una orden de pedido en PDF para usarla como documento interno de preparación.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_173`

### Casos de Prueba Ejecutados
- **CA_173_01**: Orden PDF con datos pedido completos
- **CA_173_02**: Formato estandar de pfd
- **CA_173_03**: Generación  aprox <8s
- **CA_173_04**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_174
**Descripción funcional:** Yo como Administrador necesito cambiar el estado del pedido para notificar su progreso (ej: de Pendiente a Preparando).

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_174`

### Casos de Prueba Ejecutados
- **CA_174_01**: Selector estado con: pendiente, en proceso, completado, cancelado
- **CA_174_02**: Confirmación para cambios.
- **CA_174_03**: Cambio en aprox <1s.
- **CA_174_04**: Flujo definido: Pendiente → En proceso → completado

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_175
**Descripción funcional:** Yo como Administrador necesito cancelar pedidos que el cliente no deseo continuar( se debe registrar el motivo de la cancelacion)

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_175`

### Casos de Prueba Ejecutados
- **CA_175_01**: Motivo cancelación (min 10 caracteres)
- **CA_175_02**: Confirmación de cancelacion.
- **CA_175_03**: notificacion de eliminacion exitosa
- **CA_175_04**: Solo si estado "Pendiente" o "En proceso".
- **CA_175_05**: Cancelación en  aprox<3s.
- **CA_175_06**: Cancelación irreversible.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_176
**Descripción funcional:** Yo como Administrador necesito agregar productos del pedido para poder agregar productos deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_176`

### Casos de Prueba Ejecutados
- **CA_176_01**: Lista de productos seleccionables
- **CA_176_02**: Campos: cantidad, precio
- **CA_176_03**: Calcular Subtotal y total.
- **CA_176_04**: Productos con stock disponible.
- **CA_176_05**: Agregado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_177
**Descripción funcional:** Yo como administrador necesito eliminar productos del pedido para poder eliminar productos no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_177`

### Casos de Prueba Ejecutados
- **CA_177_01**: Eliminacion instantanea
- **CA_177_02**: Recalcular total.
- **CA_177_03**: Al menos 1 producto debe quedar, para realizar el pedido
- **CA_177_04**: Eliminación en aprox <1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_178
**Descripción funcional:** Yo como Asesor necesito registrar pedidos para ayudar a los clientes a completar sus compras y asegurar que su orden quede formalizada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_178`

### Casos de Prueba Ejecutados
- **CA_178_01**: Formulario con: select cliente, fecha de creacion de pedido, fecha de entrega, agregar productos(cantidad, precio, subtotal y total)
- **CA_178_02**: Cliente  debe estar activo para crear el pedido.
- **CA_178_03**: pedido minimo con 1 producto.
- **CA_178_04**: Guardado en aprox <4s.
- **CA_178_05**: productos ilimitados por pedido.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_179
**Descripción funcional:** Yo como Asesor necesito listar todos los pedidos para tener una visión completa de las órdenes activas y su estado.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_179`

### Casos de Prueba Ejecutados
- **CA_179_01**: Tabla con: id pedido, cliente, productos, total, fecha de pedido, fecha entrega, estado.
- **CA_179_02**: Datos completos.
- **CA_179_03**: Paginación 10 por defecto.
- **CA_179_04**: Carga aprox <4s con pedidos.
- **CA_179_05**: Orden por fecha entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_180
**Descripción funcional:** Yo como Asesor necesito buscar pedidos por cliente, ID o fecha para localizar rápidamente una orden y brindar información precisa.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_180`

### Casos de Prueba Ejecutados
- **CA_180_01**: Búsqueda por cleinte
- **CA_180_02**: Parámetros válidos apartir de +2 caracteres.
- **CA_180_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_181
**Descripción funcional:** Yo como Asesor necesito ver el detalle de cualquier pedido para validar los productos solicitados y poder asistir al cliente de manera efectiva.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_181`

### Casos de Prueba Ejecutados
- **CA_181_01**: Info completa, id pedido, cliente, productos, total, fecha de pedido, fecha de entrega, estado.
- **CA_181_02**: Todos los datos cargan.
- **CA_181_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_182
**Descripción funcional:** yo como asesor necesito agregar productos a el pedido en proceso

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_182`

### Casos de Prueba Ejecutados
- **CA_182_01**: Solo fecha entrega y observaciones (si estado "Pendiente").
- **CA_182_02**: Restricciones por tiempo (<24h desde creación).
- **CA_182_03**: Guardado en <2s.
- **CA_182_04**: Cambios requieren confirmación si afectan logística.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_183
**Descripción funcional:** yo como asesor necesito aliminar productos a el pedido en proceso

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_183`

### Casos de Prueba Ejecutados
- **CA_183_01**: Orden PDF estándar (sin datos internos).
- **CA_183_02**: Formato básico.
- **CA_183_03**: Generación <6s.
- **CA_183_04**: Sin información confidencial.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_184
**Descripción funcional:** Yo como Asesor necesito actualizar información de los pedidos (como observaciones o datos de contacto) para mantener la orden precisa y actualizada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_184`

### Casos de Prueba Ejecutados
- **CA_184_01**: Solo algunos estados: Pendiente → En preparación → Listo.
- **CA_184_02**: Transiciones limitadas.
- **CA_184_03**: Cambio en <1s.
- **CA_184_04**: No puede marcar como "Entregado" (solo logística).

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_185
**Descripción funcional:** Yo como Asesor necesito generar la orden de pedido en PDF para proporcionar un comprobante al cliente y tener un respaldo de la transacción.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_185`

### Casos de Prueba Ejecutados
- **CA_185_01**: Solo si estado "Pendiente" y pedido propio.
- **CA_185_02**: Motivo obligatorio.
- **CA_185_03**: Restricciones por tiempo (<2h desde creación).
- **CA_185_04**: Cancelación en <2s.
- **CA_185_05**: Cancelación requiere confirmación supervisor si > $500.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_186
**Descripción funcional:** Yo como Asesor necesito agregar productos del pedido para poder agregar productos deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_186`

### Casos de Prueba Ejecutados
- **CA_186_01**: Lista de productos seleccionables
- **CA_186_02**: Campos: cantidad, precio
- **CA_186_03**: Calcular Subtotal y total.
- **CA_186_04**: Productos con stock disponible.
- **CA_186_05**: Agregado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_187
**Descripción funcional:** Yo como Asesor necesito eliminar productos del pedido para poder eliminar productos no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_187`

### Casos de Prueba Ejecutados
- **CA_187_01**: Eliminacion instantanea
- **CA_187_02**: Recalcular total.
- **CA_187_03**: Al menos 1 producto debe quedar, para realizar el pedido
- **CA_187_04**: Eliminación en aprox <1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_188
**Descripción funcional:** Yo como Cliente necesito crear un pedido para poder realizar mis compras en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_188`

### Casos de Prueba Ejecutados
- **CA_188_01**: Carrito de compras con: productos, cantidades, precio, subtotales, totales, fecha entrega.
- **CA_188_02**: Dirección válida registrada.
- **CA_188_03**: solo productos con Stock disponible.
- **CA_188_04**: debe contener almenos 1 producto 
- **CA_188_05**: Creación en  aprox<5s.
- **CA_188_06**: debe tener un boton para realizar el pedido

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_189
**Descripción funcional:** Yo como Cliente necesito ver un listado de todos mis pedidos para hacer seguimiento a mis compras anteriores.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_189`

### Casos de Prueba Ejecutados
- **CA_189_01**: Lista con historial de mis pedidos.
- **CA_189_02**: tabla con: cliente, productos, cantidades, precio, subtotales, totales, fecha entrega.
- **CA_189_03**: Solo pedidos propios.
- **CA_189_04**: Carga aprox <2s con pedidos
- **CA_189_05**: Orden por fecha creación descendente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_190
**Descripción funcional:** Yo como Cliente necesito buscar mis pedidos para poder localizar y consultar mis pedidos anteriores de manera rápida.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_190`

### Casos de Prueba Ejecutados
- **CA_190_01**: Búsqueda por N° pedido.
- **CA_190_02**: Solo pedidos propios.
- **CA_190_03**: Resultados en <1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_191
**Descripción funcional:** Yo como Cliente necesito acceder al detalle completo de un pedido para confirmar qué compré y a qué precio.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_191`

### Casos de Prueba Ejecutados
- **CA_191_01**: Detalle completo pedido: productos, cantidades, precios, estado actual.
- **CA_191_02**: Solo pedidos propios.
- **CA_191_03**: Página carga <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_192
**Descripción funcional:** Yo como cliente necesito descargar PDF  mi pedido

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_192`

### Casos de Prueba Ejecutados
- **CA_192_01**: Orden PDF estándar (sin datos internos).
- **CA_192_02**: Formato básico.
- **CA_192_03**: Generación  aprox <6s

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_193
**Descripción funcional:** Yo como Cliente necesito consultar el estado actual de mi pedido para saber cuándo puedo esperar recibir mi compra.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_193`

### Casos de Prueba Ejecutados
- **CA_193_01**: poder ver el estado de el pedido

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_194
**Descripción funcional:** Yo como Cliente necesito agregar productos del pedido para poder agregar productos deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_194`

### Casos de Prueba Ejecutados
- **CA_194_01**: Lista de productos.
- **CA_194_02**: Campos: cantidad, precio
- **CA_194_03**: Recalcular total.
- **CA_194_04**: solo productos con Stock disponible.
- **CA_194_05**: Agregado en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_195
**Descripción funcional:** Yo como Cliente necesito eliminar productos del pedido para poder eliminar productos no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_195`

### Casos de Prueba Ejecutados
- **CA_195_01**: Eliminacion en aprox 2s.
- **CA_195_02**: Confirmación de eliminacion
- **CA_195_03**: Recalcular total.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_196
**Descripción funcional:** Yo como Productor necesito listar los pedidos en estado "en proceso" para conocer qué debo preparar o empacar.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_196`

### Casos de Prueba Ejecutados
- **CA_196_01**: Tabla con: id pedido, cliente, productos, total, fecha de pedido, fecha entrega, estado.
- **CA_196_02**: Datos completos.
- **CA_196_03**: Paginación 10 por defecto.
- **CA_196_04**: Carga aprox <4s con pedidos.
- **CA_196_05**: Orden por fecha entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_197
**Descripción funcional:** Yo como Productor necesito ver el detalle de un pedido (productos, cantidades, especificaciones) para preparar los elementos correctos y cumplir con la orden.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_197`

### Casos de Prueba Ejecutados
- **CA_197_01**: Info completa, id pedido, cliente, productos, total, fecha de pedido, fecha de entrega, estado.
- **CA_197_02**: Todos los datos cargan.
- **CA_197_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_198
**Descripción funcional:** Yo como Productor necesito actualizar el estado de un pedido (a "Procesando" cuando inicio su preparación y a "Procesado" cuando está listo) para comunicar su progreso en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_198`

### Casos de Prueba Ejecutados
- **CA_198_01**: Solo algunos estados: Pendiente → En preparación → Listo.
- **CA_198_02**: Transiciones limitadas.
- **CA_198_03**: Cambio en <1s.
- **CA_198_04**: No puede marcar como "Entregado" (solo logística).

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_199
**Descripción funcional:** Yo como Administrador necesito registrar domicilios para supervisar y auditar el inicio de todo el proceso logístico de entregas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_199`

### Casos de Prueba Ejecutados
- **CA_199_01**: Formulario con: Pedido asociado, Repartidor,Direccion ,Fecha, Hora, detalle domicilio.
- **CA_199_02**: Pedido en estado "completado".
- **CA_199_03**: Repartidor disponible.
- **CA_199_04**: Fechas válidas.
- **CA_199_05**: Guardado en aprox <3s.
- **CA_199_06**: Promedio tiempo de entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_200
**Descripción funcional:** Yo como Administrador necesito listar los domicilios para poder gestionar, supervisar y asignar las entregas programadas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_200`

### Casos de Prueba Ejecutados
- **CA_200_01**: Tabla: IDdomicilio, numero de pedido, cliente. direccion, repartidor, fecha, hora estado.
- **CA_200_02**: Datos completos.
- **CA_200_03**: Paginación 10 por defecto.
- **CA_200_04**: Carga aprox <4s con  domicilios.
- **CA_200_05**: Orden por hora salida.
- **CA_200_06**: Estado de el domicilio

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_201
**Descripción funcional:**  Yo como Administrador necesito buscar domicilios para poder localizar rápidamente entregas específicas y gestionar la logística.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_201`

### Casos de Prueba Ejecutados
- **CA_201_01**: Búsqueda por IDdomicilio, cliente.
- **CA_201_02**: Parámetros válidos 2+ caracteres.
- **CA_201_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_202
**Descripción funcional:** Yo como Administrador necesito ver el detalle de un domicilio para poder revisar la información completa de cada entrega y verificar su estado.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_202`

### Casos de Prueba Ejecutados
- **CA_202_01**: Info completa con detalles de el domicilio
- **CA_202_02**: Todos los datos cargan.
- **CA_202_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_203
**Descripción funcional:**  Yo como Administrador necesito actualizar un domicilio para poder corregir información de entrega cuando haya cambios o errores en los datos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_203`

### Casos de Prueba Ejecutados
- **CA_203_01**: Campos editables
- **CA_203_02**: Solo si estado "pediente".
- **CA_203_03**: Guardado en <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_204
**Descripción funcional:** Yo como Administrador necesito cambiar el estado de un domicilio para poder controlar y monitorear el progreso de las entregas en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_204`

### Casos de Prueba Ejecutados
- **CA_204_01**: Selector estado (pendiente, en camino, entregado, cancelado)
- **CA_204_02**: Cambio en <1s.
- **CA_204_03**: Flujo con: Pendiente → En camino → Entregado.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_205
**Descripción funcional:** Yo como Administrador necesito eliminar domicilios para poder mantener limpia la base de datos eliminando registros de entregas erróneos o duplicados.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_205`

### Casos de Prueba Ejecutados
- **CA_205_01**: motivo de eliminacion (min 10 caracteres)
- **CA_205_02**: Confirmación de eliminacion de domicilio.
- **CA_205_03**: eliminacion aprox <1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_206
**Descripción funcional:** Yo como Asesor necesito registrar domicilios para comenzar una entrega ( "procesado" ,"enviado").

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_206`

### Casos de Prueba Ejecutados
- **CA_206_01**: Formulario con: Pedido asociado, Repartidor,Direccion ,Fecha, Hora, detalle domicilio.
- **CA_206_02**: Pedido en estado "completado".
- **CA_206_03**: Repartidor disponible.
- **CA_206_04**: Fechas válidas.
- **CA_206_05**: Guardado en aprox <3s.
- **CA_206_06**: Promedio tiempo de entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_207
**Descripción funcional:**  Yo como Asesor necesito listar los domicilios para poder ver y gestionar todas las entregas programadas y asignadas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_207`

### Casos de Prueba Ejecutados
- **CA_207_01**: Tabla: IDdomicilio, numero de pedido, cliente. direccion, repartidor, fecha, hora estado.
- **CA_207_02**: Datos completos.
- **CA_207_03**: Paginación 10 por defecto.
- **CA_207_04**: Carga aprox <4s con  domicilios.
- **CA_207_05**: Orden por hora salida.
- **CA_207_06**: Estado de el domicilio

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_208
**Descripción funcional:**  Yo como Asesor necesito buscar domicilios para poder localizar rápidamente entregas específicas y gestionar la logística.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_208`

### Casos de Prueba Ejecutados
- **CA_208_01**: Búsqueda por IDdomicilio, cliente.
- **CA_208_02**: Parámetros válidos 2+ caracteres.
- **CA_208_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_209
**Descripción funcional:** Yo como asesor necesito ver el detalle de un domicilio para poder conocer los productos y dirección de entrega para brindar información precisa al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_209`

### Casos de Prueba Ejecutados
- **CA_209_01**: Info completa con detalles de el domicilio
- **CA_209_02**: Todos los datos cargan.
- **CA_209_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_210
**Descripción funcional:** Yo como Asesor necesito actualizar datos del domicilio (ej: dirección o teléfono) por solicitud del cliente o en caso datos erroneos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_210`

### Casos de Prueba Ejecutados
- **CA_210_01**: Campos editables
- **CA_210_02**: Solo si estado "pediente".
- **CA_210_03**: Guardado en <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_211
**Descripción funcional:** Yo como Asesor necesito cambiar el estado del domicilio para poder actualizar el progreso de la entrega y mantener informado al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_211`

### Casos de Prueba Ejecutados
- **CA_211_01**: Selector estado (pendiente, en camino, entregado, cancelado)
- **CA_211_02**: Cambio en <1s.
- **CA_211_03**: Flujo con: Pendiente → En camino → Entregado.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_212
**Descripción funcional:** Yo como Asesor necesito eliminar domicilios para poder eliminar domicilios registrados por error o no necesarios.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_212`

### Casos de Prueba Ejecutados
- **CA_212_01**: motivo de eliminacion (min 10 caracteres)
- **CA_212_02**: Confirmación de eliminacion de domicilio.
- **CA_212_03**: Proceso aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_213
**Descripción funcional:** Yo como Repartidor necesito listar domicilios para ver las entregas activas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_213`

### Casos de Prueba Ejecutados
- **CA_213_01**: Tabla: IDdomicilio, numero de pedido, cliente. direccion, repartidor, fecha, hora estado.
- **CA_213_02**: Datos completos.
- **CA_213_03**: Paginación 10 por defecto.
- **CA_213_04**: Carga aprox <4s con  domicilios.
- **CA_213_05**: Orden por hora salida.
- **CA_213_06**: Estado de el domicilio

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_214
**Descripción funcional:** Yo como Repartidor necesito buscar domicilios por pedido o dirección.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_214`

### Casos de Prueba Ejecutados
- **CA_214_01**: Búsqueda por IDdomicilio, cliente.
- **CA_214_02**: Parámetros válidos 2+ caracteres.
- **CA_214_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_215
**Descripción funcional:** Yo como Repartidor necesito ver el detalle completo del domicilio para planificar mi ruta de entrega.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_215`

### Casos de Prueba Ejecutados
- **CA_215_01**: Info completa con detalles de el domicilio
- **CA_215_02**: Todos los datos cargan.
- **CA_215_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_216
**Descripción funcional:** Yo como Repartidor necesito actualizar el estado del domicilio para reflejar el progreso real de la entrega. (enviado . entregado, no entregado (solo en caso extremo error en direccion de el cliente)

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_216`

### Casos de Prueba Ejecutados
- **CA_216_01**: Solo estados de "encamino": "Entregado", "cancelado".
- **CA_216_02**: Cambio en aprox <2s 

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_217
**Descripción funcional:** Yo como Cliente necesito ver el estado del domicilio de mi pedido para saber en qué punto se encuentra mi entrega.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_217`

### Casos de Prueba Ejecutados
- **CA_217_01**: Lista del historial de domicilios recibidos.
- **CA_217_02**: Solo domicilios propios.
- **CA_217_03**: Carga aprox <3s con domicilios.
- **CA_217_04**: Orden por prioridad de estado de el domicilio.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_218
**Descripción funcional:** Yo como Asesor necesito ver las ventas mensuales para poder visualizar las ventas realizadas por mes y analizar el desempeño comercial.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_218`

### Casos de Prueba Ejecutados
- **CA_218_01**: Grafico barras: ventas mensuales.
- **CA_218_02**: distribucion por categoría de ventas de los productos.
- **CA_218_03**: Carga gráfico <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_219
**Descripción funcional:** Yo como Asesor necesito visualizar las ventas realizadas hoy para poder conocer la actividad del día.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_219`

### Casos de Prueba Ejecutados
- **CA_219_01**: Tarjeta con total ventas del dia.
- **CA_219_02**: Carga <2s.
- **CA_219_03**: Solo ventas generales.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_220
**Descripción funcional:** Yo como Asesor necesito ver los productos más vendidos para poder visualizar los productos con mayor cantidad de ventas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_220`

### Casos de Prueba Ejecutados
- **CA_220_01**: Grafico pastel por categoría.
- **CA_220_02**: Carga <3s.
- **CA_220_03**: Solo productos de categorías asignadas.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_221
**Descripción funcional:** Yo como Asesor necesito ver los pedidos registrados recientemente para poder visualizar los pedidos recién realizados y monitorear la actividad del sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_221`

### Casos de Prueba Ejecutados
- **CA_221_01**: Tabla últimos 10 pedidos
- **CA_221_02**: Solo pedidos de hoy.
- **CA_221_03**: Carga aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_222
**Descripción funcional:** Yo como Administrador necesito ver las ventas mensuales para poder visualizar las ventas realizadas por mes y analizar el desempeño comercial.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_222`

### Casos de Prueba Ejecutados
- **CA_222_01**: Grafico barras: ventas mensuales.
- **CA_222_02**: distribucion por categoría de ventas de los productos.
- **CA_222_03**: Carga gráfico <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_223
**Descripción funcional:** Yo como Administrador necesito visualizar las ventas realizadas hoy para poder conocer la actividad del día.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_223`

### Casos de Prueba Ejecutados
- **CA_223_01**: Tarjeta con total ventas del dia.
- **CA_223_02**: Carga <2s.
- **CA_223_03**: Solo ventas generales.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_224
**Descripción funcional:** Yo como Administrador necesito ver los productos más vendidos para poder visualizar los productos con mayor cantidad de ventas.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_224`

### Casos de Prueba Ejecutados
- **CA_224_01**: Grafico pastel por categoría.
- **CA_224_02**: Carga <3s.
- **CA_224_03**: Solo productos de categorías asignadas.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_225
**Descripción funcional:** Yo como Administrador necesito ver los pedidos registrados recientemente para poder visualizar los pedidos recién realizados y monitorear la actividad del sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_225`

### Casos de Prueba Ejecutados
- **CA_225_01**: Tabla últimos 10 pedidos
- **CA_225_02**: Solo pedidos de hoy.
- **CA_225_03**: Carga aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_226
**Descripción funcional:** yo como usuario necesito iniciar sesion para poder inciar sesion con cuentas registradas con cada rol 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_226`

### Casos de Prueba Ejecutados
- **CA_226_01**: Pantalla con campos: Email/Username, Contraseña.
- **CA_226_02**: Las credenciales deben ser válidas y la cuenta activa.
- **CA_226_03**: Bloqueo tras 5 intentos fallidos (por 15 minutos).
- **CA_226_04**: Autenticación en aprox 3s.
- **CA_226_05**: Interfaz responsiva (web/móvil).
- **CA_226_06**: La sesión expira tras 30 minutos de inactividad.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_227
**Descripción funcional:** yo como usuario necesito cerrar sesion para poder cerrar la sesion y que no quede abierta en otros dispositivos 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_227`

### Casos de Prueba Ejecutados
- **CA_227_01**: Confirmación  cerrar sesión.
- **CA_227_02**: Termina sesión actual inmediatamente.
- **CA_227_03**: Cierre en aprox 2s con redirección automática.
- **CA_227_04**: Confirmación  cerrar sesión.
- **CA_227_05**: Termina sesión actual inmediatamente.
- **CA_227_06**: Cierre en aprox 2s con redirección automática.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_228
**Descripción funcional:** yo como usuario necesito cambiar la contraseña para poder tener control de la contraseña personal 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_228`

### Casos de Prueba Ejecutados
- **CA_228_01**: Formulario con campos: Contraseña actual, Nueva contraseña, Confirmar.
- **CA_228_02**: La nueva contraseña no debe ser igual a las últimas 3 utilizadas.
- **CA_228_03**: Debe cumplir: mínimo 8 caracteres, al menos una mayúscula, un número
- **CA_228_04**: Validación en tiempo real.
- **CA_228_05**: Cambio en aprox 2s.
- **CA_228_06**: No reutilizar contraseñas recientes.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_229
**Descripción funcional:** yo como usuario necesito reestablecer la contraseña para poder reestablecerla por si pierde

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_229`

### Casos de Prueba Ejecutados
- **CA_229_01**: Ingresar email registrado.
- **CA_229_02**: Enviar código de verificación por email (válido 15 min).
- **CA_229_03**: Ingresar nueva contraseña después del código.
- **CA_229_04**: Email enviado en aprox 30s.
- **CA_229_05**: Proceso completo en aprox 5min.
- **CA_229_06**: Enlace válido 24 horas.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_230
**Descripción funcional:** Yo como Administrador necesito registrar ventas para mantener actualizado el historial de transacciones.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_230`

### Casos de Prueba Ejecutados
- **CA_230_01**: Formulario con: tipo de venta, cleinte, metodo de pago, agregar productos(seleccionar producto,cantidad, precio) 
- **CA_230_02**: la venta permite ser creada si el Cliente  esta activo.
- **CA_230_03**: no permitir ventas con productos sin Stock disponible.
- **CA_230_04**: subtotales y Totales >0.
- **CA_230_05**: Guardado aprox <5s, cálculos automáticos.
- **CA_230_06**: productos ilimitados por venta.
- **CA_230_07**: Precios según política de la empresa

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_231
**Descripción funcional:** Yo como Administrador necesito listar ventas para revisar movimientos de venta.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_231`

### Casos de Prueba Ejecutados
- **CA_231_01**: Tabla con datos: numero de venta, tipo, cliente, fehca, items, total, metodo de pago , estado de la venta.
- **CA_231_02**: Datos completos.
- **CA_231_03**: Paginación de 10 lineas.
- **CA_231_04**: Carga aprox <4s con ventas.
- **CA_231_05**: Orden por fecha más reciente.
- **CA_231_06**: Estados: Pendiente, Completada, cancelada.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_232
**Descripción funcional:** Yo como Administrador necesito buscar ventas por numero de venta o cliente .

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_232`

### Casos de Prueba Ejecutados
- **CA_232_01**: Búsqueda por numero de venta o numero de cliente
- **CA_232_02**: Parámetros minimos +2 caracteres
- **CA_232_03**: Resultados en aprox <2s.
- **CA_232_04**: Filtrar por fechas, estado, metodo de pago

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_233
**Descripción funcional:** Yo como Administrador necesito ver el detalle de la venta para analizar los productos y las cantidades vendidos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_233`

### Casos de Prueba Ejecutados
- **CA_233_01**: Info completa + productos + iva + historial .
- **CA_233_02**: informacion de estado.
- **CA_233_03**: Todos los datos cargan.
- **CA_233_04**: Página carga  en aprox <3s.
- **CA_233_05**: Ver costos totales.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_234
**Descripción funcional:** Yo como Administrador necesito generar un PDF de la venta para entregar un comprobante al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_234`

### Casos de Prueba Ejecutados
- **CA_234_01**: Factura PDF con logo, datos de la venta , cliente, productos, totales.
- **CA_234_02**: Formato estandar vigente.
- **CA_234_03**: Numeración consecutiva segun id compra.
- **CA_234_04**: Generación aprox <5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_235
**Descripción funcional:** Yo como Administrador necesito cancelar una venta que se registre por error de el asesor, por error (ej: producto equivocado, duplicidad,cliente problematico exige su dinero)

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_235`

### Casos de Prueba Ejecutados
- **CA_235_01**: Motivo de cancelacion (min 10 caracteres).
- **CA_235_02**: Confirmación de cancelacion
- **CA_235_03**: Solo si estado "Pendiente" o "Completada".
- **CA_235_04**: Anulación en aprox <4s.
- **CA_235_05**: Cancelacion reversible.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_236
**Descripción funcional:** Yo como Administrador necesito agregar productos durante el proceso de venta para completar la transacción.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_236`

### Casos de Prueba Ejecutados
- **CA_236_01**: lista para seleccion de productos.
- **CA_236_02**: Campos: cantidad, precio
- **CA_236_03**: Calcular totales.
- **CA_236_04**: Solo si estado "Pendiente".
- **CA_236_05**: Solo permitir agregar productos con Stock disponible.
- **CA_236_06**: Agregado en aprox<2s.
- **CA_236_07**: Precios según politicas de la empresa.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_237
**Descripción funcional:** Yo como Administrador necesito eliminar productos durante el proceso de la venta para corregir errores en la selección.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_237`

### Casos de Prueba Ejecutados
- **CA_237_01**: seleccion unica de producto a eliminar.
- **CA_237_02**: Eliminacion instantanea
- **CA_237_03**: calcular totales.
- **CA_237_04**: Solo si estado "Pendiente".
- **CA_237_05**: Al menos 1 producto debe quedar.
- **CA_237_06**: Eliminación en  aprox<1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_238
**Descripción funcional:** Yo como Asesor necesito registrar ventas para facturar los productos que adquieren mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_238`

### Casos de Prueba Ejecutados
- **CA_238_01**: Formulario con: tipo de venta, cleinte, metodo de pago, agregar productos(seleccionar producto,cantidad, precio) 
- **CA_238_02**: la venta permite ser creada si el Cliente  esta activo.
- **CA_238_03**: no permitir ventas con productos sin Stock disponible.
- **CA_238_04**: subtotales y Totales >0.
- **CA_238_05**: Guardado aprox <5s, cálculos automáticos.
- **CA_238_06**: productos ilimitados por venta.
- **CA_238_07**: Precios según política de la empresa

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_239
**Descripción funcional:** Yo como Asesor necesito listar las ventas que fueron realizadas .

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_239`

### Casos de Prueba Ejecutados
- **CA_239_01**: Tabla con datos: numero de venta, tipo, cliente, fehca, items, total, metodo de pago , estado de la venta.
- **CA_239_02**: Datos completos.
- **CA_239_03**: Paginación de 10 lineas.
- **CA_239_04**: Carga aprox <4s con ventas.
- **CA_239_05**: Orden por fecha más reciente.
- **CA_239_06**: Estados: Pendiente, Completada, cancelada.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_240
**Descripción funcional:** Yo como Asesor necesito buscar ventas por ID, cliente o fecha para atender consultas específicas de mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_240`

### Casos de Prueba Ejecutados
- **CA_240_01**: Búsqueda por numero de venta o numero de cliente
- **CA_240_02**: Parámetros minimos +2 caracteres
- **CA_240_03**: Resultados en aprox <2s.
- **CA_240_04**: Filtrar por fechas, estado, metodo de pago

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_241
**Descripción funcional:** Yo como Asesor necesito ver el detalles completos de la venta para garantizar cumplimiento de los productos

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_241`

### Casos de Prueba Ejecutados
- **CA_241_01**: Info completa + productos + iva + historial .
- **CA_241_02**: informacion de estado.
- **CA_241_03**: Todos los datos cargan.
- **CA_241_04**: Página carga  en aprox <3s.
- **CA_241_05**: Ver costos totales.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_242
**Descripción funcional:** Yo como Asesor necesito generar e imprimir el PDF de la venta en el momento para entregar el comprobante físico al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_242`

### Casos de Prueba Ejecutados
- **CA_242_01**: Factura PDF con logo, datos de la venta , cliente, productos, totales.
- **CA_242_02**: Formato estandar vigente.
- **CA_242_03**: Numeración consecutiva segun id compra.
- **CA_242_04**: Generación aprox <5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_243
**Descripción funcional:** Yo como Asesor necesito agregar productos al instante de la venta en proceso.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_243`

### Casos de Prueba Ejecutados
- **CA_243_01**: lista para seleccion de productos.
- **CA_243_02**: Campos: cantidad, precio
- **CA_243_03**: Calcular totales.
- **CA_243_04**: Solo si estado "Pendiente".
- **CA_243_05**: Solo permitir agregar productos con Stock disponible.
- **CA_243_06**: Agregado en aprox<2s.
- **CA_243_07**: Precios según politicas de la empresa.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_244
**Descripción funcional:** Yo como Asesor necesito eliminar productos de una venta en proceso para corregir la selección antes de finalizarla.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_244`

### Casos de Prueba Ejecutados
- **CA_244_01**: seleccion unica de producto a eliminar.
- **CA_244_02**: Eliminacion instantanea
- **CA_244_03**: calcular totales.
- **CA_244_04**: Solo si estado "Pendiente".
- **CA_244_05**: Al menos 1 producto debe quedar.
- **CA_244_06**: Eliminación en  aprox<1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_245
**Descripción funcional:** Yo como clientre necesito agregar productos a mi carrito de compras para posteriormente realizar mi compra.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_245`

### Casos de Prueba Ejecutados
- **CA_245_01**: agregar productos seleccionados
- **CA_245_02**: calcular siubotales y totales.
- **CA_245_03**: permitir eliminar productos de el carrito
- **CA_245_04**: boton para proceder a el pago

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_246
**Descripción funcional:** yo como  cliente necesito listar mis compras para poder acceder a el historias de mis compras

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_246`

### Casos de Prueba Ejecutados
- **CA_246_01**: Solo compras propias.
- **CA_246_02**: Búsqueda por N° factura o rango fechas.
- **CA_246_03**: Solo acceso a datos propios.
- **CA_246_04**: Resultados en aprox<1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_247
**Descripción funcional:** Yo como Cliente necesito completar una compra en el portal web para cualquier producto desponible.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_247`

### Casos de Prueba Ejecutados
- **CA_247_01**: debe contener almenos 1 producto para completar la compra
- **CA_247_02**: Solo ventas (compras) propias.
- **CA_247_03**: Carga <2s con 100+ ventas.
- **CA_247_04**: Orden por fecha descendente.
- **CA_247_05**: Estados simplificados.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_248
**Descripción funcional:** Yo como Cliente necesito ver el historial de mis ventas (compras) realizadas para consultar detalles, precios o repetir pedidos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_248`

### Casos de Prueba Ejecutados
- **CA_248_01**: Factura con detalle completos.
- **CA_248_02**: Solo ventas propias.
- **CA_248_03**: Página carga  aprox<2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_249
**Descripción funcional:** Yo como Administrador necesito registrar abonos para llevar control de pagos parciales.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_249`

### Casos de Prueba Ejecutados
- **CA_249_01**: Formulario con: pedidoID , ClienteID, monto de el abono, metodo de pago, fecha
- **CA_249_02**: Monto de el abono >= 50%
- **CA_249_03**: Fecha de el abono.
- **CA_249_04**: Guardado en aprox <3s.
- **CA_249_05**: Actualizar automáticamente saldo venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_250
**Descripción funcional:** Yo como Administrador necesito listar abonos para revisar pagos realizados.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_250`

### Casos de Prueba Ejecutados
- **CA_250_01**: Tabla con: numeroAbono, pedidoID,monto,fehca, metodo pago, Estado.
- **CA_250_02**: Datos completos.
- **CA_250_03**: Paginación 10 por defecto.
- **CA_250_04**: Carga aprox <3s de abonos.
- **CA_250_05**: Orden por fecha más reciente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_251
**Descripción funcional:** Yo como Administrador necesito buscar abonos por venta o fecha.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_251`

### Casos de Prueba Ejecutados
- **CA_251_01**: Búsqueda por numeroAbono
- **CA_251_02**: Parámetros válidos apartir de +2 caracteres.
- **CA_251_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_252
**Descripción funcional:** Yo como Administrador necesito ver el detalle del abono para validar la información y montos registrada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_252`

### Casos de Prueba Ejecutados
- **CA_252_01**: Info completa. idAbono, numeroabono, cliente, monto, fecha, metodo de pago, estado
- **CA_252_02**: Todos los datos cargan.
- **CA_252_03**: Página carga en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_253
**Descripción funcional:** Yo como Administrador necesito generar un comprobante de pago (PDF) del abono para entregarlo al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_253`

### Casos de Prueba Ejecutados
- **CA_253_01**: Recibo PDF con datos empresa, cliente, abono, monto.
- **CA_253_02**: Formato profesional.
- **CA_253_03**: Numeración consecutiva acorde a el id de el abono.
- **CA_253_04**: Generación en aprox <5s.
- **CA_253_05**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_254
**Descripción funcional:** Yo como Administrador necesito eliminar abonos para corregir registros duplicados o erróneos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_254`

### Casos de Prueba Ejecutados
- **CA_254_01**: Motivo cancelacion (10 caracteres minimos).
- **CA_254_02**: Confirmación de eliminacion de abono
- **CA_254_03**: Cancelacion en aprox <3s.
- **CA_254_04**: Cancelacion reversible .

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_255
**Descripción funcional:** Yo como Asesor necesito registrar abonos para llevar un control preciso de los pagos parciales que realizan mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_255`

### Casos de Prueba Ejecutados
- **CA_255_01**: Formulario con: pedidoID , ClienteID, monto de el abono, metodo de pago, fecha
- **CA_255_02**: Monto de el abono >= 50%
- **CA_255_03**: Fecha de el abono.
- **CA_255_04**: Guardado en aprox <3s.
- **CA_255_05**: Actualizar automáticamente saldo venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_256
**Descripción funcional:** Yo como Asesor necesito listar los abonos para revisar y verificar los pagos que han realizado mis clientes.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_256`

### Casos de Prueba Ejecutados
- **CA_256_01**: Tabla con: numeroAbono, pedidoID,monto,fehca, metodo pago, Estado.
- **CA_256_02**: Datos completos.
- **CA_256_03**: Paginación 10 por defecto.
- **CA_256_04**: Carga aprox <3s de abonos.
- **CA_256_05**: Orden por fecha más reciente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_257
**Descripción funcional:** Yo como Asesor necesito buscar abonos por cliente, venta o fecha para encontrar información de pagos específicos.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_257`

### Casos de Prueba Ejecutados
- **CA_257_01**: Búsqueda por numeroAbono
- **CA_257_02**: Parámetros válidos apartir de +2 caracteres.
- **CA_257_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_258
**Descripción funcional:** Yo como Asesor necesito ver el detalle completo de un abono para confirmar su información y brindar un soporte claro al cliente.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_258`

### Casos de Prueba Ejecutados
- **CA_258_01**: Info completa. idAbono, numeroabono, cliente, monto, fecha, metodo de pago, estado
- **CA_258_02**: Todos los datos cargan.
- **CA_258_03**: Página carga en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_259
**Descripción funcional:** Yo como Asesor necesito generar un comprobante de pago (PDF) del abono para entregárselo al cliente y que tenga su respaldo.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_259`

### Casos de Prueba Ejecutados
- **CA_259_01**: Recibo PDF con datos empresa, cliente, abono, monto.
- **CA_259_02**: Formato profesional.
- **CA_259_03**: Numeración consecutiva acorde a el id de el abono.
- **CA_259_04**: Generación en aprox <5s.
- **CA_259_05**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_300
**Descripción funcional:** Yo como Asesor necesito eliminar abonos registrados por error para corregir la información financiera de la venta.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_300`

### Casos de Prueba Ejecutados
- **CA_300_01**: Formulario con: pedidoID , ClienteID, monto de el abono, metodo de pago, fecha
- **CA_300_02**: Monto de el abono >= 50%
- **CA_300_03**: Fecha de el abono.
- **CA_300_04**: Guardado en aprox <3s.
- **CA_300_05**: Actualizar automáticamente saldo venta.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_301
**Descripción funcional:** Yo como Administrador necesito registrar pedidos de clientes para cumplir con su orden.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_301`

### Casos de Prueba Ejecutados
- **CA_301_01**: Formulario con: select cliente, fecha de creacion de pedido, fecha de entrega, agregar productos(cantidad, precio, subtotal y total)
- **CA_301_02**: Cliente  debe estar activo para crear el pedido.
- **CA_301_03**: pedido minimo con 1 producto.
- **CA_301_04**: Guardado en aprox <4s.
- **CA_301_05**: productos ilimitados por pedido.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_302
**Descripción funcional:** Yo como Administrador necesitro listar los pedidos de los clientes para dale se seguimiento

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_302`

### Casos de Prueba Ejecutados
- **CA_302_01**: Tabla con: id pedido, cliente, productos, total, fecha de pedido, fecha entrega, estado.
- **CA_302_02**: Datos completos.
- **CA_302_03**: Paginación 10 por defecto.
- **CA_302_04**: Carga aprox <4s con pedidos.
- **CA_302_05**: Orden por fecha entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_303
**Descripción funcional:** Yo como Administrador necesito buscar pedidos por fecha o ID.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_303`

### Casos de Prueba Ejecutados
- **CA_303_01**: barra de Búsqueda por IDpedido, cliente.
- **CA_303_02**: Parámetros válidos 2+ caracteres.
- **CA_303_03**: Resultados aprox <2s.
- **CA_303_04**: filtros combinados por fecha, estado

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_304
**Descripción funcional:** Yo como Administrador necesito ver el detalle del pedido para verificar productos y valores.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_304`

### Casos de Prueba Ejecutados
- **CA_304_01**: Info completa, id pedido, cliente, productos, total, fecha de pedido, fecha de entrega, estado.
- **CA_304_02**: Todos los datos cargan.
- **CA_304_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_305
**Descripción funcional:** Yo como Administrador necesito actualizar un pedido para poder agregar productos a la venta.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_305`

### Casos de Prueba Ejecutados
- **CA_305_01**: Campos editables: todos
- **CA_305_02**: Guardado en aprox <2s.
- **CA_305_03**: Confirmacion de cambios guardados.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_306
**Descripción funcional:** Yo como Administrador necesito generar una orden de pedido en PDF para usarla como documento interno de preparación.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_306`

### Casos de Prueba Ejecutados
- **CA_306_01**: Orden PDF con datos pedido completos
- **CA_306_02**: Formato estandar de pfd
- **CA_306_03**: Generación  aprox <8s
- **CA_306_04**: PDF descargable

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_307
**Descripción funcional:** Yo como Administrador necesito cambiar el estado del pedido para notificar su progreso (ej: de Pendiente a Preparando).

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_307`

### Casos de Prueba Ejecutados
- **CA_307_01**: Selector estado con: pendiente, en proceso, completado, cancelado
- **CA_307_02**: Confirmación para cambios.
- **CA_307_03**: Cambio en aprox <1s.
- **CA_307_04**: Flujo definido: Pendiente → En proceso → completado

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_308
**Descripción funcional:** Yo como Administrador necesito cancelar pedidos que el cliente no deseo continuar( se debe registrar el motivo de la cancelacion)

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_308`

### Casos de Prueba Ejecutados
- **CA_308_01**: Motivo cancelación (min 10 caracteres)
- **CA_308_02**: Confirmación de cancelacion.
- **CA_308_03**: notificacion de eliminacion exitosa
- **CA_308_04**: Solo si estado "Pendiente" o "En proceso".
- **CA_308_05**: Cancelación en  aprox<3s.
- **CA_308_06**: Cancelación reversible.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_309
**Descripción funcional:** Yo como Administrador necesito agregar productos del pedido para poder agregar productos deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_309`

### Casos de Prueba Ejecutados
- **CA_309_01**: Lista de productos seleccionables
- **CA_309_02**: Campos: cantidad, precio
- **CA_309_03**: Calcular Subtotal y total.
- **CA_309_04**: Productos con stock disponible.
- **CA_309_05**: Agregado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_310
**Descripción funcional:** Yo como administrador necesito eliminar productos del pedido para poder eliminar productos no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_310`

### Casos de Prueba Ejecutados
- **CA_310_01**: Eliminacion instantanea
- **CA_310_02**: Recalcular total.
- **CA_310_03**: Al menos 1 producto debe quedar, para realizar el pedido
- **CA_310_04**: Eliminación en aprox <1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_311
**Descripción funcional:** Yo como Asesor necesito registrar pedidos para ayudar a los clientes a completar sus compras y asegurar que su orden quede formalizada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_311`

### Casos de Prueba Ejecutados
- **CA_311_01**: Formulario con: select cliente, fecha de creacion de pedido, fecha de entrega, agregar productos(cantidad, precio, subtotal y total)
- **CA_311_02**: Cliente  debe estar activo para crear el pedido.
- **CA_311_03**: pedido minimo con 1 producto.
- **CA_311_04**: Guardado en aprox <4s.
- **CA_311_05**: productos ilimitados por pedido.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_312
**Descripción funcional:** Yo como Asesor necesito listar todos los pedidos para tener una visión completa de las órdenes activas y su estado.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_312`

### Casos de Prueba Ejecutados
- **CA_312_01**: Tabla con: id pedido, cliente, productos, total, fecha de pedido, fecha entrega, estado.
- **CA_312_02**: Datos completos.
- **CA_312_03**: Paginación 10 por defecto.
- **CA_312_04**: Carga aprox <4s con pedidos.
- **CA_312_05**: Orden por fecha entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_313
**Descripción funcional:** Yo como Asesor necesito buscar pedidos por cliente, ID o fecha para localizar rápidamente una orden y brindar información precisa.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_313`

### Casos de Prueba Ejecutados
- **CA_313_01**: Búsqueda por numeroAbono
- **CA_313_02**: Parámetros válidos apartir de +2 caracteres.
- **CA_313_03**: Resultados en aprox <1.5s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_314
**Descripción funcional:** Yo como Asesor necesito ver el detalle de cualquier pedido para validar los productos solicitados y poder asistir al cliente de manera efectiva.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_314`

### Casos de Prueba Ejecutados
- **CA_314_01**: Info completa, id pedido, cliente, productos, total, fecha de pedido, fecha de entrega, estado.
- **CA_314_02**: Todos los datos cargan.
- **CA_314_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_315
**Descripción funcional:** yo como asesor necesito agregar productos a el pedido en proceso

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_315`

### Casos de Prueba Ejecutados
- **CA_315_01**: Solo fecha entrega y observaciones (si estado "Pendiente").
- **CA_315_02**: Restricciones por tiempo (<24h desde creación).
- **CA_315_03**: Guardado en <2s.
- **CA_315_04**: Cambios requieren confirmación si afectan logística.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_316
**Descripción funcional:** yo como asesor necesito aliminar productos a el pedido en proceso

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_316`

### Casos de Prueba Ejecutados
- **CA_316_01**: Orden PDF estándar (sin datos internos).
- **CA_316_02**: Formato básico.
- **CA_316_03**: Generación <6s.
- **CA_316_04**: Sin información confidencial.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_317
**Descripción funcional:** Yo como Asesor necesito actualizar información de los pedidos (como observaciones o datos de contacto) para mantener la orden precisa y actualizada.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_317`

### Casos de Prueba Ejecutados
- **CA_317_01**: Solo algunos estados: Pendiente → En preparación → Listo.
- **CA_317_02**: Transiciones limitadas.
- **CA_317_03**: Cambio en <1s.
- **CA_317_04**: No puede marcar como "Entregado" (solo logística).

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_318
**Descripción funcional:** Yo como Asesor necesito generar la orden de pedido en PDF para proporcionar un comprobante al cliente y tener un respaldo de la transacción.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_318`

### Casos de Prueba Ejecutados
- **CA_318_01**: Solo si estado "Pendiente" y pedido propio.
- **CA_318_02**: Motivo obligatorio.
- **CA_318_03**: Restricciones por tiempo (<2h desde creación).
- **CA_318_04**: Cancelación en <2s.
- **CA_318_05**: Cancelación requiere confirmación supervisor si > $500.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_319
**Descripción funcional:** Yo como Asesor necesito agregar productos del pedido para poder agregar productos deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_319`

### Casos de Prueba Ejecutados
- **CA_319_01**: Lista de productos seleccionables
- **CA_319_02**: Campos: cantidad, precio
- **CA_319_03**: Calcular Subtotal y total.
- **CA_319_04**: Productos con stock disponible.
- **CA_319_05**: Agregado en aprox 2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_320
**Descripción funcional:** Yo como Asesor necesito eliminar productos del pedido para poder eliminar productos no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_320`

### Casos de Prueba Ejecutados
- **CA_320_01**: Eliminacion instantanea
- **CA_320_02**: Recalcular total.
- **CA_320_03**: Al menos 1 producto debe quedar, para realizar el pedido
- **CA_320_04**: Eliminación en aprox <1s por producto.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_321
**Descripción funcional:** Yo como Cliente necesito crear un pedido para poder realizar mis compras en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_321`

### Casos de Prueba Ejecutados
- **CA_321_01**: Carrito de compras con: productos, cantidades, precio, subtotales, totales, fecha entrega.
- **CA_321_02**: Dirección válida registrada.
- **CA_321_03**: solo productos con Stock disponible.
- **CA_321_04**: debe contener almenos 1 producto 
- **CA_321_05**: Creación en  aprox<5s.
- **CA_321_06**: debe tener un boton para realizar el pedido

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_322
**Descripción funcional:** Yo como Cliente necesito ver un listado de todos mis pedidos para hacer seguimiento a mis compras anteriores.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_322`

### Casos de Prueba Ejecutados
- **CA_322_01**: Lista con historial de mis pedidos.
- **CA_322_02**: tabla con: cliente, productos, cantidades, precio, subtotales, totales, fecha entrega.
- **CA_322_03**: Solo pedidos propios.
- **CA_322_04**: Carga aprox <2s con pedidos
- **CA_322_05**: Orden por fecha creación descendente.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_323
**Descripción funcional:** Yo como Cliente necesito buscar mis pedidos para poder localizar y consultar mis pedidos anteriores de manera rápida.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_323`

### Casos de Prueba Ejecutados
- **CA_323_01**: Búsqueda por N° pedido.
- **CA_323_02**: Solo pedidos propios.
- **CA_323_03**: Resultados en <1s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_324
**Descripción funcional:** Yo como Cliente necesito acceder al detalle completo de un pedido para confirmar qué compré y a qué precio.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_324`

### Casos de Prueba Ejecutados
- **CA_324_01**: Detalle completo pedido: productos, cantidades, precios, estado actual.
- **CA_324_02**: Solo pedidos propios.
- **CA_324_03**: Página carga <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_325
**Descripción funcional:** Yo como cliente necesito descargar PDF  mi pedido

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_325`

### Casos de Prueba Ejecutados
- **CA_325_01**: Orden PDF estándar (sin datos internos).
- **CA_325_02**: Formato básico.
- **CA_325_03**: Generación  aprox <6s

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_326
**Descripción funcional:** Yo como Cliente necesito consultar el estado actual de mi pedido para saber cuándo puedo esperar recibir mi compra.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_326`

### Casos de Prueba Ejecutados
- **CA_326_01**: poder ver el estado de el pedido

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_327
**Descripción funcional:** Yo como Cliente necesito agregar productos del pedido para poder agregar productos deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_327`

### Casos de Prueba Ejecutados
- **CA_327_01**: Lista de productos.
- **CA_327_02**: Campos: cantidad, precio
- **CA_327_03**: Recalcular total.
- **CA_327_04**: solo productos con Stock disponible.
- **CA_327_05**: Agregado en aprox <2s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_328
**Descripción funcional:** Yo como Cliente necesito eliminar productos del pedido para poder eliminar productos no deseados 

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_328`

### Casos de Prueba Ejecutados
- **CA_328_01**: Eliminacion en aprox 2s.
- **CA_328_02**: Confirmación de eliminacion
- **CA_328_03**: Recalcular total.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_329
**Descripción funcional:** Yo como Productor necesito listar los pedidos en estado "en proceso" para conocer qué debo preparar o empacar.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_329`

### Casos de Prueba Ejecutados
- **CA_329_01**: Tabla con: id pedido, cliente, productos, total, fecha de pedido, fecha entrega, estado.
- **CA_329_02**: Datos completos.
- **CA_329_03**: Paginación 10 por defecto.
- **CA_329_04**: Carga aprox <4s con pedidos.
- **CA_329_05**: Orden por fecha entrega.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_330
**Descripción funcional:** Yo como Productor necesito ver el detalle de un pedido (productos, cantidades, especificaciones) para preparar los elementos correctos y cumplir con la orden.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_330`

### Casos de Prueba Ejecutados
- **CA_330_01**: Info completa, id pedido, cliente, productos, total, fecha de pedido, fecha de entrega, estado.
- **CA_330_02**: Todos los datos cargan.
- **CA_330_03**: Página carga aprox <3s.

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

## HU_331
**Descripción funcional:** Yo como Productor necesito actualizar el estado de un pedido (a "Procesando" cuando inicio su preparación y a "Procesado" cuando está listo) para comunicar su progreso en el sistema.

**Rama ejecutada:** Pendiente de ejecución en `feature/hu_331`

### Casos de Prueba Ejecutados
- **CA_331_01**: Solo algunos estados: Pendiente → En preparación → Listo.
- **CA_331_02**: Transiciones limitadas.
- **CA_331_03**: Cambio en <1s.
- **CA_331_04**: No puede marcar como "Entregado" (solo logística).

**Resultado:** PENDIENTE
**Errores encontrados:** N/A
**Evidencias:** N/A
**Correcciones aplicadas:** N/A
**Estado final:** En Cola de QA
**Recomendaciones técnicas:** N/A
---

