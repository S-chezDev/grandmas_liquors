import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:grandmas_liquors_movil/data/models/sales/sales_management_models.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';

class ProductLinesEditor extends StatefulWidget {
  final List<ProductOption> catalog;
  final List<ProductLineInput> lines;
  final ValueChanged<List<ProductLineInput>> onChanged;
  final bool checkStock;

  const ProductLinesEditor({
    super.key,
    required this.catalog,
    required this.lines,
    required this.onChanged,
    this.checkStock = true,
  });

  @override
  State<ProductLinesEditor> createState() => _ProductLinesEditorState();
}

class _ProductLinesEditorState extends State<ProductLinesEditor> {
  int? _selectedProductId;
  final _qtyCtrl = TextEditingController(text: '1');
  final _currency = NumberFormat.currency(locale: 'es_CO', symbol: r'$ ', decimalDigits: 0);

  @override
  void dispose() {
    _qtyCtrl.dispose();
    super.dispose();
  }

  double get total => widget.lines.fold(0.0, (s, l) => s + l.subtotal);

  void _addLine() {
    if (_selectedProductId == null) {
      showAppMessage(context, message: 'Seleccione un producto', isError: true);
      return;
    }
    final qty = int.tryParse(_qtyCtrl.text.trim()) ?? 0;
    if (qty <= 0) {
      showAppMessage(context, message: 'La cantidad debe ser mayor a 0', isError: true);
      return;
    }
    final product = widget.catalog.firstWhere((p) => p.id == _selectedProductId);
    if (widget.checkStock && product.stock > 0 && qty > product.stock) {
      showAppMessage(context, message: 'Stock insuficiente (disponible: ${product.stock})', isError: true);
      return;
    }
    final updated = [...widget.lines];
    final idx = updated.indexWhere((l) => l.productoId == product.id);
    if (idx >= 0) {
      updated[idx] = ProductLineInput(
        productoId: product.id,
        nombre: product.nombre,
        cantidad: updated[idx].cantidad + qty,
        precio: product.precio,
      );
    } else {
      updated.add(ProductLineInput(
        productoId: product.id,
        nombre: product.nombre,
        cantidad: qty,
        precio: product.precio,
      ));
    }
    widget.onChanged(updated);
    setState(() {
      _selectedProductId = null;
      _qtyCtrl.text = '1';
    });
  }

  void _removeLine(int productoId) {
    widget.onChanged(widget.lines.where((l) => l.productoId != productoId).toList());
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Agregar productos *',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        AppSelectField<int>(
          label: 'Producto',
          value: _selectedProductId,
          items: widget.catalog
              .map((p) => DropdownMenuItem(
                    value: p.id,
                    child: Text(
                      '${p.nombre} · ${_currency.format(p.precio)}${p.stock > 0 ? ' (stock ${p.stock})' : ''}',
                      overflow: TextOverflow.ellipsis,
                    ),
                  ))
              .toList(),
          onChanged: (v) => setState(() => _selectedProductId = v),
        ),
        const SizedBox(height: 10),
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              child: AppFormField(
                controller: _qtyCtrl,
                label: 'Cantidad',
                keyboardType: TextInputType.number,
              ),
            ),
            const SizedBox(width: 10),
            ElevatedButton.icon(
              onPressed: _addLine,
              icon: const Icon(Icons.add, size: 18),
              label: const Text('Agregar'),
            ),
          ],
        ),
        if (widget.lines.isNotEmpty) ...[
          const SizedBox(height: 14),
          ...widget.lines.map((line) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.inputBackground,
              borderRadius: BorderRadius.circular(AppColors.radiusLg),
              border: Border.all(color: AppColors.borderColor),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(line.nombre, style: const TextStyle(fontWeight: FontWeight.w600)),
                      Text(
                        '${line.cantidad} x ${_currency.format(line.precio)}',
                        style: const TextStyle(fontSize: 12, color: AppColors.mutedForeground),
                      ),
                    ],
                  ),
                ),
                Text(_currency.format(line.subtotal), style: const TextStyle(fontWeight: FontWeight.w600)),
                IconButton(
                  icon: const Icon(Icons.close, size: 18),
                  onPressed: () => _removeLine(line.productoId),
                  color: AppColors.mutedForeground,
                ),
              ],
            ),
          )),
          const SizedBox(height: 4),
          AppSummaryRow(label: 'Total', value: _currency.format(total), highlight: true),
        ] else
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(
              'Agregue al menos un producto',
              style: TextStyle(fontSize: 12, color: AppColors.mutedForeground),
            ),
          ),
      ],
    );
  }
}
