import 'package:dio/dio.dart';
import 'package:grandmas_liquors_movil/data/datasources/remote/api_service.dart';
import 'package:grandmas_liquors_movil/data/models/auth/auth_models.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';

class SalesManagementRepository {
  final ApiService _api;

  SalesManagementRepository(this._api);

  double _toDouble(dynamic value) {
    if (value is num) return value.toDouble();
    if (value == null) return 0;
    return double.tryParse(value.toString()) ?? 0;
  }

  int _toInt(dynamic value) {
    if (value is num) return value.toInt();
    if (value == null) return 0;
    return int.tryParse(value.toString()) ?? 0;
  }

  String _normalizeMetodoUi(String raw) {
    final v = raw.toLowerCase();
    return v.contains('transfer') ? 'Transferencia' : 'Efectivo';
  }

  String _metodoToApi(String raw) {
    return raw.toLowerCase().contains('transfer')
        ? 'Transferencia'
        : 'Efectivo';
  }

  String _estadoVentaToApi(String estado) {
    final e = estado.toLowerCase();
    if (e.contains('cancel')) return 'Cancelada';
    if (e.contains('complet')) return 'Completada';
    return 'Pendiente';
  }

  String _estadoAbonoToApi(String estado) {
    final e = estado.toLowerCase();
    if (e.contains('cancel')) return 'Cancelado';
    if (e.contains('verif')) return 'Verificado';
    if (e.contains('final')) return 'Finalizado';
    if (e.contains('aplic')) return 'Aplicado';
    return 'Registrado';
  }

  /// Mapea cualquier representacion del estado del abono al canonico
  /// que reconoce el backend.
  String normalizeAbonoEstado(String? estado) {
    final raw = (estado ?? '').trim();
    if (raw.isEmpty) return 'Registrado';
    final lower = raw.toLowerCase();
    if (lower.contains('cancel')) return 'Cancelado';
    if (lower.contains('finaliz')) return 'Finalizado';
    if (lower.contains('aplic')) return 'Aplicado';
    if (lower.contains('verif')) return 'Verificado';
    if (lower.contains('registr')) return 'Registrado';
    return raw;
  }

  /// Lista de estados destino validos para una transicion manual desde el
  /// estado actual, segun la logica del backend.
  /// `Cancelado` y `Finalizado` son terminales.
  List<String> allowedAbonoTransitions(String currentEstado) {
    switch (normalizeAbonoEstado(currentEstado)) {
      case 'Registrado':
        return const ['Verificado', 'Cancelado'];
      case 'Verificado':
        return const ['Cancelado'];
      case 'Aplicado':
        return const ['Cancelado'];
      default:
        return const <String>[];
    }
  }

  String _estadoPedidoToApi(String estado) {
    final e = estado.toLowerCase();
    if (e.contains('cancel')) return 'Cancelado';
    if (e.contains('proceso')) return 'En Proceso';
    if (e.contains('complet')) return 'Completado';
    return 'Pendiente';
  }

  String _estadoDomicilioToApi(String estado) {
    final e = estado.toLowerCase();
    if (e.contains('cancel')) return 'Cancelado';
    if (e.contains('ruta') || e.contains('camino')) return 'En Camino';
    if (e.contains('complet') || e.contains('entreg')) return 'Entregado';
    return 'Pendiente';
  }

  Future<List<SalesOption>> getClientesOptions() async {
    final response = await _api.get('/api/clientes');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows
        .where((r) {
          final estado = (r as Map<String, dynamic>)['estado']?.toString().toLowerCase() ?? '';
          return estado.isEmpty || estado == 'activo';
        })
        .map((r) {
          final row = r as Map<String, dynamic>;
          final id = _toInt(row['id']);
          final nombre = (row['nombre'] ?? '').toString().trim();
          final apellido = (row['apellido'] ?? '').toString().trim();
          final label = '$nombre $apellido'.trim();
          return SalesOption(id: id, label: label.isEmpty ? 'Cliente $id' : label);
        })
        .toList();
  }

  Future<ClienteDetail> getClienteById(int clienteId) async {
    final response = await _api.get('/api/clientes/$clienteId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    return ClienteDetail(
      id: _toInt(row['id']),
      nombre: (row['nombre'] ?? '').toString(),
      apellido: (row['apellido'] ?? '').toString(),
      direccion: (row['direccion'] ?? '').toString(),
      telefono: (row['telefono'] ?? '').toString(),
      estado: (row['estado'] ?? '').toString(),
    );
  }

