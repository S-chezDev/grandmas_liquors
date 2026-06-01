import 'package:flutter/foundation.dart';

class AppConstants {
  // API Configuration
  static final String apiBaseUrl = _resolveApiBaseUrl();
  static const Duration apiTimeoutDuration = Duration(seconds: 30);

  // Storage Keys
  static const String tokenKey = 'app_token';
  static const String userKey = 'app_user';
  static const String permissionsKey = 'app_permissions';
  static const String modulesKey = 'app_modules';

  // API Endpoints
  static const String loginEndpoint = '/api/auth/login';
  static const String logoutEndpoint = '/api/auth/logout';
  static const String refreshTokenEndpoint = '/api/auth/refresh';
  static const String meEndpoint = '/api/auth/me';

  // Modules
  static const String moduleConfiguration = 'configuration';
  static const String modulePurchases = 'purchases';
  static const String moduleProduction = 'production';
  static const String moduleSales = 'sales';

  // Permissions
  static const String permissionView = 'view';
  static const String permissionCreate = 'create';
  static const String permissionEdit = 'edit';
  static const String permissionDelete = 'delete';
  static const String permissionApprove = 'approve';

  // Default Values
  static const int pageSize = 20;
  static const int maxRetries = 3;

  // App Info
  static const String appName = 'Grandmas Liquors';
  static const String appVersion = '1.0.0';

  static String _resolveApiBaseUrl() {
    const configuredUrl = String.fromEnvironment('API_BASE_URL');
    if (configuredUrl.isNotEmpty) {
      return configuredUrl;
    }

    if (kIsWeb) {
      return 'http://localhost:3002';
    }

    return 'http://192.168.40.76:3002';
  }
}
