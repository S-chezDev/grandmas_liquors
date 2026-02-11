import React, { useState } from 'react';
import { Card } from '../../Card';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { LogIn, Lock, Mail } from 'lucide-react';

export function Accesos() {
  const [activeTab, setActiveTab] = useState<'login' | 'change-password' | 'reset'>('login');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [changePasswordData, setChangePasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [resetData, setResetData] = useState({ email: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Iniciando sesión...');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña actualizada correctamente');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Se ha enviado un enlace de recuperación a ${resetData.email}`);
  };

  return (
    <div className="space-y-6">
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
              
              <FormField
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type="password"
                value={changePasswordData.confirmPassword}
                onChange={(value) => setChangePasswordData({ ...changePasswordData, confirmPassword: value as string })}
                placeholder="••••••••"
                required
              />

              <FormActions>
                <Button type="submit" className="w-full">
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
