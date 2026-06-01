import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors
  static const Color primaryRed = Color(0xFF800020);
  static const Color primaryRedDark = Color(0xFF941434);
  
  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color greyLight = Color(0xFFF5F5F5);
  static const Color greyMedium = Color(0xFF9E9E9E);
  static const Color greyDark = Color(0xFF424242);
  
  // Status Colors
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFFC107);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);
  
  // Semantic Colors
  static const Color activeBackground = white;
  static const Color inactiveBackground = greyLight;
  static const Color disabled = greyMedium;
  static const Color border = Color(0xFFE0E0E0);
  
  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryRed, primaryRedDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
