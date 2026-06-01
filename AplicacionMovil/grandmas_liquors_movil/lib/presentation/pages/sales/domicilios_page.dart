import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_drawer.dart';

class DomiciliosPage extends ConsumerStatefulWidget {
  const DomiciliosPage({super.key});

  @override
  ConsumerState<DomiciliosPage> createState() => _DomiciliosPageState();
}

class _DomiciliosPageState extends ConsumerState<DomiciliosPage> {
  bool _loading = true;
  List<DomicilioItem> _items = [];
  List<SalesOption> _pedidos = [];
  List<SalesOption> _repartidores = [];
  final _currency = NumberFormat.currency(
    locale: 'es_CO',
    symbol: r'$ ',
    decimalDigits: 0,
  );

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final repo = ref.read(salesManagementRepositoryProvider);
    final user = ref.read(currentUserProvider);
    try {
      final results = await Future.wait([
        repo.getDomicilios(user),
        repo.getPedidosOptions(),
        repo.getRepartidoresOptions(),
      ]);
      setState(() {
        _items = results[0] as List<DomicilioItem>;
        _pedidos = results[1] as List<SalesOption>;
        _repartidores = results[2] as List<SalesOption>;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _showCreateDialog() async {
    int? pedidoId;
    int? repartidorId;

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nuevo domicilio'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<int>(
              decoration: const InputDecoration(labelText: 'Pedido'),
              items: _pedidos
                  .map(
                    (p) => DropdownMenuItem(value: p.id, child: Text(p.label)),
                  )
                  .toList(),
              onChanged: (v) => pedidoId = v,
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<int>(
              decoration: const InputDecoration(labelText: 'Repartidor'),
              items: _repartidores
                  .map(
                    (p) => DropdownMenuItem(value: p.id, child: Text(p.label)),
                  )
                  .toList(),
              onChanged: (v) => repartidorId = v,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Guardar'),
          ),
        ],
      ),
    );

    if (ok != true) return;
    if (pedidoId == null || repartidorId == null) return;

    final repo = ref.read(salesManagementRepositoryProvider);
    await repo.createDomicilio(
      pedidoId: pedidoId!,
      repartidorId: repartidorId!,
    );
    await _load();
  }

  Future<void> _changeEstado(DomicilioItem item, String estado) async {
    String? motivo;
    if (estado == 'Cancelado') {
      motivo = await _askMotivo();
      if (motivo == null) return;
    }
    final repo = ref.read(salesManagementRepositoryProvider);
    await repo.changeDomicilioEstado(
      item.id,
      estado,
      motivoCancelacion: motivo,
    );
    await _load();
  }

  Future<void> _deleteItem(DomicilioItem item) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar domicilio'),
        content: Text('¿Eliminar el domicilio #${item.id}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirm != true) return;
    await ref.read(salesManagementRepositoryProvider).deleteDomicilio(item.id);
    await _load();
  }

  Future<void> _showDetails(DomicilioItem item) async {
    final detail = await ref
        .read(salesManagementRepositoryProvider)
        .getDomicilioById(item.id);
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Domicilio #${detail.id}'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Pedido: ${detail.pedidoId}'),
              Text('Cliente: ${detail.clienteId}'),
              Text('Repartidor: ${detail.repartidorNombre}'),
              Text('Dirección: ${detail.direccion}'),
              Text('Total: ${_currency.format(detail.total)}'),
              Text('Estado: ${detail.estado}'),
              Text('Fecha: ${detail.fecha}'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    );
  }

  Future<String?> _askMotivo() async {
    final ctrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Motivo de cancelacion'),
        content: TextField(
          controller: ctrl,
          maxLength: 50,
          decoration: const InputDecoration(
            hintText: 'Entre 10 y 50 caracteres',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Confirmar'),
          ),
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

    return Scaffold(
      appBar: AppBar(title: const Text('Gestion Domicilios')),
      drawer: const AppDrawer(),
      floatingActionButton: canCreate
          ? FloatingActionButton(
              onPressed: _showCreateDialog,
              child: const Icon(LucideIcons.plus),
            )
          : null,
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView.builder(
                itemCount: _items.length,
                itemBuilder: (context, index) {
                  final item = _items[index];
                  return Card(
                    margin: const EdgeInsets.fromLTRB(12, 8, 12, 0),
                    child: ListTile(
                      title: Text(
                        'Domicilio #${item.id} - Pedido #${item.pedidoId}',
                      ),
                      subtitle: Text(
                        '${item.fecha} - ${_currency.format(item.total)} - ${item.repartidorNombre}',
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          DropdownButton<String>(
                            value: item.estado,
                            items: const [
                              DropdownMenuItem(
                                value: 'Pendiente',
                                child: Text('Pendiente'),
                              ),
                              DropdownMenuItem(
                                value: 'En Camino',
                                child: Text('En Camino'),
                              ),
                              DropdownMenuItem(
                                value: 'Entregado',
                                child: Text('Entregado'),
                              ),
                              DropdownMenuItem(
                                value: 'Cancelado',
                                child: Text('Cancelado'),
                              ),
                            ],
                            onChanged: (value) {
                              if (value == null || value == item.estado) return;
                              _changeEstado(item, value);
                            },
                          ),
                          PopupMenuButton<String>(
                            icon: const Icon(Icons.more_vert),
                            onSelected: (value) {
                              if (value == 'detail') {
                                _showDetails(item);
                              } else if (value == 'delete') {
                                _deleteItem(item);
                              }
                            },
                            itemBuilder: (context) => const [
                              PopupMenuItem(
                                value: 'detail',
                                child: Text('Ver detalle'),
                              ),
                              PopupMenuItem(
                                value: 'delete',
                                child: Text('Eliminar'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