  Future<List<ProductOption>> getProductosOptions() async {
    final response = await _api.get('/api/productos');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows
        .where((r) {
          final row = r as Map<String, dynamic>;
          final estado = (row['estado'] ?? '').toString().toLowerCase();
          final typo = (row['typo'] ?? row['tipo'] ?? '').toString().toLowerCase();
          return (estado.isEmpty || estado == 'activo') && !typo.contains('insumo');
        })
        .map((r) {
          final row = r as Map<String, dynamic>;
          return ProductOption(
            id: _toInt(row['id']),
            nombre: (row['nombre'] ?? 'Producto').toString(),
            precio: _toDouble(row['precio_venta'] ?? row['precioVenta'] ?? row['precio']),
            stock: _toInt(row['stock'] ?? row['stock_actual'] ?? 0),
          );
        })
        .toList();
  }

  Future<PedidoDetail> getPedidoDetail(int pedidoId) async {
    final response = await _api.get('/api/pedidos/$pedidoId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    return PedidoDetail(
      id: _toInt(row['id']),
      clienteId: _toInt(row['cliente_id']),
      total: _toDouble(row['total']),
      montoAbonado: _toDouble(row['monto_abonado'] ?? row['montoAbonado']),
      esquemaAbono: (row['esquema_abono'] ?? row['esquemaAbono'] ?? '100%').toString(),
      metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
      estado: (row['estado'] ?? '').toString(),
      fechaEntrega: (row['fecha_entrega'] ?? '').toString().split('T').first,
      fechaPedido: (row['fecha'] ?? '').toString().split('T').first,
      direccion: (row['direccion'] ?? row['detalles'] ?? '').toString(),
      telefono: (row['telefono'] ?? '').toString(),
    );
  }

