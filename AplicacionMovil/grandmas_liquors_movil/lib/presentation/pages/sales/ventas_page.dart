import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/sales_create_sheets.dart';

class VentasPage extends ConsumerStatefulWidget {
  const VentasPage({super.key});

  @override
  ConsumerState<VentasPage> createState() => _VentasPageState();
}

class _VentasPageState extends ConsumerState<VentasPage> {
  bool _loading = true;
  String? _error;
  List<VentaItem> _items = [];
  List<SalesOption> _clientes = [];
  List<SalesOption> _pedidos = [];
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

  List<VentaItem> get _filteredItems {
    final q = _searchCtrl.text.trim().toLowerCase();
    return _items.where((item) {
      final matchSearch = q.isEmpty ||
          item.id.toString().contains(q) ||
          item.clienteNombre.toLowerCase().contains(q) ||
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
      final user = ref.read(currentUserProvider);
      final results = await Future.wait([
        repo.getVentas(user),
        repo.getClientesOptions(),
        repo.getPedidosOptions(),
        repo.getProductosOptions(),
      ]);
      if (!mounted) return;
      setState(() {
        _items = results[0] as List<VentaItem>;
        _clientes = results[1] as List<SalesOption>;
        _pedidos = results[2] as List<SalesOption>;
        _productos = results[3] as List<ProductOption>;
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

  Future<void> _showCreateDialog() async {
    final ok = await showAppFormSheet(
      context: context,
      builder: (ctx) => CreateVentaSheet(
        repo: ref.read(salesManagementRepositoryProvider),
        clientes: _clientes,
        pedidos: _pedidos,
        productos: _productos,
      ),
    );
    if (ok == true) {
      await _load();
      if (mounted) showAppMessage(context, message: 'Venta creada correctamente');
    }
  }

  Future<void> _changeEstado(VentaItem item, String estado) async {
    try {
      await ref.read(salesManagementRepositoryProvider).changeVentaEstado(item.id, estado);
      await _load();
      if (mounted) showAppMessage(context, message: 'Estado actualizado');
    } catch (e) {
      if (mounted) showAppMessage(context, message: formatApiError(e), isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredItems;
    return AppPageScaffold(
      title: 'Gestión de ventas',
      subtitle: 'Registra y consulta ventas',
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
                    title: 'Ventas',
                    subtitle: '${_items.length} registros en total',
                    onCreate: _showCreateDialog,
                    createLabel: 'Nueva venta',
                  ),
                  AppFilterBar(
                    searchController: _searchCtrl,
                    searchHint: 'Buscar por cliente, ID o estado...',
                    filters: [
                      SizedBox(
                        width: 160,
                        child: DropdownButtonFormField<String>(
                          value: _estadoFilter,
                          decoration: const InputDecoration(labelText: 'Estado', isDense: true),
                          items: const [
                            DropdownMenuItem(value: null, child: Text('Todos')),
                            DropdownMenuItem(value: 'Pendiente', child: Text('Pendiente')),
                            DropdownMenuItem(value: 'Completada', child: Text('Completada')),
                            DropdownMenuItem(value: 'Cancelada', child: Text('Cancelada')),
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
                    const AppEmptyState(icon: LucideIcons.receipt, message: 'No hay ventas para mostrar')
                  else
                    ...filtered.map((item) => AppDataCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  'Venta #${item.id} · ${item.clienteNombre}',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                              ),
                              AppStatusChip(label: item.estado),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('${item.fecha} · ${_currency.format(item.total)}'),
                          Text('${item.metodoPago}${item.tipo.isNotEmpty ? ' · ${item.tipo}' : ''}'),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            children: [
                              OutlinedButton(
                                onPressed: () => _changeEstado(item, 'Completada'),
                                child: const Text('Completar'),
                              ),
                              OutlinedButton(
                                onPressed: () => _changeEstado(item, 'Cancelada'),
                                child: const Text('Cancelar'),
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
