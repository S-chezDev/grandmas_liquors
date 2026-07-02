import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/data/repositories/sales_management_repository.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/product_lines_editor.dart';

class CreatePedidoSheet extends StatefulWidget {
  final SalesManagementRepository repo;
  final List<SalesOption> clientes;
  final List<ProductOption> productos;

  const CreatePedidoSheet({
    super.key,
    required this.repo,
    required this.clientes,
    required this.productos,
  });

  @override
  State<CreatePedidoSheet> createState() => _CreatePedidoSheetState();
}

class _CreatePedidoSheetState extends State<CreatePedidoSheet> {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  int? _clienteId;
  String _metodo = 'Efectivo';
  String _esquema = '50%';
  final _direccionCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _fechaEntregaCtrl = TextEditingController(text: todayIso());
  List<ProductLineInput> _lines = [];

  @override
  void dispose() {
    _direccionCtrl.dispose();
    _telefonoCtrl.dispose();
    _fechaEntregaCtrl.dispose();
    super.dispose();
  }

  Future<void> _onClienteChanged(int? id) async {
    setState(() => _clienteId = id);
    if (id == null) return;
    try {
      final c = await widget.repo.getClienteById(id);
      if (!mounted) return;
      setState(() {
        _direccionCtrl.text = c.direccion;
        _telefonoCtrl.text = c.telefono.replaceAll(RegExp(r'\D'), '');
      });
    } catch (_) {}
  }

  Future<void> _save() async {
    if (_formKey.currentState?.validate() != true) return;
    if (_lines.isEmpty) {
      showAppMessage(context, message: 'Agregue al menos un producto', isError: true);
      return;
    }
    setState(() => _saving = true);
    try {
      await widget.repo.createPedido(
        clienteId: _clienteId!,
        metodoPago: _metodo,
        esquemaAbono: _esquema,
        fechaEntrega: _fechaEntregaCtrl.text.trim(),
        productos: _lines,
        direccion: _direccionCtrl.text.trim(),
        telefono: _telefonoCtrl.text.trim(),
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) showAppMessage(context, message: formatApiError(e), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppFormSheet(
      title: 'Nuevo pedido',
      subtitle: 'Complete los datos de entrega y productos',
      saving: _saving,
      onCancel: () => Navigator.pop(context, false),
      onSave: _save,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const AppInfoBanner(message: 'La fecha del pedido se registra automáticamente al guardar.'),
            const SizedBox(height: 16),
            AppSelectField<int>(
              label: 'Cliente *',
              value: _clienteId,
              items: widget.clientes
                  .map((c) => DropdownMenuItem(value: c.id, child: Text(c.label)))
                  .toList(),
              onChanged: _onClienteChanged,
              validator: (v) => v == null ? 'Seleccione un cliente' : null,
            ),
            const SizedBox(height: 12),
            AppSelectField<String>(
              label: 'Método de pago',
              value: _metodo,
              items: const [
                DropdownMenuItem(value: 'Efectivo', child: Text('Efectivo')),
                DropdownMenuItem(value: 'Transferencia', child: Text('Transferencia')),
              ],
              onChanged: (v) => setState(() => _metodo = v ?? 'Efectivo'),
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _direccionCtrl,
              label: 'Dirección de entrega',
              maxLines: 2,
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _telefonoCtrl,
              label: 'Teléfono de contacto *',
              keyboardType: TextInputType.phone,
              validator: validateTelefono10,
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _fechaEntregaCtrl,
              label: 'Fecha entrega * (solo fechas futuras)',
              validator: validateFutureDate,
            ),
            const SizedBox(height: 12),
            AppSelectField<String>(
              label: 'Porcentaje de abono',
              value: _esquema,
              items: const [
                DropdownMenuItem(value: '50%', child: Text('50%')),
                DropdownMenuItem(value: '100%', child: Text('100%')),
              ],
              onChanged: (v) => setState(() => _esquema = v ?? '50%'),
            ),
            const SizedBox(height: 16),
            ProductLinesEditor(
              catalog: widget.productos,
              lines: _lines,
              onChanged: (l) => setState(() => _lines = l),
            ),
          ],
        ),
      ),
    );
  }
}

