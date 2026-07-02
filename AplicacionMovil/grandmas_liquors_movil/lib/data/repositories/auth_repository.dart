import 'dart:convert';

import 'package:flutter/foundation.dart';

import '../../core/constants/app_constants.dart';
import '../../core/errors/exceptions.dart';
import '../models/auth/auth_models.dart';
import '../datasources/local/secure_storage.dart';
import '../datasources/remote/api_service.dart';

class AuthRepository {
  final ApiService _apiService;
  final SecureStorageService _secureStorage;

  AuthRepository({
    required ApiService apiService,
    required SecureStorageService secureStorage,
  }) : _apiService = apiService,
       _secureStorage = secureStorage;

  Future<LoginResponse> login({
    required String email,
    required String password,
  }) async {
    final request = LoginRequest(
      email: email,
      password: password,
      rememberMe: true,
    );

    final response = await _apiService.postRaw(
      AppConstants.loginEndpoint,
      data: request.toJson(),
    );

    final payload = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : <String, dynamic>{};

    final user = UsuarioModel.fromJson(payload);
    final token = _resolveSessionToken(payload, response['set_cookie'] as String?);

    if (token.isNotEmpty) {
      await _secureStorage.saveToken(token);
      await _persistUserSession(user);
      return LoginResponse(token: token, usuario: user);
    }

    if (kIsWeb) {
      final verified = await refreshUser();
      if (verified == null) {
        throw AuthenticationException(
          message:
              'No se pudo iniciar sesión en el navegador. Ejecute el proxy de API (tool/start_api_proxy.bat) en otra terminal y reinicie la app.',
        );
      }
      await _persistUserSession(verified);
      return LoginResponse(token: token, usuario: verified);
    }

    throw AuthenticationException(
      message: 'El servidor no devolvió un token de sesión.',
    );
  }

  Future<void> logout() async {
    try {
      await _apiService.post(AppConstants.logoutEndpoint);
    } catch (e) {
      // Continue with logout even if API call fails
    } finally {
      await _secureStorage.clearAll();
    }
  }

  Future<UsuarioModel?> getCurrentUser() async {
    try {
      final userJson = await _secureStorage.getUserData();
      if (userJson == null) return null;

      final userMap = jsonDecode(userJson) as Map<String, dynamic>;
      return UsuarioModel.fromJson(userMap);
    } catch (e) {
      return null;
    }
  }

  Future<bool> hasValidToken() async {
    try {
      if (await _secureStorage.hasToken()) {
        return true;
      }
      if (kIsWeb && await getCurrentUser() != null) {
        return await refreshUser() != null;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<List<String>> getPermissionNames() async {
    try {
      final permissionsJson = await _secureStorage.getPermissions();
      if (permissionsJson == null) return [];

      final permissionsList = jsonDecode(permissionsJson) as List;
      return permissionsList.map((p) => p.toString()).toList();
    } catch (e) {
      return [];
    }
  }

  @Deprecated('Use hasPermissionName')
  Future<bool> hasPermission(String modulo, String accion) async => false;

  Future<bool> hasPermissionName(String permissionName) async {
    final permissions = await getPermissionNames();
    return permissions.contains(permissionName);
  }

  Future<List<String>> getAccessibleModules() async {
    try {
      final user = await getCurrentUser();
      if ((user?.rol ?? '').toLowerCase() == 'cliente') {
        return const ['client'];
      }

      final permissions = await getPermissionNames();
      final modules = <String>{};

      final has = (String p) => permissions.contains(p);
      if (has('Ver Roles') || has('Ver Usuarios')) modules.add('access');
      if (has('Ver Ventas') ||
          has('Ver Abonos') ||
          has('Ver Pedidos') ||
          has('Ver Domicilios')) {
        modules.add('sales');
      }

      return modules.toList();
    } catch (e) {
      return [];
    }
  }

  Future<List<UsuarioModel>> getUsers({bool includeClientes = false}) async {
    final response = await _apiService.get(
      '/api/usuarios?exclude_clientes=${includeClientes ? 'false' : 'true'}',
    );
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows
        .whereType<Map<String, dynamic>>()
        .map(UsuarioModel.fromJson)
        .toList();
  }

  Future<List<String>> getRoles() async {
    final response = await _apiService.get('/api/roles');
    final rows = response['data'] is List
        ? response['data'] as List
        : <dynamic>[];
    return rows
        .whereType<Map<String, dynamic>>()
        .map((row) => (row['nombre'] ?? row['rol'] ?? '').toString().trim())
        .where((name) => name.isNotEmpty)
        .toList();
  }

  Future<UsuarioModel?> refreshUser() async {
    try {
      final response = await _apiService.get(AppConstants.meEndpoint);
      final payload = response['data'] is Map<String, dynamic>
          ? response['data'] as Map<String, dynamic>
          : <String, dynamic>{};
      final usuario = UsuarioModel.fromJson(payload);

      await _secureStorage.saveUserData(jsonEncode(usuario.toJson()));
      await _secureStorage.savePermissions(jsonEncode(usuario.permisos));

      return usuario;
    } catch (e) {
      return null;
    }
  }

  Future<void> clearSession() async {
    await _secureStorage.clearAll();
  }

  Future<void> _persistUserSession(UsuarioModel user) async {
    await _secureStorage.saveUserData(jsonEncode(user.toJson()));
    await _secureStorage.savePermissions(jsonEncode(user.permisos));
  }

  String _resolveSessionToken(
    Map<String, dynamic> payload,
    String? setCookieHeader,
  ) {
    final bodyToken = payload['token']?.toString().trim();
    if (bodyToken != null && bodyToken.isNotEmpty) {
      return bodyToken;
    }
    return _extractTokenFromCookieHeader(setCookieHeader) ?? '';
  }

  String? _extractTokenFromCookieHeader(String? setCookieHeader) {
    if (setCookieHeader == null || setCookieHeader.isEmpty) return null;
    final firstPair = setCookieHeader.split(';').first;
    final eqIdx = firstPair.indexOf('=');
    if (eqIdx <= 0 || eqIdx >= firstPair.length - 1) return null;
    return firstPair.substring(eqIdx + 1).trim();
  }

  Future<void> registerCliente(RegisterRequest request) async {
    await _apiService.post(
      AppConstants.registerClienteEndpoint,
      data: request.toJson(),
    );
  }

  Future<RegisterAvailability> checkRegisterAvailability({
    String? documento,
    String? email,
  }) async {
    final params = <String, dynamic>{};
    if (documento != null && documento.isNotEmpty) {
      params['documento'] = documento.replaceAll(RegExp(r'\D'), '');
    }
    if (email != null && email.isNotEmpty) {
      params['email'] = email.trim().toLowerCase();
    }
    final response = await _apiService.get(
      AppConstants.registerAvailabilityEndpoint,
      queryParameters: params,
    );
    final data = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : response;
    return RegisterAvailability.fromJson(data);
  }
}
