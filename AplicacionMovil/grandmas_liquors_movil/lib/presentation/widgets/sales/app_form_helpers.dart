import 'package:flutter/material.dart';
import 'package:grandmas_liquors_movil/core/errors/exceptions.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';

String todayIso() => DateTime.now().toIso8601String().split('T').first;

String tomorrowIso() {
  final tomorrow = DateTime.now().add(const Duration(days: 1));
  return tomorrow.toIso8601String().split('T').first;
}

String minDateIso() => todayIso();

double parseMoney(String? raw) {
  if (raw == null) return 0;
  var s = raw.trim().replaceAll(RegExp(r'\s'), '');
  if (s.isEmpty) return 0;
  if (RegExp(r',\d{1,2}$').hasMatch(s)) {
    s = s.replaceAll('.', '').replaceAll(',', '.');
  } else {
    s = s.replaceAll('.', '');
  }
  return double.tryParse(s) ?? 0;
}

String? validateRequired(String? v, String label) {
  if (v == null || v.trim().isEmpty) return '$label es requerido';
  return null;
}

String? validateTelefono10(String? v) {
  final digits = (v ?? '').replaceAll(RegExp(r'\D'), '');
  if (digits.length != 10) return 'El teléfono debe tener 10 dígitos';
  return null;
}

String? validatePasswordPolicy(String? v) {
  final value = (v ?? '').trim();
  if (value.isEmpty) return 'La contraseña es obligatoria';
  if (value.length < 8) return 'Mínimo 8 caracteres';
  if (!RegExp(r'[A-Z]').hasMatch(value)) {
    return 'Debe incluir al menos una mayúscula';
  }
  if (!RegExp(r'[a-z]').hasMatch(value)) {
    return 'Debe incluir al menos una minúscula';
  }
  if (!RegExp(r'\d').hasMatch(value)) {
    return 'Debe incluir al menos un número';
  }
  return null;
}

String? validateDocumento(String? v) {
  final digits = (v ?? '').replaceAll(RegExp(r'\D'), '');
  if (digits.isEmpty) return 'El documento es obligatorio';
  if (digits.length < 6 || digits.length > 12) {
    return 'El documento debe tener entre 6 y 12 dígitos';
  }
  return null;
}

String? validateDireccion(String? v) {
  final text = (v ?? '').trim();
  if (text.isEmpty) return 'La dirección es obligatoria';
  if (text.length < 5) return 'Ingresa una dirección más completa';
  return null;
}

String? validateName(String? v, String label) {
  final text = (v ?? '').trim();
  if (text.isEmpty) return '$label es obligatorio';
  if (text.length < 2) return '$label debe tener al menos 2 caracteres';
  return null;
}

String? validateEmail(String? v) {
  final text = (v ?? '').trim();
  if (text.isEmpty) return 'El correo es obligatorio';
  if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(text)) {
    return 'Ingresa un correo electrónico válido';
  }
  return null;
}

String? validateFutureDate(String? v) {
  if (v == null || v.trim().isEmpty) return 'La fecha es requerida';
  final parsed = DateTime.tryParse(v.trim());
  if (parsed == null) return 'Fecha inválida (YYYY-MM-DD)';
  final today = DateTime.now();
  final d = DateTime(parsed.year, parsed.month, parsed.day);
  final t = DateTime(today.year, today.month, today.day);
  if (d.isBefore(t)) return 'La fecha debe ser hoy o posterior';
  return null;
}

String formatApiError(Object e) {
  if (e is AppException) return e.message;
  final s = e.toString();
  if (s.startsWith('Exception: ')) return s.substring(11);
  return s;
}

void showAppMessage(
  BuildContext context, {
  required String message,
  bool isError = false,
}) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: isError ? AppColors.error : AppColors.success,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ),
  );
}

/// Contenedor de formulario móvil (bottom sheet) alineado con modales web.
class AppFormSheet extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget child;
  final VoidCallback onCancel;
  final VoidCallback onSave;
  final String saveLabel;
  final bool saving;

  const AppFormSheet({
    super.key,
    required this.title,
    this.subtitle,
    required this.child,
    required this.onCancel,
    required this.onSave,
    this.saveLabel = 'Guardar',
    this.saving = false,
  });

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewInsets.bottom;
    final height = MediaQuery.of(context).size.height * 0.92;
    return Padding(
      padding: EdgeInsets.only(top: MediaQuery.of(context).size.height * 0.04),
      child: SizedBox(
        height: height,
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              const SizedBox(height: 8),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.muted,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 12, 8),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          if (subtitle != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              subtitle!,
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.mutedForeground,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: saving ? null : onCancel,
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.fromLTRB(20, 16, 20, 16 + bottom),
                  child: child,
                ),
              ),
              Container(
                padding: EdgeInsets.fromLTRB(
                  20,
                  12,
                  20,
                  12 + MediaQuery.of(context).padding.bottom,
                ),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  border: Border(top: BorderSide(color: AppColors.borderColor)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: saving ? null : onCancel,
                        child: const Text('Cancelar'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: saving ? null : onSave,
                        child: saving
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: AppColors.white,
                                ),
                              )
                            : Text(saveLabel),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

Future<bool?> showAppFormSheet({
  required BuildContext context,
  required Widget Function(BuildContext context) builder,
}) {
  return showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    useSafeArea: true,
    builder: builder,
  );
}

class AppInfoBanner extends StatelessWidget {
  final String message;
  final IconData icon;

  const AppInfoBanner({super.key, required this.message, this.icon = Icons.info_outline});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.infoBg,
        borderRadius: BorderRadius.circular(AppColors.radiusLg),
        border: Border.all(color: AppColors.info.withValues(alpha: 0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: AppColors.info),
          const SizedBox(width: 10),
          Expanded(
            child: Text(message, style: const TextStyle(fontSize: 13, color: AppColors.foreground)),
          ),
        ],
      ),
    );
  }
}

class AppSummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final bool highlight;

  const AppSummaryRow({
    super.key,
    required this.label,
    required this.value,
    this.highlight = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: AppColors.mutedForeground, fontSize: 13)),
          Text(
            value,
            style: TextStyle(
              fontWeight: highlight ? FontWeight.w700 : FontWeight.w600,
              color: highlight ? AppColors.primaryRed : AppColors.foreground,
              fontSize: highlight ? 16 : 14,
            ),
          ),
        ],
      ),
    );
  }
}