class CreateVentaSheet extends StatefulWidget {
  final SalesManagementRepository repo;
  final List<SalesOption> clientes;
  final List<SalesOption> pedidos;
  final List<ProductOption> productos;

  const CreateVentaSheet({
    super.key,
    required this.repo,
    required this.clientes,
    required this.pedidos,
    required this.productos,
  });

  @override
  State<CreateVentaSheet> createState() => _CreateVentaSheetState();
}

class _CreateVentaSheetState extends State<CreateVentaSheet> {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  String _tipo = 'directa';
  int? _clienteId;
  int? _pedidoId;
  String _metodo = 'Efectivo';
  final _fechaCtrl = TextEditingController(text: todayIso());
  List<ProductLineInput> _lines = [];
  PedidoDetail? _pedidoDetail;
  final _currency = NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

  @override
  void dispose() {
    _fechaCtrl.dispose();
    super.dispose();
  }

  Future<void> _onPedidoChanged(int? id) async {
    setState(() {
      _pedidoId = id;
      _pedidoDetail = null;
      _lines = [];
    });
    if (id == null) return;
    try {
      final detail = await widget.repo.getPedidoDetail(id);
      if (!mounted) return;
      setState(() {
        _pedidoDetail = detail;
        _clienteId = detail.clienteId;
        _metodo = detail.metodoPago;
      });
    } catch (_) {}
  }

  double get _total {
    if (_tipo == 'por pedido' && _pedidoDetail != null) return _pedidoDetail!.total;
    return _lines.fold(0.0, (s, l) => s + l.subtotal);
  }

  Future<void> _save() async {
    if (_formKey.currentState?.validate() != true) return;
    if (_tipo == 'directa' && _lines.isEmpty) {
      showAppMessage(context, message: 'Agregue al menos un producto', isError: true);
      return;
    }
    if (_tipo == 'por pedido' && (_pedidoId == null || _pedidoId! <= 0)) {
      showAppMessage(context, message: 'Seleccione un pedido', isError: true);
      return;
    }
    setState(() => _saving = true);
    try {
      await widget.repo.createVenta(
        tipo: _tipo == 'por pedido' ? 'Por Pedido' : 'Directa',
        clienteId: _clienteId,
        pedidoId: _pedidoId,
        total: _total,
        metodoPago: _metodo,
        fecha: _fechaCtrl.text.trim(),
        estado: _tipo == 'directa' ? 'Completada' : 'Pendiente',
        productos: _tipo == 'directa' ? _lines : const [],
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) showAppMessage(context, message: formatApiError(e), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppFormSheet(
      title: 'Nueva venta',
      subtitle: 'Registre una venta directa o por pedido',
      saving: _saving,
      onCancel: () => Navigator.pop(context, false),
      onSave: _save,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppSelectField<String>(
              label: 'Tipo de venta',
              value: _tipo,
              items: const [
                DropdownMenuItem(value: 'directa', child: Text('Directa')),
                DropdownMenuItem(value: 'por pedido', child: Text('Por pedido')),
              ],
              onChanged: (v) => setState(() {
                _tipo = v ?? 'directa';
                _pedidoId = null;
                _pedidoDetail = null;
                _lines = [];
              }),
            ),
            const SizedBox(height: 12),
            if (_tipo == 'directa') ...[
              AppSelectField<int>(
                label: 'Cliente *',
                value: _clienteId,
                items: widget.clientes
                    .map((c) => DropdownMenuItem(value: c.id, child: Text(c.label)))
                    .toList(),
                onChanged: (v) => setState(() => _clienteId = v),
                validator: (v) => v == null ? 'Seleccione un cliente' : null,
              ),
              const SizedBox(height: 16),
              ProductLinesEditor(
                catalog: widget.productos,
                lines: _lines,
                onChanged: (l) => setState(() => _lines = l),
              ),
            ] else ...[
              AppSelectField<int>(
                label: 'Pedido *',
                value: _pedidoId,
                items: widget.pedidos
                    .map((p) => DropdownMenuItem(value: p.id, child: Text(p.label)))
                    .toList(),
                onChanged: _onPedidoChanged,
                validator: (v) => v == null ? 'Seleccione un pedido' : null,
              ),
              if (_pedidoDetail != null) ...[
                const SizedBox(height: 12),
                AppInfoBanner(
                  message: 'Cliente del pedido #${_pedidoDetail!.id} · Total ${_currency.format(_pedidoDetail!.total)}',
                ),
              ],
            ],
            const SizedBox(height: 12),
            AppSelectField<String>(
              label: 'Método de pago',
              value: _metodo,
              items: const [
                DropdownMenuItem(value: 'Efectivo', child: Text('Efectivo')),
                DropdownMenuItem(value: 'Transferencia', child: Text('Transferencia')),
              ],
              onChanged: (v) => setState(() => _metodo = v ?? 'Efectivo'),
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _fechaCtrl,
              label: 'Fecha',
              validator: (v) => validateRequired(v, 'Fecha'),
            ),
            if (_total > 0) ...[
              const SizedBox(height: 12),
              AppSummaryRow(label: 'Total venta', value: _currency.format(_total), highlight: true),
            ],
          ],
        ),
      ),
    );
  }
}

