import 'package:flutter/material.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.primaryRed,
      scaffoldBackgroundColor: AppColors.white,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryRed,
        onPrimary: AppColors.white,
        secondary: AppColors.secondary,
        onSecondary: AppColors.primaryRed,
        error: AppColors.destructive,
        onError: AppColors.white,
        surface: AppColors.white,
        onSurface: AppColors.foreground,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.white,
        foregroundColor: AppColors.foreground,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: AppColors.foreground,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(fontSize: 28, fontWeight: FontWeight.w600, color: AppColors.foreground),
        headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.foreground),
        headlineSmall: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.foreground),
        titleLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.foreground),
        titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.foreground),
        titleSmall: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.foreground),
        bodyLarge: TextStyle(fontSize: 16, color: AppColors.foreground),
        bodyMedium: TextStyle(fontSize: 14, color: AppColors.mutedForeground),
        bodySmall: TextStyle(fontSize: 12, color: AppColors.mutedForeground),
        labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.foreground),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryRed,
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusLg),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.foreground,
          backgroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusLg),
          ),
          side: const BorderSide(color: AppColors.borderColor),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.inputBackground,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          borderSide: const BorderSide(color: AppColors.borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          borderSide: const BorderSide(color: AppColors.borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          borderSide: const BorderSide(color: AppColors.primaryRed, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          borderSide: const BorderSide(color: AppColors.destructive),
        ),
        labelStyle: const TextStyle(color: AppColors.mutedForeground),
        hintStyle: const TextStyle(color: AppColors.mutedForeground),
      ),
      cardTheme: CardThemeData(
        color: AppColors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          side: const BorderSide(color: AppColors.borderColor),
        ),
      ),
      dividerTheme: const DividerThemeData(color: AppColors.borderColor, thickness: 1),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.primaryRed,
        foregroundColor: AppColors.white,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.foreground,
        contentTextStyle: const TextStyle(color: AppColors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
        ),
      ),
    );
  }
}
