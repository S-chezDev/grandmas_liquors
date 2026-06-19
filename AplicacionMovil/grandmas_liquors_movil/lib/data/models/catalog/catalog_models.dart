import 'package:grandmas_liquors_movil/core/constants/app_constants.dart';

class CatalogProduct {
  final int id;
  final String nombre;
  final String categoria;
  final String tipo;
  final double precio;
  final int stock;
  final String? imagenUrl;
  final String descripcion;

  CatalogProduct({
    required this.id,
    required this.nombre,
    required this.categoria,
    required this.tipo,
    required this.precio,
    required this.stock,
    this.imagenUrl,
    this.descripcion = '',
  });

  bool get isPreparacion => tipo.toLowerCase().contains('prepar');
  bool get disponible => isPreparacion || stock > 0;

  String get imageFullUrl {
    final raw = (imagenUrl ?? '').trim();
    if (raw.isEmpty) return '';
    if (raw.startsWith('http')) return raw;
    return '${AppConstants.apiBaseUrl}$raw';
  }

  factory CatalogProduct.fromJson(Map<String, dynamic> json) {
    final tipoRaw =
        (json['tipo_producto'] ?? json['tipo'] ?? '').toString().toLowerCase();
    return CatalogProduct(
      id: (json['id'] as num?)?.toInt() ?? 0,
      nombre: (json['nombre'] ?? '').toString(),
      categoria: (json['categoria'] ?? 'Sin categoría').toString(),
      tipo: tipoRaw.contains('prepar') ? 'de preparacion' : 'terminado',
      precio: (json['precio'] as num?)?.toDouble() ?? 0,
      stock: (json['stock'] as num?)?.toInt() ?? 0,
      imagenUrl: json['imagen_url']?.toString(),
      descripcion: (json['descripcion'] ?? '').toString(),
    );
  }
}

class CartLine {
  final CatalogProduct product;
  int cantidad;

  CartLine({required this.product, this.cantidad = 1});

  double get subtotal => product.precio * cantidad;
}
