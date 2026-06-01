import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/app_drawer.dart';
import '../../styles/app_colors.dart';

class HomePage extends ConsumerWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: Text('Grandmas Liquors'), elevation: 0),
      drawer: AppDrawer(),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Card
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: Center(
                          child: Text(
                            user?.nombre.isNotEmpty == true
                                ? user!.nombre[0].toUpperCase()
                                : 'U',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: AppColors.white,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Bienvenido',
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: AppColors.greyMedium),
                            ),
                            SizedBox(height: 4),
                            Text(
                              user?.nombre ?? 'Usuario',
                              style: Theme.of(context).textTheme.titleMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              user?.rol.isNotEmpty == true
                                  ? user!.rol
                                  : 'Sin rol asignado',
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: AppColors.primaryRed),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 24),

              // Quick Actions
              Text(
                'Accesos Rápidos',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),

              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                children: [
                  _buildQuickActionCard(
                    context,
                    'Ventas',
                    LucideIcons.shoppingBag,
                    () => Navigator.pushNamed(context, '/sales/ventas'),
                  ),
                  _buildQuickActionCard(
                    context,
                    'Abonos',
                    LucideIcons.creditCard,
                    () => Navigator.pushNamed(context, '/sales/abonos'),
                  ),
                  _buildQuickActionCard(
                    context,
                    'Domicilios',
                    LucideIcons.truck,
                    () => Navigator.pushNamed(context, '/sales/domicilios'),
                  ),
                ],
              ),

              SizedBox(height: 24),

              // Information Section
              Text(
                'Sistema de Gestión',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              Text(
                'Gestiona todos los aspectos de tu negocio desde una plataforma unificada. Acceso a módulos de acceso, ventas, abonos, pedidos y domicilios.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActionCard(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Card(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: AppColors.primaryRed),
              SizedBox(height: 12),
              Text(
                title,
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
