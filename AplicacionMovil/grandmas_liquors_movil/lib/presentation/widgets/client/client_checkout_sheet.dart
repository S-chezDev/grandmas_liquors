import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:grandmas_liquors_movil/core/constants/landing_constants.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/data/repositories/sales_management_repository.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/providers/cart_provider.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';

class ClientCheckoutSheet extends ConsumerStatefulWidget {
  final SalesManagementRepository repo;

  const ClientCheckoutSheet({super.key, required this.repo});

  @override
  ConsumerState<ClientCheckoutSheet> createState() =>
      _ClientCheckoutSheetState();
}

class _ClientCheckoutSheetState extends ConsumerState<ClientCheckoutSheet> {
  final _formKey = GlobalKey<FormState>();
  final _direccionCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _detallesCtrl = TextEditingController();
  final _fechaCtrl = TextEditingController();
  String _esquema = '50%';
  XFile? _comprobanteFile;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _fechaCtrl.text = tomorrowIso();
    _prefill();
  }

  void _prefill() {
    final user = ref.read(currentUserProvider);
    if (user?.telefono != null) {
      _telefonoCtrl.text = user!.telefono!.replaceAll(RegExp(r'\D'), '');
    }
    final clienteId = user?.clienteId;
    if (clienteId != null) {
      widget.repo.getClienteById(clienteId).then((c) {
        if (!mounted) return;
        setState(() {
          if (_direccionCtrl.text.isEmpty) _direccionCtrl.text = c.direccion;
          if (_telefonoCtrl.text.isEmpty) {
            _telefonoCtrl.text = c.telefono.replaceAll(RegExp(r'\D'), '');
          }
        });
      }).catchError((_) {});
    }
  }

  @override
  void dispose() {
    _direccionCtrl.dispose();
    _telefonoCtrl.dispose();
    _detallesCtrl.dispose();
    _fechaCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickComprobante() async {
    final file = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (file != null && mounted) setState(() => _comprobanteFile = file);
  }

  Future<void> _pickFechaEntrega() async {
    final now = DateTime.now();
    final initial = DateTime.tryParse(_fechaCtrl.text.trim()) ??
        now.add(const Duration(days: 1));
    final picked = await showDatePicker(
      context: context,
      initialDate: initial.isBefore(now) ? now : initial,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
    );
    if (picked != null && mounted) {
      setState(() {
        _fechaCtrl.text = picked.toIso8601String().split('T').first;
      });
    }
  }

  Future<void> _confirm() async {
    if (_formKey.currentState?.validate() != true) return;
    if (_comprobanteFile == null) {
      showAppMessage(
        context,
        message: 'Adjunta la captura del comprobante de transferencia',
        isError: true,
      );
      return;
    }

    final stockError = ref.read(cartProvider.notifier).firstStockError();
    if (stockError != null) {
      showAppMessage(context, message: stockError, isError: true);
      return;
    }

    final user = ref.read(currentUserProvider);
    if (user?.clienteId == null) {
      showAppMessage(
        context,
        message:
            'Tu perfil de cliente no está vinculado. Cierra sesión e ingresa de nuevo.',
        isError: true,
      );
      return;
    }

    final cart = ref.read(cartProvider);
    if (cart.isEmpty) return;

    setState(() => _saving = true);
    try {
      final bytes = await _comprobanteFile!.readAsBytes();
      final filename = _comprobanteFile!.name.isNotEmpty
          ? _comprobanteFile!.name
          : 'comprobante.jpg';
      final comprobanteUrl = await widget.repo.uploadComprobanteBytes(
        bytes,
        filename: filename,
      );

      final lines = cart
          .map(
            (l) => ProductLineInput(
              productoId: l.product.id,
              nombre: l.product.nombre,
              cantidad: l.cantidad,
              precio: l.product.precio,
            ),
          )
          .toList();

      await widget.repo.createPedidoCliente(
        esquemaAbono: _esquema,
        fechaEntrega: _fechaCtrl.text.trim(),
        productos: lines,
        comprobanteUrl: comprobanteUrl,
        direccion: _direccionCtrl.text.trim(),
        telefono: _telefonoCtrl.text.trim(),
        detalles: _detallesCtrl.text.trim(),
      );

      ref.read(cartProvider.notifier).clear();
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) {
        showAppMessage(context, message: formatApiError(e), isError: true);
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final total = ref.watch(cartTotalProvider);
    final currency =
        NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

    return AppFormSheet(
      title: 'Finalizar pedido',
      subtitle: 'Pago por transferencia bancaria',
      saving: _saving,
      saveLabel: 'Confirmar pedido',
      onCancel: () => Navigator.pop(context, false),
      onSave: _confirm,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Total ${currency.format(total)}',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.circular(AppColors.radiusLg),
                border: Border.all(
                  color: AppColors.primaryRed.withValues(alpha: 0.15),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Datos para transferencia',
                    style: TextStyle(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Cuenta: ${LandingConstants.checkoutCuentaTransferencia}',
                    style: const TextStyle(fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      LandingConstants.checkoutQrUrl,
                      height: 120,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const AppInfoBanner(
              message:
                  'Realiza la transferencia y adjunta el comprobante para confirmar.',
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _direccionCtrl,
              label: 'Dirección de entrega *',
              maxLines: 2,
              validator: validateDireccion,
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _telefonoCtrl,
              label: 'Teléfono *',
              keyboardType: TextInputType.phone,
              validator: validateTelefono10,
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _fechaCtrl,
              label: 'Fecha de entrega *',
              readOnly: true,
              onTap: _saving ? null : _pickFechaEntrega,
              suffixIcon: const Icon(Icons.calendar_today, size: 18),
              validator: validateFutureDate,
            ),
            const SizedBox(height: 12),
            AppFormField(
              controller: _detallesCtrl,
              label: 'Observaciones (opcional)',
              maxLines: 2,
            ),
            const SizedBox(height: 12),
            AppSelectField<String>(
              label: 'Esquema de pago',
              value: _esquema,
              items: const [
                DropdownMenuItem(value: '50%', child: Text('50% anticipo')),
                DropdownMenuItem(value: '100%', child: Text('100% anticipo')),
              ],
              onChanged: (v) => setState(() => _esquema = v ?? '50%'),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: _saving ? null : _pickComprobante,
              icon: const Icon(Icons.attach_file),
              label: Text(
                _comprobanteFile == null
                    ? 'Adjuntar comprobante *'
                    : 'Comprobante: ${_comprobanteFile!.name}',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

Future<bool?> showClientCheckout(
  BuildContext context,
  SalesManagementRepository repo,
) {
  return showAppFormSheet(
    context: context,
    builder: (ctx) => ClientCheckoutSheet(repo: repo),
  );
}
