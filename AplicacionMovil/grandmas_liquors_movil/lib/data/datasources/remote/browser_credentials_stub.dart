import 'package:dio/dio.dart';

/// No-op para plataformas que no son Flutter Web (Android, iOS, Desktop).
/// En esas plataformas se utiliza `Authorization: Bearer [token]`.
void enableBrowserCredentials(Dio dio) {}
