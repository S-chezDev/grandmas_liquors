class LoginRequest {
  final String email;
  final String password;
  final bool rememberMe;

  LoginRequest({
    required this.email,
    required this.password,
    this.rememberMe = true,
  });

  Map<String, dynamic> toJson() => {
    'email': email,
    'password': password,
    'rememberMe': rememberMe,
  };

  factory LoginRequest.fromJson(Map<String, dynamic> json) => LoginRequest(
    email: json['email'] ?? '',
    password: json['password'] ?? '',
    rememberMe: json['rememberMe'] == true,
  );
}

class LoginResponse {
  final String token;
  final UsuarioModel usuario;

  LoginResponse({required this.token, required this.usuario});

  Map<String, dynamic> toJson() => {
    'token': token,
    'usuario': usuario.toJson(),
  };

  factory LoginResponse.fromJson(Map<String, dynamic> json) => LoginResponse(
    token: json['token'] ?? '',
    usuario: UsuarioModel.fromJson(json['usuario'] ?? {}),
  );
}

class UsuarioModel {
  final int id;
  final String nombre;
  final String email;
  final String? apellido;
  final String? telefono;
  final String rol;
  final int? rolId;
  final int? clienteId;
  final List<String> permisos;

  UsuarioModel({
    required this.id,
    required this.nombre,
    required this.email,
    this.apellido,
    this.telefono,
    required this.rol,
    required this.permisos,
    this.rolId,
    this.clienteId,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre': nombre,
    'email': email,
    'apellido': apellido,
    'telefono': telefono,
    'rol': rol,
    'rol_id': rolId,
    'cliente_id': clienteId,
    'permisos': permisos,
  };

  factory UsuarioModel.fromJson(Map<String, dynamic> json) {
    final permisosRaw = json['permisos'];
    final permisos = <String>[];
    if (permisosRaw is List) {
      for (final item in permisosRaw) {
        if (item == null) continue;
        permisos.add(item.toString());
      }
    }

    return UsuarioModel(
      id: (json['id'] as num?)?.toInt() ?? 0,
      nombre: json['nombre']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      apellido: json['apellido']?.toString(),
      telefono: json['telefono']?.toString(),
      rol: json['rol']?.toString() ?? '',
      rolId: (json['rol_id'] as num?)?.toInt(),
      clienteId: (json['cliente_id'] as num?)?.toInt(),
      permisos: permisos,
    );
  }
}

class RegisterRequest {
  final String tipoDocumento;
  final String numeroDocumento;
  final String nombre;
  final String apellido;
  final String direccion;
  final String telefono;
  final String email;
  final String password;

  RegisterRequest({
    required this.tipoDocumento,
    required this.numeroDocumento,
    required this.nombre,
    required this.apellido,
    required this.direccion,
    required this.telefono,
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() => {
    'tipoDocumento': tipoDocumento,
    'numeroDocumento': numeroDocumento,
    'nombre': nombre,
    'apellido': apellido,
    'direccion': direccion,
    'telefono': telefono,
    'email': email.trim().toLowerCase(),
    'password': password,
  };
}

class RegisterAvailability {
  final bool documentoExists;
  final bool emailExists;

  RegisterAvailability({
    required this.documentoExists,
    required this.emailExists,
  });

  factory RegisterAvailability.fromJson(Map<String, dynamic> json) =>
      RegisterAvailability(
        documentoExists: json['documentoExists'] == true,
        emailExists: json['emailExists'] == true,
      );
}
