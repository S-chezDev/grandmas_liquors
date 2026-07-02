import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/core/constants/landing_constants.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_logo.dart';

class LandingContactSection extends StatelessWidget {
  final VoidCallback? onScrollToTop;
  final VoidCallback? onScrollToProducts;

  const LandingContactSection({
    super.key,
    this.onScrollToTop,
    this.onScrollToProducts,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          color: AppColors.white,
          padding: const EdgeInsets.fromLTRB(16, 32, 16, 24),
          child: Column(
            children: [
              Text(
                'Contáctanos',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: AppColors.primaryRed,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '¿Tienes alguna pregunta? Estamos aquí para ayudarte',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.mutedForeground,
                ),
              ),
              const SizedBox(height: 24),
              _ContactCard(
                icon: LucideIcons.mapPin,
                title: 'Dirección',
                body:
                    '${LandingConstants.contactoDireccion}\n${LandingConstants.contactoCiudad}\nAntioquia, Colombia',
              ),
              const SizedBox(height: 12),
              _ContactCard(
                icon: LucideIcons.phone,
                title: 'Teléfono',
                body:
                    '${LandingConstants.contactoTelefonoDisplay}\nLunes a Sábado: 9:00 AM – 8:00 PM\nDomingos: 10:00 AM – 6:00 PM',
              ),
              const SizedBox(height: 12),
              _ContactCard(
                icon: LucideIcons.mail,
                title: 'Email',
                body:
                    '${LandingConstants.contactoEmail}\n${LandingConstants.contactoEmailVentas}',
              ),
            ],
          ),
        ),
        Container(
          color: AppColors.primaryRed,
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  AppLogo(size: 40),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          LandingConstants.brandName,
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'Licores Premium desde 2015',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'Somos una empresa dedicada a la comercialización de licores premium en Medellín. Contamos con 12 colaboradores comprometidos con la calidad.',
                style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  _FooterLink(label: 'Inicio', onTap: onScrollToTop),
                  _FooterLink(label: 'Productos', onTap: onScrollToProducts),
                  _FooterLink(label: 'Contacto', onTap: () {}),
                ],
              ),
              const SizedBox(height: 20),
              const Divider(color: Colors.white24),
              const SizedBox(height: 12),
              const Text(
                '© 2026 Grandma\'s Liqueurs. Todos los derechos reservados.',
                style: TextStyle(color: Colors.white60, fontSize: 11),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ContactCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String body;

  const _ContactCard({
    required this.icon,
    required this.title,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.inputBackground,
        borderRadius: BorderRadius.circular(AppColors.radiusLg),
      ),
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primaryRed.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.primaryRed, size: 22),
          ),
          const SizedBox(height: 10),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text(
            body,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.mutedForeground,
              fontSize: 13,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}

class _FooterLink extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;

  const _FooterLink({required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 13,
          decoration: TextDecoration.underline,
          decorationColor: Colors.white54,
        ),
      ),
    );
  }
}
