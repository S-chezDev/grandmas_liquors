import React, { useEffect, useMemo, useState } from 'react';
import { Search, Star, Building2, User, ToggleRight, ToggleLeft, AlertTriangle, Eye, PencilLine, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { useAlertDialog } from '../../AlertDialog';
import { proveedores as proveedoresAPI } from '../../../services/api';

type ProveedorTipoPersona = 'Juridica' | 'Natural';
type ProveedorEstado = 'Activo' | 'Inactivo';
type ProveedorTipoDocumento = 'CC' | 'CE' | 'TI' | 'Pasaporte';

interface Proveedor {
  id: string;
  tipo_persona: ProveedorTipoPersona;
  nombre_empresa?: string | null;
  nit?: string | null;
  nombre?: string | null;
  apellido?: string | null;
  tipo_documento?: ProveedorTipoDocumento | null;
  numero_documento?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  estado: ProveedorEstado;
  preferente?: boolean | null;
  rating?: number | null;
  observaciones?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ProveedorHistorial {
  id: number;
  accion: string;
  cambios: {
    reason?: string | null;
    changedFields?: string[];
    statusChange?: boolean;
  };
  usuario_nombre?: string | null;
  usuario_apellido?: string | null;
  usuario_email?: string | null;
  created_at?: string;
}

interface ProveedorFormState {
  tipo_persona: ProveedorTipoPersona;
  nombre_empresa: string;
  nit: string;
  nombre: string;
  apellido: string;
  tipo_documento: ProveedorTipoDocumento;
  numero_documento: string;
  telefono: string;
  email: string;
  direccion: string;
  preferente: boolean;
  rating: number;
  observaciones: string;
}

const initialFormState: ProveedorFormState = {
  tipo_persona: 'Juridica',
  nombre_empresa: '',
  nit: '',
  nombre: '',
  apellido: '',
  tipo_documento: 'CC',
  numero_documento: '',
  telefono: '',
  email: '',
  direccion: '',
  preferente: false,
  rating: 0,
  observaciones: '',
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getProveedorDisplayName = (proveedor: Proveedor) => {
  if (proveedor.tipo_persona === 'Juridica') {
    return proveedor.nombre_empresa?.trim() || 'Sin razón social';
  }

  return [proveedor.nombre, proveedor.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre';
};

const getProveedorIdentifier = (proveedor: Pick<Proveedor, 'tipo_persona' | 'nit' | 'numero_documento'>) => {
  if (proveedor.tipo_persona === 'Juridica') {
    return proveedor.nit?.trim() || '';
  }

  return proveedor.numero_documento?.trim() || '';
};

const countDigits = (value: string) => value.replace(/\D/g, '').length;

export function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [historial, setHistorial] = useState<ProveedorHistorial[]>([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [formData, setFormData] = useState<ProveedorFormState>(initialFormState);
  const [statusForm, setStatusForm] = useState({ estado: 'Activo' as ProveedorEstado, motivo: '', pendingPurchases: 0 });
  const [deleteReason, setDeleteReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    void loadProveedores();
  }, []);

  useEffect(() => {
    const loadPendingPurchases = async () => {
      if (!isStatusModalOpen || !selectedProveedor) return;

      if (statusForm.estado !== 'Inactivo') {
        setStatusForm((current) => ({ ...current, pendingPurchases: 0 }));
        return;
      }

      try {
        const response = await proveedoresAPI.getPendingPurchases(Number(selectedProveedor.id));
        setStatusForm((current) => ({
          ...current,
          pendingPurchases: Number((response as { total?: number })?.total || 0),
        }));
      } catch {
        setStatusForm((current) => ({ ...current, pendingPurchases: 0 }));
      }
    };

    void loadPendingPurchases();
  }, [isStatusModalOpen, selectedProveedor?.id, statusForm.estado]);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const data = await proveedoresAPI.getAll();
      setProveedores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudieron cargar los proveedores. Verifique que el backend esté activo.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (proveedorId: string) => {
    try {
      setHistorialLoading(true);
      const data = await proveedoresAPI.getHistory(Number(proveedorId));
      setHistorial(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar historial de proveedor:', error);
      setHistorial([]);
    } finally {
      setHistorialLoading(false);
    }
  };

  const normalizedQuery = normalizeText(searchQuery);

  const proveedoresVisible = useMemo(() => {
    const ordered = [...proveedores].sort((left, right) => {
      const activeDiff = Number(right.estado === 'Activo') - Number(left.estado === 'Activo');
      if (activeDiff !== 0) return activeDiff;

      const preferredDiff = Number(Boolean(right.preferente)) - Number(Boolean(left.preferente));
      if (preferredDiff !== 0) return preferredDiff;

      return getProveedorDisplayName(left).localeCompare(getProveedorDisplayName(right), 'es', {
        sensitivity: 'base',
      });
    });

    if (!normalizedQuery) {
      return ordered.filter((proveedor) => proveedor.estado === 'Activo');
    }

    return ordered.filter((proveedor) => {
      const searchable = normalizeText([getProveedorIdentifier(proveedor), getProveedorDisplayName(proveedor)].join(' '));
      return searchable.includes(normalizedQuery);
    });
  }, [normalizedQuery, proveedores]);

  const isEditing = Boolean(selectedProveedor);

  const columns: Column[] = [
    {
      key: 'tipo_persona',
      label: 'Tipo',
      render: (tipo: ProveedorTipoPersona) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
            tipo === 'Juridica' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}
        >
          {tipo === 'Juridica' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
          {tipo === 'Juridica' ? 'Jurídica' : 'Natural'}
        </span>
      ),
    },
    {
      key: 'nombre',
      label: 'Nombre / Razón Social',
      render: (_, proveedor: Proveedor) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{getProveedorDisplayName(proveedor)}</span>
            {proveedor.preferente ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                <Star className="w-3 h-3 fill-current" />
                Preferente
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">RUC: {getProveedorIdentifier(proveedor) || 'Sin registrar'}</p>
        </div>
      ),
    },
    {
      key: 'documento',
      label: 'Documento',
      render: (_, proveedor: Proveedor) => {
        if (proveedor.tipo_persona === 'Juridica') {
          return proveedor.nit || 'Sin NIT';
        }

        return `${proveedor.tipo_documento || ''} ${proveedor.numero_documento || ''}`.trim();
      },
    },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado: ProveedorEstado) => (
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {estado}
        </span>
      ),
    },
    {
      key: 'preferente',
      label: 'Preferente',
      render: (preferente: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            preferente ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'
          }`}
        >
          {preferente ? 'Sí' : 'No'}
        </span>
      ),
    },
  ];

  const resetForm = () => setFormData(initialFormState);

  const openCreateModal = () => {
    setSelectedProveedor(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setFormData({
      tipo_persona: proveedor.tipo_persona,
      nombre_empresa: proveedor.nombre_empresa || '',
      nit: proveedor.nit || '',
      nombre: proveedor.nombre || '',
      apellido: proveedor.apellido || '',
      tipo_documento: proveedor.tipo_documento || 'CC',
      numero_documento: proveedor.numero_documento || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
      preferente: Boolean(proveedor.preferente),
      rating: Number(proveedor.rating ?? 0),
      observaciones: proveedor.observaciones || '',
    });
    setIsFormModalOpen(true);
  };

  const openStatusModal = (proveedor: Proveedor) => {
    const nextState = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo';
    setSelectedProveedor(proveedor);
    setStatusForm({ estado: nextState, motivo: '', pendingPurchases: 0 });
    setIsStatusModalOpen(true);
  };

  const openDeleteModal = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setDeleteReason('');
    setIsDeleteModalOpen(true);
  };

  const handleView = async (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setHistorial([]);
    setIsDetailModalOpen(true);
    await loadHistory(proveedor.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const telefonoDigits = countDigits(formData.telefono);
    if (telefonoDigits < 7 || telefonoDigits > 15) {
      showAlert({
        title: 'Teléfono inválido',
        description: 'El teléfono debe contener entre 7 y 15 dígitos.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    const identifier = getProveedorIdentifier({
      tipo_persona: formData.tipo_persona,
      nit: formData.nit,
      numero_documento: formData.numero_documento,
    });

    if (identifier) {
      const conflict = proveedores.find((proveedor) => {
        if (selectedProveedor && proveedor.id === selectedProveedor.id) {
          return false;
        }

        return getProveedorIdentifier(proveedor) === identifier;
      });

      if (conflict) {
        showAlert({
          title: 'RUC duplicado',
          description:
            conflict.estado === 'Inactivo'
              ? 'El RUC ya existe pero corresponde a un proveedor inactivo. No se puede duplicar.'
              : 'El RUC ya existe para otro proveedor.',
          type: 'danger',
          confirmText: 'Entendido',
          onConfirm: () => {},
        });
        return;
      }
    }

    const dataToSend = {
      ...formData,
      ...(formData.tipo_persona === 'Juridica'
        ? { nombre: undefined, apellido: undefined, tipo_documento: undefined, numero_documento: undefined }
        : { nombre_empresa: undefined, nit: undefined }),
      rating: Number(formData.rating),
      observaciones: formData.observaciones.trim(),
    };

    try {
      setSaving(true);
      if (selectedProveedor) {
        await proveedoresAPI.update(Number(selectedProveedor.id), dataToSend);
        setProveedores((current) =>
          current.map((proveedor) =>
            String(proveedor.id) === String(selectedProveedor.id)
              ? {
                  ...proveedor,
                  ...formData,
                  tipo_persona: formData.tipo_persona,
                  preferente: formData.preferente,
                  rating: formData.rating,
                  observaciones: formData.observaciones.trim(),
                }
              : proveedor
          )
        );
      } else {
        await proveedoresAPI.create(dataToSend);
      }

      await loadProveedores();
      setIsFormModalOpen(false);
      setSelectedProveedor(null);
      showAlert({
        title: 'Éxito',
        description: `Proveedor ${selectedProveedor ? 'actualizado' : 'creado'} correctamente`,
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error: any) {
      console.error('Error al guardar proveedor:', error);
      showAlert({
        title: 'Error',
        description: error?.message || 'No se pudo guardar el proveedor',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    const motivo = statusForm.motivo.trim();
    if (motivo.length < 10) {
      showAlert({
        title: 'Motivo requerido',
        description: 'El motivo de cambio de estado debe tener al menos 10 caracteres.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    if (statusForm.estado === 'Inactivo' && statusForm.pendingPurchases > 0) {
      showAlert({
        title: 'No permitido',
        description: 'No se puede desactivar el proveedor porque tiene ordenes de compra pendientes.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStatusSaving(true);
      await proveedoresAPI.updateStatus(Number(selectedProveedor?.id), {
        estado: statusForm.estado,
        motivo,
      });
      setProveedores((current) =>
        current.map((proveedor) =>
          String(proveedor.id) === String(selectedProveedor?.id)
            ? { ...proveedor, estado: statusForm.estado }
            : proveedor
        )
      );
      await loadProveedores();
      setIsStatusModalOpen(false);
      showAlert({
        title: 'Éxito',
        description: 'Estado del proveedor actualizado correctamente',
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      showAlert({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar el estado del proveedor',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setStatusSaving(false);
    }
  };

  const handleSubmitDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const motivo = deleteReason.trim();
    if (motivo.length < 10) {
      showAlert({
        title: 'Motivo requerido',
        description: 'El motivo de eliminación debe tener al menos 10 caracteres.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setDeleteSaving(true);
      await proveedoresAPI.delete(Number(selectedProveedor?.id), { motivo });
      await loadProveedores();
      setIsDeleteModalOpen(false);
      showAlert({
        title: 'Éxito',
        description: 'Proveedor eliminado correctamente',
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error: any) {
      console.error('Error al eliminar proveedor:', error);
      showAlert({
        title: 'Error',
        description: error?.message || 'No se pudo eliminar el proveedor',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setDeleteSaving(false);
    }
  };

  const emptyMessage = normalizedQuery
    ? 'No se encontraron proveedores activos o inactivos que coincidan con la búsqueda por RUC o nombre.'
    : 'No hay proveedores activos disponibles.';

  return (
    <div className="space-y-6">
      {AlertComponent}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2>Gestión de Proveedores</h2>
          <p className="text-muted-foreground">Administra proveedores activos, preferentes e historial de cambios.</p>
        </div>
        <Button icon={<Building2 className="w-5 h-5" />} onClick={openCreateModal}>
          Nuevo Proveedor
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar por RUC o nombre..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="outline" onClick={() => setSearchQuery('')} disabled={!searchQuery.trim()}>
            Limpiar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Por defecto se muestran solo proveedores activos. Los inactivos aparecen cuando la búsqueda coincide con su RUC o nombre.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando proveedores...</div>
      ) : proveedoresVisible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={proveedoresVisible}
          actions={[
            {
              label: 'Cambiar Estado',
                icon: (row) =>
                  row?.estado === 'Activo' ? (
                    <ToggleRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-slate-500" />
                  ),
              onClick: openStatusModal,
              variant: 'outline',
            },
              {
                label: 'Ver detalle',
                icon: <Eye className="w-4 h-4" />,
                onClick: handleView,
              },
              {
                label: 'Editar',
                icon: <PencilLine className="w-4 h-4" />,
                onClick: openEditModal,
                variant: 'primary',
              },
              {
                label: 'Eliminar',
                icon: <Trash2 className="w-4 h-4" />,
                onClick: openDeleteModal,
                variant: 'destructive',
              },
          ]}
        />
      )}

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'} size="lg">
        <Form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-3">Tipo de Proveedor</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData((current) => ({ ...current, tipo_persona: 'Juridica' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.tipo_persona === 'Juridica' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-2 ${formData.tipo_persona === 'Juridica' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className={formData.tipo_persona === 'Juridica' ? 'text-primary' : 'text-muted-foreground'}>
                  Persona Jurídica
                </div>
                <p className="text-xs text-muted-foreground mt-1">Empresa o sociedad</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData((current) => ({ ...current, tipo_persona: 'Natural' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.tipo_persona === 'Natural' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <User className={`w-8 h-8 mx-auto mb-2 ${formData.tipo_persona === 'Natural' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className={formData.tipo_persona === 'Natural' ? 'text-primary' : 'text-muted-foreground'}>
                  Persona Natural
                </div>
                <p className="text-xs text-muted-foreground mt-1">Persona individual</p>
              </button>
            </div>
          </div>

          {formData.tipo_persona === 'Juridica' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Razón Social"
                name="nombre_empresa"
                value={formData.nombre_empresa}
                onChange={(value) => setFormData((current) => ({ ...current, nombre_empresa: value as string }))}
                placeholder="Ej: Distribuidora Nacional S.A.S"
                required
              />
              <FormField
                label="RUC / NIT"
                name="nit"
                value={formData.nit}
                onChange={(value) => setFormData((current) => ({ ...current, nit: value as string }))}
                placeholder="900.123.456-7"
                required
                readOnly={isEditing}
                helperText={isEditing ? 'El RUC no se puede editar.' : 'Se validará la existencia del RUC antes de guardar.'}
              />
            </div>
          )}

          {formData.tipo_persona === 'Natural' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(value) => setFormData((current) => ({ ...current, nombre: value as string }))}
                  placeholder="Juan"
                  required
                />
                <FormField
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={(value) => setFormData((current) => ({ ...current, apellido: value as string }))}
                  placeholder="Pérez"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Tipo de Documento"
                  name="tipo_documento"
                  type="select"
                  value={formData.tipo_documento}
                  onChange={(value) => setFormData((current) => ({ ...current, tipo_documento: value as ProveedorTipoDocumento }))}
                  options={[
                    { value: 'CC', label: 'Cédula de Ciudadanía' },
                    { value: 'CE', label: 'Cédula de Extranjería' },
                    { value: 'TI', label: 'Tarjeta de Identidad' },
                    { value: 'Pasaporte', label: 'Pasaporte' },
                  ]}
                  required
                />
                <FormField
                  label="RUC / Documento"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={(value) => setFormData((current) => ({ ...current, numero_documento: value as string }))}
                  placeholder="1234567890"
                  required
                  readOnly={isEditing}
                  helperText={isEditing ? 'El RUC no se puede editar.' : 'Se validará la existencia del RUC antes de guardar.'}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={(value) => setFormData((current) => ({ ...current, telefono: value as string }))}
              placeholder="6041234567"
              helperText="Debe contener entre 7 y 15 dígitos."
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData((current) => ({ ...current, email: value as string }))}
              placeholder="contacto@proveedor.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={(value) => setFormData((current) => ({ ...current, rating: Number(value) }))}
              placeholder="0"
              helperText="Valor entre 0 y 5."
              required
            />
            <div />
          </div>

          <FormField
            label="Dirección"
            name="direccion"
            type="textarea"
            value={formData.direccion}
            onChange={(value) => setFormData((current) => ({ ...current, direccion: value as string }))}
            placeholder="Dirección completa del proveedor"
            rows={2}
            required
          />

          <FormField
            label="Observaciones"
            name="observaciones"
            type="textarea"
            value={formData.observaciones}
            onChange={(value) => setFormData((current) => ({ ...current, observaciones: value as string }))}
            placeholder="Notas internas sobre el proveedor"
            rows={3}
          />

          <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-accent/30">
            <input
              id="preferente"
              type="checkbox"
              checked={formData.preferente}
              onChange={(event) => setFormData((current) => ({ ...current, preferente: event.target.checked }))}
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor="preferente" className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-amber-600" />
              Marcar como proveedor preferente
            </label>
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {selectedProveedor ? 'Actualizar' : 'Crear'} Proveedor
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Cambiar estado del proveedor" size="md">
        <Form onSubmit={handleSubmitStatus}>
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Proveedor seleccionado</p>
            <p className="font-medium">{selectedProveedor ? getProveedorDisplayName(selectedProveedor) : ''}</p>
            <p className="text-sm text-muted-foreground">RUC: {selectedProveedor ? getProveedorIdentifier(selectedProveedor) : ''}</p>
          </div>

          <FormField
            label="Nuevo estado"
            name="estado"
            type="select"
            value={statusForm.estado}
            onChange={(value) => setStatusForm((current) => ({ ...current, estado: value as ProveedorEstado }))}
            options={[
              { value: 'Activo', label: 'Activo' },
              { value: 'Inactivo', label: 'Inactivo' },
            ]}
            required
          />

          {statusForm.estado === 'Inactivo' ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4" />
                Confirmación requerida
              </div>
              <p>Debe registrar un motivo y no podrá desactivar el proveedor si existen ordenes de compra pendientes.</p>
              {statusForm.pendingPurchases > 0 ? <p className="font-medium">Hay {statusForm.pendingPurchases} orden(es) de compra pendiente(s).</p> : null}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-accent/20 p-4 text-sm text-muted-foreground">
              El motivo sigue siendo obligatorio para dejar trazabilidad del cambio.
            </div>
          )}

          <FormField
            label="Motivo"
            name="motivo-estado"
            type="textarea"
            value={statusForm.motivo}
            onChange={(value) => setStatusForm((current) => ({ ...current, motivo: value as string }))}
            placeholder="Explique el motivo del cambio de estado"
            rows={3}
            required
          />

          <FormActions>
            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)} disabled={statusSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={statusSaving || (statusForm.estado === 'Inactivo' && statusForm.pendingPurchases > 0)}>
              Confirmar cambio
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar proveedor" size="md">
        <Form onSubmit={handleSubmitDelete}>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
            <p className="font-medium">{selectedProveedor ? getProveedorDisplayName(selectedProveedor) : ''}</p>
            <p className="text-sm text-muted-foreground">La eliminación requiere un motivo de trazabilidad.</p>
          </div>

          <FormField
            label="Motivo de eliminación"
            name="motivo-eliminacion"
            type="textarea"
            value={deleteReason}
            onChange={(value) => setDeleteReason(value as string)}
            placeholder="Describa por qué se elimina este proveedor"
            rows={3}
            required
          />

          <FormActions>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={deleteSaving}>
              Eliminar proveedor
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProveedor(null);
          setHistorial([]);
        }}
        title={`Detalle de Proveedor - ${selectedProveedor ? getProveedorDisplayName(selectedProveedor) : ''}`}
        size="lg"
      >
        {selectedProveedor && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Proveedor</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    selectedProveedor.tipo_persona === 'Juridica'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {selectedProveedor.tipo_persona === 'Juridica' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {selectedProveedor.tipo_persona === 'Juridica' ? 'Persona Jurídica' : 'Persona Natural'}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedProveedor.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedProveedor.estado}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">RUC</p>
                <p>{getProveedorIdentifier(selectedProveedor) || 'Sin registrar'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Preferente</p>
                <p>{selectedProveedor.preferente ? 'Sí' : 'No'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p>{selectedProveedor.rating ?? 0}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Estado visual</p>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                    selectedProveedor.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedProveedor.estado === 'Activo' ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  {selectedProveedor.estado}
                </span>
              </div>

              {selectedProveedor.tipo_persona === 'Juridica' ? (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Razón Social</p>
                  <p>{selectedProveedor.nombre_empresa}</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                    <p>{selectedProveedor.tipo_documento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Documento</p>
                    <p>{selectedProveedor.numero_documento}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p>{getProveedorDisplayName(selectedProveedor)}</p>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p>{selectedProveedor.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{selectedProveedor.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{selectedProveedor.direccion}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Observaciones</p>
                <p>{selectedProveedor.observaciones || 'Sin observaciones'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg">Historial de cambios</h3>
                {historialLoading ? <span className="text-sm text-muted-foreground">Cargando historial...</span> : null}
              </div>

              {historial.length === 0 && !historialLoading ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No hay historial registrado para este proveedor.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {historial.map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-border p-4 bg-white space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-accent text-foreground">{entry.accion}</span>
                          {entry.cambios?.statusChange ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Cambio de estado</span>
                          ) : null}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {entry.created_at ? new Date(entry.created_at).toLocaleString('es-CO') : ''}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.usuario_nombre || entry.usuario_apellido
                          ? `Registrado por ${[entry.usuario_nombre, entry.usuario_apellido].filter(Boolean).join(' ')}`
                          : entry.usuario_email
                            ? `Registrado por ${entry.usuario_email}`
                            : 'Registro automático'}
                      </p>
                      {entry.cambios?.reason ? <p className="text-sm">Motivo: {entry.cambios.reason}</p> : null}
                      {entry.cambios?.changedFields?.length ? (
                        <p className="text-sm text-muted-foreground">Campos modificados: {entry.cambios.changedFields.join(', ')}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedProveedor(null);
                  setHistorial([]);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
