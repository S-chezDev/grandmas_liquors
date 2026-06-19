import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:grandmas_liquors_movil/core/config/theme/app_theme.dart';
import 'package:grandmas_liquors_movil/presentation/pages/access/access_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/client/client_catalog_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/client/client_pedidos_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/client/client_profile_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/home/home_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/login/login_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/sales/abonos_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/sales/domicilios_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/sales/pedidos_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/sales/ventas_page.dart';
import 'package:grandmas_liquors_movil/presentation/pages/splash/splash_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Grandmas Liquors',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: const SplashPage(),
      routes: {
        '/splash': (context) => const SplashPage(),
        '/login': (context) => const LoginPage(),
        '/home': (context) => const HomePage(),
        '/client/catalog': (context) => const ClientCatalogPage(),
        '/client/pedidos': (context) => const ClientPedidosPage(),
        '/client/profile': (context) => const ClientProfilePage(),
        '/access': (context) => const AccessPage(),
        '/sales/ventas': (context) => const VentasPage(),
        '/sales/abonos': (context) => const AbonosPage(),
        '/sales/pedidos': (context) => const PedidosPage(),
        '/sales/domicilios': (context) => const DomiciliosPage(),
      },
    );
  }
}
