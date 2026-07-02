import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/sales_create_sheets.dart';

class DomiciliosPage extends ConsumerStatefulWidget {
  const DomiciliosPage({super.key});

  @override
  ConsumerState<DomiciliosPage> createState() => _DomiciliosPageState();
}

class _DomiciliosPageState extends ConsumerState<DomiciliosPage> {
  bool _loading = true;
  String? _error;
  List<DomicilioItem> _items = [];
  List<SalesOption> _pedidos = [];
  List<SalesOption> _repartidores = [];
  String? _repartidoresError;
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

  List<DomicilioItem> get _filteredItems {
    final q = _searchCtrl.text.trim().toLowerCase();
    return _items.where((item) {
      final matchSearch = q.isEmpty ||
          item.id.toString().contains(q) ||
          item.pedidoId.toString().contains(q) ||
          item.repartidorNombre.toLowerCase().contains(q) ||
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
    final repo = ref.read(salesManagementRepositoryProvider);
    final user = ref.read(currentUserProvider);
    try {
      final domiciliosFuture = repo.getDomicilios(user);
      final pedidosFuture = repo.getPedidosOptions();
      List<SalesOption> repartidores = [];
      String? repError;
      try {
        repartidores = await repo.getRepartidoresOptions();
      } catch (e) {
        repError = formatApiError(e);
      }

      final results = await Future.wait([
        domiciliosFuture,
        pedidosFuture,
      ]);
      if (!mounted) return;
      setState(() {
        _items = results[0] as List<DomicilioItem>;
        _pedidos = results[1] as List<SalesOption>;
        _repartidores = repartidores;
        _repartidoresError = repError;
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
    if (_pedidos.isEmpty) {
      showAppMessage(context, message: 'No hay pedidos disponibles', isError: true);
      return;
    }
    final ok = await showAppFormSheet(
      context: context,
      builder: (ctx) => CreateDomicilioSheet(
        repo: ref.read(salesManagementRepositoryProvider),
        pedidos: _pedidos,
        repartidores: _repartidores,
      ),
    );
    if (ok == true) {
      await _load();
      if (mounted) showAppMessage(context, message: 'Domicilio creado correctamente');
    }
  }

  Future<void> _changeEstado(DomicilioItem item, String estado) async {
    String? motivo;
    if (estado == 'Cancelado') {
      motivo = await _askMotivo();
      if (motivo == null) return;
    }
    try {
      await ref.read(salesManagementRepositoryProvider).changeDomicilioEstado(
        item.id,
        estado,
        motivoCancelacion: motivo,
      );
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
    final role = (ref.watch(currentUserProvider)?.rol ?? '').toLowerCase();
    final canCreate = role != 'cliente' && role != 'repartidor';
    final filtered = _filteredItems;

    return AppPageScaffold(
      title: 'Gestión de domicilios',
      subtitle: 'Asigna y da seguimiento a entregas',
      floatingActionButton: canCreate
          ? FloatingActionButton(onPressed: _showCreateDialog, child: const Icon(LucideIcons.plus))
          : null,
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? AppErrorState(message: _error!, onRetry: _load)
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                children: [
                  AppPageHeader(
                    title: 'Domicilios',
                    subtitle: '${_items.length} registros en total',
                    onCreate: canCreate ? _showCreateDialog : null,
                    createLabel: 'Nuevo domicilio',
                  ),
                  if (_repartidoresError != null)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                      child: AppInfoBanner(
                        message: 'Repartidores: $_repartidoresError',
                        icon: Icons.warning_amber_rounded,
                      ),
                    ),
                  AppFilterBar(
                    searchController: _searchCtrl,
                    searchHint: 'Buscar por ID, pedido o repartidor...',
                    filters: [
                      SizedBox(
                        width: 160,
                        child: DropdownButtonFormField<String>(
                          value: _estadoFilter,
                          decoration: const InputDecoration(labelText: 'Estado', isDense: true),
                          items: const [
                            DropdownMenuItem(value: null, child: Text('Todos')),
                            DropdownMenuItem(value: 'Pendiente', child: Text('Pendiente')),
                            DropdownMenuItem(value: 'En Camino', child: Text('En Camino')),
                            DropdownMenuItem(value: 'Entregado', child: Text('Entregado')),
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
                    const AppEmptyState(icon: LucideIcons.truck, message: 'No hay domicilios para mostrar')
                  else
                    ...filtered.map((item) => AppDataCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  'Domicilio #${item.id} · Pedido #${item.pedidoId}',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                              ),
                              AppStatusChip(label: item.estado),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('${item.fecha} · ${_currency.format(item.total)}'),
                          Text(item.repartidorNombre),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            children: [
                              OutlinedButton(
                                onPressed: () => _changeEstado(item, 'En Camino'),
                                child: const Text('En camino'),
                              ),
                              OutlinedButton(
                                onPressed: () => _changeEstado(item, 'Entregado'),
                                child: const Text('Entregado'),
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
