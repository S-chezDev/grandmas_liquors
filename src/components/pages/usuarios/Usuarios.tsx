import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Download, RotateCcw, KeyRound, Search } from 'lucide-react';
import { AlertDialog } from '../../AlertDialog';
import { usuarios as usuariosAPI, roles as rolesAPI } from '../../../services/api';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  tipo_documento: 'CC' | 'CE' | 'TI' | 'Pasaporte';
  documento: string;
  direccion: string;
  email: string;
  telefono: string;
  rol_id?: number;
  rol?: string;
  estado: 'Activo' | 'Inactivo' | 'Eliminado';
  created_at?: string;
  updated_at?: string;
}

interface UsuarioActividad {
  id: string | number;
  accion: string;
  created_at: string;
  actor_email?: string | null;
  cambios?: {
    reason?: string | null;
    changedFields?: Record<string, { before: unknown; after: unknown }>;
    [key: string]: unknown;
  };
}

interface UsuarioSesion {
  id: number;
  created_at: string;
  expires_at: string;
  revoked_at?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
}

interface UsuarioDetalleCompleto {
  usuario: Usuario;
  logs: UsuarioActividad[];
  sesiones: UsuarioSesion[];
  activeSessions: number;
}

interface DeleteImpactBlocker {
  key: string;
  label: string;
  total: number;
}

interface DeleteImpact {
  activeSessions: number;
  daysInactive: number;
  canPhysicalDelete: boolean;
  blockers: DeleteImpactBlocker[];
}

interface UsersFilters {
  globalQuery: string;
  estado: '' | 'Activo' | 'Inactivo' | 'Eliminado';
  rolId: string;
}

interface UsuarioFormErrors {
  nombre?: string;
  apellido?: string;
  tipo_documento?: string;
  documento?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  rol_id?: string;
}

interface UsuarioTouchedFields {
  nombre?: boolean;
  apellido?: boolean;
  tipo_documento?: boolean;
  documento?: boolean;
  direccion?: boolean;
  email?: boolean;
  telefono?: boolean;
  rol_id?: boolean;
}

interface ValidationState {
  checking: boolean;
  message: string;
}

interface AlertState {
  isOpen: boolean;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  onConfirm: () => void;
}

