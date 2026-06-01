import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/auth/auth_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_drawer.dart';

class AccessPage extends ConsumerStatefulWidget {
  const AccessPage({super.key});

  @override
  ConsumerState<AccessPage> createState() => _AccessPageState();
}

class _AccessPageState extends ConsumerState<AccessPage> {
  late Future<_AccessData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_AccessData> _load() async {
    final repo = ref.read(authRepositoryProvider);
    final results = await Future.wait([
      repo.getCurrentUser(),
      repo.getUsers(),
      repo.getRoles(),
    ]);
    return _AccessData(
      currentUser: results[0] as UsuarioModel?,
      users: results[1] as List<UsuarioModel>,
      roles: results[2] as List<String>,
    );
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final permissions = ref.watch(userPermissionsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Gestion Acceso')),
      drawer: const AppDrawer(),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: FutureBuilder<_AccessData>(
          future: _future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return ListView(
                children: [
                  SizedBox(height: 200),
                  Center(child: CircularProgressIndicator()),
                ],
              );
            }

            if (snapshot.hasError) {
              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Card(
                    child: ListTile(
                      leading: const Icon(Icons.error_outline),
                      title: const Text('No fue posible cargar el acceso'),
                      subtitle: Text(snapshot.error.toString()),
                    ),
                  ),
                ],
              );
            }

            final data = snapshot.data;
            final user = data?.currentUser;
            final users = data?.users ?? const <UsuarioModel>[];
            final roles = data?.roles ?? const <String>[];

            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Card(
                  child: ListTile(
                    leading: const Icon(LucideIcons.users),
                    title: Text(
                      '${user?.nombre ?? ''} ${user?.apellido ?? ''}'.trim(),
                    ),
                    subtitle: Text(user?.email ?? '-'),
                    trailing: Chip(label: Text(user?.rol ?? '-')),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Permisos del rol',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                if (permissions.isEmpty)
                  const Card(
                    child: ListTile(title: Text('Sin permisos asignados')),
                  ),
                ...permissions.map(
                  (permission) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: const Icon(LucideIcons.shieldCheck),
                      title: Text(permission),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Roles disponibles',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                ...roles.map(
                  (role) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: const Icon(LucideIcons.badgeCheck),
                      title: Text(role),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Usuarios registrados',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                ...users.map(
                  (item) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: const Icon(LucideIcons.users),
                      title: Text('${item.nombre} ${item.apellido}'.trim()),
                      subtitle: Text(item.email),
                      trailing: Chip(label: Text(item.rol)),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _AccessData {
  final UsuarioModel? currentUser;
  final List<UsuarioModel> users;
  final List<String> roles;

  _AccessData({
    required this.currentUser,
    required this.users,
    required this.roles,
  });
}
