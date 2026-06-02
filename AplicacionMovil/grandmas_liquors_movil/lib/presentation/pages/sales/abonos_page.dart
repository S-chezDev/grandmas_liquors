import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/sales_management_provider.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_page_scaffold.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/sales_create_sheets.dart';

class AbonosPage extends ConsumerStatefulWidget {
  const AbonosPage({super.key});

  @override
  ConsumerState<AbonosPage> createState() => _AbonosPageState();
}

class _AbonosPageState extends ConsumerState<AbonosPage> {
  bool _loading = true;
  String? _error;
  List<AbonoItem> _items = [];
  List<SalesOption> _pedidos = [];
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
    setState(() {
      _loading = true;
      _error = null;
    });
    final repo = ref.read(salesManagementRepositoryProvider);
    try {
      final results = await Future.wait([
        repo.getAbonos(),
        repo.getPedidosOptions(),
      ]);
      if (!mounted) return;
      setState(() {
        _items = results[0] as List<AbonoItem>;
        _pedidos = results[1] as List<SalesOption>;
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
      builder: (ctx) => CreateAbonoSheet(
        repo: ref.read(salesManagementRepositoryProvider),
        pedidos: _pedidos,
      ),
    );
    if (ok == true) {
      await _load();
      if (mounted) showAppMessage(context, message: 'Abono creado correctamente');
    }
  }

  Future<void> _changeEstado(AbonoItem item, String estado) async {
    try {
      final repo = ref.read(salesManagementRepositoryProvider);
      await repo.changeAbonoEstado(item.id, estado);
      await _load();
      _showSnack('Estado actualizado a $estado.', isError: false);
    } catch (e) {
      _showSnack('No se pudo cambiar el estado: $e', isError: true);
    }
  }

  Future<void> _deleteItem(AbonoItem item) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar abono'),
        content: Text('¿Eliminar el abono #${item.id}?'),
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
    try {
      await ref.read(salesManagementRepositoryProvider).deleteAbono(item.id);
      await _load();
      _showSnack('Abono eliminado.', isError: false);
    } catch (e) {
      _showSnack('No se pudo eliminar el abono: $e', isError: true);
    }
  }

