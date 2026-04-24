import React, { useEffect, useMemo, useState } from 'react';
import { Search, Star, Building2, User, ToggleRight, ToggleLeft, Eye, PencilLine, Trash2 } from 'lucide-react';
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
  observaciones: string;
}

interface StateChangeRequest {
  proveedorId: string;
  proveedorNombre: string;
  currentState: ProveedorEstado;
  nextState: ProveedorEstado;
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
  const [listFilters, setListFilters] = useState<{
    tipo: '' | 'Juridica' | 'Natural';
    estado: '' | 'Activo' | 'Inactivo';
  }>({ tipo: '', estado: 'Activo' });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [historial, setHistorial] = useState<ProveedorHistorial[]>([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [formData, setFormData] = useState<ProveedorFormState>(initialFormState);
  const [pendingStateChange, setPendingStateChange] = useState<StateChangeRequest | null>(null);
  const [stateChangeReason, setStateChangeReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [nitValidationState, setNitValidationState] = useState({ checking: false, message: '', ok: false });
  const [emailValidationState, setEmailValidationState] = useState({ checking: false, message: '', ok: false });
  const [phoneValidationState, setPhoneValidationState] = useState({ checking: false, message: '', ok: false });
  const [saving, setSaving] = useState(false);
  const [stateChangeSaving, setStateChangeSaving] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const { showAlert, AlertComponent } = useAlertDialog();

  const stateChangeReasonTrimmed = stateChangeReason.trim();
  const stateChangeReasonLength = stateChangeReasonTrimmed.length;
  const isStateChangeReasonValid = stateChangeReasonLength >= 10 && stateChangeReasonLength <= 500;
  const stateChangeReasonError =
    stateChangeReasonLength === 0
      ? 'El motivo es obligatorio para cambiar el estado.'
      : stateChangeReasonLength < 10
      ? 'El motivo debe tener al menos 10 caracteres.'
      : stateChangeReasonLength > 500
      ? 'El motivo no puede superar los 500 caracteres.'
      : '';

  useEffect(() => {
    void loadProveedores();
  }, []);

  useEffect(() => {
    if (!isFormModalOpen) return;

    const identifier = getProveedorIdentifier({
      tipo_persona: formData.tipo_persona,
      nit: formData.nit,
      numero_documento: formData.numero_documento,
    }).trim();

    if (identifier.length < 5) {
      setNitValidationState({ checking: false, message: '', ok: false });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setNitValidationState({ checking: true, message: '', ok: false });
      try {
        const existing = await proveedoresAPI.getByNit(identifier);
        if (existing && Number((existing as Proveedor).id) !== Number(selectedProveedor?.id)) {
          setNitValidationState({ checking: false, message: 'El NIT o documento ya está registrado.', ok: false });
          return;
        }
        setNitValidationState({ checking: false, message: 'NIT/Documento disponible.', ok: true });
      } catch {
        setNitValidationState({ checking: false, message: 'NIT/Documento disponible.', ok: true });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [isFormModalOpen, formData.tipo_persona, formData.nit, formData.numero_documento, selectedProveedor?.id]);

  useEffect(() => {
    if (!isFormModalOpen) return;

    const email = formData.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailValidationState({ checking: false, message: '', ok: false });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setEmailValidationState({ checking: true, message: '', ok: false });
      try {
        const existing = await proveedoresAPI.getByEmail(email);
        if (existing && Number((existing as Proveedor).id) !== Number(selectedProveedor?.id)) {
          setEmailValidationState({ checking: false, message: 'El email ya está registrado.', ok: false });
          return;
        }
        setEmailValidationState({ checking: false, message: 'Email disponible.', ok: true });
      } catch {
        setEmailValidationState({ checking: false, message: 'Email disponible.', ok: true });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [isFormModalOpen, formData.email, selectedProveedor?.id]);

  useEffect(() => {
    if (!isFormModalOpen) return;

    const telefono = formData.telefono.replace(/\D/g, '');
    if (telefono.length < 7 || telefono.length > 15) {
      setPhoneValidationState({ checking: false, message: '', ok: false });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setPhoneValidationState({ checking: true, message: '', ok: false });
      try {
        const existing = await proveedoresAPI.getByTelefono(telefono);
        if (existing && Number((existing as Proveedor).id) !== Number(selectedProveedor?.id)) {
          setPhoneValidationState({ checking: false, message: 'El teléfono ya está registrado.', ok: false });
          return;
        }
        setPhoneValidationState({ checking: false, message: 'Teléfono disponible.', ok: true });
      } catch {
        setPhoneValidationState({ checking: false, message: 'Teléfono disponible.', ok: true });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [isFormModalOpen, formData.telefono, selectedProveedor?.id]);

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

    return ordered.filter((proveedor) => {
      const searchable = normalizeText([getProveedorIdentifier(proveedor), getProveedorDisplayName(proveedor)].join(' '));
      const bySearch = !normalizedQuery || searchable.includes(normalizedQuery);
      const byTipo = !listFilters.tipo || proveedor.tipo_persona === listFilters.tipo;
      const byEstado = !listFilters.estado || proveedor.estado === listFilters.estado;
      return bySearch && byTipo && byEstado;
    });
  }, [normalizedQuery, proveedores, listFilters]);

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
      render: (estado: ProveedorEstado, proveedor: Proveedor) => (
        <select
          value={estado}
          onChange={(event) => {
            void handleEstadoChangeRequest(proveedor, event.target.value as ProveedorEstado);
          }}
          className={`min-h-8 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
            estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      ),
    },
    {
      key: 'preferente',
      label: 'Preferente',
      render: (_: boolean, proveedor: Proveedor) => (
        <button
          type="button"
          onClick={() => {
            void handleTogglePreferente(proveedor);
          }}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
            proveedor.preferente
              ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
              : 'bg-muted text-muted-foreground border-border hover:bg-amber-50 hover:text-amber-700'
          }`}
          aria-pressed={Boolean(proveedor.preferente)}
          title={proveedor.preferente ? 'Quitar preferente' : 'Marcar como preferente'}
        >
          <Star className={`w-3 h-3 ${proveedor.preferente ? 'fill-current' : ''}`} />
          {proveedor.preferente ? 'Sí' : 'No'}
        </button>
      ),
    },
  ];

  const resetForm = () => setFormData(initialFormState);

  const openCreateModal = () => {
    setSelectedProveedor(null);
    resetForm();
    setNitValidationState({ checking: false, message: '', ok: false });
    setEmailValidationState({ checking: false, message: '', ok: false });
    setPhoneValidationState({ checking: false, message: '', ok: false });
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
      observaciones: proveedor.observaciones || '',
    });
    setNitValidationState({ checking: false, message: '', ok: false });
    setEmailValidationState({ checking: false, message: '', ok: false });
    setPhoneValidationState({ checking: false, message: '', ok: false });
    setIsFormModalOpen(true);

    showAlert({
      title: 'RUC bloqueado en edición',
      description:
        proveedor.tipo_persona === 'Juridica'
          ? 'El RUC/NIT no se puede editar para mantener trazabilidad. Si es incorrecto, crea un proveedor nuevo y desactiva el anterior.'
          : 'El RUC/Documento no se puede editar para mantener trazabilidad. Si es incorrecto, crea un proveedor nuevo y desactiva el anterior.',
      type: 'info',
      confirmText: 'Entendido',
      onConfirm: () => {},
    });
  };

  const handleEstadoChangeRequest = async (proveedor: Proveedor, nuevoEstado: ProveedorEstado) => {
    if (nuevoEstado === proveedor.estado) return;

    if (nuevoEstado === 'Inactivo') {
      try {
        const response = await proveedoresAPI.getPendingPurchases(Number(proveedor.id));
        const pendingPurchases = Number((response as { total?: number })?.total || 0);

        if (pendingPurchases > 0) {
          showAlert({
            title: 'No se puede desactivar',
            description: `El proveedor ${getProveedorDisplayName(proveedor)} tiene ${pendingPurchases} orden(es) de compra pendiente(s). Debes cerrar o cancelar esas ordenes antes de cambiar el estado.`,
            type: 'warning',
            confirmText: 'Entendido',
            onConfirm: () => {},
          });
          return;
        }
      } catch {
        showAlert({
          title: 'Validación incompleta',
          description: 'No fue posible validar compras pendientes. Intenta nuevamente en unos segundos.',
          type: 'warning',
          confirmText: 'Entendido',
          onConfirm: () => {},
        });
        return;
      }
    }

    setPendingStateChange({
      proveedorId: proveedor.id,
      proveedorNombre: getProveedorDisplayName(proveedor),
      currentState: proveedor.estado,
      nextState: nuevoEstado,
    });
    setStateChangeReason('');
  };

  const handleCancelStateChange = () => {
    setPendingStateChange(null);
    setStateChangeReason('');
  };

  const handleTogglePreferente = async (proveedor: Proveedor) => {
    try {
      await proveedoresAPI.update(Number(proveedor.id), {
        preferente: !Boolean(proveedor.preferente),
        motivo: 'Cambio rapido desde acciones de la tabla',
      });

      setProveedores((current) =>
        current.map((row) =>
          String(row.id) === String(proveedor.id)
            ? { ...row, preferente: !Boolean(proveedor.preferente) }
            : row
        )
      );
    } catch (error: any) {
      showAlert({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar la preferencia del proveedor.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    }
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

    if (nitValidationState.checking || emailValidationState.checking || phoneValidationState.checking) {
      showAlert({
        title: 'Validación en progreso',
        description: 'Espera mientras finalizamos la validación de NIT, email y teléfono.',
        type: 'info',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    if (
      nitValidationState.message.includes('registrado') ||
      emailValidationState.message.includes('registrado') ||
      phoneValidationState.message.includes('registrado')
    ) {
      showAlert({
        title: 'Datos duplicados',
        description: 'Corrige los campos duplicados antes de continuar.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    const dataToSend = {
      tipoPersona: formData.tipo_persona,
      nombreEmpresa: formData.tipo_persona === 'Juridica' ? formData.nombre_empresa.trim() : undefined,
      nit: formData.tipo_persona === 'Juridica' ? formData.nit.trim() : undefined,
      nombre: formData.tipo_persona === 'Natural' ? formData.nombre.trim() : '',
      apellido: formData.tipo_persona === 'Natural' ? formData.apellido.trim() : undefined,
      tipoDocumento: formData.tipo_persona === 'Natural' ? formData.tipo_documento : undefined,
      numeroDocumento: formData.tipo_persona === 'Natural' ? formData.numero_documento.trim() : undefined,
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      direccion: formData.direccion.trim(),
      estado: 'Activo',
      preferente: formData.preferente,
      rating: 0,
      observaciones: formData.observaciones.trim(),
    };

    const executeSave = async () => {
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

    if (!selectedProveedor) {
      const confirmationSummary = [
        `Nombre: ${formData.tipo_persona === 'Juridica' ? formData.nombre_empresa : `${formData.nombre} ${formData.apellido}`.trim()}`,
        `Identificador: ${identifier || 'N/A'}`,
        `Email: ${formData.email || 'N/A'}`,
        `Teléfono: ${formData.telefono || 'N/A'}`,
        `Preferente: ${formData.preferente ? 'Sí' : 'No'}`,
      ].join('\n');

      showAlert({
        title: 'Confirmación de datos del proveedor',
        description: `Datos únicos verificados. Confirma la información antes de crear:\n\n${confirmationSummary}`,
        type: 'info',
        confirmText: 'Confirmar creación',
        cancelText: 'Revisar',
        onConfirm: () => {
          void executeSave();
        },
      });
      return;
    }

    await executeSave();
  };

  const handleConfirmStateChange = async () => {
    if (!pendingStateChange) return;

    if (!isStateChangeReasonValid) {
      showAlert({
        title: 'Motivo inválido',
        description: stateChangeReasonError,
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStateChangeSaving(true);
      const response = await proveedoresAPI.updateStatus(Number(pendingStateChange.proveedorId), {
        estado: pendingStateChange.nextState,
        motivo: stateChangeReasonTrimmed,
      });
      const updatedEstado =
        ((response as { estado?: ProveedorEstado })?.estado || pendingStateChange.nextState) as ProveedorEstado;

      setProveedores((current) =>
        current.map((proveedor) =>
          String(proveedor.id) === String(pendingStateChange.proveedorId)
            ? { ...proveedor, estado: updatedEstado }
            : proveedor
        )
      );
      setSelectedProveedor((current) =>
        current && String(current.id) === String(pendingStateChange.proveedorId)
          ? { ...current, estado: updatedEstado }
          : current
      );

      await loadProveedores();
      setPendingStateChange(null);
      setStateChangeReason('');

      showAlert({
        title: 'Estado actualizado',
        description: `El proveedor ${pendingStateChange.proveedorNombre} cambió a ${updatedEstado} correctamente.${stateChangeReasonTrimmed ? ` Motivo registrado: ${stateChangeReasonTrimmed}.` : ''}`,
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
      setStateChangeSaving(false);
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

  const emptyMessage = 'No se encontraron proveedores con los filtros aplicados.';

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setListFilters({ tipo: '', estado: '' });
            }}
            disabled={!searchQuery.trim() && !listFilters.tipo && !listFilters.estado}
          >
            Limpiar filtros
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={listFilters.tipo}
            onChange={(event) =>
              setListFilters((current) => ({
                ...current,
                tipo: event.target.value as '' | 'Juridica' | 'Natural',
              }))
            }
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tipo (todos)</option>
            <option value="Natural">Natural</option>
            <option value="Juridica">Empresa</option>
          </select>
          <select
            value={listFilters.estado}
            onChange={(event) =>
              setListFilters((current) => ({
                ...current,
                estado: event.target.value as '' | 'Activo' | 'Inactivo',
              }))
            }
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Estado (todos)</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <p className="text-sm text-muted-foreground">
          Puedes combinar búsqueda por texto con filtros de tipo y estado.
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

      <Modal
        isOpen={Boolean(pendingStateChange)}
        onClose={handleCancelStateChange}
        title={`Confirmar cambio de estado - ${pendingStateChange?.proveedorNombre}`}
        size="md"
      >
        {pendingStateChange ? (
          <div className="space-y-4">
            <div className="p-4 bg-accent/50 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                Vas a cambiar el estado de <strong>{pendingStateChange.proveedorNombre}</strong> de{' '}
                <strong>{pendingStateChange.currentState}</strong> a <strong>{pendingStateChange.nextState}</strong>.
              </p>
            </div>

            <FormField
              label="Motivo (obligatorio)"
              name="motivo-estado-proveedor"
              type="textarea"
              value={stateChangeReason}
              onChange={(value) => setStateChangeReason(value as string)}
              placeholder="Describe el motivo del cambio de estado (10 a 500 caracteres)"
              rows={3}
              required
              error={stateChangeReason ? stateChangeReasonError || undefined : undefined}
              helperText={`Caracteres: ${stateChangeReasonLength}/500`}
            />

            <FormActions>
              <Button type="button" variant="outline" onClick={handleCancelStateChange}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirmStateChange} disabled={stateChangeSaving || !isStateChangeReasonValid}>
                Confirmar
              </Button>
            </FormActions>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="xl"
      >
        <Form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-accent/30 mb-4">
            <input
              id="preferente"
              type="checkbox"
              checked={formData.preferente}
              onChange={(event) => setFormData((current) => ({ ...current, preferente: event.target.checked }))}
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor="preferente" className="flex items-center gap-2 text-sm font-medium">
              <Star className="w-4 h-4 text-amber-600" />
              Marcar como proveedor preferente
            </label>
          </div>

          <FormField
            label="Tipo de Proveedor"
            name="tipo_persona"
            type="select"
            value={formData.tipo_persona}
            onChange={(value) => setFormData((current) => ({ ...current, tipo_persona: value as ProveedorTipoPersona }))}
            options={[
              { value: 'Juridica', label: 'Persona Jurídica' },
              { value: 'Natural', label: 'Persona Natural' },
            ]}
            required
          />

          {formData.tipo_persona === 'Juridica' ? (
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
                error={nitValidationState.message.includes('registrado') ? nitValidationState.message : undefined}
                helperText={
                  isEditing
                    ? 'Bloqueado: el RUC no se puede editar para mantener trazabilidad.'
                    : nitValidationState.checking
                    ? 'Validando NIT en tiempo real...'
                    : nitValidationState.ok
                    ? nitValidationState.message
                    : 'Se validará la existencia del NIT antes de guardar.'
                }
              />
            </div>
          ) : (
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
                  error={nitValidationState.message.includes('registrado') ? nitValidationState.message : undefined}
                  helperText={isEditing ? 'Bloqueado: el RUC/Documento no se puede editar para mantener trazabilidad.' : undefined}
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
              error={phoneValidationState.message.includes('registrado') ? phoneValidationState.message : undefined}
              helperText={
                phoneValidationState.checking
                  ? 'Validando teléfono en tiempo real...'
                  : phoneValidationState.ok
                  ? phoneValidationState.message
                  : 'Debe contener entre 7 y 15 dígitos.'
              }
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData((current) => ({ ...current, email: value as string }))}
              placeholder="contacto@proveedor.com"
              error={emailValidationState.message.includes('registrado') ? emailValidationState.message : undefined}
              helperText={
                emailValidationState.checking
                  ? 'Validando email en tiempo real...'
                  : emailValidationState.ok
                  ? emailValidationState.message
                  : undefined
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Observaciones clave"
              name="observaciones"
              type="textarea"
              value={formData.observaciones}
              onChange={(value) => setFormData((current) => ({ ...current, observaciones: value as string }))}
              placeholder="Ej: precios competitivos, tiempo de entrega 24h"
              rows={2}
            />
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                saving ||
                nitValidationState.checking ||
                emailValidationState.checking ||
                phoneValidationState.checking
              }
            >
              {selectedProveedor ? 'Actualizar' : 'Crear'} Proveedor
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
