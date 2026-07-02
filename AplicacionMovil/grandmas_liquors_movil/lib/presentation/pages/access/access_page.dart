import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/auth/auth_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';

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

    return AppPageScaffold(
      title: 'Gestión de acceso',
      subtitle: 'Usuarios, roles y permisos',
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: FutureBuilder<_AccessData>(
          future: _future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return ListView(
                children: const [
                  SizedBox(height: 200),
                  Center(child: CircularProgressIndicator()),
                ],
              );
            }

            if (snapshot.hasError) {
              return ListView(
                children: [
                  AppErrorState(
                    message: snapshot.error.toString(),
                    onRetry: _refresh,
                  ),
                ],
              );
            }

            final data = snapshot.data;
            final user = data?.currentUser;
            final users = data?.users ?? const <UsuarioModel>[];
            final roles = data?.roles ?? const <String>[];

            return ListView(
              children: [
                AppPageHeader(
                  title: 'Acceso',
                  subtitle: '${users.length} usuarios registrados',
                ),
                AppDataCard(
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.12),
                        child: Icon(LucideIcons.user, color: Theme.of(context).colorScheme.primary),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${user?.nombre ?? ''} ${user?.apellido ?? ''}'.trim(),
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            Text(user?.email ?? '-'),
                          ],
                        ),
                      ),
                      AppStatusChip(label: user?.rol ?? '-'),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text('Permisos del rol', style: Theme.of(context).textTheme.titleMedium),
                ),
                if (permissions.isEmpty)
                  const AppDataCard(child: Text('Sin permisos asignados'))
                else
                  ...permissions.map(
                    (permission) => AppDataCard(
                      child: Row(
                        children: [
                          Icon(LucideIcons.shieldCheck, size: 18, color: Theme.of(context).colorScheme.primary),
                          const SizedBox(width: 10),
                          Expanded(child: Text(permission)),
                        ],
                      ),
                    ),
                  ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text('Roles disponibles', style: Theme.of(context).textTheme.titleMedium),
                ),
                ...roles.map(
                  (role) => AppDataCard(
                    child: Row(
                      children: [
                        Icon(LucideIcons.badgeCheck, size: 18, color: Theme.of(context).colorScheme.primary),
                        const SizedBox(width: 10),
                        Text(role),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text('Usuarios registrados', style: Theme.of(context).textTheme.titleMedium),
                ),
                ...users.map(
                  (item) => AppDataCard(
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${item.nombre} ${item.apellido}'.trim(), style: Theme.of(context).textTheme.titleSmall),
                              Text(item.email),
                            ],
                          ),
                        ),
                        AppStatusChip(label: item.rol),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
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
