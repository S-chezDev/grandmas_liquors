import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:grandmas_liquors_movil/core/errors/exceptions.dart';
import 'package:grandmas_liquors_movil/core/utils/role_utils.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';
import 'package:grandmas_liquors_movil/presentation/styles/app_colors.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_form_field.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/app_logo.dart';
import 'package:grandmas_liquors_movil/presentation/widgets/auth/register_form.dart';

class LoginPage extends ConsumerStatefulWidget {
  final int initialTab;

  const LoginPage({super.key, this.initialTab = 0});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;
  late final FocusNode _emailFocus;
  late final FocusNode _passwordFocus;
  bool _isPasswordVisible = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 2,
      vsync: this,
      initialIndex: widget.initialTab.clamp(0, 1),
    );
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) setState(() {});
    });
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    _emailFocus = FocusNode();
    _passwordFocus = FocusNode();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  void _navigateAfterAuth() {
    final user = ref.read(currentUserProvider);
    Navigator.of(context).pushReplacementNamed(homeRouteForUser(user));
  }

  Future<void> _handleLogin() async {
    setState(() => _errorMessage = null);
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Por favor completa todos los campos');
      return;
    }

    try {
      await ref.read(authProvider.notifier).login(email, password);
      if (mounted) _navigateAfterAuth();
    } on AppException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (_) {
      setState(() => _errorMessage = 'Error al iniciar sesión. Intenta de nuevo.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(isLoadingProvider);

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Container(decoration: const BoxDecoration(gradient: AppColors.loginOverlay)),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 460),
                  child: Column(
                    children: [
                      const AppLogo(size: 80),
                      const SizedBox(height: 16),
                      Text(
                        "Grandma's Liqueurs",
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: AppColors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 28),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: AppColors.white.withValues(alpha: 0.96),
                          borderRadius: BorderRadius.circular(AppColors.radiusLg),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 24,
                              offset: Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            TabBar(
                              controller: _tabController,
                              labelColor: AppColors.primaryRed,
                              unselectedLabelColor: AppColors.mutedForeground,
                              indicatorColor: AppColors.primaryRed,
                              tabs: const [
                                Tab(text: 'Iniciar sesión'),
                                Tab(text: 'Registrarse'),
                              ],
                            ),
                            const SizedBox(height: 20),
                            if (_tabController.index == 0)
                              _buildLoginForm(isLoading)
                            else
                              RegisterForm(
                                onSuccess: _navigateAfterAuth,
                                onGoToLogin: () => _tabController.animateTo(0),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginForm(bool isLoading) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AppFormField(
          controller: _emailController,
          focusNode: _emailFocus,
          label: 'Correo electrónico',
          hint: 'correo@ejemplo.com',
          keyboardType: TextInputType.emailAddress,
          enabled: !isLoading,
          prefixIcon: const Icon(Icons.email_outlined, size: 20),
        ),
        const SizedBox(height: 16),
        AppFormField(
          controller: _passwordController,
          focusNode: _passwordFocus,
          label: 'Contraseña',
          obscureText: !_isPasswordVisible,
          enabled: !isLoading,
          prefixIcon: const Icon(Icons.lock_outline, size: 20),
          suffixIcon: IconButton(
            icon: Icon(
              _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
              size: 20,
            ),
            onPressed: () =>
                setState(() => _isPasswordVisible = !_isPasswordVisible),
          ),
          onFieldSubmitted: (_) {
            if (!isLoading) _handleLogin();
          },
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: 16),
          AppFieldError(message: _errorMessage!),
        ],
        const SizedBox(height: 20),
        SizedBox(
          height: 48,
          child: ElevatedButton.icon(
            onPressed: isLoading ? null : _handleLogin,
            icon: isLoading
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.white,
                    ),
                  )
                : const Icon(LucideIcons.logIn, size: 18),
            label: Text(isLoading ? 'Ingresando...' : 'Iniciar sesión'),
          ),
        ),
      ],
    );
  }
}
