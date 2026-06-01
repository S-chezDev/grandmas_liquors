import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:grandmas_liquors_movil/data/datasources/local/secure_storage.dart';
import 'package:grandmas_liquors_movil/data/datasources/remote/api_service.dart';
import 'package:grandmas_liquors_movil/data/repositories/auth_repository.dart';
import 'package:grandmas_liquors_movil/data/models/auth/auth_models.dart';
import 'package:grandmas_liquors_movil/core/errors/exceptions.dart';

// Providers for dependencies
final secureStorageProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});

final apiServiceProvider = Provider<ApiService>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  return ApiService(secureStorage: secureStorage);
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  final secureStorage = ref.watch(secureStorageProvider);
  return AuthRepository(apiService: apiService, secureStorage: secureStorage);
});

// State classes
class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final UsuarioModel? usuario;
  final List<String> permisos;
  final List<String> modulos;
  final String? errorMessage;

  AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.usuario,
    this.permisos = const [],
    this.modulos = const [],
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    UsuarioModel? usuario,
    List<String>? permisos,
    List<String>? modulos,
    String? errorMessage,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      usuario: usuario ?? this.usuario,
      permisos: permisos ?? this.permisos,
      modulos: modulos ?? this.modulos,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

// Auth State Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;

  AuthNotifier(this._authRepository) : super(AuthState()) {
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    state = state.copyWith(isLoading: true);
    try {
      final hasToken = await _authRepository.hasValidToken();
      if (hasToken) {
        final usuario = await _authRepository.getCurrentUser();
        final permisos = await _authRepository.getPermissionNames();
        final modulos = await _authRepository.getAccessibleModules();

        state = state.copyWith(
          isLoading: false,
          isAuthenticated: true,
          usuario: usuario,
          permisos: permisos,
          modulos: modulos,
        );
      } else {
        state = state.copyWith(isLoading: false, isAuthenticated: false);
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: false,
        errorMessage: 'Error al inicializar sesión',
      );
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final response = await _authRepository.login(
        email: email,
        password: password,
      );

      final permisos = response.usuario.permisos;
      final modulos = await _authRepository.getAccessibleModules();

      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        usuario: response.usuario,
        permisos: permisos,
        modulos: modulos,
        errorMessage: null,
      );
    } on AppException catch (e) {
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: false,
        errorMessage: e.message,
      );
      rethrow;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: false,
        errorMessage: 'Error al iniciar sesión',
      );
      rethrow;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    try {
      await _authRepository.logout();
      state = AuthState();
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Error al cerrar sesión',
      );
    }
  }

  Future<void> refreshUser() async {
    try {
      final usuario = await _authRepository.refreshUser();
      if (usuario != null) {
        final permisos = usuario.permisos;
        final modulos = await _authRepository.getAccessibleModules();

        state = state.copyWith(
          usuario: usuario,
          permisos: permisos,
          modulos: modulos,
        );
      }
    } catch (e) {
      state = state.copyWith(errorMessage: 'Error al actualizar usuario');
    }
  }

  bool hasPermission(String modulo, String accion) {
    return state.permisos.contains(accion);
  }

  bool hasModuleAccess(String modulo) {
    return state.modulos.contains(modulo);
  }

  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}

// Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return AuthNotifier(authRepository);
});

// Convenient selectors
final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isAuthenticated;
});

final currentUserProvider = Provider<UsuarioModel?>((ref) {
  return ref.watch(authProvider).usuario;
});

final userPermissionsProvider = Provider<List<String>>((ref) {
  return ref.watch(authProvider).permisos;
});

final userModulesProvider = Provider<List<String>>((ref) {
  return ref.watch(authProvider).modulos;
});

final isLoadingProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isLoading;
});
