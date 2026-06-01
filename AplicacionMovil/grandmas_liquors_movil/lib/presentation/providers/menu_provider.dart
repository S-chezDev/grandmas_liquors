import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_provider.dart';

class MenuItemModel {
  final String id;
  final String title;
  final String? icon;
  final String? route;
  final List<MenuItemModel> submenu;
  final String? moduloKey;

  MenuItemModel({
    required this.id,
    required this.title,
    this.icon,
    this.route,
    this.submenu = const [],
    this.moduloKey,
  });
}

/// Menú dinámico de la aplicación móvil.
///
/// Por requerimiento del cliente, esta app móvil expone solo el módulo de
/// **Ventas** (Ventas, Abonos, Pedidos, Domicilios). Los demás módulos de
/// la plataforma se gestionan desde la aplicación web.
final dynamicMenuProvider = Provider<List<MenuItemModel>>((ref) {
  final permisos = ref.watch(userPermissionsProvider);
  final user = ref.watch(currentUserProvider);
  final role = user?.rol ?? '';

  bool hasAny(List<String> required) {
    if (role == 'Administrador') return true;
    return required.any(permisos.contains);
  }

  final menuItems = <MenuItemModel>[];

  // Ventas (Ventas, Abonos, Pedidos, Domicilios)
  if (hasAny(const [
        'Ver Ventas',
        'Ver Abonos',
        'Ver Pedidos',
        'Ver Domicilios',
      ]) ||
      role == 'Administrador' ||
      role == 'Cliente' ||
      role == 'Repartidor') {
    final salesSubmenu = <MenuItemModel>[];

    if (hasAny(const ['Ver Ventas', 'Registrar Ventas']) ||
        role == 'Administrador' ||
        role == 'Asesor') {
      salesSubmenu.add(
        MenuItemModel(
          id: 'ventas',
          title: 'Ventas',
          icon: 'assets/icons/sales.svg',
          route: '/sales/ventas',
        ),
      );
    }

    if (hasAny(const ['Ver Abonos']) || role == 'Administrador') {
      salesSubmenu.add(
        MenuItemModel(
          id: 'abonos',
          title: 'Abonos',
          icon: 'assets/icons/payments.svg',
          route: '/sales/abonos',
        ),
      );
    }

    if (hasAny(const ['Ver Pedidos', 'Ver Mis Pedidos']) ||
        role == 'Administrador' ||
        role == 'Cliente') {
      salesSubmenu.add(
        MenuItemModel(
          id: 'pedidos',
          title: 'Pedidos',
          icon: 'assets/icons/orders.svg',
          route: '/sales/pedidos',
        ),
      );
    }

    if (hasAny(const [
          'Ver Domicilios',
          'Gestionar Domicilios',
          'Ver Mis Domicilios',
        ]) ||
        role == 'Administrador' ||
        role == 'Repartidor' ||
        role == 'Cliente') {
      salesSubmenu.add(
        MenuItemModel(
          id: 'domicilios',
          title: 'Domicilios',
          icon: 'assets/icons/delivery.svg',
          route: '/sales/domicilios',
        ),
      );
    }

    if (salesSubmenu.isNotEmpty) {
      menuItems.add(
        MenuItemModel(
          id: 'sales',
          title: 'Ventas',
          icon: 'assets/icons/sales.svg',
          submenu: salesSubmenu,
          moduloKey: 'sales',
        ),
      );
    }
  }

  return menuItems;
});
