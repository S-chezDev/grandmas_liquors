import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _tokenKey = 'jwt_token';
  static const _refreshTokenKey = 'refresh_token';
  static const _userKey = 'user_data';
  static const _permissionsKey = 'user_permissions';

  final FlutterSecureStorage _storage;

  SecureStorageService({
    FlutterSecureStorage? storage,
  }) : _storage = storage ?? const FlutterSecureStorage();

  // Token Management
  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // Refresh Token Management
  Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: _refreshTokenKey, value: token);
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  Future<void> deleteRefreshToken() async {
    await _storage.delete(key: _refreshTokenKey);
  }

  // User Data Management
  Future<void> saveUserData(String userJson) async {
    await _storage.write(key: _userKey, value: userJson);
  }

  Future<String?> getUserData() async {
    return await _storage.read(key: _userKey);
  }

  Future<void> deleteUserData() async {
    await _storage.delete(key: _userKey);
  }

  // Permissions Management
  Future<void> savePermissions(String permissionsJson) async {
    await _storage.write(key: _permissionsKey, value: permissionsJson);
  }

  Future<String?> getPermissions() async {
    return await _storage.read(key: _permissionsKey);
  }

  Future<void> deletePermissions() async {
    await _storage.delete(key: _permissionsKey);
  }

  // Clear All
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }

  // Check if token exists
  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
