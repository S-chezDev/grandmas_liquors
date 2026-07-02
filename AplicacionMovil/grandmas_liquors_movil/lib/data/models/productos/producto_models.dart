class ProductoModel {
  final String id;
  final String nombre;
  final String? descripcion;
  final String categoriaId;
  final String tipo;
  final double precio;
  final int stock;
  final bool activo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  ProductoModel({
    required this.id,
    required this.nombre,
    this.descripcion,
    required this.categoriaId,
    required this.tipo,
    required this.precio,
    required this.stock,
    required this.activo,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre': nombre,
    'descripcion': descripcion,
    'categoriaId': categoriaId,
    'tipo': tipo,
    'precio': precio,
    'stock': stock,
    'activo': activo,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory ProductoModel.fromJson(Map<String, dynamic> json) => ProductoModel(
    id: json['id'] ?? '',
    nombre: json['nombre'] ?? '',
    descripcion: json['descripcion'],
    categoriaId: json['categoriaId'] ?? '',
    tipo: json['tipo'] ?? '',
    precio: (json['precio'] as num?)?.toDouble() ?? 0.0,
    stock: json['stock'] ?? 0,
    activo: json['activo'] ?? false,
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}

class CategoriaModel {
  final String id;
  final String nombre;
  final String? descripcion;
  final bool activo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  CategoriaModel({
    required this.id,
    required this.nombre,
    this.descripcion,
    required this.activo,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre': nombre,
    'descripcion': descripcion,
    'activo': activo,
    'createdAt': createdAt?.toIso8601String(),
    'updatedAt': updatedAt?.toIso8601String(),
  };

  factory CategoriaModel.fromJson(Map<String, dynamic> json) => CategoriaModel(
    id: json['id'] ?? '',
    nombre: json['nombre'] ?? '',
    descripcion: json['descripcion'],
    activo: json['activo'] ?? false,
    createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
  );
}