  Future<List<SalesOption>> getPedidosOptions() async {
    final response = await _api.get('/api/pedidos');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      final id = _toInt(row['id']);
      return SalesOption(id: id, label: 'Pedido #$id');
    }).toList();
  }

  Future<List<SalesOption>> getRepartidoresOptions() async {
    final response = await _api.get('/api/usuarios');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows
        .where((r) {
          final row = r as Map<String, dynamic>;
          return (row['rol'] ?? '').toString().toLowerCase() == 'repartidor';
        })
        .map((r) {
          final row = r as Map<String, dynamic>;
          final id = _toInt(row['id']);
          final nombre = (row['nombre'] ?? '').toString().trim();
          final apellido = (row['apellido'] ?? '').toString().trim();
          return SalesOption(id: id, label: '$nombre $apellido'.trim());
        })
        .toList();
  }

  Future<List<VentaItem>> getVentas(UsuarioModel? user) async {
    final bool isCliente = (user?.rol ?? '').toLowerCase() == 'cliente';
    final endpoint = isCliente && user?.clienteId != null
        ? '/api/ventas/cliente/${user!.clienteId}'
        : '/api/ventas';
    final response = await _api.get(endpoint);
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      return VentaItem(
        id: _toInt(row['id']),
        clienteId: _toInt(row['cliente_id']),
        clienteNombre:
            ((row['cliente_nombre'] ?? '') as String).trim().isNotEmpty
            ? (row['cliente_nombre'] ?? '').toString()
            : 'Cliente ${_toInt(row['cliente_id'])}',
        total: _toDouble(row['total']),
        metodoPago: _normalizeMetodoUi(
          (row['metodopago'] ?? row['metodo_pago'] ?? '').toString(),
        ),
        tipo: (row['tipo'] ?? '').toString(),
        estado: (row['estado'] ?? '').toString(),
        fecha: (row['fecha'] ?? '').toString().split('T').first,
      );
    }).toList();
  }

  Future<void> createVenta({
    required String tipo,
    int? clienteId,
    int? pedidoId,
    required double total,
    required String metodoPago,
    required String fecha,
    required String estado,
    List<ProductLineInput> productos = const [],
  }) async {
    final payload = <String, dynamic>{
      'tipo': tipo.toLowerCase().contains('pedido') ? 'Por Pedido' : 'Directa',
      'fecha': fecha,
      'metodopago': _metodoToApi(metodoPago),
      'total': total,
      'estado': _estadoVentaToApi(estado),
    };
    if (clienteId != null && clienteId > 0) payload['cliente_id'] = clienteId;
    if (pedidoId != null && pedidoId > 0) payload['pedido_id'] = pedidoId;
    if (productos.isNotEmpty) {
      payload['items'] = productos.map((p) => p.toApiJson()).toList();
    }
    await _api.post('/api/ventas', data: payload);
  }

  Future<VentaItem> getVentaById(int ventaId) async {
    final response = await _api.get('/api/ventas/$ventaId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    return VentaItem(
      id: _toInt(row['id']),
      clienteId: _toInt(row['cliente_id']),
      clienteNombre: (row['cliente_nombre'] ?? '').toString().trim(),
      total: _toDouble(row['total']),
      metodoPago: _normalizeMetodoUi(
        (row['metodopago'] ?? row['metodo_pago'] ?? '').toString(),
      ),
      tipo: (row['tipo'] ?? '').toString(),
      estado: (row['estado'] ?? '').toString(),
      fecha: (row['fecha'] ?? '').toString().split('T').first,
    );
  }

  Future<void> updateVenta({
    required int ventaId,
    required int clienteId,
    required double total,
    required String metodoPago,
    String tipo = 'Directa',
    required String estado,
  }) async {
    await _api.put(
      '/api/ventas/$ventaId',
      data: {
        'tipo': tipo,
        'cliente_id': clienteId,
        'fecha': DateTime.now().toIso8601String().split('T').first,
        'metodopago': _metodoToApi(metodoPago),
        'total': total,
        'estado': estado,
      },
    );
  }

  Future<void> deleteVenta(int ventaId) async {
    await _api.delete('/api/ventas/$ventaId');
  }

  Future<void> addVentaProducto({
    required int ventaId,
    required int productoId,
    required int cantidad,
    required double precioUnitario,
  }) async {
    await _api.post(
      '/api/ventas/producto',
      data: {
        'ventaId': ventaId,
        'productoId': productoId,
        'cantidad': cantidad,
        'precioUnitario': precioUnitario,
      },
    );
  }

  Future<void> changeVentaEstado(int ventaId, String estado) async {
    await _api.patch(
      '/api/ventas/$ventaId/estado',
      data: {'estado': _estadoVentaToApi(estado)},
    );
  }

  Future<List<AbonoItem>> getAbonos() async {
    final response = await _api.get('/api/abonos');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      final clienteId = _toInt(row['cliente_id']);
      final clienteNombre = (row['cliente_nombre'] ?? '').toString().trim();
      return AbonoItem(
        id: _toInt(row['id']),
        pedidoId: _toInt(row['pedido_id']),
        clienteId: clienteId,
        clienteNombre: clienteNombre.isEmpty
            ? (clienteId > 0 ? 'Cliente $clienteId' : '-')
            : clienteNombre,
        monto: _toDouble(row['monto']),
        estado: (row['estado'] ?? '').toString(),
        metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
        fecha: (row['fecha'] ?? '').toString().split('T').first,
        totalPedido: _toDouble(row['total_pedido']),
      );
    }).toList();
  }

  Future<void> createAbono({
    required int pedidoId,
    required double monto,
    required String metodoPago,
    required String fecha,
    int? porcentaje,
  }) async {
    await _api.post(
      '/api/abonos',
      data: {
        'pedido_id': pedidoId,
        'monto': monto,
        'fecha': fecha,
        'metodo_pago': _metodoToApi(metodoPago),
        'estado': 'Registrado',
        if (porcentaje != null) 'porcentaje_abonado': porcentaje,
      },
    );
  }

  Future<AbonoItem> getAbonoById(int abonoId) async {
    final response = await _api.get('/api/abonos/$abonoId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    final clienteId = _toInt(row['cliente_id']);
    final clienteNombre = (row['cliente_nombre'] ?? '').toString().trim();
    return AbonoItem(
      id: _toInt(row['id']),
      pedidoId: _toInt(row['pedido_id']),
      clienteId: clienteId,
      clienteNombre: clienteNombre.isEmpty
          ? (clienteId > 0 ? 'Cliente $clienteId' : '-')
          : clienteNombre,
      monto: _toDouble(row['monto']),
      estado: (row['estado'] ?? '').toString(),
      metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
      fecha: (row['fecha'] ?? '').toString().split('T').first,
      totalPedido: _toDouble(row['total_pedido']),
    );
  }

  Future<void> updateAbono({
    required int abonoId,
    required int pedidoId,
    required double monto,
    required String metodoPago,
    required String estado,
  }) async {
    await _api.put(
      '/api/abonos/$abonoId',
      data: {
        'pedido_id': pedidoId,
        'monto': monto,
        'fecha': DateTime.now().toIso8601String().split('T').first,
        'metodo_pago': _metodoToApi(metodoPago),
        'estado': estado,
      },
    );
  }

  Future<void> deleteAbono(int abonoId) async {
    await _api.delete('/api/abonos/$abonoId');
  }

  Future<List<AbonoItem>> getAbonosByPedido(int pedidoId) async {
    final response = await _api.get('/api/abonos/pedido/$pedidoId');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      final clienteId = _toInt(row['cliente_id']);
      final clienteNombre = (row['cliente_nombre'] ?? '').toString().trim();
      return AbonoItem(
        id: _toInt(row['id']),
        pedidoId: _toInt(row['pedido_id']),
        clienteId: clienteId,
        clienteNombre: clienteNombre.isEmpty
            ? (clienteId > 0 ? 'Cliente $clienteId' : '-')
            : clienteNombre,
        monto: _toDouble(row['monto']),
        estado: (row['estado'] ?? '').toString(),
        metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
        fecha: (row['fecha'] ?? '').toString().split('T').first,
        totalPedido: _toDouble(row['total_pedido']),
      );
    }).toList();
  }

  Future<void> changeAbonoEstado(int abonoId, String estado) async {
    await _api.patch(
      '/api/abonos/$abonoId/estado',
      data: {'estado': _estadoAbonoToApi(estado)},
    );
  }

  Future<List<PedidoItem>> getPedidos() async {
    final response = await _api.get('/api/pedidos');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      return PedidoItem(
        id: _toInt(row['id']),
        clienteId: _toInt(row['cliente_id']),
        total: _toDouble(row['total']),
        estado: (row['estado'] ?? '').toString(),
        metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
        fechaEntrega: (row['fecha_entrega'] ?? '').toString().split('T').first,
      );
    }).toList();
  }

  Future<void> createPedido({
    required int clienteId,
    required String metodoPago,
    required String esquemaAbono,
    required String fechaEntrega,
    required List<ProductLineInput> productos,
    String? direccion,
    String? telefono,
    String? detalles,
  }) async {
    final total = productos.fold<double>(0, (s, p) => s + p.subtotal);
    final payload = <String, dynamic>{
      'cliente_id': clienteId,
      'fecha': DateTime.now().toIso8601String().split('T').first,
      'fecha_entrega': fechaEntrega,
      'total': total,
      'estado': 'Pendiente',
      'metodo_pago': _metodoToApi(metodoPago),
      'esquema_abono': esquemaAbono,
      'productos': productos.map((p) => p.toApiJson()).toList(),
    };
    final dir = (direccion ?? '').trim();
    final tel = (telefono ?? '').replaceAll(RegExp(r'\D'), '');
    final det = (detalles ?? '').trim();
    if (dir.length >= 5) payload['direccion'] = dir;
    if (tel.isNotEmpty) payload['telefono'] = tel;
    if (det.length >= 5) payload['detalles'] = det;
    await _api.post('/api/pedidos', data: payload);
  }

  Future<String> uploadComprobante(String filePath) async {
    final formData = FormData.fromMap({
      'comprobante': await MultipartFile.fromFile(filePath),
    });
    return _uploadComprobanteFormData(formData);
  }

  Future<String> uploadComprobanteBytes(
    List<int> bytes, {
    required String filename,
  }) async {
    final formData = FormData.fromMap({
      'comprobante': MultipartFile.fromBytes(bytes, filename: filename),
    });
    return _uploadComprobanteFormData(formData);
  }

  Future<String> _uploadComprobanteFormData(FormData formData) async {
    final response = await _api.postMultipart(
      '/api/pedidos/comprobante',
      data: formData,
    );
    final data = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : response;
    final url = (data['comprobante_url'] ?? '').toString().trim();
    if (url.isEmpty) throw Exception('No se recibió la URL del comprobante');
    return url;
  }

  Future<void> createPedidoCliente({
    required String esquemaAbono,
    required String fechaEntrega,
    required List<ProductLineInput> productos,
    required String comprobanteUrl,
    String? direccion,
    String? telefono,
    String? detalles,
  }) async {
    final total = productos.fold<double>(0, (s, p) => s + p.subtotal);
    final payload = <String, dynamic>{
      'fecha_entrega': fechaEntrega,
      'total': total,
      'estado': 'Pendiente',
      'metodo_pago': 'Transferencia',
      'esquema_abono': esquemaAbono,
      'comprobante_url': comprobanteUrl,
      'productos': productos.map((p) => p.toApiJson()).toList(),
    };
    final dir = (direccion ?? '').trim();
    final tel = (telefono ?? '').replaceAll(RegExp(r'\D'), '');
    final det = (detalles ?? '').trim();
    if (dir.length >= 5) payload['direccion'] = dir;
    if (tel.isNotEmpty) payload['telefono'] = tel;
    if (det.length >= 5) payload['detalles'] = det;
    await _api.post('/api/pedidos', data: payload);
  }

  Future<PedidoItem> getPedidoById(int pedidoId) async {
    final response = await _api.get('/api/pedidos/$pedidoId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    return PedidoItem(
      id: _toInt(row['id']),
      clienteId: _toInt(row['cliente_id']),
      total: _toDouble(row['total']),
      estado: (row['estado'] ?? '').toString(),
      metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
      fechaEntrega: (row['fecha_entrega'] ?? '').toString().split('T').first,
    );
  }

  Future<void> updatePedido({
    required int pedidoId,
    required int clienteId,
    required double total,
    required String metodoPago,
    required String estado,
    String? fechaEntrega,
  }) async {
    await _api.put(
      '/api/pedidos/$pedidoId',
      data: {
        'cliente_id': clienteId,
        'total': total,
        'metodo_pago': _metodoToApi(metodoPago),
        'estado': estado,
        if (fechaEntrega != null) 'fecha_entrega': fechaEntrega,
      },
    );
  }

  Future<void> deletePedido(int pedidoId) async {
    await _api.delete('/api/pedidos/$pedidoId');
  }

  Future<List<PedidoItem>> getPedidosByCliente(int clienteId) async {
    final response = await _api.get('/api/pedidos/cliente/$clienteId');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      return PedidoItem(
        id: _toInt(row['id']),
        clienteId: _toInt(row['cliente_id']),
        total: _toDouble(row['total']),
        estado: (row['estado'] ?? '').toString(),
        metodoPago: _normalizeMetodoUi((row['metodo_pago'] ?? '').toString()),
        fechaEntrega: (row['fecha_entrega'] ?? '').toString().split('T').first,
      );
    }).toList();
  }

  Future<void> addPedidoProducto({
    required int pedidoId,
    required int productoId,
    required int cantidad,
    required double precioUnitario,
  }) async {
    await _api.post(
      '/api/pedidos/producto',
      data: {
        'pedidoId': pedidoId,
        'productoId': productoId,
        'cantidad': cantidad,
        'precioUnitario': precioUnitario,
      },
    );
  }

  Future<void> changePedidoEstado(
    int pedidoId,
    String estado, {
    String? motivo,
  }) async {
    await _api.patch(
      '/api/pedidos/$pedidoId/estado',
      data: {
        'estado': _estadoPedidoToApi(estado),
        if (motivo != null && motivo.trim().isNotEmpty) 'motivo': motivo.trim(),
      },
    );
  }

  Future<List<DomicilioItem>> getDomicilios(UsuarioModel? user) async {
    final bool isCliente = (user?.rol ?? '').toLowerCase() == 'cliente';
    final endpoint = isCliente && user?.clienteId != null
        ? '/api/domicilios/cliente/${user!.clienteId}'
        : '/api/domicilios';
    final response = await _api.get(endpoint);
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      final repNombre =
          ((row['repartidor_nombre'] ?? row['repartidor'] ?? '') as String)
              .trim();
      return DomicilioItem(
        id: _toInt(row['id']),
        pedidoId: _toInt(row['pedido_id']),
        clienteId: _toInt(row['cliente_id']),
        repartidorId: _toInt(row['repartidor_id']),
        repartidorNombre: repNombre.isEmpty
            ? 'Repartidor ${_toInt(row['repartidor_id'])}'
            : repNombre,
        direccion: (row['direccion'] ?? '').toString(),
        total: _toDouble(row['total_pedido'] ?? row['total']),
        estado: (row['estado'] ?? '').toString(),
        fecha: (row['fecha'] ?? '').toString().split('T').first,
      );
    }).toList();
  }

  Future<void> createDomicilio({
    required int pedidoId,
    required int repartidorId,
    String? repartidorNombre,
    String? direccionFallback,
    String? fecha,
  }) async {
    final payload = <String, dynamic>{
      'pedido_id': pedidoId,
      'repartidor_id': repartidorId,
      'estado': 'Pendiente',
    };
    final nombre = (repartidorNombre ?? '').trim();
    if (nombre.isNotEmpty) payload['repartidor'] = nombre.length > 100 ? nombre.substring(0, 100) : nombre;
    final dir = (direccionFallback ?? '').trim();
    if (dir.isNotEmpty) payload['direccion'] = dir.length > 2000 ? dir.substring(0, 2000) : dir;
    if (fecha != null && fecha.isNotEmpty) payload['fecha'] = fecha.split('T').first;
    await _api.post('/api/domicilios', data: payload);
  }

  Future<void> changeDomicilioEstado(
    int domicilioId,
    String estado, {
    String? motivoCancelacion,
  }) async {
    await _api.patch(
      '/api/domicilios/$domicilioId/estado',
      data: {
        'estado': _estadoDomicilioToApi(estado),
        if (motivoCancelacion != null && motivoCancelacion.trim().isNotEmpty)
          'motivo_cancelacion': motivoCancelacion.trim(),
      },
    );
  }

  Future<DomicilioItem> getDomicilioById(int domicilioId) async {
    final response = await _api.get('/api/domicilios/$domicilioId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    final repNombre =
        ((row['repartidor_nombre'] ?? row['repartidor'] ?? '') as String)
            .trim();
    return DomicilioItem(
      id: _toInt(row['id']),
      pedidoId: _toInt(row['pedido_id']),
      clienteId: _toInt(row['cliente_id']),
      repartidorId: _toInt(row['repartidor_id']),
      repartidorNombre: repNombre.isEmpty
          ? 'Repartidor ${_toInt(row['repartidor_id'])}'
          : repNombre,
      direccion: (row['direccion'] ?? '').toString(),
      total: _toDouble(row['total_pedido'] ?? row['total']),
      estado: (row['estado'] ?? '').toString(),
      fecha: (row['fecha'] ?? '').toString().split('T').first,
    );
  }

  Future<void> updateDomicilio({
    required int domicilioId,
    required int pedidoId,
    required int repartidorId,
    required String estado,
    String? direccion,
  }) async {
    await _api.put(
      '/api/domicilios/$domicilioId',
      data: {
        'pedido_id': pedidoId,
        'repartidor_id': repartidorId,
        'estado': estado,
        if (direccion != null) 'direccion': direccion,
      },
    );
  }

  Future<void> deleteDomicilio(int domicilioId) async {
    await _api.delete('/api/domicilios/$domicilioId');
  }

  Future<List<DomicilioItem>> getDomiciliosByCliente(int clienteId) async {
    final response = await _api.get('/api/domicilios/cliente/$clienteId');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows.map((r) {
      final row = r as Map<String, dynamic>;
      final repNombre =
          ((row['repartidor_nombre'] ?? row['repartidor'] ?? '') as String)
              .trim();
      return DomicilioItem(
        id: _toInt(row['id']),
        pedidoId: _toInt(row['pedido_id']),
        clienteId: _toInt(row['cliente_id']),
        repartidorId: _toInt(row['repartidor_id']),
        repartidorNombre: repNombre.isEmpty
            ? 'Repartidor ${_toInt(row['repartidor_id'])}'
            : repNombre,
        direccion: (row['direccion'] ?? '').toString(),
        total: _toDouble(row['total_pedido'] ?? row['total']),
        estado: (row['estado'] ?? '').toString(),
        fecha: (row['fecha'] ?? '').toString().split('T').first,
      );
    }).toList();
  }

  Future<DomicilioItem?> getDomicilioByPedido(int pedidoId) async {
    final response = await _api.get('/api/domicilios/pedido/$pedidoId');
    final row = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};
    if (row.isEmpty) return null;
    final repNombre =
        ((row['repartidor_nombre'] ?? row['repartidor'] ?? '') as String)
            .trim();
    return DomicilioItem(
      id: _toInt(row['id']),
      pedidoId: _toInt(row['pedido_id']),
      clienteId: _toInt(row['cliente_id']),
      repartidorId: _toInt(row['repartidor_id']),
      repartidorNombre: repNombre.isEmpty
          ? 'Repartidor ${_toInt(row['repartidor_id'])}'
          : repNombre,
      direccion: (row['direccion'] ?? '').toString(),
      total: _toDouble(row['total_pedido'] ?? row['total']),
      estado: (row['estado'] ?? '').toString(),
      fecha: (row['fecha'] ?? '').toString().split('T').first,
    );
  }
}
