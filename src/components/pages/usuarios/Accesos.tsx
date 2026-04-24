import React, { useMemo, useState } from 'react';
import { Card } from '../../Card';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { LogIn, Lock, Mail, CheckCircle2, Circle } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { useAuth } from '../../AuthContext';
import { auth } from '../../../services/api';

export function Accesos() {
  const [activeTab, setActiveTab] = useState<'login' | 'change-password' | 'reset'>('login');
  const { login } = useAuth();
  const { showAlert, AlertComponent } = useAlertDialog();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [changePasswordData, setChangePasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [resetData, setResetData] = useState({ email: '' });

  const passwordChecks = useMemo(() => {
    const value = String(changePasswordData.newPassword || '');
    return {
      minLength: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
    };
  }, [changePasswordData.newPassword]);

  const isNewPasswordValid = passwordChecks.minLength && passwordChecks.uppercase && passwordChecks.number;
  const passwordsMatch =
    changePasswordData.confirmPassword.length > 0 &&
    changePasswordData.newPassword === changePasswordData.confirmPassword;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(loginData.email, loginData.password, false);

    if (result.success) {
      showAlert({
        title: 'Inicio de sesión exitoso',
        description: 'Sesión iniciada correctamente.',
        type: 'success',
        confirmText: 'Aceptar',
        onConfirm: () => {},
      });
      return;
    }

    showAlert({
      title: 'No fue posible iniciar sesión',
      description: result.message || 'Credenciales incorrectas.',
      type: 'danger',
      confirmText: 'Entendido',
      onConfirm: () => {},
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNewPasswordValid) {
      showAlert({
        title: 'Nueva contraseña inválida',
        description: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      showAlert({
        title: 'Contraseñas no coinciden',
        description: 'La confirmación no coincide con la nueva contraseña.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      await auth.changePassword({
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword,
        confirmPassword: changePasswordData.confirmPassword,
      });

      showAlert({
        title: 'Contraseña actualizada',
        description: 'La contraseña se actualizó correctamente.',
        type: 'success',
        confirmText: 'Aceptar',
        onConfirm: () => {},
      });

      setChangePasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showAlert({
        title: 'No se pudo cambiar la contraseña',
        description: error?.message || 'Ocurrió un error al actualizar la contraseña.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await auth.requestPasswordReset(resetData.email);
      showAlert({
        title: 'Recuperación enviada',
        description: `Se envió el código de recuperación a ${resetData.email}.`,
        type: 'success',
        confirmText: 'Aceptar',
        onConfirm: () => {},
      });
    } catch (error: any) {
      showAlert({
        title: 'No se pudo enviar la recuperación',
        description: error?.message || 'No fue posible enviar el código de recuperación.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    }
  };

  return (
    <div className="space-y-6">
      {AlertComponent}
      <div>
        <h2>Gestión de Accesos</h2>
        <p className="text-muted-foreground">Administra el acceso y seguridad del sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('login')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'login' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:text-primary'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setActiveTab('change-password')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'change-password' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:text-primary'
          }`}
        >
          Cambiar Contraseña
        </button>
        <button
          onClick={() => setActiveTab('reset')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'reset' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:text-primary'
          }`}
        >
          Restablecer Contraseña
        </button>
      </div>

      <div className="max-w-2xl">
        {activeTab === 'login' && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3>Iniciar Sesión</h3>
                <p className="text-sm text-muted-foreground">Ingresa tus credenciales de acceso</p>
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
                <Button type="submit" className="w-full">
                  Iniciar Sesión
                </Button>
              </FormActions>
            </Form>
          </Card>
        )}

        {activeTab === 'change-password' && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3>Cambiar Contraseña</h3>
                <p className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</p>
              </div>
            </div>

            <Form onSubmit={handleChangePassword}>
              <FormField
                label="Contraseña Actual"
                name="currentPassword"
                type="password"
                value={changePasswordData.currentPassword}
                onChange={(value) => setChangePasswordData({ ...changePasswordData, currentPassword: value as string })}
                placeholder="••••••••"
                required
              />
              
              <FormField
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                value={changePasswordData.newPassword}
                onChange={(value) => setChangePasswordData({ ...changePasswordData, newPassword: value as string })}
                placeholder="••••••••"
                required
              />

              <div className="rounded-lg border border-border bg-accent/30 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Validación en tiempo real</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordChecks.minLength ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={passwordChecks.minLength ? 'text-foreground' : 'text-muted-foreground'}>
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordChecks.uppercase ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={passwordChecks.uppercase ? 'text-foreground' : 'text-muted-foreground'}>
                      Al menos una letra mayúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordChecks.number ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={passwordChecks.number ? 'text-foreground' : 'text-muted-foreground'}>
                      Al menos un número
                    </span>
                  </div>
                </div>
              </div>
              
              <FormField
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type="password"
                value={changePasswordData.confirmPassword}
                onChange={(value) => setChangePasswordData({ ...changePasswordData, confirmPassword: value as string })}
                placeholder="••••••••"
                required
              />

              {changePasswordData.confirmPassword.length > 0 && !passwordsMatch ? (
                <p className="text-sm text-destructive">La confirmación de contraseña no coincide.</p>
              ) : null}

              <FormActions>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !changePasswordData.currentPassword ||
                    !changePasswordData.newPassword ||
                    !changePasswordData.confirmPassword ||
                    !isNewPasswordValid ||
                    !passwordsMatch
                  }
                >
                  Cambiar Contraseña
                </Button>
              </FormActions>
            </Form>
          </Card>
        )}

        {activeTab === 'reset' && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3>Restablecer Contraseña</h3>
                <p className="text-sm text-muted-foreground">Envía un enlace de recuperación por email</p>
              </div>
            </div>

            <Form onSubmit={handleReset}>
              <FormField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={resetData.email}
                onChange={(value) => setResetData({ email: value as string })}
                placeholder="usuario@example.com"
                required
              />

              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Se enviará un enlace de recuperación al correo electrónico especificado. 
                  El enlace será válido por 24 horas.
                </p>
              </div>

              <FormActions>
                <Button type="submit" className="w-full">
                  Enviar Enlace de Recuperación
                </Button>
              </FormActions>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
}
