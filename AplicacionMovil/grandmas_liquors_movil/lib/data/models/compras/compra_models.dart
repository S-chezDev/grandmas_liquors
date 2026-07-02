class ProveedorModel {
  final String id;
  final String nombre;
  final String? contacto;
  final String? email;
  final String? telefono;
  final String? direccion;
  final bool activo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  ProveedorModel({
    required this.id,
    required this.nombre,
    this.contacto,
    this.email,
    this.telefono,
    this.direccion,
    required this.activo,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre': nombre,
    'contacto': contacto,
    'email': email,
    'telefono': telefono,
    'direccion': direccion,
    'activo': activo,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory ProveedorModel.fromJson(Map<String, dynamic> json) => ProveedorModel(
    id: json['id'] ?? '',
    nombre: json['nombre'] ?? '',
    contacto: json['contacto'],
    email: json['email'],
    telefono: json['telefono'],
    direccion: json['direccion'],
    activo: json['activo'] ?? false,
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class CompraModel {
  final String id;
  final String proveedorId;
  final String? numeroCompra;
  final double total;
  final String estado;
  final DateTime fechaCompra;
  final DateTime? fechaEntrega;
  final String? notas;
  final List<DetalleCompraModel> detalles;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  CompraModel({
    required this.id,
    required this.proveedorId,
    this.numeroCompra,
    required this.total,
    required this.estado,
    required this.fechaCompra,
    this.fechaEntrega,
    this.notas,
    required this.detalles,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'proveedorId': proveedorId,
    'numeroCompra': numeroCompra,
    'total': total,
    'estado': estado,
    'fechaCompra': fechaCompra.toIso8601String(),
    'fechaEntrega': fechaEntrega?.toIso8601String(),
    'notas': notas,
    'detalles': detalles.map((d) => d.toJson()).toList(),
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory CompraModel.fromJson(Map<String, dynamic> json) => CompraModel(
    id: json['id'] ?? '',
    proveedorId: json['proveedorId'] ?? '',
    numeroCompra: json['numeroCompra'],
    total: (json['total'] as num?)?.toDouble() ?? 0.0,
    estado: json['estado'] ?? '',
    fechaCompra: json['fechaCompra'] != null ? DateTime.parse(json['fechaCompra']) : DateTime.now(),
    fechaEntrega: json['fechaEntrega'] != null ? DateTime.parse(json['fechaEntrega']) : null,
    notas: json['notas'],
    detalles: (json['detalles'] as List?)?.map((d) => DetalleCompraModel.fromJson(d as Map<String, dynamic>)).toList() ?? [],
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class DetalleCompraModel {
  final String id;
  final String productoId;
  final int cantidad;
  final double precioUnitario;
  final double subtotal;

  DetalleCompraModel({
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

  factory DetalleCompraModel.fromJson(Map<String, dynamic> json) => DetalleCompraModel(
    id: json['id'] ?? '',
    productoId: json['productoId'] ?? '',
    cantidad: json['cantidad'] ?? 0,
    precioUnitario: (json['precioUnitario'] as num?)?.toDouble() ?? 0.0,
    subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
  );
}

class InsumoModel {
  final String id;
  final String nombre;
  final String? descripcion;
  final String unidadMedida;
  final double cantidad;
  final bool activo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  InsumoModel({
    required this.id,
    required this.nombre,
    this.descripcion,
    required this.unidadMedida,
    required this.cantidad,
    required this.activo,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre': nombre,
    'descripcion': descripcion,
    'unidadMedida': unidadMedida,
    'cantidad': cantidad,
    'activo': activo,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory InsumoModel.fromJson(Map<String, dynamic> json) => InsumoModel(
    id: json['id'] ?? '',
    nombre: json['nombre'] ?? '',
    descripcion: json['descripcion'],
    unidadMedida: json['unidadMedida'] ?? '',
    cantidad: (json['cantidad'] as num?)?.toDouble() ?? 0.0,
    activo: json['activo'] ?? false,
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}
