import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/core/utils/role_utils.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';

class ClientPedidosPage extends ConsumerStatefulWidget {
  const ClientPedidosPage({super.key});

  @override
  ConsumerState<ClientPedidosPage> createState() => _ClientPedidosPageState();
}

class _ClientPedidosPageState extends ConsumerState<ClientPedidosPage> {
  bool _loading = true;
  String? _error;
  List<PedidoItem> _items = [];
  final _currency =
      NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

  @override
  void initState() {
    super.initState();
    _load();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!isCliente(ref.read(currentUserProvider)) && mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    });
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final items = await ref.read(salesManagementRepositoryProvider).getPedidos();
      if (!mounted) return;
      setState(() {
        _items = items;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = formatApiError(e);
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: 'Mis pedidos',
      subtitle: 'Historial y estado de tus pedidos',
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? AppErrorState(message: _error!, onRetry: _load)
          : RefreshIndicator(
              onRefresh: _load,
              child: _items.isEmpty
                  ? ListView(
                      children: const [
                        AppEmptyState(
                          icon: LucideIcons.clipboardList,
                          message: 'Aún no tienes pedidos registrados',
                        ),
                      ],
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _items.length,
                      itemBuilder: (context, index) {
                        final item = _items[index];
                        return AppDataCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      'Pedido #${item.id}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleMedium,
                                    ),
                                  ),
                                  AppStatusChip(label: item.estado),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text('Entrega: ${item.fechaEntrega}'),
                              Text(
                                '${_currency.format(item.total)} · ${item.metodoPago}',
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
