import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/core/constants/landing_constants.dart';
import 'package:grandmas_liquors_movil/core/utils/role_utils.dart';
import 'package:grandmas_liquors_movil/data/models/catalog/catalog_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/cart_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_drawer.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_logo.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/client/client_checkout_sheet.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/client/landing_carousel.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/client/landing_contact_section.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/client/landing_product_card.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';

bool _ageVerifiedSession = false;

class ClientCatalogPage extends ConsumerStatefulWidget {
  const ClientCatalogPage({super.key});

  @override
  ConsumerState<ClientCatalogPage> createState() => _ClientCatalogPageState();
}

class _ClientCatalogPageState extends ConsumerState<ClientCatalogPage> {
  bool _loading = true;
  String? _error;
  List<CatalogProduct> _productos = [];
  List<String> _categorias = const ['Todos'];
  String _categoria = 'Todos';
  final _searchCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final _productsKey = GlobalKey();
  final _currency =
      NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

  @override
  void initState() {
    super.initState();
    _searchCtrl.addListener(() => setState(() {}));
    _load();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!isCliente(ref.read(currentUserProvider)) && mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
        return;
      }
      _maybeShowAgeVerification();
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final catalog = await ref.read(catalogRepositoryProvider).getPublicCatalog();
      if (!mounted) return;
      setState(() {
        _productos = catalog.productos.where((p) => p.disponible).toList();
        _categorias = catalog.categorias;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = formatApiError(e);
        _loading = false;
      });
    }
  }

  List<CatalogProduct> get _filtered {
    final q = _searchCtrl.text.trim().toLowerCase();
    return _productos.where((p) {
      final matchCat = _categoria == 'Todos' || p.categoria == _categoria;
      final matchSearch = q.isEmpty ||
          p.nombre.toLowerCase().contains(q) ||
          p.categoria.toLowerCase().contains(q);
      return matchCat && matchSearch;
    }).toList();
  }

  void _scrollToProducts() {
    final ctx = _productsKey.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(
        ctx,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  void _scrollToTop() {
    _scrollCtrl.animateTo(
      0,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeInOut,
    );
  }

  void _maybeShowAgeVerification() {
    if (_ageVerifiedSession) return;
    Future.delayed(const Duration(seconds: 2), () {
      if (!mounted || _ageVerifiedSession) return;
      showDialog<void>(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: const Text('Verificación de edad'),
          content: const Text(
            'El consumo de bebidas alcohólicas es exclusivo para personas '
            'mayores de 18 años. Al continuar, confirmas que cumples este requisito.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Salir'),
            ),
            ElevatedButton(
              onPressed: () {
                _ageVerifiedSession = true;
                Navigator.pop(ctx);
              },
              child: const Text('Soy mayor de edad'),
            ),
          ],
        ),
      );
    });
  }

  void _addToCart(CatalogProduct product) {
    final result = ref.read(cartProvider.notifier).addProduct(product);
    if (!mounted) return;
    if (result.success) {
      showAppMessage(context, message: '${product.nombre} agregado al carrito');
    } else {
      showAppMessage(
        context,
        message: result.message ?? 'No se pudo agregar',
        isError: true,
      );
    }
  }

  Future<void> _checkout() async {
    if (ref.read(cartProvider).isEmpty) {
      showAppMessage(context, message: 'Tu carrito está vacío', isError: true);
      return;
    }
    final stockError = ref.read(cartProvider.notifier).firstStockError();
    if (stockError != null) {
      showAppMessage(context, message: stockError, isError: true);
      return;
    }
    final ok = await showClientCheckout(
      context,
      ref.read(salesManagementRepositoryProvider),
    );
    if (ok == true && mounted) {
      showAppMessage(context, message: 'Pedido registrado correctamente');
      Navigator.pushNamed(context, '/client/pedidos');
    }
  }

  void _showCartSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => _CartSheet(onCheckout: () {
        Navigator.pop(ctx);
        _checkout();
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cartCount = ref.watch(cartItemCountProvider);
    final user = ref.watch(currentUserProvider);

    return Scaffold(
      backgroundColor: AppColors.white,
      drawer: const AppDrawer(),
      body: Column(
        children: [
          _LandingHeader(
            cartCount: cartCount,
            userName: user?.nombre,
            searchController: _searchCtrl,
            onCartTap: _showCartSheet,
            onLogoTap: _scrollToTop,
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                ? AppErrorState(message: _error!, onRetry: _load)
                : RefreshIndicator(
                    onRefresh: _load,
                    child: CustomScrollView(
                      controller: _scrollCtrl,
                      slivers: [
                        const SliverToBoxAdapter(child: LandingCarousel()),
                        SliverToBoxAdapter(
                          child: Padding(
                            key: _productsKey,
                            padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
                            child: Column(
                              children: [
                                Text(
                                  'Productos Destacados',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(
                                    color: AppColors.primaryRed,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  'Descubre nuestra selección premium de licores '
                                  'y bebidas de la más alta calidad',
                                  textAlign: TextAlign.center,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                    color: AppColors.mutedForeground,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SliverToBoxAdapter(
                          child: SizedBox(
                            height: 40,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _categorias.length,
                              separatorBuilder: (_, __) =>
                                  const SizedBox(width: 8),
                              itemBuilder: (context, index) {
                                final cat = _categorias[index];
                                return FilterChip(
                                  label: Text(cat, style: const TextStyle(fontSize: 12)),
                                  selected: cat == _categoria,
                                  onSelected: (_) =>
                                      setState(() => _categoria = cat),
                                  selectedColor:
                                      AppColors.primaryRed.withValues(alpha: 0.15),
                                  checkmarkColor: AppColors.primaryRed,
                                );
                              },
                            ),
                          ),
                        ),
                        const SliverToBoxAdapter(child: SizedBox(height: 12)),
                        if (_filtered.isEmpty)
                          const SliverFillRemaining(
                            hasScrollBody: false,
                            child: AppEmptyState(
                              icon: LucideIcons.package,
                              message:
                                  'No se encontraron productos que coincidan con tu búsqueda',
                            ),
                          )
                        else
                          SliverPadding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            sliver: SliverGrid(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 5,
                                mainAxisSpacing: 4,
                                crossAxisSpacing: 4,
                                childAspectRatio: 0.55,
                              ),
                              delegate: SliverChildBuilderDelegate(
                                (context, index) {
                                  final p = _filtered[index];
                                  return LandingProductCard(
                                    product: p,
                                    currency: _currency,
                                    onAdd: () => _addToCart(p),
                                  );
                                },
                                childCount: _filtered.length,
                              ),
                            ),
                          ),
                        SliverToBoxAdapter(
                          child: LandingContactSection(
                            onScrollToTop: _scrollToTop,
                            onScrollToProducts: _scrollToProducts,
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
          if (cartCount > 0)
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton.icon(
                    onPressed: _checkout,
                    icon: const Icon(LucideIcons.shoppingBag, size: 18),
                    label: Text('Realizar pedido ($cartCount)'),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _LandingHeader extends StatelessWidget {
  final int cartCount;
  final String? userName;
  final TextEditingController searchController;
  final VoidCallback onCartTap;
  final VoidCallback onLogoTap;

  const _LandingHeader({
    required this.cartCount,
    required this.userName,
    required this.searchController,
    required this.onCartTap,
    required this.onLogoTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.primaryRed,
      elevation: 4,
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 4, 8, 8),
              child: Row(
                children: [
                  Builder(
                    builder: (ctx) => IconButton(
                      icon: const Icon(Icons.menu, color: Colors.white),
                      onPressed: () => Scaffold.of(ctx).openDrawer(),
                    ),
                  ),
                  Expanded(
                    child: InkWell(
                      onTap: onLogoTap,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const AppLogo(size: 32),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                LandingConstants.brandName,
                                style: Theme.of(context)
                                    .textTheme
                                    .titleSmall
                                    ?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                LandingConstants.brandTagline,
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: onCartTap,
                    icon: Badge(
                      isLabelVisible: cartCount > 0,
                      label: Text('$cartCount'),
                      child: const Icon(
                        LucideIcons.shoppingCart,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            if (userName != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  'Hola, $userName',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 10),
              child: TextField(
                controller: searchController,
                style: const TextStyle(fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Buscar productos...',
                  hintStyle: TextStyle(
                    color: AppColors.mutedForeground.withValues(alpha: 0.8),
                  ),
                  prefixIcon: const Icon(Icons.search, size: 20),
                  filled: true,
                  fillColor: Colors.white,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CartSheet extends ConsumerWidget {
  final VoidCallback onCheckout;

  const _CartSheet({required this.onCheckout});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final total = ref.watch(cartTotalProvider);
    final hasStockErrors = ref.watch(cartHasStockErrorsProvider);
    final currency =
        NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: 16 + MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Mi carrito', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          if (cart.isEmpty)
            const Text('Tu carrito está vacío')
          else ...[
            ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.4,
              ),
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: cart.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final line = cart[index];
                  final stockErr = cartLineStockError(line);
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(line.product.nombre),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(currency.format(line.product.precio)),
                        if (stockErr != null)
                          Text(
                            stockErr,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontSize: 11,
                            ),
                          ),
                      ],
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline),
                          onPressed: () {
                            final result = ref
                                .read(cartProvider.notifier)
                                .updateQuantity(
                                  line.product.id,
                                  line.cantidad - 1,
                                );
                            if (!result.success && context.mounted) {
                              showAppMessage(
                                context,
                                message: result.message ?? 'Error',
                                isError: true,
                              );
                            }
                          },
                        ),
                        Text('${line.cantidad}'),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          onPressed: () {
                            final result = ref
                                .read(cartProvider.notifier)
                                .updateQuantity(
                                  line.product.id,
                                  line.cantidad + 1,
                                );
                            if (!result.success && context.mounted) {
                              showAppMessage(
                                context,
                                message: result.message ?? 'Error',
                                isError: true,
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            const Divider(),
            Text(
              'Total: ${currency.format(total)}',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton(
                onPressed: hasStockErrors ? null : onCheckout,
                child: const Text('Realizar pedido'),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
