class OrdenProduccionModel {
  final String id;
  final String productoId;
  final int cantidad;
  final String productor;
  final DateTime fechaInicio;
  final DateTime? fechaFin;
  final String estado; // pendiente, en_proceso, completado
  final String? notas;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  OrdenProduccionModel({
    required this.id,
    required this.productoId,
    required this.cantidad,
    required this.productor,
    required this.fechaInicio,
    this.fechaFin,
    required this.estado,
    this.notas,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'productoId': productoId,
    'cantidad': cantidad,
    'productor': productor,
    'fechaInicio': fechaInicio.toIso8601String(),
    'fechaFin': fechaFin?.toIso8601String(),
    'estado': estado,
    'notas': notas,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory OrdenProduccionModel.fromJson(Map<String, dynamic> json) => OrdenProduccionModel(
    id: json['id'] ?? '',
    productoId: json['productoId'] ?? '',
    cantidad: json['cantidad'] ?? 0,
    productor: json['productor'] ?? '',
    fechaInicio: json['fechaInicio'] != null ? DateTime.parse(json['fechaInicio']) : DateTime.now(),
    fechaFin: json['fechaFin'] != null ? DateTime.parse(json['fechaFin']) : null,
    estado: json['estado'] ?? '',
    notas: json['notas'],
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class EntregaInsumoModel {
  final String id;
  final String ordenProduccionId;
  final String insumoId;
  final double cantidad;
  final DateTime fechaEntrega;
  final String responsable;
  final String? notas;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  EntregaInsumoModel({
    required this.id,
    required this.ordenProduccionId,
    required this.insumoId,
    required this.cantidad,
    required this.fechaEntrega,
    required this.responsable,
    this.notas,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'ordenProduccionId': ordenProduccionId,
    'insumoId': insumoId,
    'cantidad': cantidad,
    'fechaEntrega': fechaEntrega.toIso8601String(),
    'responsable': responsable,
    'notas': notas,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory EntregaInsumoModel.fromJson(Map<String, dynamic> json) => EntregaInsumoModel(
    id: json['id'] ?? '',
    ordenProduccionId: json['ordenProduccionId'] ?? '',
    insumoId: json['insumoId'] ?? '',
    cantidad: (json['cantidad'] as num?)?.toDouble() ?? 0.0,
    fechaEntrega: json['fechaEntrega'] != null ? DateTime.parse(json['fechaEntrega']) : DateTime.now(),
    responsable: json['responsable'] ?? '',
    notas: json['notas'],
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}
