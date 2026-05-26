import React from 'react';
import { CreditCard, FileText, KeyRound, Mail, MapPin, Phone, User } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { UserData } from '../hooks/landingShared';

interface ProfileModalProps {
  isOpen: boolean;
  user?: UserData;
  onClose: () => void;
  onOpenChangePassword: () => void;
}

export function ProfileModal({
  isOpen,
  user,
  onClose,
  onOpenChangePassword,
}: ProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil" size="lg">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-accent/50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl">
                  {user?.nombre} {user?.apellido}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs text-primary shadow-sm">
                  Cuenta {user?.rol}
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Resumen</p>
              <p className="text-sm text-foreground">Datos principales de tu cuenta y contacto</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4 sm:pb-5">
              <div className="rounded-lg bg-primary/10 p-2">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Correo electrónico</p>
                <p className="text-sm">{user?.email || 'No registrado'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-border/60 pb-4 sm:pb-5">
              <div className="rounded-lg bg-primary/10 p-2">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm">{user?.telefono || 'No registrado'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-border/60 pb-4 sm:pb-5">
              <div className="rounded-lg bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Documento</p>
                <p className="text-sm">
                  {user?.tipoDocumento && user?.numeroDocumento
                    ? `${user.tipoDocumento} ${user.numeroDocumento}`
                    : 'No registrado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-border/60 pb-4 sm:pb-5">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rol</p>
                <p className="text-sm">{user?.rol || 'Cliente'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dirección</p>
                <p className="text-sm">{user?.direccion || 'No registrada'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <Button
            onClick={onOpenChangePassword}
            variant="outline"
            className="w-full"
            icon={<KeyRound className="w-5 h-5" />}
          >
            Cambiar Contraseña
          </Button>
        </div>
      </div>
    </Modal>
  );
}
