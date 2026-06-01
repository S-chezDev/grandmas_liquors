import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_drawer.dart';

class VentasPage extends ConsumerStatefulWidget {
  const VentasPage({super.key});

  @override
  ConsumerState<VentasPage> createState() => _VentasPageState();
}

class _VentasPageState extends ConsumerState<VentasPage> {
  bool _loading = true;
  List<VentaItem> _items = [];
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
    final user = ref.read(currentUserProvider);
    try {
      final results = await Future.wait([
        repo.getVentas(user),
        repo.getClientesOptions(),
      ]);
      setState(() {
        _items = results[0] as List<VentaItem>;
        _clientes = results[1] as List<SalesOption>;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _showCreateDialog() async {
    int? clienteId;
    final totalCtrl = TextEditingController();
    String metodo = 'Efectivo';

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nueva venta'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<int>(
              decoration: const InputDecoration(labelText: 'Cliente'),
              items: _clientes
                  .map(
                    (c) => DropdownMenuItem(value: c.id, child: Text(c.label)),
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
    if (clienteId == null || clienteId! <= 0) return;

    final total = double.tryParse(totalCtrl.text.replaceAll(',', '.')) ?? 0;
    if (total <= 0) return;

    final repo = ref.read(salesManagementRepositoryProvider);
    await repo.createVenta(
      clienteId: clienteId!,
      total: total,
      metodoPago: metodo,
    );
    await _load();
  }

  Future<void> _changeEstado(VentaItem item, String estado) async {
    final repo = ref.read(salesManagementRepositoryProvider);
    await repo.changeVentaEstado(item.id, estado);
    await _load();
  }

  Future<void> _deleteItem(VentaItem item) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar venta'),
        content: Text('¿Eliminar la venta #${item.id}?'),
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
    await ref.read(salesManagementRepositoryProvider).deleteVenta(item.id);
    await _load();
  }

  Future<void> _showDetails(VentaItem item) async {
    final detail = await ref
        .read(salesManagementRepositoryProvider)
        .getVentaById(item.id);
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Venta #${detail.id}'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Cliente: ${detail.clienteNombre.isNotEmpty ? detail.clienteNombre : detail.clienteId}',
              ),
              Text('Total: ${_currency.format(detail.total)}'),
              Text('Método: ${detail.metodoPago}'),
              Text('Estado: ${detail.estado}'),
              Text('Fecha: ${detail.fecha}'),
              if (detail.tipo.isNotEmpty) Text('Tipo: ${detail.tipo}'),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gestion Ventas')),
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
                      title: Text('Venta #${item.id} - ${item.clienteNombre}'),
                      subtitle: Text(
                        '${item.fecha} - ${_currency.format(item.total)} - ${item.metodoPago}',
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
                                value: 'Completada',
                                child: Text('Completada'),
                              ),
                              DropdownMenuItem(
                                value: 'Cancelada',
                                child: Text('Cancelada'),
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
