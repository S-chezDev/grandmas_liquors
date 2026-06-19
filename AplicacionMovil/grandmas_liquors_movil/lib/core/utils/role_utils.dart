import 'package:grandmas_liquors_movil/data/models/auth/auth_models.dart';

bool isCliente(UsuarioModel? user) =>
    (user?.rol ?? '').toLowerCase() == 'cliente';

String homeRouteForUser(UsuarioModel? user) =>
    isCliente(user) ? '/client/catalog' : '/home';
