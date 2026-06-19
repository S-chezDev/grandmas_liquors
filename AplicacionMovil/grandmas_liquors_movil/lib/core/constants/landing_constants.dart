import 'package:grandmas_liquors_movil/core/constants/app_constants.dart';

class LandingCarouselSlide {
  final String imagePath;
  final String titulo;
  final String subtitulo;

  const LandingCarouselSlide({
    required this.imagePath,
    required this.titulo,
    required this.subtitulo,
  });

  String get imageUrl => '${AppConstants.apiBaseUrl}$imagePath';
}

class LandingConstants {
  static const String brandName = "Grandma's Liqueurs";
  static const String brandTagline = 'Licores Premium';

  static const String contactoDireccion = 'Calle 104 # 79D – 65';
  static const String contactoCiudad = 'Medellín, Laureles';
  static const String contactoTelefono = '3246102339';
  static const String contactoTelefonoDisplay = '324 610 2339';
  static const String contactoEmail = 'info@grandmasliqueurs.com';
  static const String contactoEmailVentas = 'ventas@grandmasliqueurs.com';

  static const String checkoutCuentaTransferencia = '0027437961';
  static const String checkoutQrPath = '/qrs/qrs.jpeg';

  static String get checkoutQrUrl => '${AppConstants.apiBaseUrl}$checkoutQrPath';

  static const String productImageFallback = '/uploads/productos/seed_01.webp';

  static const List<LandingCarouselSlide> carouselSlides = [
    LandingCarouselSlide(
      imagePath: '/uploads/carousel/carousel_01.webp',
      titulo: 'Licores Premium',
      subtitulo: 'La mejor selección de bebidas en Medellín',
    ),
    LandingCarouselSlide(
      imagePath: '/uploads/carousel/carousel_02.webp',
      titulo: 'Rones Añejos',
      subtitulo: 'Calidad y tradición en cada botella',
    ),
    LandingCarouselSlide(
      imagePath: '/uploads/carousel/carousel_03.webp',
      titulo: 'Whiskies Importados',
      subtitulo: 'Experiencias únicas para paladares exigentes',
    ),
    LandingCarouselSlide(
      imagePath: '/uploads/carousel/carousel_04.webp',
      titulo: 'Vinos Selectos',
      subtitulo: 'De las mejores bodegas del mundo',
    ),
    LandingCarouselSlide(
      imagePath: '/uploads/carousel/carousel_05.webp',
      titulo: 'Tequilas y Mezcales',
      subtitulo: 'Agave auténtico en cada sorbo',
    ),
    LandingCarouselSlide(
      imagePath: '/uploads/carousel/carousel_06.webp',
      titulo: 'Coctelería Premium',
      subtitulo: 'Ingredientes para crear momentos únicos',
    ),
  ];
}
