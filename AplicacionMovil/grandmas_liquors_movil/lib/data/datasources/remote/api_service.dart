import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:grandmas_liquors_movil/data/datasources/local/secure_storage.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/errors/exceptions.dart';
import 'browser_credentials_stub.dart'
    if (dart.library.html) 'browser_credentials_web.dart';

class ApiService {
  late final Dio _dio;
  final SecureStorageService _secureStorage;

  ApiService({SecureStorageService? secureStorage})
    : _secureStorage = secureStorage ?? SecureStorageService() {
    _initializeDio();
  }

  void _initializeDio() {
    final baseUrl = AppConstants.apiBaseUrl;

    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: AppConstants.apiTimeoutDuration,
        receiveTimeout: AppConstants.apiTimeoutDuration,
        sendTimeout: AppConstants.apiTimeoutDuration,
        contentType: 'application/json',
        responseType: ResponseType.json,
        // En navegador, indicamos a Dio que envíe credenciales (cookies)
        // para que el backend reciba la cookie de sesión `gl_session`.
        extra: kIsWeb ? const {'withCredentials': true} : const {},
      ),
    );

    if (kIsWeb) {
      enableBrowserCredentials(_dio);
    }

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onResponse: _onResponse,
        onError: _onError,
      ),
    );

    print('[API] Base URL: $baseUrl');
  }

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    try {
      final token = await _secureStorage.getToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      print('[API Request] ${options.method.toUpperCase()} ${options.path}');
      handler.next(options);
    } catch (e) {
      handler.reject(
        DioException(
          requestOptions: options,
          error: NetworkException(
            message: 'Error al procesar la solicitud',
            originalError: e,
          ),
        ),
      );
    }
  }

  void _onResponse(Response response, ResponseInterceptorHandler handler) {
    print(
      '[API Response] ${response.statusCode} ${response.requestOptions.path}',
    );
    handler.next(response);
  }

  Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    print('[API Error] ${error.response?.statusCode} - ${error.message}');

    if (error.response?.statusCode == 401) {
      // Token expired - try to refresh
      try {
        await _refreshToken();
        // Retry original request
        final response = await _dio.request(
          error.requestOptions.path,
          data: error.requestOptions.data,
          queryParameters: error.requestOptions.queryParameters,
          options: Options(method: error.requestOptions.method),
        );
        return handler.resolve(response);
      } catch (e) {
        return handler.reject(
          DioException(
            requestOptions: error.requestOptions,
            error: TokenExpiredException(),
          ),
        );
      }
    }

    handler.next(error);
  }

  Future<void> _refreshToken() async {
    try {
      final refreshToken = await _secureStorage.getRefreshToken();
      if (refreshToken == null) throw Exception('No refresh token available');

      final response = await _dio.post(
        AppConstants.refreshTokenEndpoint,
        data: {'refreshToken': refreshToken},
        options: Options(headers: {'Authorization': 'Bearer $refreshToken'}),
      );

      final newToken = response.data['token'];
      await _secureStorage.saveToken(newToken);
    } catch (e) {
      await _secureStorage.clearAll();
      rethrow;
    }
  }

  // GET Request
  Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getRaw(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
      );
      return _handleRawResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // POST Request
  Future<Map<String, dynamic>> post(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    try {
      final response = await _dio.post(endpoint, data: data);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> postRaw(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    try {
      final response = await _dio.post(endpoint, data: data);
      return _handleRawResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // PUT Request
  Future<Map<String, dynamic>> put(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    try {
      final response = await _dio.put(endpoint, data: data);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // PATCH Request
  Future<Map<String, dynamic>> patch(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    try {
      final response = await _dio.patch(endpoint, data: data);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // DELETE Request
  Future<Map<String, dynamic>> delete(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    try {
      final response = await _dio.delete(endpoint, data: data);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Map<String, dynamic> _handleResponse(Response response) {
    if (response.statusCode! >= 200 && response.statusCode! < 300) {
      return response.data is Map<String, dynamic>
          ? response.data
          : {'data': response.data};
    } else {
      throw ServerException(
        message: response.data['message'] ?? 'Error del servidor',
        code: response.statusCode.toString(),
      );
    }
  }

  Map<String, dynamic> _handleRawResponse(Response response) {
    final data = _handleResponse(response);
    final setCookie = response.headers.map['set-cookie'];
    return {
      ...data,
      'set_cookie': (setCookie != null && setCookie.isNotEmpty)
          ? setCookie.first
          : null,
    };
  }

  AppException _handleError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout) {
      return NetworkException(
        message: 'Tiempo de conexión agotado. Por favor, intenta de nuevo.',
        originalError: error,
      );
    } else if (error.type == DioExceptionType.connectionError) {
      final isBrowserNetworkError =
          error.error == null &&
          error.message != null &&
          error.message!.contains('XMLHttpRequest');

      return NetworkException(
        message: isBrowserNetworkError
            ? 'No se pudo conectar con la API desde el navegador. Verifica la URL del backend y la configuración CORS.'
            : 'Error de conexión. Por favor, verifica tu conexión a internet.',
        originalError: error,
      );
    } else if (error.response != null) {
      switch (error.response!.statusCode) {
        case 400:
          return ValidationException(
            message: error.response!.data?['message'] ?? 'Datos inválidos',
            code: '400',
            originalError: error,
          );
        case 401:
          return AuthenticationException(
            message: error.response!.data?['message'] ?? 'No autorizado',
            code: '401',
            originalError: error,
          );
        case 403:
          return AuthorizationException(
            message: error.response!.data?['message'] ?? 'Acceso denegado',
            code: '403',
            originalError: error,
          );
        case 404:
          return NotFoundException(
            message:
                error.response!.data?['message'] ?? 'Recurso no encontrado',
            code: '404',
            originalError: error,
          );
        case 500:
        case 502:
        case 503:
          return ServerException(
            message: error.response!.data?['message'] ?? 'Error del servidor',
            code: error.response!.statusCode.toString(),
            originalError: error,
          );
        default:
          return AppException(
            message: error.response!.data?['message'] ?? 'Error desconocido',
            code: error.response!.statusCode.toString(),
            originalError: error,
          );
      }
    }

    return AppException(
      message: error.message ?? 'No se pudo conectar con la API',
      originalError: error,
    );
  }

  void setToken(String token) async {
    await _secureStorage.saveToken(token);
  }

  Future<void> clearToken() async {
    await _secureStorage.deleteToken();
  }

  Dio get dio => _dio;
}
