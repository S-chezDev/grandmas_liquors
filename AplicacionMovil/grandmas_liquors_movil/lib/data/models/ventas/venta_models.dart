class ClienteModel {
  final String id;
  final String nombre;
  final String? apellido;
  final String? email;
  final String? telefono;
  final String? direccion;
  final double saldoAdeudado;
  final bool activo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  ClienteModel({
    required this.id,
    required this.nombre,
    this.apellido,
    this.email,
    this.telefono,
    this.direccion,
    required this.saldoAdeudado,
    required this.activo,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre': nombre,
    'apellido': apellido,
    'email': email,
    'telefono': telefono,
    'direccion': direccion,
    'saldoAdeudado': saldoAdeudado,
    'activo': activo,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory ClienteModel.fromJson(Map<String, dynamic> json) => ClienteModel(
    id: json['id'] ?? '',
    nombre: json['nombre'] ?? '',
    apellido: json['apellido'],
    email: json['email'],
    telefono: json['telefono'],
    direccion: json['direccion'],
    saldoAdeudado: (json['saldoAdeudado'] as num?)?.toDouble() ?? 0.0,
    activo: json['activo'] ?? false,
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class VentaModel {
  final String id;
  final String clienteId;
  final String numeroVenta;
  final double total;
  final double pagado;
  final double saldo;
  final String estado;
  final DateTime fecha;
  final String? notas;
  final List<DetalleVentaModel> detalles;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  VentaModel({
    required this.id,
    required this.clienteId,
    required this.numeroVenta,
    required this.total,
    required this.pagado,
    required this.saldo,
    required this.estado,
    required this.fecha,
    this.notas,
    required this.detalles,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'clienteId': clienteId,
    'numeroVenta': numeroVenta,
    'total': total,
    'pagado': pagado,
    'saldo': saldo,
    'estado': estado,
    'fecha': fecha.toIso8601String(),
    'notas': notas,
    'detalles': detalles.map((d) => d.toJson()).toList(),
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory VentaModel.fromJson(Map<String, dynamic> json) => VentaModel(
    id: json['id'] ?? '',
    clienteId: json['clienteId'] ?? '',
    numeroVenta: json['numeroVenta'] ?? '',
    total: (json['total'] as num?)?.toDouble() ?? 0.0,
    pagado: (json['pagado'] as num?)?.toDouble() ?? 0.0,
    saldo: (json['saldo'] as num?)?.toDouble() ?? 0.0,
    estado: json['estado'] ?? '',
    fecha: json['fecha'] != null ? DateTime.parse(json['fecha']) : DateTime.now(),
    notas: json['notas'],
    detalles: (json['detalles'] as List?)?.map((d) => DetalleVentaModel.fromJson(d as Map<String, dynamic>)).toList() ?? [],
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class DetalleVentaModel {
  final String id;
  final String productoId;
  final int cantidad;
  final double precioUnitario;
  final double subtotal;

  DetalleVentaModel({
    required this.id,
    required this.productoId,
    required this.cantidad,
    required this.precioUnitario,
    required this.subtotal,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'productoId': productoId,
    'cantidad': cantidad,
    'precioUnitario': precioUnitario,
    'subtotal': subtotal,
  };

  factory DetalleVentaModel.fromJson(Map<String, dynamic> json) => DetalleVentaModel(
    id: json['id'] ?? '',
    productoId: json['productoId'] ?? '',
    cantidad: json['cantidad'] ?? 0,
    precioUnitario: (json['precioUnitario'] as num?)?.toDouble() ?? 0.0,
    subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
  );
}

class AbonoModel {
  final String id;
  final String ventaId;
  final double monto;
  final String tipo; // 50% o 100%
  final String metodo; // efectivo, tarjeta, transferencia
  final DateTime fecha;
  final String? notas;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  AbonoModel({
    required this.id,
    required this.ventaId,
    required this.monto,
    required this.tipo,
    required this.metodo,
    required this.fecha,
    this.notas,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'ventaId': ventaId,
    'monto': monto,
    'tipo': tipo,
    'metodo': metodo,
    'fecha': fecha.toIso8601String(),
    'notas': notas,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory AbonoModel.fromJson(Map<String, dynamic> json) => AbonoModel(
    id: json['id'] ?? '',
    ventaId: json['ventaId'] ?? '',
    monto: (json['monto'] as num?)?.toDouble() ?? 0.0,
    tipo: json['tipo'] ?? '',
    metodo: json['metodo'] ?? '',
    fecha: json['fecha'] != null ? DateTime.parse(json['fecha']) : DateTime.now(),
    notas: json['notas'],
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class PedidoModel {
  final String id;
  final String ventaId;
  final String numeroPedido;
  final String estado; // pendiente, en_preparacion, listo, entregado
  final String? direccionEntrega;
  final DateTime fechaEntrega;
  final String? notas;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  PedidoModel({
    required this.id,
    required this.ventaId,
    required this.numeroPedido,
    required this.estado,
    this.direccionEntrega,
    required this.fechaEntrega,
    this.notas,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'ventaId': ventaId,
    'numeroPedido': numeroPedido,
    'estado': estado,
    'direccionEntrega': direccionEntrega,
    'fechaEntrega': fechaEntrega.toIso8601String(),
    'notas': notas,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory PedidoModel.fromJson(Map<String, dynamic> json) => PedidoModel(
    id: json['id'] ?? '',
    ventaId: json['ventaId'] ?? '',
    numeroPedido: json['numeroPedido'] ?? '',
    estado: json['estado'] ?? '',
    direccionEntrega: json['direccionEntrega'],
    fechaEntrega: json['fechaEntrega'] != null ? DateTime.parse(json['fechaEntrega']) : DateTime.now(),
    notas: json['notas'],
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}
