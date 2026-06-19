import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/core/utils/role_utils.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/app_page_scaffold.dart';
import '../../widgets/app_logo.dart';
import '../../styles/app_colors.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (isCliente(ref.read(currentUserProvider)) && mounted) {
        Navigator.of(context).pushReplacementNamed('/client/catalog');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);

    return AppPageScaffold(
      title: 'Panel principal',
      subtitle: 'Grandma\'s Liqueurs · Gestión empresarial',
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(AppColors.radiusLg),
                  border: Border.all(color: AppColors.borderColor),
                ),
                child: Row(
                  children: [
                    const AppLogo(size: 56, borderRadius: BorderRadius.all(Radius.circular(10))),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Bienvenido',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            user?.nombre ?? 'Usuario',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          Text(
                            user?.rol.isNotEmpty == true ? user!.rol : 'Sin rol asignado',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.primaryRed,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Accesos rápidos',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.15,
                children: [
                  _QuickAction(
                    title: 'Ventas',
                    icon: LucideIcons.receipt,
                    onTap: () => Navigator.pushNamed(context, '/sales/ventas'),
                  ),
                  _QuickAction(
                    title: 'Abonos',
                    icon: LucideIcons.creditCard,
                    onTap: () => Navigator.pushNamed(context, '/sales/abonos'),
                  ),
                  _QuickAction(
                    title: 'Pedidos',
                    icon: LucideIcons.clipboardList,
                    onTap: () => Navigator.pushNamed(context, '/sales/pedidos'),
                  ),
                  _QuickAction(
                    title: 'Domicilios',
                    icon: LucideIcons.truck,
                    onTap: () => Navigator.pushNamed(context, '/sales/domicilios'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _QuickAction({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppColors.radiusLg),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          border: Border.all(color: AppColors.borderColor),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primaryRed.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(AppColors.radiusLg),
              ),
              child: Icon(icon, color: AppColors.primaryRed, size: 28),
            ),
            const SizedBox(height: 10),
            Text(title, style: Theme.of(context).textTheme.titleMedium),
          ],
        ),
      ),
    );
  }
}
