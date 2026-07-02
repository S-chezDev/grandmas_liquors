import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:grandmas_liquors_movil/core/errors/exceptions.dart';
import 'package:grandmas_liquors_movil/data/models/auth/auth_models.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/sales/app_form_helpers.dart';

class RegisterForm extends ConsumerStatefulWidget {
  final VoidCallback onSuccess;
  final VoidCallback onGoToLogin;

  const RegisterForm({
    super.key,
    required this.onSuccess,
    required this.onGoToLogin,
  });

  @override
  ConsumerState<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends ConsumerState<RegisterForm> {
  final _formKey = GlobalKey<FormState>();
  final _docCtrl = TextEditingController();
  final _nombreCtrl = TextEditingController();
  final _apellidoCtrl = TextEditingController();
  final _direccionCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();

  String _tipoDocumento = 'CC';
  bool _showPassword = false;
  String? _errorMessage;
  String? _docDuplicate;
  String? _emailDuplicate;
  Timer? _availabilityTimer;

  @override
  void dispose() {
    _availabilityTimer?.cancel();
    _docCtrl.dispose();
    _nombreCtrl.dispose();
    _apellidoCtrl.dispose();
    _direccionCtrl.dispose();
    _telefonoCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  void _checkAvailability({String? documento, String? email}) {
    _availabilityTimer?.cancel();
    _availabilityTimer = Timer(const Duration(milliseconds: 350), () async {
      try {
        final result = await ref
            .read(authRepositoryProvider)
            .checkRegisterAvailability(documento: documento, email: email);
        if (!mounted) return;
        setState(() {
          if (documento != null) {
            _docDuplicate =
                result.documentoExists ? 'Este documento ya está registrado' : null;
          }
          if (email != null) {
            _emailDuplicate =
                result.emailExists ? 'Este correo ya está registrado' : null;
          }
        });
      } catch (_) {}
    });
  }

  Future<void> _submit() async {
    setState(() => _errorMessage = null);
    if (_formKey.currentState?.validate() != true) return;
    if (_passwordCtrl.text != _confirmCtrl.text) {
      setState(() => _errorMessage = 'Las contraseñas no coinciden');
      return;
    }

    try {
      await ref.read(authProvider.notifier).register(
        RegisterRequest(
          tipoDocumento: _tipoDocumento,
          numeroDocumento: _docCtrl.text.replaceAll(RegExp(r'\D'), ''),
          nombre: _nombreCtrl.text.trim(),
          apellido: _apellidoCtrl.text.trim(),
          direccion: _direccionCtrl.text.trim(),
          telefono: _telefonoCtrl.text.replaceAll(RegExp(r'\D'), ''),
          email: _emailCtrl.text.trim(),
          password: _passwordCtrl.text,
        ),
      );
      if (mounted) widget.onSuccess();
    } on AppException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (_) {
      setState(() => _errorMessage = 'No se pudo completar el registro');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(isLoadingProvider);

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppSelectField<String>(
            label: 'Tipo de documento *',
            value: _tipoDocumento,
            items: const [
              DropdownMenuItem(value: 'CC', child: Text('Cédula de ciudadanía')),
              DropdownMenuItem(value: 'CE', child: Text('Cédula de extranjería')),
              DropdownMenuItem(value: 'Pasaporte', child: Text('Pasaporte')),
            ],
            onChanged: (v) => setState(() => _tipoDocumento = v ?? 'CC'),
          ),
          const SizedBox(height: 12),
          AppFormField(
            controller: _docCtrl,
            label: 'Número de documento *',
            keyboardType: TextInputType.number,
            validator: validateDocumento,
            onChanged: (v) {
              final digits = v.replaceAll(RegExp(r'\D'), '');
              if (digits.length >= 6) _checkAvailability(documento: digits);
            },
          ),
          if (_docDuplicate != null) AppFieldError(message: _docDuplicate!),
          const SizedBox(height: 12),
          AppFormField(
            controller: _nombreCtrl,
            label: 'Nombres *',
            validator: (v) => validateName(v, 'Nombre'),
          ),
          const SizedBox(height: 12),
          AppFormField(
            controller: _apellidoCtrl,
            label: 'Apellidos *',
            validator: (v) => validateName(v, 'Apellido'),
          ),
          const SizedBox(height: 12),
          AppFormField(
            controller: _direccionCtrl,
            label: 'Dirección *',
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
            controller: _emailCtrl,
            label: 'Correo electrónico *',
            keyboardType: TextInputType.emailAddress,
            validator: validateEmail,
            onChanged: (v) {
              if (validateEmail(v) == null) _checkAvailability(email: v.trim());
            },
          ),
          if (_emailDuplicate != null) AppFieldError(message: _emailDuplicate!),
          const SizedBox(height: 12),
          AppFormField(
            controller: _passwordCtrl,
            label: 'Contraseña *',
            obscureText: !_showPassword,
            validator: validatePasswordPolicy,
            suffixIcon: IconButton(
              icon: Icon(_showPassword ? Icons.visibility : Icons.visibility_off),
              onPressed: () => setState(() => _showPassword = !_showPassword),
            ),
          ),
          const SizedBox(height: 12),
          AppFormField(
            controller: _confirmCtrl,
            label: 'Confirmar contraseña *',
            obscureText: !_showPassword,
            validator: (v) =>
                (v ?? '').isEmpty ? 'Confirma tu contraseña' : null,
          ),
          if (_errorMessage != null) ...[
            const SizedBox(height: 12),
            AppFieldError(message: _errorMessage!),
          ],
          const SizedBox(height: 16),
          SizedBox(
            height: 48,
            child: ElevatedButton(
              onPressed: isLoading ? null : _submit,
              child: Text(isLoading ? 'Registrando...' : 'Crear cuenta'),
            ),
          ),
          TextButton(
            onPressed: isLoading ? null : widget.onGoToLogin,
            child: const Text('¿Ya tienes cuenta? Inicia sesión'),
          ),
        ],
      ),
    );
  }
}
