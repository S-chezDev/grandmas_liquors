import 'package:flutter/material.dart';

/// Tokens alineados con `frontend/src/styles/globals.css`.
class AppColors {
  static const Color primaryRed = Color(0xFF800020);
  static const Color primaryRedDark = Color(0xFF941434);
  static const Color secondary = Color(0xFFF5E6E8);
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF252525);
  static const Color foreground = Color(0xFF252525);
  static const Color muted = Color(0xFFECECF0);
  static const Color mutedForeground = Color(0xFF717182);
  static const Color accent = Color(0xFFE9EBEF);
  static const Color inputBackground = Color(0xFFF3F3F5);
  static const Color destructive = Color(0xFFD4183D);
  static const Color borderColor = Color.fromRGBO(0, 0, 0, 0.1);

  static const Color success = Color(0xFF15803D);
  static const Color successBg = Color(0xFFF0FDF4);
  static const Color warning = Color(0xFFA16207);
  static const Color warningBg = Color(0xFFFEF9C3);
  static const Color error = Color(0xFFD4183D);
  static const Color errorBg = Color(0xFFFEF2F2);
  static const Color info = Color(0xFF1D4ED8);
  static const Color infoBg = Color(0xFFEFF6FF);

  /// Alias de compatibilidad con widgets existentes.
  static const Color greyDark = mutedForeground;
  static const Color greyMedium = mutedForeground;
  static const Color greyLight = accent;

  static const double radiusSm = 6;
  static const double radiusMd = 8;
  static const double radiusLg = 10;
  static const double radiusXl = 14;

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryRed, primaryRedDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient loginOverlay = LinearGradient(
    colors: [
      Color(0xE6800020),
      Color(0xCC800020),
      Color(0xCC000000),
    ],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static Color estadoBg(String estado) {
    final e = estado.toLowerCase();
    if (e.contains('cancel')) return errorBg;
    if (e.contains('complet') || e.contains('entreg') || e.contains('verif') || e.contains('finaliz') || e.contains('aplic')) {
      return successBg;
    }
    if (e.contains('proceso') || e.contains('camino') || e.contains('pend')) {
      return warningBg;
    }
    return accent;
  }

  static Color estadoFg(String estado) {
    final e = estado.toLowerCase();
    if (e.contains('cancel')) return error;
    if (e.contains('complet') || e.contains('entreg') || e.contains('verif') || e.contains('finaliz') || e.contains('aplic')) {
      return success;
    }
    if (e.contains('proceso') || e.contains('camino') || e.contains('pend')) {
      return warning;
    }
    return mutedForeground;
  }
}
