import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/core/constants/landing_constants.dart';
import 'package:grandmas_liquors_movil/core/constants/app_constants.dart';
import 'package:grandmas_liquors_movil/data/models/catalog/catalog_models.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';

class LandingProductCard extends StatelessWidget {
  final CatalogProduct product;
  final NumberFormat currency;
  final VoidCallback? onAdd;

  const LandingProductCard({
    super.key,
    required this.product,
    required this.currency,
    this.onAdd,
  });

  String get _imageUrl {
    if (product.imageFullUrl.isNotEmpty) return product.imageFullUrl;
    return '${AppConstants.apiBaseUrl}${LandingConstants.productImageFallback}';
  }

  @override
  Widget build(BuildContext context) {
    final available = product.disponible;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.radiusLg),
        border: Border.all(color: AppColors.borderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AspectRatio(
            aspectRatio: 1.1,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  _imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: AppColors.secondary,
                    child: const Icon(
                      LucideIcons.wine,
                      color: AppColors.primaryRed,
                      size: 28,
                    ),
                  ),
                ),
                Positioned(
                  top: 4,
                  right: 4,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primaryRed,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      product.categoria,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(4, 4, 4, 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.nombre,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (product.descripcion.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      product.descripcion,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 8,
                        color: AppColors.mutedForeground,
                        height: 1.2,
                      ),
                    ),
                  ],
                  const Spacer(),
                  Text(
                    currency.format(product.precio),
                    style: const TextStyle(
                      color: AppColors.primaryRed,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 2),
                  SizedBox(
                    width: double.infinity,
                    height: 24,
                    child: ElevatedButton(
                      onPressed: available ? onAdd : null,
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.zero,
                        textStyle: const TextStyle(fontSize: 9),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            available ? LucideIcons.shoppingCart : LucideIcons.ban,
                            size: 10,
                          ),
                          const SizedBox(width: 3),
                          Text(available ? 'Agregar' : 'Agotado'),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
