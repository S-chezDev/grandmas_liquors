import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, Edit3, FileText, KeyRound, Mail, MapPin, Phone, Save, Upload, User, X } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Form, FormField, FormActions } from '../Form';
import { toast } from '../AlertDialog';
import { api } from '../../services/api';
import { UserData, validateImageFile } from '../hooks/landingShared';

interface ProfileModalProps {
  isOpen: boolean;
  user?: UserData;
  onClose: () => void;
  onOpenChangePassword: () => void;
  onProfileUpdated?: () => void;
}

interface EditFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export function ProfileModal({
  isOpen,
  user,
  onClose,
  onOpenChangePassword,
  onProfileUpdated,
}: ProfileModalProps) {
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
  });

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !user?.email) {
      return;
    }

    let cancelled = false;
    const loadFoto = async () => {
      try {
        const me = await api.auth.me();
        const cliente = await api.clientes.getByUsuarioId(Number(me.id));
        if (!cancelled) {
          setFotoPreview(cliente.foto || null);
          setClienteId(Number(me.clienteId || cliente.id));
        }
      } catch (error) {
        if (!cancelled) {
          setFotoPreview(null);
        }
        if (import.meta.env.DEV) {
          console.error('No se pudo cargar la foto de perfil', error);
        }
      }
    };

    loadFoto();
    return () => {
      cancelled = true;
    };
  }, [isOpen, user?.email]);

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    // Validar imagen con lógica flexible (MIME type O extensión)
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error('Archivo rechazado', { description: validation.error || 'No se puede procesar esta imagen.' });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setFotoPreview(localPreview);
    setIsUploadingFoto(true);

    try {
      const fotoUrl = await api.clientes.uploadProfilePhoto(file);
      setFotoPreview(fotoUrl);
      toast.success('Foto actualizada', { description: 'Tu foto de perfil se guardó correctamente.' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la foto de perfil.';
      toast.error('Foto no guardada', { description: message });
      if (import.meta.env.DEV) {
        console.error('Error al subir foto de perfil', error);
      }
    } finally {
      setIsUploadingFoto(false);
    }
  };

  const handleStartEditing = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      tipoDocumento: user?.tipoDocumento || 'CC',
      numeroDocumento: user?.numeroDocumento || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);

      // Get clienteId if not already loaded
      let cid = clienteId;
      if (!cid) {
        const me = await api.auth.me();
        cid = Number(me.clienteId);
        setClienteId(cid);
      }

      if (!cid) {
        throw new Error('No se pudo identificar tu cuenta de cliente.');
      }

      await api.clientes.update(cid, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        direccion: formData.direccion,
        email: formData.email,
        telefono: formData.telefono,
      });

      toast.success('Perfil actualizado', {
        description: 'Tu información fue actualizada exitosamente.',
      });
      setIsEditing(false);
      onProfileUpdated?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el perfil.';
      toast.error('Error al actualizar', { description: message });
      if (import.meta.env.DEV) {
        console.error('Error al actualizar perfil', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil" size="lg">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-accent/50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Foto de perfil"
                  className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                  <User className="h-8 w-8" />
                </div>
              )}
              <div>
                <h3 className="text-lg sm:text-xl">
                  {isEditing ? `${formData.nombre} ${formData.apellido}` : `${user?.nombre} ${user?.apellido}`}
                </h3>
                <p className="text-sm text-muted-foreground">{isEditing ? formData.email : user?.email}</p>
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

          {!isEditing && (
            <div className="mt-4 flex items-center gap-3">
              <input
                ref={fotoInputRef}
                id="profileModalFotoInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingFoto}
                onClick={() => fotoInputRef.current?.click()}
                icon={<Upload className="w-4 h-4" />}
              >
                Seleccionar foto
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG o WEBP. Máximo 2 MB.</p>
            </div>
          )}

          {isEditing ? (
            <div className="mt-6">
              <Form onSubmit={handleSaveChanges}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={(value) => setFormData({ ...formData, nombre: value as string })}
                    placeholder="Juan"
                    required
                  />
                  <FormField
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={(value) => setFormData({ ...formData, apellido: value as string })}
                    placeholder="Pérez"
                    required
                  />
                </div>
                <FormField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value as string })}
                  placeholder="usuario@example.com"
                  required
                />
                <FormField
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(value) => setFormData({ ...formData, telefono: value as string })}
                  placeholder="3001234567"
                  required
                  inputDigitRule="telefono10"
                />
                <FormField
                  label="Dirección"
                  name="direccion"
                  type="textarea"
                  value={formData.direccion}
                  onChange={(value) => setFormData({ ...formData, direccion: value as string })}
                  placeholder="Dirección completa"
                  rows={2}
                  required
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Tipo de Documento"
                    name="tipoDocumento"
                    type="select"
                    value={formData.tipoDocumento}
                    onChange={(value) => setFormData({ ...formData, tipoDocumento: value as string })}
                    options={[
                      { value: 'CC', label: 'Cédula de Ciudadanía' },
                      { value: 'CE', label: 'Cédula de Extranjería' },
                      { value: 'Pasaporte', label: 'Pasaporte' },
                    ]}
                    required
                  />
                  <FormField
                    label="Número de Documento"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={(value) => setFormData({ ...formData, numeroDocumento: value as string })}
                    placeholder="Entre 6 y 12 dígitos"
                    required
                    inputDigitRule="documento6to12"
                  />
                </div>

                <FormActions>
                  <Button type="button" variant="outline" onClick={handleCancelEdit} icon={<X className="w-4 h-4" />}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving} icon={<Save className="w-4 h-4" />}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </FormActions>
              </Form>
            </div>
          ) : (
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
          )}
        </div>

        <div className="border-t border-border pt-6 flex flex-col gap-3 sm:flex-row">
          {!isEditing && (
            <Button
              onClick={handleStartEditing}
              variant="primary"
              className="w-full sm:flex-1"
              icon={<Edit3 className="w-5 h-5" />}
            >
              Editar Datos
            </Button>
          )}
          <Button
            onClick={onOpenChangePassword}
            variant="outline"
            className="w-full sm:flex-1"
            icon={<KeyRound className="w-5 h-5" />}
          >
            Cambiar Contraseña
          </Button>
        </div>
      </div>
    </Modal>
  );
}