class CreateAbonoSheet extends StatefulWidget {
  final SalesManagementRepository repo;
  final List<SalesOption> pedidos;

  const CreateAbonoSheet({
    super.key,
    required this.repo,
    required this.pedidos,
  });

  @override
  State<CreateAbonoSheet> createState() => _CreateAbonoSheetState();
}

class _CreateAbonoSheetState extends State<CreateAbonoSheet> {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  int? _pedidoId;
  int _porcentaje = 50;
  String _metodo = 'Efectivo';
  final _fechaCtrl = TextEditingController(text: todayIso());
  PedidoDetail? _pedido;
  final _currency = NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

  @override
  void dispose() {
    _fechaCtrl.dispose();
    super.dispose();
  }

  double get _monto {
    if (_pedido == null) return 0;
    return (_pedido!.total * _porcentaje / 100).roundToDouble();
  }

  Future<void> _onPedidoChanged(int? id) async {
    setState(() {
      _pedidoId = id;
      _pedido = null;
    });
    if (id == null) return;
    try {
      final detail = await widget.repo.getPedidoDetail(id);
      if (!mounted) return;
      final pct = detail.esquemaAbono.contains('50') ? 50 : 100;
      setState(() {
        _pedido = detail;
        _porcentaje = pct;
        _metodo = detail.metodoPago;
      });
    } catch (_) {}
  }

  Future<void> _save() async {
    if (_formKey.currentState?.validate() != true) return;
    if (_pedido == null) return;
    if (_monto <= 0) {
      showAppMessage(context, message: 'El monto calculado no es válido', isError: true);
      return;
    }
    if (_monto > _pedido!.saldoPendiente + 0.01) {
      showAppMessage(
        context,
        message: 'El abono supera el saldo pendiente (${_currency.format(_pedido!.saldoPendiente)})',
        isError: true,
      );
      return;
    }
    setState(() => _saving = true);
    try {
      await widget.repo.createAbono(
        pedidoId: _pedidoId!,
        monto: _monto,
        metodoPago: _metodo,
        fecha: _fechaCtrl.text.trim(),
        porcentaje: _porcentaje,
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) showAppMessage(context, message: formatApiError(e), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppFormSheet(
      title: 'Nuevo abono',
      subtitle: 'Registre un pago parcial o total del pedido',
      saving: _saving,
      onCancel: () => Navigator.pop(context, false),
      onSave: _save,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppSelectField<int>(
              label: 'Pedido *',
              value: _pedidoId,
              items: widget.pedidos
                  .map((p) => DropdownMenuItem(value: p.id, child: Text(p.label)))
                  .toList(),
              onChanged: _onPedidoChanged,
              validator: (v) => v == null ? 'Seleccione un pedido' : null,
            ),
            const SizedBox(height: 12),
            AppSelectField<int>(
              label: 'Porcentaje del abono',
              value: _porcentaje,
              items: const [
                DropdownMenuItem(value: 50, child: Text('50%')),
                DropdownMenuItem(value: 100, child: Text('100%')),
              ],
              onChanged: (v) => setState(() => _porcentaje = v ?? 50),
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _fechaCtrl,
              label: 'Fecha',
              validator: (v) => validateRequired(v, 'Fecha'),
            ),
            const SizedBox(height: 12),
            AppSelectField<String>(
              label: 'Método de pago',
              value: _metodo,
              items: const [
                DropdownMenuItem(value: 'Efectivo', child: Text('Efectivo')),
                DropdownMenuItem(value: 'Transferencia', child: Text('Transferencia')),
              ],
              onChanged: (v) => setState(() => _metodo = v ?? 'Efectivo'),
            ),
            if (_pedido != null) ...[
              const SizedBox(height: 16),
              AppSummaryRow(label: 'Total pedido', value: _currency.format(_pedido!.total)),
              AppSummaryRow(label: 'Abonado', value: _currency.format(_pedido!.montoAbonado)),
              AppSummaryRow(label: 'Saldo pendiente', value: _currency.format(_pedido!.saldoPendiente)),
              const SizedBox(height: 8),
              AppSummaryRow(label: 'Monto del abono', value: _currency.format(_monto), highlight: true),
            ],
          ],
        ),
      ),
    );
  }
}