interface StatusChangeRequest {
  usuario: Usuario;
  from: 'Activo' | 'Inactivo';
  to: 'Activo' | 'Inactivo';
}
const downloadUsersCsv = (rows: Usuario[]) => {
  const toCsvValue = (value: unknown) => {
    const text = value === null || value === undefined ? '' : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const headers = [
    'id',
    'nombre',
    'apellido',
    'tipo_documento',
    'documento',
    'direccion',
    'email',
    'telefono',
    'rol_id',
    'rol',
    'estado',
    'created_at',
    'updated_at',
  ];

  const lines = [headers.map(toCsvValue).join(',')];
  rows.forEach((row) => {
    lines.push(
      [
        row.id,
        row.nombre,
        row.apellido,
        row.tipo_documento,
        row.documento,
        row.direccion,
        row.email,
        row.telefono,
        row.rol_id,
        row.rol,
        row.estado,
        row.created_at,
        row.updated_at,
      ]
        .map(toCsvValue)
        .join(',')
    );
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `usuarios_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export function Usuarios() {
  const defaultFilters: UsersFilters = {
    globalQuery: '',
    estado: '',
    rolId: '',
  };

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSaving, setSubmitSaving] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detalleCompleto, setDetalleCompleto] = useState<UsuarioDetalleCompleto | null>(null);

  const [statusSaving, setStatusSaving] = useState(false);
  const [pendingStateChange, setPendingStateChange] = useState<StatusChangeRequest | null>(null);
  const [statusForm, setStatusForm] = useState({
    motivo: '',
    force: true,
    notificar: true,
  });

  const [filters, setFilters] = useState<UsersFilters>(defaultFilters);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteTargetUsuario, setDeleteTargetUsuario] = useState<Usuario | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteReasonError, setDeleteReasonError] = useState('');
  const [deleteImpactLoading, setDeleteImpactLoading] = useState(false);
  const [deleteImpact, setDeleteImpact] = useState<DeleteImpact | null>(null);
  const [deleteMode, setDeleteMode] = useState<'logical' | 'physical'>('logical');
  const [omitDeleteValidations, setOmitDeleteValidations] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipo_documento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    documento: '',
    direccion: '',
    email: '',
    telefono: '',
    rol_id: '',
  });

  const [formErrors, setFormErrors] = useState<UsuarioFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<UsuarioTouchedFields>({});

  const [emailValidationState, setEmailValidationState] = useState<ValidationState>({
    checking: false,
    message: '',
  });
  const [documentValidationState, setDocumentValidationState] = useState<ValidationState>({
    checking: false,
    message: '',
  });
  const [phoneValidationState, setPhoneValidationState] = useState<ValidationState>({
    checking: false,
    message: '',
  });

  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: '',
    description: '',
    type: 'warning',
    onConfirm: () => {},
  });

  const lastLoadIdRef = useRef(0);
  const searchDebounceRef = useRef<number | null>(null);

  const validateUsuarioForm = (data: typeof formData): UsuarioFormErrors => {
    const errors: UsuarioFormErrors = {};

    if (!data.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!data.apellido.trim()) errors.apellido = 'El apellido es obligatorio.';
    if (!data.tipo_documento) errors.tipo_documento = 'El tipo de documento es obligatorio.';

    const documento = String(data.documento || '').trim();
    if (!documento) {
      errors.documento = 'El documento es obligatorio.';
    } else if (!/^\d{5,20}$/.test(documento)) {
      errors.documento = 'El documento debe contener entre 5 y 20 dígitos.';
    }

    if (!data.direccion.trim()) errors.direccion = 'La dirección es obligatoria.';

    const email = data.email.trim().toLowerCase();
    if (!email) {
      errors.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ingresa un correo válido.';
    }

    const telefono = String(data.telefono || '').replace(/\D/g, '');
    if (!telefono) {
      errors.telefono = 'El teléfono es obligatorio.';
    } else if (telefono.length !== 10) {
      errors.telefono = 'El teléfono debe tener 10 dígitos.';
    }

    if (!data.rol_id.trim()) errors.rol_id = 'El rol es obligatorio.';

    return errors;
  };

  const getErrorReason = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) return message;
    }
    return fallback;
  };

  const columns: Column[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre', render: (_: any, row: Usuario) => `${row.nombre} ${row.apellido}` },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'rol', label: 'Rol' },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado: string, usuario: Usuario) => (
        <select
          value={estado === 'Activo' ? 'Activo' : estado === 'Inactivo' ? 'Inactivo' : 'Eliminado'}
          onChange={(event) => handleChangeStateRequest(usuario, event.target.value as 'Activo' | 'Inactivo' | 'Eliminado')}
          disabled={statusSaving || estado === 'Eliminado'}
          className={`min-h-8 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
            estado === 'Activo'
              ? 'bg-green-100 text-green-700'
              : estado === 'Eliminado'
              ? 'bg-slate-200 text-slate-700'
              : 'bg-red-100 text-red-700'
          } ${estado === 'Eliminado' ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          {estado === 'Eliminado' ? <option value="Eliminado">Eliminado</option> : null}
        </select>
      ),
    },
  ];

  const minWait = async (startedAt: number, ms: number) => {
    const elapsed = Date.now() - startedAt;
    const remaining = ms - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
  };

  const loadRoles = async () => {
    try {
      const data = await rolesAPI.getAll();
      const rolesOptions = data.map((rol: any) => ({ value: rol.id.toString(), label: rol.nombre }));
      setRoles(rolesOptions);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

  const loadUsuarios = async (nextFilters?: Partial<UsersFilters>) => {
    const mergedFilters: UsersFilters = { ...filters, ...(nextFilters || {}) };
    const loadId = ++lastLoadIdRef.current;

    try {
      setLoading(true);
      const data = await usuariosAPI.getAll({
        q: mergedFilters.globalQuery || undefined,
        estados: mergedFilters.estado ? [mergedFilters.estado] : undefined,
        rol_id: mergedFilters.rolId ? Number(mergedFilters.rolId) : undefined,
        include_deleted: true,
        limit: 50000,
      });

      if (loadId === lastLoadIdRef.current) {
        const normalizedRows = Array.isArray(data) ? data : [];
        setUsuarios(normalizedRows);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      if (loadId === lastLoadIdRef.current) {
        setUsuarios([]);
      }
    } finally {
      if (loadId === lastLoadIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadRoles();
    void loadUsuarios(defaultFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const email = formData.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailValidationState({ checking: false, message: '' });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setEmailValidationState({ checking: true, message: '' });

      try {
        const existing = await usuariosAPI.getByEmail(email);
        if (existing && Number(existing.id) !== Number(selectedUsuario?.id)) {
          setEmailValidationState({ checking: false, message: 'El correo ya está registrado' });
          return;
        }
        setEmailValidationState({ checking: false, message: '' });
      } catch {
        setEmailValidationState({ checking: false, message: '' });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [formData.email, isModalOpen, selectedUsuario?.id]);

  useEffect(() => {
    if (!isModalOpen) return;

    const documento = String(formData.documento || '').trim();
    if (!/^\d{5,20}$/.test(documento)) {
      setDocumentValidationState({ checking: false, message: '' });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setDocumentValidationState({ checking: true, message: '' });

      try {
        const existing = await usuariosAPI.getByDocumento(documento);
        if (existing && Number(existing.id) !== Number(selectedUsuario?.id)) {
          setDocumentValidationState({ checking: false, message: 'El documento ya está registrado' });
          return;
        }
        setDocumentValidationState({ checking: false, message: '' });
      } catch {
        setDocumentValidationState({ checking: false, message: '' });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [formData.documento, isModalOpen, selectedUsuario?.id]);

  useEffect(() => {
    if (!isModalOpen) return;

    const telefono = String(formData.telefono || '').replace(/\D/g, '');
    if (telefono.length !== 10) {
      setPhoneValidationState({ checking: false, message: '' });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setPhoneValidationState({ checking: true, message: '' });

      try {
        const existing = await usuariosAPI.getByTelefono(telefono);
        if (existing && Number(existing.id) !== Number(selectedUsuario?.id)) {
          setPhoneValidationState({ checking: false, message: 'El teléfono ya está registrado' });
          return;
        }
        setPhoneValidationState({ checking: false, message: '' });
      } catch {
        setPhoneValidationState({ checking: false, message: '' });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [formData.telefono, isModalOpen, selectedUsuario?.id]);

  const roleFilterOptions = useMemo(() => {
    return [{ value: '', label: 'Todos los roles' }, ...roles];
  }, [roles]);

  const handleAdvancedFiltersChange = (field: keyof UsersFilters, value: string) => {
    const nextFilters = { ...filters, [field]: value };
    setFilters(nextFilters);
    void loadUsuarios(nextFilters);
  };

  const handleResetFilters = async () => {
    setFilters(defaultFilters);
    await loadUsuarios(defaultFilters);
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    const nextData = {
      ...formData,
      [field]: value,
      ...(field === 'telefono' ? { telefono: String(value).replace(/\D/g, '').slice(0, 10) } : {}),
    };

    setFormData(nextData);
    setFormErrors(validateUsuarioForm(nextData));
  };

  const handleAdd = () => {
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      apellido: '',
      tipo_documento: 'CC',
      documento: '',
      direccion: '',
      email: '',
      telefono: '',
      rol_id: '',
    });
    setFormErrors({});
    setTouchedFields({});
    setEmailValidationState({ checking: false, message: '' });
    setDocumentValidationState({ checking: false, message: '' });
    setPhoneValidationState({ checking: false, message: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      tipo_documento: usuario.tipo_documento,
      documento: usuario.documento,
      direccion: usuario.direccion,
      email: usuario.email,
      telefono: usuario.telefono,
      rol_id: usuario.rol_id?.toString() || '',
    });
    setFormErrors({});
    setTouchedFields({});
    setEmailValidationState({ checking: false, message: '' });
    setDocumentValidationState({ checking: false, message: '' });
    setPhoneValidationState({ checking: false, message: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateUsuarioForm(formData);
    setTouchedFields({
      nombre: true,
      apellido: true,
      tipo_documento: true,
      documento: true,
      direccion: true,
      email: true,
      telefono: true,
      rol_id: true,
    });
    setFormErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0 ||
      Boolean(emailValidationState.message) ||
      Boolean(documentValidationState.message) ||
      Boolean(phoneValidationState.message)
    ) {
      return;
    }

    try {
      setSubmitSaving(true);
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        tipo_documento: formData.tipo_documento,
        documento: formData.documento.trim(),
        direccion: formData.direccion.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.replace(/\D/g, ''),
        rol_id: parseInt(formData.rol_id, 10),
      };

      if (selectedUsuario) {
        await usuariosAPI.update(Number(selectedUsuario.id), dataToSend);
      } else {
        const startedAt = Date.now();
        await usuariosAPI.create(dataToSend);
        await minWait(startedAt, 3000);
      }

      await loadUsuarios();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: getErrorReason(error, 'No fue posible guardar el usuario.'),
        type: 'danger',
        onConfirm: () => {},
      });
    } finally {
      setSubmitSaving(false);
    }
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDetailModalOpen(true);
    setDetalleCompleto(null);

    void (async () => {
      try {
        setDetailLoading(true);
        const detail = await usuariosAPI.getFullDetail(Number(usuario.id));
        setDetalleCompleto(detail || null);
      } catch (error) {
        console.error('Error cargando detalle completo:', error);
        setAlertState({
          isOpen: true,
          title: 'Error',
          description: getErrorReason(error, 'No fue posible cargar el detalle del usuario.'),
          type: 'danger',
          onConfirm: () => {},
        });
      } finally {
        setDetailLoading(false);
      }
    })();
  };

  const handleForceResetPassword = async () => {
    if (!selectedUsuario) return;
    try {
      await usuariosAPI.forceResetPassword(Number(selectedUsuario.id), {
        motivo: 'Reset forzado desde detalle de usuario',
      });
      setAlertState({
        isOpen: true,
        title: 'Operación completada',
        description: 'La contraseña temporal fue reseteada y enviada al correo del usuario.',
        type: 'success',
        onConfirm: () => {},
      });
    } catch (error) {
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: getErrorReason(error, 'No fue posible resetear la contraseña.'),
        type: 'danger',
        onConfirm: () => {},
      });
    }
  };

  const handleDelete = (usuario: Usuario) => {
    setDeleteTargetUsuario(usuario);
    setDeleteReason('');
    setDeleteReasonError('');
    setDeleteImpact(null);
    setDeleteImpactLoading(true);
    setDeleteMode('logical');
    setOmitDeleteValidations(false);
    setDeleteModalOpen(true);

    void (async () => {
      try {
        const impact = await usuariosAPI.getDeleteImpact(Number(usuario.id));
        setDeleteImpact(impact || null);
        if (impact?.canPhysicalDelete) {
          setDeleteMode('physical');
        }
      } catch (error) {
        console.error('Error obteniendo impacto de eliminación:', error);
      } finally {
        setDeleteImpactLoading(false);
      }
    })();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetUsuario) return;

    const normalizedReason = deleteReason.trim();
    if (normalizedReason.length < 10) {
      setDeleteReasonError('El motivo es obligatorio y debe tener al menos 10 caracteres.');
      return;
    }

    try {
      setDeleteSaving(true);
      const startedAt = Date.now();

      await usuariosAPI.delete(Number(deleteTargetUsuario.id), {
        motivo: normalizedReason,
        mode: deleteMode,
        omit_validaciones: omitDeleteValidations,
      });

      await minWait(startedAt, 3000);
      await loadUsuarios();

      setDeleteModalOpen(false);
      setDeleteTargetUsuario(null);
      setDeleteReason('');
      setDeleteReasonError('');
      setDeleteImpact(null);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: getErrorReason(error, 'No fue posible eliminar el usuario.'),
        type: 'danger',
        onConfirm: () => {},
      });
    } finally {
      setDeleteSaving(false);
    }
  };

  const handleChangeStateRequest = (usuario: Usuario, targetState: 'Activo' | 'Inactivo' | 'Eliminado') => {
    if (targetState === 'Eliminado' || usuario.estado === 'Eliminado') return;
    if (usuario.estado === targetState) return;

    setPendingStateChange({
      usuario,
      from: usuario.estado as 'Activo' | 'Inactivo',
      to: targetState,
    });
    setStatusForm({
      motivo: '',
      force: true,
      notificar: true,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStateChange) return;

    if (!statusForm.notificar) {
      setAlertState({
        isOpen: true,
        title: 'Notificación obligatoria',
        description: 'Debes confirmar la notificación al usuario para aplicar el cambio de estado.',
        type: 'warning',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStatusSaving(true);
      await usuariosAPI.updateStatus(Number(pendingStateChange.usuario.id), {
        estado: pendingStateChange.to,
        force: statusForm.force,
        motivo: statusForm.motivo.trim() || undefined,
        notificar: statusForm.notificar,
        verificacion: pendingStateChange.to === 'Activo',
      });

      await loadUsuarios();
      setPendingStateChange(null);
      setStatusForm({ motivo: '', force: true, notificar: true });
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: getErrorReason(error, 'No fue posible cambiar el estado del usuario.'),
        type: 'danger',
        onConfirm: () => {},
      });
    } finally {
      setStatusSaving(false);
    }
  };

  const handleCancelStatusChange = () => {
    setPendingStateChange(null);
    setStatusForm({ motivo: '', force: true, notificar: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administra, busca y audita usuarios sin restricciones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={() => downloadUsersCsv(usuarios)}>
            Exportar CSV
          </Button>
          <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={filters.globalQuery}
              onChange={(event) => {
                const query = event.target.value;
                const nextFilters = { ...filters, globalQuery: query };
                setFilters(nextFilters);

                if (searchDebounceRef.current) {
                  window.clearTimeout(searchDebounceRef.current);
                }

                searchDebounceRef.current = window.setTimeout(() => {
                  void loadUsuarios(nextFilters);
                }, 350);
              }}
              placeholder="Buscar usuario por nombre, correo o documento..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => void handleResetFilters()}
            disabled={!filters.globalQuery.trim() && !filters.estado && !filters.rolId}
          >
            Limpiar filtros
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={filters.estado}
            onChange={(event) => handleAdvancedFiltersChange('estado', event.target.value as UsersFilters['estado'])}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Estado (todos)</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Eliminado">Eliminado</option>
          </select>
          <select
            value={filters.rolId}
            onChange={(event) => handleAdvancedFiltersChange('rolId', event.target.value)}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {roleFilterOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Cargando usuarios...</p> : null}

      <DataTable
        columns={columns}
        data={usuarios}
        actions={[
          commonActions.view(handleView),
          commonActions.edit(handleEdit),
          commonActions.delete(handleDelete),
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(value) => updateField('nombre', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, nombre: true }))}
            required
            error={touchedFields.nombre ? formErrors.nombre : undefined}
          />

          <FormField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={(value) => updateField('apellido', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, apellido: true }))}
            required
            error={touchedFields.apellido ? formErrors.apellido : undefined}
          />

          <FormField
            label="Tipo de Documento"
            name="tipo_documento"
            type="select"
            value={formData.tipo_documento}
            onChange={(value) => updateField('tipo_documento', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, tipo_documento: true }))}
            options={[
              { value: 'CC', label: 'Cédula de Ciudadanía' },
              { value: 'CE', label: 'Cédula de Extranjería' },
              { value: 'TI', label: 'Tarjeta de Identidad' },
              { value: 'Pasaporte', label: 'Pasaporte' },
            ]}
            required
            error={touchedFields.tipo_documento ? formErrors.tipo_documento : undefined}
          />

          <FormField
            label="Número de Documento"
            name="documento"
            value={formData.documento}
            onChange={(value) => updateField('documento', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, documento: true }))}
            required
            error={
              touchedFields.documento || Boolean(documentValidationState.message)
                ? formErrors.documento || documentValidationState.message || undefined
                : undefined
            }
            helperText={documentValidationState.checking ? 'Validando unicidad del documento...' : undefined}
          />

          <FormField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={(value) => updateField('direccion', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, direccion: true }))}
            required
            error={touchedFields.direccion ? formErrors.direccion : undefined}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, email: true }))}
            required
            error={
              touchedFields.email || Boolean(emailValidationState.message)
                ? formErrors.email || emailValidationState.message || undefined
                : undefined
            }
            helperText={
              emailValidationState.checking
                ? 'Validando unicidad del correo...'
                : undefined
            }
          />

          {!selectedUsuario ? (
            <p className="text-xs text-muted-foreground -mt-1">
              La contraseña temporal se genera automáticamente y se envía al correo del usuario.
            </p>
          ) : null}

          <FormField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={(value) => updateField('telefono', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, telefono: true }))}
            required
            error={
              touchedFields.telefono || Boolean(phoneValidationState.message)
                ? formErrors.telefono || phoneValidationState.message || undefined
                : undefined
            }
            helperText={phoneValidationState.checking ? 'Validando unicidad del teléfono...' : 'Formato de 10 dígitos'}
          />

          <FormField
            label="Rol"
            name="rol_id"
            type="select"
            value={formData.rol_id}
            onChange={(value) => updateField('rol_id', value as string)}
            onBlur={() => setTouchedFields((current) => ({ ...current, rol_id: true }))}
            options={roles}
            required
            error={touchedFields.rol_id ? formErrors.rol_id : undefined}
          />

          {!selectedUsuario ? (
            <p className="text-xs text-muted-foreground -mt-1">
              El estado inicial se asigna automáticamente. Para cambios posteriores, usa el selector de estado en la tabla.
            </p>
          ) : null}

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                submitSaving ||
                emailValidationState.checking ||
                documentValidationState.checking ||
                phoneValidationState.checking
              }
            >
              {submitSaving ? 'Guardando...' : `${selectedUsuario ? 'Actualizar' : 'Crear'} Usuario`}
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUsuario(null);
          setDetalleCompleto(null);
        }}
        title={`Detalle de Usuario - ${selectedUsuario?.nombre} ${selectedUsuario?.apellido}`}
        size="lg"
      >
        {detailLoading ? <p className="text-sm text-muted-foreground">Cargando detalle completo...</p> : null}

        {!detailLoading && detalleCompleto ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p>{detalleCompleto.usuario.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p>{detalleCompleto.usuario.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Apellido</p>
                <p>{detalleCompleto.usuario.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo Documento</p>
                <p>{detalleCompleto.usuario.tipo_documento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p>{detalleCompleto.usuario.documento}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{detalleCompleto.usuario.direccion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{detalleCompleto.usuario.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p>{detalleCompleto.usuario.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rol</p>
                <p>{detalleCompleto.usuario.rol}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p>{detalleCompleto.usuario.estado}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Creado</p>
                <p>{detalleCompleto.usuario.created_at ? new Date(detalleCompleto.usuario.created_at).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actualizado</p>
                <p>{detalleCompleto.usuario.updated_at ? new Date(detalleCompleto.usuario.updated_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">Logs y actividad</h3>
                <Button size="sm" variant="outline" icon={<KeyRound className="w-4 h-4" />} onClick={handleForceResetPassword}>
                  Resetear contraseña forzosamente
                </Button>
              </div>
              {detalleCompleto.logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay logs registrados.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-auto pr-1">
                  {detalleCompleto.logs.map((item) => (
                    <div key={String(item.id)} className="rounded-md border border-border px-3 py-2 text-sm">
                      <p className="font-medium">{item.accion}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleString()} {item.actor_email ? `• ${item.actor_email}` : ''}
                      </p>
                      {item.cambios?.reason ? <p className="text-xs text-muted-foreground">Motivo: {item.cambios.reason}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 p-4 border border-border rounded-lg">
              <h3 className="text-base font-semibold">Sesiones e IPs ({detalleCompleto.activeSessions} activas)</h3>
              {detalleCompleto.sesiones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay sesiones registradas.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-auto pr-1">
                  {detalleCompleto.sesiones.map((session) => (
                    <div key={session.id} className="rounded-md border border-border px-3 py-2 text-sm">
                      <p className="font-medium">Sesión #{session.id}</p>
                      <p className="text-xs text-muted-foreground">Inicio: {new Date(session.created_at).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Expira: {new Date(session.expires_at).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">IP: {session.ip_address || 'No registrada'}</p>
                      <p className="text-xs text-muted-foreground">Agente: {session.user_agent || 'No registrado'}</p>
                      <p className="text-xs text-muted-foreground">
                        Estado: {session.revoked_at ? `Revocada (${new Date(session.revoked_at).toLocaleString()})` : 'Activa'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={Boolean(pendingStateChange)}
        onClose={handleCancelStatusChange}
        title={`Cambiar estado - ${pendingStateChange?.usuario.nombre || ''} ${pendingStateChange?.usuario.apellido || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Estado actual: {pendingStateChange?.from || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Nuevo estado: {pendingStateChange?.to || 'N/A'}</p>
          </div>

          <FormField
            label="Motivo"
            name="status_motivo"
            type="textarea"
            value={statusForm.motivo}
            onChange={(value) => setStatusForm((current) => ({ ...current, motivo: value as string }))}
            placeholder="Describe el motivo del cambio"
            rows={3}
          />

          <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-accent/40">
            <input
              type="checkbox"
              checked={statusForm.force}
              onChange={(event) => setStatusForm((current) => ({ ...current, force: event.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-border text-primary"
            />
            <span className="text-sm">Forzar cambio incluso con sesión activa.</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-accent/40">
            <input
              type="checkbox"
              checked={statusForm.notificar}
              onChange={(event) => setStatusForm((current) => ({ ...current, notificar: event.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-border text-primary"
            />
            <span className="text-sm">Notificar al usuario sobre el cambio de estado (obligatorio).</span>
          </label>

          <FormActions>
            <Button variant="outline" onClick={handleCancelStatusChange}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmStatusChange} disabled={statusSaving}>
              Confirmar cambio
            </Button>
          </FormActions>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetUsuario(null);
          setDeleteReason('');
          setDeleteReasonError('');
          setDeleteImpact(null);
        }}
        title={`Eliminar usuario - ${deleteTargetUsuario?.nombre} ${deleteTargetUsuario?.apellido}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Confirmación avanzada con análisis de impacto</p>
            <p className="mt-1">Se mostrará el impacto antes de ejecutar la eliminación.</p>
          </div>

          {deleteImpactLoading ? <p className="text-sm text-muted-foreground">Analizando impacto...</p> : null}

          {deleteImpact ? (
            <div className="rounded-lg border border-border p-3 text-sm space-y-1">
              <p>Sesiones activas: {deleteImpact.activeSessions}</p>
              <p>Días inactivo: {deleteImpact.daysInactive}</p>
              <p>Eliminación física habilitada: {deleteImpact.canPhysicalDelete ? 'Sí' : 'No'}</p>
              <p>Bloqueos detectados: {deleteImpact.blockers.length}</p>
              {deleteImpact.blockers.length > 0 ? (
                <div className="max-h-24 overflow-auto text-xs text-muted-foreground">
                  {deleteImpact.blockers.map((item) => (
                    <p key={item.key}>
                      {item.label}: {item.total}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <FormField
            label="Modo de eliminación"
            name="delete_mode"
            type="select"
            value={deleteMode}
            onChange={(value) => setDeleteMode(value as 'logical' | 'physical')}
            options={[
              { value: 'logical', label: 'Lógica' },
              { value: 'physical', label: 'Física (backup automático)' },
            ]}
            helperText="La eliminación física está permitida después de 90 días inactivo."
          />

          <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-accent/40">
            <input
              type="checkbox"
              checked={omitDeleteValidations}
              onChange={(event) => setOmitDeleteValidations(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary"
            />
            <span className="text-sm">Omitir algunas validaciones de eliminación.</span>
          </label>

          <FormField
            label="Motivo"
            name="delete_motivo"
            type="textarea"
            value={deleteReason}
            onChange={(value) => {
              const nextValue = value as string;
              setDeleteReason(nextValue);
              setDeleteReasonError(nextValue.trim().length >= 10 ? '' : deleteReasonError);
            }}
            rows={4}
            required
            error={deleteReasonError || undefined}
            helperText="Obligatorio. Mínimo 10 caracteres. El proceso tarda aprox 3 segundos."
          />

          <FormActions>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteTargetUsuario(null);
                setDeleteReason('');
                setDeleteReasonError('');
                setDeleteImpact(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleteSaving} className="bg-destructive hover:bg-destructive/90 text-white">
              {deleteSaving ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </FormActions>
        </div>
      </Modal>

      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() =>
          setAlertState({ isOpen: false, title: '', description: '', type: 'warning', onConfirm: () => {} })
        }
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
}
