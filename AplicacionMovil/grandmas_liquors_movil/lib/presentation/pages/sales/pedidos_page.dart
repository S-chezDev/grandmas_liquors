import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_drawer.dart';

class PedidosPage extends ConsumerStatefulWidget {
  const PedidosPage({super.key});

  @override
  ConsumerState<PedidosPage> createState() => _PedidosPageState();
}

class _PedidosPageState extends ConsumerState<PedidosPage> {
  bool _loading = true;
  List<PedidoItem> _items = [];
  List<SalesOption> _clientes = [];
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
    try {
      final results = await Future.wait([
        repo.getPedidos(),
        repo.getClientesOptions(),
      ]);
      setState(() {
        _items = results[0] as List<PedidoItem>;
        _clientes = results[1] as List<SalesOption>;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _showCreateDialog() async {
    int? clienteId;
    String metodo = 'Efectivo';
    String esquema = '50%';
    final totalCtrl = TextEditingController();
    final fechaCtrl = TextEditingController(
      text: DateTime.now().toIso8601String().split('T').first,
    );

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nuevo pedido'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<int>(
                decoration: const InputDecoration(labelText: 'Cliente'),
                items: _clientes
                    .map(
                      (c) =>
                          DropdownMenuItem(value: c.id, child: Text(c.label)),
                    )
                    .toList(),
                onChanged: (v) => clienteId = v,
              ),
              const SizedBox(height: 8),
              TextField(
                controller: totalCtrl,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: const InputDecoration(labelText: 'Total'),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: fechaCtrl,
                decoration: const InputDecoration(
                  labelText: 'Fecha entrega (YYYY-MM-DD)',
                ),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: metodo,
                decoration: const InputDecoration(labelText: 'Metodo pago'),
                items: const [
                  DropdownMenuItem(value: 'Efectivo', child: Text('Efectivo')),
                  DropdownMenuItem(
                    value: 'Transferencia',
                    child: Text('Transferencia'),
                  ),
                ],
                onChanged: (v) => metodo = v ?? 'Efectivo',
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: esquema,
                decoration: const InputDecoration(labelText: 'Esquema abono'),
                items: const [
                  DropdownMenuItem(value: '50%', child: Text('50%')),
                  DropdownMenuItem(value: '100%', child: Text('100%')),
                ],
                onChanged: (v) => esquema = v ?? '50%',
              ),
            ],
          ),
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
    if (clienteId == null || clienteId! <= 0) return;

    final total = double.tryParse(totalCtrl.text.replaceAll(',', '.')) ?? 0;
    if (total <= 0) return;

    final repo = ref.read(salesManagementRepositoryProvider);
    await repo.createPedido(
      clienteId: clienteId!,
      total: total,
      metodoPago: metodo,
      esquemaAbono: esquema,
      fechaEntrega: fechaCtrl.text.trim(),
    );
    await _load();
  }

  Future<void> _changeEstado(PedidoItem item, String estado) async {
    String? motivo;
    if (estado == 'Cancelado') {
      motivo = await _askMotivo();
      if (motivo == null) return;
    }
    final repo = ref.read(salesManagementRepositoryProvider);
    await repo.changePedidoEstado(item.id, estado, motivo: motivo);
    await _load();
  }

  Future<void> _deleteItem(PedidoItem item) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar pedido'),
        content: Text('¿Eliminar el pedido #${item.id}?'),
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
    await ref.read(salesManagementRepositoryProvider).deletePedido(item.id);
    await _load();
  }

  Future<void> _showDetails(PedidoItem item) async {
    final detail = await ref
        .read(salesManagementRepositoryProvider)
        .getPedidoById(item.id);
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Pedido #${detail.id}'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Cliente: ${detail.clienteId}'),
              Text('Total: ${_currency.format(detail.total)}'),
              Text('Método: ${detail.metodoPago}'),
              Text('Estado: ${detail.estado}'),
              Text('Entrega: ${detail.fechaEntrega}'),
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
    return Scaffold(
      appBar: AppBar(title: const Text('Gestion Pedidos')),
      drawer: const AppDrawer(),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateDialog,
        child: const Icon(LucideIcons.plus),
      ),
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
                        'Pedido #${item.id} - Cliente ${item.clienteId}',
                      ),
                      subtitle: Text(
                        'Entrega ${item.fechaEntrega} - ${_currency.format(item.total)} - ${item.metodoPago}',
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
                                value: 'En Proceso',
                                child: Text('En Proceso'),
                              ),
                              DropdownMenuItem(
                                value: 'Completado',
                                child: Text('Completado'),
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
