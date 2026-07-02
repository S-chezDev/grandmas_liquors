import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/sales_create_sheets.dart';

class PedidosPage extends ConsumerStatefulWidget {
  const PedidosPage({super.key});

  @override
  ConsumerState<PedidosPage> createState() => _PedidosPageState();
}

class _PedidosPageState extends ConsumerState<PedidosPage> {
  bool _loading = true;
  String? _error;
  List<PedidoItem> _items = [];
  List<SalesOption> _clientes = [];
  List<ProductOption> _productos = [];
  final _searchCtrl = TextEditingController();
  String? _estadoFilter;
  final _currency = NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

  @override
  void initState() {
    super.initState();
    _searchCtrl.addListener(() => setState(() {}));
    _load();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<PedidoItem> get _filteredItems {
    final q = _searchCtrl.text.trim().toLowerCase();
    return _items.where((item) {
      final matchSearch = q.isEmpty ||
          item.id.toString().contains(q) ||
          item.clienteId.toString().contains(q) ||
          item.estado.toLowerCase().contains(q);
      final matchEstado = _estadoFilter == null ||
          _estadoFilter!.isEmpty ||
          item.estado.toLowerCase() == _estadoFilter!.toLowerCase();
      return matchSearch && matchEstado;
    }).toList();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final repo = ref.read(salesManagementRepositoryProvider);
      final results = await Future.wait([
        repo.getPedidos(),
        repo.getClientesOptions(),
        repo.getProductosOptions(),
      ]);
      if (!mounted) return;
      setState(() {
        _items = results[0] as List<PedidoItem>;
        _clientes = results[1] as List<SalesOption>;
        _productos = results[2] as List<ProductOption>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  String _clienteLabel(int clienteId) {
    return _clientes
            .where((c) => c.id == clienteId)
            .map((c) => c.label)
            .firstOrNull ??
        'Cliente $clienteId';
  }

  Future<void> _showCreateDialog() async {
    if (_clientes.isEmpty) {
      showAppMessage(context, message: 'No hay clientes disponibles', isError: true);
      return;
    }
    if (_productos.isEmpty) {
      showAppMessage(context, message: 'No hay productos disponibles', isError: true);
      return;
    }
    final ok = await showAppFormSheet(
      context: context,
      builder: (ctx) => CreatePedidoSheet(
        repo: ref.read(salesManagementRepositoryProvider),
        clientes: _clientes,
        productos: _productos,
      ),
    );
    if (ok == true) {
      await _load();
      if (mounted) showAppMessage(context, message: 'Pedido creado correctamente');
    }
  }

  Future<void> _changeEstado(PedidoItem item, String estado) async {
    String? motivo;
    if (estado == 'Cancelado') {
      motivo = await _askMotivo();
      if (motivo == null) return;
    }
    try {
      await ref.read(salesManagementRepositoryProvider).changePedidoEstado(item.id, estado, motivo: motivo);
      await _load();
      if (mounted) showAppMessage(context, message: 'Estado actualizado');
    } catch (e) {
      if (mounted) showAppMessage(context, message: formatApiError(e), isError: true);
    }
  }

  Future<String?> _askMotivo() async {
    final ctrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Motivo de cancelación'),
        content: AppFormField(controller: ctrl, label: 'Motivo', hint: 'Entre 10 y 50 caracteres'),
        actions: [
          OutlinedButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Confirmar')),
        ],
      ),
    );
    if (ok != true) return null;
    final text = ctrl.text.trim();
    if (text.length < 10 || text.length > 50) return null;
    return text;
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredItems;
    return AppPageScaffold(
      title: 'Gestión de pedidos',
      subtitle: 'Administra pedidos y entregas',
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateDialog,
        child: const Icon(LucideIcons.plus),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? AppErrorState(message: _error!, onRetry: _load)
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                children: [
                  AppPageHeader(
                    title: 'Pedidos',
                    subtitle: '${_items.length} registros en total',
                    onCreate: _showCreateDialog,
                    createLabel: 'Nuevo pedido',
                  ),
                  AppFilterBar(
                    searchController: _searchCtrl,
                    searchHint: 'Buscar por ID, cliente o estado...',
                    filters: [
                      SizedBox(
                        width: 160,
                        child: DropdownButtonFormField<String>(
                          value: _estadoFilter,
                          decoration: const InputDecoration(labelText: 'Estado', isDense: true),
                          items: const [
                            DropdownMenuItem(value: null, child: Text('Todos')),
                            DropdownMenuItem(value: 'Pendiente', child: Text('Pendiente')),
                            DropdownMenuItem(value: 'En Proceso', child: Text('En Proceso')),
                            DropdownMenuItem(value: 'Completado', child: Text('Completado')),
                            DropdownMenuItem(value: 'Cancelado', child: Text('Cancelado')),
                          ],
                          onChanged: (v) => setState(() => _estadoFilter = v),
                        ),
                      ),
                    ],
                    onClear: () => setState(() {
                      _searchCtrl.clear();
                      _estadoFilter = null;
                    }),
                  ),
                  if (filtered.isEmpty)
                    const AppEmptyState(icon: LucideIcons.clipboardList, message: 'No hay pedidos para mostrar')
                  else
                    ...filtered.map((item) => AppDataCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  'Pedido #${item.id}',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                              ),
                              AppStatusChip(label: item.estado),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(_clienteLabel(item.clienteId)),
                          Text('Entrega: ${item.fechaEntrega}'),
                          Text('${_currency.format(item.total)} · ${item.metodoPago}'),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            children: [
                              OutlinedButton(
                                onPressed: () => _changeEstado(item, 'En Proceso'),
                                child: const Text('En proceso'),
                              ),
                              OutlinedButton(
                                onPressed: () => _changeEstado(item, 'Completado'),
                                child: const Text('Completar'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    )),
                  const SizedBox(height: 80),
                ],
              ),
            ),
    );
  }
}
