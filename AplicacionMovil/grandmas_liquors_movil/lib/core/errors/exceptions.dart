class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic originalError;
  final StackTrace? stackTrace;

  AppException({
    required this.message,
    this.code,
    this.originalError,
    this.stackTrace,
  });

  @override
  String toString() => message;
}

class AuthenticationException extends AppException {
  AuthenticationException({
    required String message,
    String? code,
    dynamic originalError,
    StackTrace? stackTrace,
  }) : super(
    message: message,
    code: code ?? 'AUTH_ERROR',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}

class AuthorizationException extends AppException {
  AuthorizationException({
    required String message,
    String? code,
    dynamic originalError,
    StackTrace? stackTrace,
  }) : super(
    message: message,
    code: code ?? 'AUTHORIZATION_ERROR',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}

class NotFoundException extends AppException {
  NotFoundException({
    required String message,
    String? code,
    dynamic originalError,
    StackTrace? stackTrace,
  }) : super(
    message: message,
    code: code ?? 'NOT_FOUND',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}

class ValidationException extends AppException {
  ValidationException({
    required String message,
    String? code,
    dynamic originalError,
    StackTrace? stackTrace,
  }) : super(
    message: message,
    code: code ?? 'VALIDATION_ERROR',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}

class ServerException extends AppException {
  ServerException({
    required String message,
    String? code,
    dynamic originalError,
    StackTrace? stackTrace,
  }) : super(
    message: message,
    code: code ?? 'SERVER_ERROR',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}

class NetworkException extends AppException {
  NetworkException({
    required String message,
    String? code,
    dynamic originalError,
    StackTrace? stackTrace,
  }) : super(
    message: message,
    code: code ?? 'NETWORK_ERROR',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}

class TokenExpiredException extends AuthenticationException {
  TokenExpiredException({
    String? originalError,
    StackTrace? stackTrace,
  }) : super(
    message: 'Token expirado. Por favor, inicia sesión nuevamente.',
    code: 'TOKEN_EXPIRED',
    originalError: originalError,
    stackTrace: stackTrace,
  );
}
