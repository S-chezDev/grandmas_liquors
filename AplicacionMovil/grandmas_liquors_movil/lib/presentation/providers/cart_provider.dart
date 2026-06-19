import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:grandmas_liquors_movil/data/models/catalog/catalog_models.dart';
import 'package:grandmas_liquors_movil/data/repositories/catalog_repository.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';

final catalogRepositoryProvider = Provider<CatalogRepository>((ref) {
  return CatalogRepository(ref.watch(apiServiceProvider));
});

class CartAddResult {
  final bool success;
  final String? message;

  const CartAddResult._(this.success, this.message);

  factory CartAddResult.ok() => const CartAddResult._(true, null);

  factory CartAddResult.fail(String message) =>
      CartAddResult._(false, message);
}

String? cartLineStockError(CartLine line) {
  if (line.product.isPreparacion) return null;
  if (line.product.stock <= 0) {
    return 'Este producto no está disponible en este momento.';
  }
  if (line.cantidad > line.product.stock) {
    return 'La cantidad solicitada supera el stock disponible.';
  }
  return null;
}

class CartNotifier extends StateNotifier<List<CartLine>> {
  CartNotifier() : super(const []);

  CartAddResult addProduct(CatalogProduct product) {
    if (!product.disponible) {
      return CartAddResult.fail('Este producto no está disponible.');
    }

    final idx = state.indexWhere((l) => l.product.id == product.id);
    if (idx >= 0) {
      final current = state[idx].cantidad;
      if (!product.isPreparacion && current + 1 > product.stock) {
        return CartAddResult.fail(
          'Solo hay ${product.stock} unidad(es) disponibles.',
        );
      }
      state = [
        for (var i = 0; i < state.length; i++)
          if (i == idx)
            CartLine(product: product, cantidad: current + 1)
          else
            state[i],
      ];
    } else {
      state = [...state, CartLine(product: product)];
    }
    return CartAddResult.ok();
  }

  CartAddResult updateQuantity(int productId, int cantidad) {
    if (cantidad <= 0) {
      state = state.where((l) => l.product.id != productId).toList();
      return CartAddResult.ok();
    }

    final line = state.firstWhere((l) => l.product.id == productId);
    if (!line.product.isPreparacion && cantidad > line.product.stock) {
      return CartAddResult.fail(
        'Solo hay ${line.product.stock} unidad(es) disponibles.',
      );
    }

    state = [
      for (final item in state)
        if (item.product.id == productId)
          CartLine(product: item.product, cantidad: cantidad)
        else
          item,
    ];
    return CartAddResult.ok();
  }

  void clear() => state = const [];

  String? firstStockError() {
    for (final line in state) {
      final err = cartLineStockError(line);
      if (err != null) return err;
    }
    return null;
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, List<CartLine>>(
  (ref) => CartNotifier(),
);

final cartItemCountProvider = Provider<int>((ref) {
  return ref.watch(cartProvider).fold(0, (s, l) => s + l.cantidad);
});

final cartTotalProvider = Provider<double>((ref) {
  return ref.watch(cartProvider).fold(0, (s, l) => s + l.subtotal);
});

final cartHasStockErrorsProvider = Provider<bool>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.any((line) => cartLineStockError(line) != null);
});
