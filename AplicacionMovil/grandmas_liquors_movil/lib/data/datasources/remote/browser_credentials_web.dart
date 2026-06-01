import 'package:dio/dio.dart';
import 'package:dio/browser.dart';

/// Habilita el envío de cookies (credenciales) en las peticiones del
/// navegador. Esto es necesario porque el backend autentica vía la
/// cookie HttpOnly `gl_session`, que no puede ser leída desde JS.
void enableBrowserCredentials(Dio dio) {
  final adapter = BrowserHttpClientAdapter();
  adapter.withCredentials = true;
  dio.httpClientAdapter = adapter;
}