  Future<void> _showDetails(AbonoItem item) async {
    try {
      final detail = await ref
          .read(salesManagementRepositoryProvider)
          .getAbonoById(item.id);
      if (!mounted) return;
      final estadoCanonico = ref
          .read(salesManagementRepositoryProvider)
          .normalizeAbonoEstado(detail.estado);
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Abono #${detail.id}'),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                _detailRow('Cliente', detail.clienteNombre),
                _detailRow('Pedido', '#${detail.pedidoId}'),
                _detailRow('Monto', _currency.format(detail.monto)),
                if (detail.totalPedido > 0)
                  _detailRow(
                    'Total pedido',
                    _currency.format(detail.totalPedido),
                  ),
                _detailRow('Estado', estadoCanonico),
                _detailRow('Método', detail.metodoPago),
                _detailRow('Fecha', detail.fecha),
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
    } catch (e) {
      _showSnack('No se pudo cargar el detalle: $e', isError: true);
    }
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.greyDark,
              ),
            ),
          ),
          Expanded(child: Text(value.isEmpty ? '-' : value)),
        ],
      ),
    );
  }

  void _showSnack(String message, {required bool isError}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppColors.error : AppColors.success,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: 'Gestión de abonos',
      subtitle: 'Control de pagos parciales y totales',
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateDialog,
        child: const Icon(LucideIcons.plus),
      ),
      body: RefreshIndicator(
        onRefresh: _load,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return ListView(
        children: const [
          SizedBox(height: 200),
          Center(child: CircularProgressIndicator()),
        ],
      );
    }

    if (_error != null) {
      return ListView(
        children: [AppErrorState(message: _error!, onRetry: _load)],
      );
    }

    if (_items.isEmpty) {
      return ListView(
        children: const [
          AppPageHeader(title: 'Abonos', subtitle: '0 registros en total'),
          AppEmptyState(
            icon: LucideIcons.creditCard,
            message: 'Aún no hay abonos registrados.',
          ),
        ],
      );
    }

    return ListView(
      children: [
        AppPageHeader(
          title: 'Abonos',
          subtitle: '${_items.length} registros en total',
          onCreate: _showCreateDialog,
          createLabel: 'Nuevo abono',
        ),
        ..._items.map(_buildAbonoCard),
        const SizedBox(height: 80),
      ],
    );
  }

  Widget _buildAbonoCard(AbonoItem item) {
    final repo = ref.read(salesManagementRepositoryProvider);
    final estadoCanonico = repo.normalizeAbonoEstado(item.estado);
    final transiciones = repo.allowedAbonoTransitions(item.estado);

    return Card(
      margin: const EdgeInsets.fromLTRB(12, 6, 12, 6),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primaryRed.withOpacity(0.12),
                  child: const Icon(
                    LucideIcons.creditCard,
                    color: AppColors.primaryRed,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Abono #${item.id} · Pedido #${item.pedidoId}',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        item.clienteNombre,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.greyMedium,
                        ),
                      ),
                    ],
                  ),
                ),
                _estadoChip(estadoCanonico),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 6,
              children: [
                _infoChip(
                  LucideIcons.dollarSign,
                  _currency.format(item.monto),
                  color: AppColors.primaryRed,
                ),
                _infoChip(LucideIcons.calendar, item.fecha),
                _infoChip(LucideIcons.wallet, item.metodoPago),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (transiciones.isNotEmpty)
                  PopupMenuButton<String>(
                    tooltip: 'Cambiar estado',
                    onSelected: (estado) => _changeEstado(item, estado),
                    itemBuilder: (context) => transiciones
                        .map(
                          (estado) => PopupMenuItem(
                            value: estado,
                            child: Row(
                              children: [
                                Icon(
                                  _iconForEstado(estado),
                                  size: 16,
                                  color: AppColors.greyDark,
                                ),
                                const SizedBox(width: 8),
                                Text('Marcar como $estado'),
                              ],
                            ),
                          ),
                        )
                        .toList(),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primaryRed.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: AppColors.primaryRed.withOpacity(0.3),
                        ),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            LucideIcons.refreshCw,
                            size: 14,
                            color: AppColors.primaryRed,
                          ),
                          SizedBox(width: 6),
                          Text(
                            'Cambiar estado',
                            style: TextStyle(
                              color: AppColors.primaryRed,
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
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
          ],
        ),
      ),
    );
  }

  Widget _estadoChip(String estado) {
    Color background;
    Color foreground;
    IconData icon;
    switch (estado) {
      case 'Verificado':
        background = const Color(0xFFE3F2FD);
        foreground = const Color(0xFF1565C0);
        icon = LucideIcons.shieldCheck;
        break;
      case 'Aplicado':
        background = const Color(0xFFEDE7F6);
        foreground = const Color(0xFF5E35B1);
        icon = LucideIcons.check;
        break;
      case 'Finalizado':
        background = const Color(0xFFE6F4EA);
        foreground = const Color(0xFF1E8E3E);
        icon = LucideIcons.circleCheck;
        break;
      case 'Cancelado':
        background = const Color(0xFFFDECEA);
        foreground = const Color(0xFFC5221F);
        icon = LucideIcons.circleX;
        break;
      case 'Registrado':
      default:
        background = const Color(0xFFFFF4E5);
        foreground = const Color(0xFFB95C00);
        icon = LucideIcons.clock;
        break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: foreground),
          const SizedBox(width: 4),
          Text(
            estado,
            style: TextStyle(
              color: foreground,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoChip(IconData icon, String label, {Color? color}) {
    final c = color ?? AppColors.greyDark;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.greyLight,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: c),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(fontSize: 12, color: c, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  IconData _iconForEstado(String estado) {
    switch (estado) {
      case 'Verificado':
        return LucideIcons.shieldCheck;
      case 'Cancelado':
        return LucideIcons.circleX;
      case 'Aplicado':
        return LucideIcons.check;
      case 'Finalizado':
        return LucideIcons.circleCheck;
      default:
        return LucideIcons.clock;
    }
  }
}
