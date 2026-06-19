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

/// Menú según rol: clientes ven tienda; staff ve módulo de ventas.
final dynamicMenuProvider = Provider<List<MenuItemModel>>((ref) {
  final permisos = ref.watch(userPermissionsProvider);
  final user = ref.watch(currentUserProvider);
  final role = user?.rol ?? '';

  if (role == 'Cliente') {
    return [
      MenuItemModel(
        id: 'catalog',
        title: 'Tienda',
        route: '/client/catalog',
        moduloKey: 'client',
      ),
      MenuItemModel(
        id: 'my-orders',
        title: 'Mis Pedidos',
        route: '/client/pedidos',
        moduloKey: 'client',
      ),
      MenuItemModel(
        id: 'my-profile',
        title: 'Mi Perfil',
        route: '/client/profile',
        moduloKey: 'client',
      ),
      MenuItemModel(
        id: 'contacto',
        title: 'Contacto',
        moduloKey: 'client',
      ),
      MenuItemModel(
        id: 'nosotros',
        title: 'Nosotros',
        moduloKey: 'client',
      ),
    ];
  }

  bool hasAny(List<String> required) {
    if (role == 'Administrador') return true;
    return required.any(permisos.contains);
  }

  final menuItems = <MenuItemModel>[];

  if (hasAny(const [
        'Ver Ventas',
        'Ver Abonos',
        'Ver Pedidos',
        'Ver Domicilios',
      ]) ||
      role == 'Administrador' ||
      role == 'Repartidor') {
    final salesSubmenu = <MenuItemModel>[];

    if (hasAny(const ['Ver Ventas', 'Registrar Ventas']) ||
        role == 'Administrador' ||
        role == 'Asesor') {
      salesSubmenu.add(
        MenuItemModel(id: 'ventas', title: 'Ventas', route: '/sales/ventas'),
      );
    }

    if (hasAny(const ['Ver Abonos']) || role == 'Administrador') {
      salesSubmenu.add(
        MenuItemModel(id: 'abonos', title: 'Abonos', route: '/sales/abonos'),
      );
    }

    if (hasAny(const ['Ver Pedidos']) || role == 'Administrador') {
      salesSubmenu.add(
        MenuItemModel(id: 'pedidos', title: 'Pedidos', route: '/sales/pedidos'),
      );
    }

    if (hasAny(const ['Ver Domicilios', 'Gestionar Domicilios']) ||
        role == 'Administrador' ||
        role == 'Repartidor') {
      salesSubmenu.add(
        MenuItemModel(
          id: 'domicilios',
          title: 'Domicilios',
          route: '/sales/domicilios',
        ),
      );
    }

    if (salesSubmenu.isNotEmpty) {
      menuItems.add(
        MenuItemModel(
          id: 'sales',
          title: 'Ventas',
          submenu: salesSubmenu,
          moduloKey: 'sales',
        ),
      );
    }
  }

  return menuItems;
});