class CreateDomicilioSheet extends StatefulWidget {
  final SalesManagementRepository repo;
  final List<SalesOption> pedidos;
  final List<SalesOption> repartidores;

  const CreateDomicilioSheet({
    super.key,
    required this.repo,
    required this.pedidos,
    required this.repartidores,
  });

  @override
  State<CreateDomicilioSheet> createState() => _CreateDomicilioSheetState();
}

class _CreateDomicilioSheetState extends State<CreateDomicilioSheet> {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  int? _pedidoId;
  int? _repartidorId;
  PedidoDetail? _pedido;

  Future<void> _onPedidoChanged(int? id) async {
    setState(() {
      _pedidoId = id;
      _pedido = null;
    });
    if (id == null) return;
    try {
      final detail = await widget.repo.getPedidoDetail(id);
      if (mounted) setState(() => _pedido = detail);
    } catch (_) {}
  }

  String? _repartidorNombre() {
    if (_repartidorId == null) return null;
    return widget.repartidores
        .where((r) => r.id == _repartidorId)
        .map((r) => r.label)
        .firstOrNull;
  }

  Future<void> _save() async {
    if (_formKey.currentState?.validate() != true) return;
    if (widget.repartidores.isEmpty) {
      showAppMessage(
        context,
        message: 'No hay repartidores disponibles. Verifique permisos de usuarios.',
        isError: true,
      );
      return;
    }
    setState(() => _saving = true);
    try {
      await widget.repo.createDomicilio(
        pedidoId: _pedidoId!,
        repartidorId: _repartidorId!,
        repartidorNombre: _repartidorNombre(),
        direccionFallback: _pedido?.direccion,
        fecha: _pedido?.fechaEntrega,
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) showAppMessage(context, message: formatApiError(e), isError: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppFormSheet(
      title: 'Nuevo domicilio',
      subtitle: 'Asigne un pedido a un repartidor',
      saving: _saving,
      onCancel: () => Navigator.pop(context, false),
      onSave: _save,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (widget.repartidores.isEmpty)
              const AppInfoBanner(
                message: 'No se pudieron cargar repartidores. Se requiere permiso "Ver Usuarios".',
                icon: Icons.warning_amber_rounded,
              ),
            const SizedBox(height: 12),
            AppSelectField<int>(
              label: 'Pedido *',
              value: _pedidoId,
              items: widget.pedidos
                  .map((p) => DropdownMenuItem(value: p.id, child: Text(p.label)))
                  .toList(),
              onChanged: _onPedidoChanged,
              validator: (v) => v == null ? 'Seleccione un pedido' : null,
            ),
            if (_pedido != null) ...[
              const SizedBox(height: 12),
              AppInfoBanner(
                message: 'Entrega: ${_pedido!.fechaEntrega.isNotEmpty ? _pedido!.fechaEntrega : "—"} · '
                    'Dirección: ${_pedido!.direccion.isNotEmpty ? _pedido!.direccion : "Sin dirección"}',
              ),
            ],
            const SizedBox(height: 12),
            AppSelectField<int>(
              label: 'Repartidor *',
              value: _repartidorId,
              items: widget.repartidores
                  .map((r) => DropdownMenuItem(value: r.id, child: Text(r.label)))
                  .toList(),
              onChanged: (v) => setState(() => _repartidorId = v),
              validator: (v) => v == null ? 'Seleccione un repartidor' : null,
            ),
          ],
        ),
      ),
    );
  }
}
