import 'package:flutter/material.dart';
import 'package:grandmas_liquors_movil/core/constants/app_assets.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';

class AppLogo extends StatelessWidget {
  final double size;
  final bool onWhiteBackground;
  final BorderRadius? borderRadius;

  const AppLogo({
    super.key,
    this.size = 80,
    this.onWhiteBackground = true,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final radius = borderRadius ?? BorderRadius.circular(AppColors.radiusXl);
    return Container(
      width: size,
      height: size,
      padding: EdgeInsets.all(size * 0.12),
      decoration: BoxDecoration(
        color: onWhiteBackground ? AppColors.white : Colors.transparent,
        borderRadius: radius,
        boxShadow: onWhiteBackground
            ? const [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 12,
                  offset: Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: ClipRRect(
        borderRadius: radius.subtract(BorderRadius.circular(4)),
        child: Image.asset(
          AppAssets.logo,
          fit: BoxFit.contain,
          errorBuilder: (_, __, ___) => Icon(
            Icons.local_bar,
            size: size * 0.5,
            color: AppColors.primaryRed,
          ),
        ),
      ),
    );
  }
}
