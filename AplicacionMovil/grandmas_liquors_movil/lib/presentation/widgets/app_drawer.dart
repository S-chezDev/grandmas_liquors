import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/menu_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_logo.dart';

class AppDrawer extends ConsumerWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final menuItems = ref.watch(dynamicMenuProvider);
    final currentUser = ref.watch(currentUserProvider);

    return Drawer(
      backgroundColor: AppColors.primaryRed,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: Container(
        decoration: BoxDecoration(gradient: AppColors.primaryGradient),
        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(currentUser),
              const Divider(color: Colors.white24, height: 1),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  itemCount: menuItems.length,
                  itemBuilder: (context, index) {
                    final item = menuItems[index];
                    return _buildMenuItem(context, item);
                  },
                ),
              ),
              const Divider(color: Colors.white24, height: 1),
              _buildLogoutButton(context, ref),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(dynamic currentUser) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppLogo(size: 48, borderRadius: BorderRadius.all(Radius.circular(8))),
          const SizedBox(height: 14),
          Text(
            currentUser?.nombre ?? 'Usuario',
            style: const TextStyle(
              color: AppColors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            currentUser?.email ?? '',
            style: TextStyle(
              color: AppColors.white.withValues(alpha: 0.85),
              fontSize: 12,
            ),
          ),
          if ((currentUser?.rol ?? '').toString().isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.white.withValues(alpha: 0.18),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.white.withValues(alpha: 0.35)),
              ),
              child: Text(
                currentUser.rol,
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildMenuItem(BuildContext context, MenuItemModel item) {
    if (item.submenu.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
        child: Material(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          child: InkWell(
            borderRadius: BorderRadius.circular(10),
            onTap: () {
              Navigator.pop(context);
              if (item.route != null) {
                Navigator.pushNamed(context, item.route!);
              }
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              child: Row(
                children: [
                  Icon(_getIconForItem(item.id), color: AppColors.white, size: 22),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      item.title,
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      child: Theme(
        data: Theme.of(context).copyWith(
          dividerColor: Colors.transparent,
          unselectedWidgetColor: AppColors.white,
          colorScheme: Theme.of(
            context,
          ).colorScheme.copyWith(primary: AppColors.white),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: ExpansionTile(
            iconColor: AppColors.white,
            collapsedIconColor: AppColors.white,
            backgroundColor: Colors.white.withValues(alpha: 0.08),
            collapsedBackgroundColor: Colors.transparent,
            tilePadding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 2,
            ),
            childrenPadding: const EdgeInsets.only(bottom: 6),
            leading: Icon(
              _getIconForItem(item.id),
              color: AppColors.white,
              size: 22,
            ),
            title: Text(
              item.title,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
            children: item.submenu.map((subitem) {
              return Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 6,
                  vertical: 2,
                ),
                child: Material(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () {
                      Navigator.pop(context);
                      if (subitem.route != null) {
                        Navigator.pushNamed(context, subitem.route!);
                      }
                    },
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(28, 10, 12, 10),
                      child: Row(
                        children: [
                          Icon(
                            _getIconForItem(subitem.id),
                            color: AppColors.white.withValues(alpha: 0.85),
                            size: 18,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              subitem.title,
                              style: TextStyle(
                                color: AppColors.white.withOpacity(0.95),
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _showLogoutDialog(context, ref),
          icon: const Icon(Icons.logout, color: AppColors.primaryRed),
          label: const Text(
            'Cerrar Sesión',
            style: TextStyle(
              color: AppColors.primaryRed,
              fontWeight: FontWeight.bold,
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.white,
            foregroundColor: AppColors.primaryRed,
            padding: const EdgeInsets.symmetric(vertical: 12),
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
      ),
    );
  }

  IconData _getIconForItem(String id) {
    switch (id) {
      case 'configuration':
        return LucideIcons.settings;
      case 'access':
        return LucideIcons.shieldCheck;
      case 'roles':
        return LucideIcons.shield;
      case 'usuarios':
        return LucideIcons.users;
      case 'purchases':
        return LucideIcons.shoppingCart;
      case 'proveedores':
        return LucideIcons.building2;
      case 'compras':
        return LucideIcons.shoppingBag;
      case 'productos':
        return LucideIcons.package2;
      case 'categorias':
        return LucideIcons.tags;
      case 'production':
        return LucideIcons.factory;
      case 'ordenes_produccion':
        return LucideIcons.clipboardList;
      case 'insumos':
        return LucideIcons.boxes;
      case 'entregas':
        return LucideIcons.truck;
      case 'sales':
        return LucideIcons.shoppingBag;
      case 'clientes':
        return LucideIcons.user;
      case 'ventas':
        return LucideIcons.receipt;
      case 'abonos':
        return LucideIcons.creditCard;
      case 'pedidos':
        return LucideIcons.clipboardList;
      case 'domicilios':
        return LucideIcons.truck;
      default:
        return LucideIcons.menu;
    }
  }

  void _showLogoutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cerrar Sesión'),
        content: const Text('¿Estás seguro de que deseas cerrar sesión?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
              ref.read(authProvider.notifier).logout();
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/login',
                (route) => false,
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Cerrar Sesión'),
          ),
        ],
      ),
    );
  }
}
