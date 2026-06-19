import 'package:grandmas_liquors_movil/core/constants/app_constants.dart';
import 'package:grandmas_liquors_movil/data/datasources/remote/api_service.dart';
import 'package:grandmas_liquors_movil/data/models/catalog/catalog_models.dart';

class CatalogRepository {
  final ApiService _api;

  CatalogRepository(this._api);

  Future<({List<CatalogProduct> productos, List<String> categorias})>
  getPublicCatalog() async {
    final response = await _api.get(AppConstants.publicCatalogEndpoint);
    final data = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : response;

    final productosRaw = data['productos'] is List
        ? data['productos'] as List
        : <dynamic>[];
    final categoriasRaw = data['categorias'] is List
        ? data['categorias'] as List
        : <dynamic>[];

    final productos = productosRaw
        .whereType<Map<String, dynamic>>()
        .map(CatalogProduct.fromJson)
        .where((p) => p.disponible)
        .toList();

    final categorias = <String>['Todos'];
    for (final row in categoriasRaw) {
      if (row is Map<String, dynamic>) {
        final nombre = (row['nombre'] ?? '').toString().trim();
        if (nombre.isNotEmpty) categorias.add(nombre);
      }
    }

    return (productos: productos, categorias: categorias);
  }
}
