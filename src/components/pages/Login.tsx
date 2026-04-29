import React, { useState } from 'react';
import { Card } from '../Card';
import { Form, FormField, FormActions } from '../Form';
import { Button } from '../Button';
import { LogIn, UserPlus, KeyRound } from 'lucide-react';
import { Modal } from '../Modal';
import { AlertDialog } from '../AlertDialog';
import { auth } from '../../services/api';
import type { AuthLoginResult } from '../AuthContext';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<AuthLoginResult>;
  defaultTab?: 'login' | 'register';
  embedded?: boolean;
  onAuthSuccess?: () => void;
}

export function Login({ onLogin, defaultTab = 'login', embedded = false, onAuthSuccess }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Estados para alertas
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'info' as 'warning' | 'info' | 'success' | 'danger',
    onConfirm: () => {}
  });
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    tipoDocumento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    documento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: '',
    estado: 'Activo' as 'Activo' | 'Inactivo',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await onLogin(loginData.email, loginData.password);

    if (result.success) {
      setAlertState({
        isOpen: true,
        title: 'Bienvenido',
        description: 'Inicio de sesión exitoso.',
        type: 'success',
        onConfirm: () => {}
      });
      
      // Cerrar alerta y hacer login automáticamente después de 3 segundos
      setTimeout(() => {
        setAlertState((prev: any) => ({ ...prev, isOpen: false }));
        onAuthSuccess?.();
      }, 1500);
    } else {
      const fallbackMessage = 'Credenciales incorrectas. Por favor verifica tu email y contraseña.';
      const backendMessage = result.message?.trim() || fallbackMessage;
      setAlertState({
        isOpen: true,
        title: 'Error de autenticación',
        description: backendMessage,
        type: 'danger',
        onConfirm: () => {}
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = {
      tipoDocumento: registerData.tipoDocumento,
      documento: registerData.documento.trim(),
      nombre: registerData.nombre.trim(),
      apellido: registerData.apellido.trim(),
      telefono: registerData.telefono.replace(/\D/g, '').trim(),
      direccion: registerData.direccion.trim(),
      email: registerData.email.trim().toLowerCase(),
      estado: 'Activo' as const,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    };

    const requiredFields: Array<{ key: keyof typeof trimmed; label: string }> = [
      { key: 'documento', label: 'Número de Documento' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'direccion', label: 'Dirección' },
      { key: 'email', label: 'Correo Electrónico' },
      { key: 'password', label: 'Contraseña' },
    ];

    const missingField = requiredFields.find((field) => !String(trimmed[field.key] ?? '').trim());
    if (missingField) {
      setAlertState({
        isOpen: true,
        title: 'Error en el registro',
        description: `El campo "${missingField.label}" es obligatorio.`,
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }

    if (trimmed.telefono.length < 7 || trimmed.telefono.length > 15) {
      setAlertState({
        isOpen: true,
        title: 'Error en el registro',
        description: 'El teléfono debe tener entre 7 y 15 dígitos numéricos.',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }

    if (trimmed.password !== trimmed.confirmPassword) {
      setAlertState({
        isOpen: true,
        title: 'Error en el registro',
        description: 'Las contraseñas no coinciden',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }

    try {
      await auth.registerCliente({
        tipoDocumento: trimmed.tipoDocumento,
        documento: trimmed.documento,
        nombre: trimmed.nombre,
        apellido: trimmed.apellido,
        telefono: trimmed.telefono,
        direccion: trimmed.direccion,
        email: trimmed.email,
        estado: trimmed.estado,
        password: trimmed.password,
      });

      setAlertState({
        isOpen: true,
        title: 'Registro exitoso',
        description: `Registro exitoso para ${trimmed.nombre} ${trimmed.apellido}\n\nTu cuenta ya fue creada y quedó con rol Cliente.`,
        type: 'success',
        onConfirm: () => {}
      });

      setTimeout(() => {
        setAlertState((prev: any) => ({ ...prev, isOpen: false }));
        setActiveTab('login');
        setLoginData({ email: trimmed.email, password: '' });
      }, 3000);
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: 'Error en el registro',
        description: error?.message || 'No fue posible registrar el cliente. Verifica la información e intenta nuevamente.',
        type: 'danger',
        onConfirm: () => {}
      });
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si el email existe
    if (resetEmail.includes('@')) {
      setAlertState({
        isOpen: true,
        title: 'Enlace enviado',
        description: `Se ha enviado un enlace de restablecimiento de contraseña a ${resetEmail}\n\nPor favor revisa tu correo electrónico.`,
        type: 'success',
        onConfirm: () => {
          setIsResetPasswordOpen(false);
          setResetEmail('');
        }
      });
    } else {
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'No existe una cuenta asociada a este correo electrónico.',
        type: 'danger',
        onConfirm: () => {}
      });
    }
  };

  const containerClassName = embedded
    ? 'w-full'
    : 'min-h-screen bg-background flex items-center justify-center p-6';
  const innerClassName = embedded ? 'w-full' : 'w-full max-w-md';

  return (
    <div className={containerClassName}>
      <div className={innerClassName}>
        {!embedded && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <h1 className="text-primary">Grandma's Liqueurs</h1>
            <p className="text-muted-foreground">Sistema de Gestión</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'login' 
                ? 'bg-white shadow-sm text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'register' 
                ? 'bg-white shadow-sm text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Registrarse
          </button>
        </div>

        {activeTab === 'login' && (
          embedded ? (
            <div className="w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LogIn className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Bienvenido</h3>
                  <p className="text-sm text-muted-foreground">Ingresa tus credenciales</p>
                </div>
              </div>

              <Form onSubmit={handleLogin}>
                <FormField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={(value) => setLoginData({ ...loginData, email: value as string })}
                  placeholder="usuario@example.com"
                  required
                />
                
                <FormField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={(value) => setLoginData({ ...loginData, password: value as string })}
                  placeholder="••••••••"
                  required
                />

                <FormActions>
                  <Button type="submit" className="w-full" icon={<LogIn className="w-5 h-5" />}>
                    Iniciar Sesión
                  </Button>
                </FormActions>
              </Form>

              {/* Enlace de restablecer contraseña */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Credenciales de ejemplo */}
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <p className="text-sm mb-2">Credenciales de prueba (si están cargadas en BD):</p>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p><strong>Administrador:</strong> admin@grandmas.com / admin123</p>
                  <p><strong>Asesor:</strong> asesor@grandmas.com / asesor123</p>
                  <p><strong>Repartidor:</strong> repartidor@grandmas.com / repartidor123</p>
                  <p><strong>Cliente:</strong> cliente@grandmas.com / cliente123</p>
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3>Bienvenido</h3>
                <p className="text-sm text-muted-foreground">Ingresa tus credenciales</p>
              </div>
            </div>

            <Form onSubmit={handleLogin}>
              <FormField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={loginData.email}
                onChange={(value) => setLoginData({ ...loginData, email: value as string })}
                placeholder="usuario@example.com"
                required
              />
              
              <FormField
                label="Contraseña"
                name="password"
                type="password"
                value={loginData.password}
                onChange={(value) => setLoginData({ ...loginData, password: value as string })}
                placeholder="••••••••"
                required
              />

              <FormActions>
                <Button type="submit" className="w-full" icon={<LogIn className="w-5 h-5" />}>
                  Iniciar Sesión
                </Button>
              </FormActions>
            </Form>

            {/* Enlace de restablecer contraseña */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsResetPasswordOpen(true)}
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Credenciales de ejemplo */}
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <p className="text-sm mb-2">Credenciales de prueba (si están cargadas en BD):</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Administrador:</strong> admin@grandmas.com / admin123</p>
                <p><strong>Asesor:</strong> asesor@grandmas.com / asesor123</p>
                <p><strong>Repartidor:</strong> repartidor@grandmas.com / repartidor123</p>
                <p><strong>Cliente:</strong> cliente@grandmas.com / cliente123</p>
              </div>
            </div>
            </Card>
          )
        )}

        {activeTab === 'register' && (
          embedded ? (
            <div className="w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Crear Cuenta</h3>
                  <p className="text-sm text-muted-foreground">Completa el formulario de registro</p>
                </div>
              </div>

              <Form onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Tipo de Documento"
                    name="tipoDocumento"
                    type="select"
                    value={registerData.tipoDocumento}
                    onChange={(value) => setRegisterData({ ...registerData, tipoDocumento: value as any })}
                    options={[
                      { value: 'CC', label: 'Cédula de Ciudadanía' },
                      { value: 'CE', label: 'Cédula de Extranjería' },
                      { value: 'TI', label: 'Tarjeta de Identidad' },
                      { value: 'Pasaporte', label: 'Pasaporte' }
                    ]}
                    required
                  />
                  
                  <FormField
                    label="Número de Documento"
                    name="documento"
                    value={registerData.documento}
                    onChange={(value) => setRegisterData({ ...registerData, documento: value as string })}
                    placeholder="1234567890"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Nombre"
                    name="nombre"
                    value={registerData.nombre}
                    onChange={(value) => setRegisterData({ ...registerData, nombre: value as string })}
                    placeholder="Juan"
                    required
                  />
                  
                  <FormField
                    label="Apellido"
                    name="apellido"
                    value={registerData.apellido}
                    onChange={(value) => setRegisterData({ ...registerData, apellido: value as string })}
                    placeholder="Pérez"
                    required
                  />
                </div>
                
                <FormField
                  label="Teléfono"
                  name="telefono"
                  value={registerData.telefono}
                  onChange={(value) => setRegisterData({ ...registerData, telefono: value as string })}
                  placeholder="3001234567"
                  required
                />

                <FormField
                  label="Dirección"
                  name="direccion"
                  value={registerData.direccion}
                  onChange={(value) => setRegisterData({ ...registerData, direccion: value as string })}
                  placeholder="Calle 104 # 79D - 65"
                  required
                />
                
                <FormField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={(value) => setRegisterData({ ...registerData, email: value as string })}
                  placeholder="usuario@example.com"
                  required
                />
                
                <FormField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={(value) => setRegisterData({ ...registerData, password: value as string })}
                  placeholder="••••••••"
                  required
                />
                
                <FormField
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(value) => setRegisterData({ ...registerData, confirmPassword: value as string })}
                  placeholder="••••••••"
                  required
                />

                <div className="p-4 bg-accent rounded-lg mb-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota:</strong> Tu cuenta será registrada como Cliente por defecto. 
                    Un administrador revisará tu solicitud y asignará los permisos correspondientes si requieres otro rol.
                  </p>
                </div>

                <FormActions>
                  <Button type="submit" className="w-full" icon={<UserPlus className="w-5 h-5" />}>
                    Crear Cuenta
                  </Button>
                </FormActions>
              </Form>
            </div>
          ) : (
            <Card>
              <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3>Crear Cuenta</h3>
                <p className="text-sm text-muted-foreground">Completa el formulario de registro</p>
              </div>
            </div>

            <Form onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Tipo de Documento"
                  name="tipoDocumento"
                  type="select"
                  value={registerData.tipoDocumento}
                  onChange={(value) => setRegisterData({ ...registerData, tipoDocumento: value as any })}
                  options={[
                    { value: 'CC', label: 'Cédula de Ciudadanía' },
                    { value: 'CE', label: 'Cédula de Extranjería' },
                    { value: 'TI', label: 'Tarjeta de Identidad' },
                    { value: 'Pasaporte', label: 'Pasaporte' }
                  ]}
                  required
                />
                
                <FormField
                  label="Número de Documento"
                  name="documento"
                  value={registerData.documento}
                  onChange={(value) => setRegisterData({ ...registerData, documento: value as string })}
                  placeholder="1234567890"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Nombre"
                  name="nombre"
                  value={registerData.nombre}
                  onChange={(value) => setRegisterData({ ...registerData, nombre: value as string })}
                  placeholder="Juan"
                  required
                />
                
                <FormField
                  label="Apellido"
                  name="apellido"
                  value={registerData.apellido}
                  onChange={(value) => setRegisterData({ ...registerData, apellido: value as string })}
                  placeholder="Pérez"
                  required
                />
              </div>
              
              <FormField
                label="Teléfono"
                name="telefono"
                value={registerData.telefono}
                onChange={(value) => setRegisterData({ ...registerData, telefono: value as string })}
                placeholder="3001234567"
                required
              />

              <FormField
                label="Dirección"
                name="direccion"
                value={registerData.direccion}
                onChange={(value) => setRegisterData({ ...registerData, direccion: value as string })}
                placeholder="Calle 104 # 79D - 65"
                required
              />
              
              <FormField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={registerData.email}
                onChange={(value) => setRegisterData({ ...registerData, email: value as string })}
                placeholder="usuario@example.com"
                required
              />
              
              <FormField
                label="Contraseña"
                name="password"
                type="password"
                value={registerData.password}
                onChange={(value) => setRegisterData({ ...registerData, password: value as string })}
                placeholder="••••••••"
                required
              />
              
              <FormField
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={registerData.confirmPassword}
                onChange={(value) => setRegisterData({ ...registerData, confirmPassword: value as string })}
                placeholder="••••••••"
                required
              />

              <div className="p-4 bg-accent rounded-lg mb-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Nota:</strong> Tu cuenta será registrada como Cliente por defecto. 
                  Un administrador revisará tu solicitud y asignará los permisos correspondientes si requieres otro rol.
                </p>
              </div>

              <FormActions>
                <Button type="submit" className="w-full" icon={<UserPlus className="w-5 h-5" />}>
                  Crear Cuenta
                </Button>
              </FormActions>
            </Form>
            </Card>
          )
        )}

        {!embedded && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Calle 104 # 79D – 65, Medellín, Laureles</p>
            <p>Tel: 324 610 2339</p>
          </div>
        )}
      </div>

      {/* Modal de Restablecer Contraseña */}
      <Modal
        isOpen={isResetPasswordOpen}
        onClose={() => {
          setIsResetPasswordOpen(false);
          setResetEmail('');
        }}
        title="Restablecer Contraseña"
        size="md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>
        </div>

        <Form onSubmit={handleResetPassword}>
          <FormField
            label="Correo Electrónico"
            name="resetEmail"
            type="email"
            value={resetEmail}
            onChange={(value) => setResetEmail(value as string)}
            placeholder="usuario@example.com"
            required
          />

          <FormActions>
            <Button variant="outline" onClick={() => {
              setIsResetPasswordOpen(false);
              setResetEmail('');
            }}>
              Cancelar
            </Button>
            <Button type="submit" icon={<KeyRound className="w-5 h-5" />}>
              Enviar Enlace
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* AlertDialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
        onConfirm={alertState.onConfirm}
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
        confirmText="Aceptar"
        cancelText="Cerrar"
      />
    </div>
  );
}