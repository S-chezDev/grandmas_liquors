import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, KeyRound } from 'lucide-react';
import { Modal } from './Modal';
import { Form, FormField, FormActions } from './Form';
import { Button } from './Button';
import { AlertDialog } from './AlertDialog';

interface HeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export function Header({ title, userName = 'Usuario', userRole = 'Rol', onLogout }: HeaderProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'info' as 'warning' | 'info' | 'success' | 'danger',
    onConfirm: () => {}
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'Las contraseñas nuevas no coinciden',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }
    
    // Aquí iría la lógica para cambiar la contraseña
    setAlertState({
      isOpen: true,
      title: 'Contraseña actualizada',
      description: 'Tu contraseña ha sido actualizada exitosamente',
      type: 'success',
      onConfirm: () => {
        setIsChangePasswordOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    });
  };

  return (
    <>
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            
            <button 
              onClick={() => setIsChangePasswordOpen(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Cambiar contraseña"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Cambiar Contraseña */}
      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => {
          setIsChangePasswordOpen(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }}
        title="Cambiar Contraseña"
        size="md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Ingresa tu contraseña actual y la nueva contraseña
            </p>
          </div>
        </div>

        <Form onSubmit={handleChangePassword}>
          <FormField
            label="Contraseña Actual"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(value) => setPasswordData({ ...passwordData, currentPassword: value as string })}
            placeholder="••••••••"
            required
          />

          <FormField
            label="Nueva Contraseña"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(value) => setPasswordData({ ...passwordData, newPassword: value as string })}
            placeholder="••••••••"
            required
          />

          <FormField
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(value) => setPasswordData({ ...passwordData, confirmPassword: value as string })}
            placeholder="••••••••"
            required
          />

          <div className="p-4 bg-accent rounded-lg mb-4">
            <p className="text-xs text-muted-foreground">
              <strong>Nota:</strong> La contraseña debe tener al menos 6 caracteres. 
              Se recomienda usar una combinación de letras, números y símbolos.
            </p>
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => {
              setIsChangePasswordOpen(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
            }}>
              Cancelar
            </Button>
            <Button type="submit" icon={<KeyRound className="w-5 h-5" />}>
              Cambiar Contraseña
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
    </>
  );
}