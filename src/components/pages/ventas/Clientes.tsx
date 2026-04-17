import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, UserCircle, Upload, Search, RotateCcw } from 'lucide-react';
import { AlertDialog } from '../../AlertDialog';
import { clientes as clientesAPI } from '../../../services/api';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  foto_url?: string;
  estado: 'Activo' | 'Inactivo';
}

interface StateChangeRequest {
  cliente: Cliente;
  from: Cliente['estado'];
  to: Cliente['estado'];
}

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    tipo_documento: '',
    estado: ''
  });

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesAPI.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'No se pudieron cargar los clientes. Verifique que el backend esté activo.',
        onConfirm: () => {}
      });
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [pendingStateChange, setPendingStateChange] = useState<StateChangeRequest | null>(null);
  const [stateChangeReason, setStateChangeReason] = useState('');
  const [stateChangeSaving, setStateChangeSaving] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipo_documento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    documento: '',
    telefono: '',
    email: '',
    direccion: '',
    foto_url: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, foto: file });
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const columns: Column[] = [
    { key: 'id', label: 'ID Cliente' },
    { 
      key: 'nombre', 
      label: 'Nombre Completo',
      render: (_: any, row: Cliente) => `${row.nombre} ${row.apellido}`
    },
    { 
      key: 'tipo_documento', 
      label: 'Tipo Doc.',
      render: (tipo_documento: string) => tipo_documento
    },
    { key: 'documento', label: 'Documento' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string, cliente: Cliente) => (
        <select
          value={estado}
          onChange={(event) => handleEstadoChangeRequest(cliente, event.target.value as Cliente['estado'])}
          disabled={stateChangeSaving}
          className={`min-h-8 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
            estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      )
    }
  ];

  const clientesFiltrados = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return clientes.filter((cliente) => {
      const matchesQuery =
        !normalizedQuery ||
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(normalizedQuery) ||
        String(cliente.documento || '').toLowerCase().includes(normalizedQuery) ||
        String(cliente.email || '').toLowerCase().includes(normalizedQuery);
      const matchesTipo = !filters.tipo_documento || cliente.tipo_documento === filters.tipo_documento;
      const matchesEstado = !filters.estado || cliente.estado === filters.estado;
      return matchesQuery && matchesTipo && matchesEstado;
    });
  }, [clientes, filters]);

  const handleAdd = () => {
    setSelectedCliente(null);
    setFormData({ nombre: '', apellido: '', tipo_documento: 'CC', documento: '', telefono: '', email: '', direccion: '', foto_url: '', estado: 'Activo' });
    setIsModalOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      tipo_documento: cliente.tipo_documento,
      documento: cliente.documento,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      foto_url: cliente.foto_url || '',
      estado: cliente.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    setAlertState({
      isOpen: true,
      title: 'Confirmar eliminación',
      description: `¿Está seguro de eliminar al cliente "${cliente.nombre} ${cliente.apellido}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await clientesAPI.delete(Number(cliente.id));
          await loadClientes();
          setAlertState({
            isOpen: true,
            title: 'Éxito',
            description: 'Cliente eliminado correctamente',
            onConfirm: () => {}
          });
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
          setAlertState({
            isOpen: true,
            title: 'Error',
            description: 'No se pudo eliminar el cliente',
            onConfirm: () => {}
          });
        }
      }
    });
  };

  const handleEstadoChangeRequest = (cliente: Cliente, nuevoEstado: Cliente['estado']) => {
    if (cliente.estado === nuevoEstado) return;

    setPendingStateChange({
      cliente,
      from: cliente.estado,
      to: nuevoEstado,
    });
    setStateChangeReason('');
  };

  const handleConfirmEstadoChange = async () => {
    if (!pendingStateChange) return;

    if (pendingStateChange.to === 'Inactivo' && stateChangeReason.trim().length < 10) {
      setAlertState({
        isOpen: true,
        title: 'Motivo requerido',
        description: 'Para inactivar al cliente debes indicar un motivo de al menos 10 caracteres.',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStateChangeSaving(true);
      await clientesAPI.update(Number(pendingStateChange.cliente.id), {
        estado: pendingStateChange.to,
        observaciones: stateChangeReason.trim() || undefined,
      });
      await loadClientes();
      setPendingStateChange(null);
      setStateChangeReason('');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setStateChangeSaving(false);
    }
  };

  const handleCancelEstadoChange = () => {
    setPendingStateChange(null);
    setStateChangeReason('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCliente) {
        await clientesAPI.update(Number(selectedCliente.id), formData);
      } else {
        await clientesAPI.create(formData);
      }
      await loadClientes();
      setIsModalOpen(false);
      setAlertState({
        isOpen: true,
        title: 'Éxito',
        description: `Cliente ${selectedCliente ? 'actualizado' : 'creado'} correctamente`,
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'No se pudo guardar el cliente',
        onConfirm: () => {}
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Clientes</h2>
          <p className="text-muted-foreground">Administra la información de los clientes</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nuevo Cliente
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={filters.query}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Buscar cliente por nombre, documento o correo..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setFilters({ query: '', tipo_documento: '', estado: '' })}
            disabled={!filters.query.trim() && !filters.tipo_documento && !filters.estado}
          >
            Limpiar filtros
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={filters.tipo_documento}
            onChange={(event) => setFilters((current) => ({ ...current, tipo_documento: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tipo Doc. (todos)</option>
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="TI">TI</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
          <select
            value={filters.estado}
            onChange={(event) => setFilters((current) => ({ ...current, estado: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Estado (todos)</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando clientes...</div>
      ) : (
        <DataTable
          columns={columns}
          data={clientesFiltrados}
          actions={[
            commonActions.view((cliente) => {
              setSelectedCliente(cliente);
              setIsDetailModalOpen(true);
            }),
            commonActions.edit(handleEdit),
            commonActions.delete(handleDelete)
          ]}
        />
      )}

      <Modal
        isOpen={Boolean(pendingStateChange)}
        onClose={handleCancelEstadoChange}
        title={`Cambiar estado - Cliente ${pendingStateChange?.cliente.nombre || ''} ${pendingStateChange?.cliente.apellido || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Estado actual: {pendingStateChange?.from || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Nuevo estado: {pendingStateChange?.to || 'N/A'}</p>
          </div>

          {pendingStateChange?.to === 'Inactivo' ? (
            <FormField
              label="Motivo del cambio"
              name="motivo-cambio-cliente"
              type="textarea"
              value={stateChangeReason}
              onChange={(value) => setStateChangeReason(String(value))}
              rows={3}
              required
              placeholder="Explica por qué se inactiva el cliente (mínimo 10 caracteres)"
            />
          ) : null}

          <FormActions>
            <Button variant="outline" onClick={handleCancelEstadoChange} disabled={stateChangeSaving}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmEstadoChange} disabled={stateChangeSaving}>
              {stateChangeSaving ? 'Guardando...' : 'Confirmar'}
            </Button>
          </FormActions>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detalle de Cliente ${selectedCliente?.id}`}
        size="lg"
      >
        {selectedCliente && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID Cliente</p>
                <p>{selectedCliente.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p>{selectedCliente.nombre} {selectedCliente.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                <p>{selectedCliente.tipo_documento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p>{selectedCliente.documento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p>{selectedCliente.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{selectedCliente.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{selectedCliente.direccion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedCliente.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedCliente.estado}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(value) => setFormData({ ...formData, nombre: value as string })}
              placeholder="Ej: Juan"
              required
            />
            
            <FormField
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={(value) => setFormData({ ...formData, apellido: value as string })}
              placeholder="Ej: Pérez García"
              required
            />
            
            <FormField
              label="Tipo de Documento"
              name="tipo_documento"
              type="select"
              value={formData.tipo_documento}
              onChange={(value) => setFormData({ ...formData, tipo_documento: value as 'CC' | 'CE' | 'TI' | 'Pasaporte' })}
              options={[
                { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
                { value: 'CE', label: 'Cédula de Extranjería (CE)' },
                { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
                { value: 'Pasaporte', label: 'Pasaporte' }
              ]}
              required
            />
            
            <FormField
              label="Número de Documento"
              name="documento"
              value={formData.documento}
              onChange={(value) => setFormData({ ...formData, documento: value as string })}
              placeholder="1234567890"
              required
            />
            
            <FormField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={(value) => setFormData({ ...formData, telefono: value as string })}
              placeholder="300 123 4567"
              required
            />
            
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value as string })}
              placeholder="cliente@email.com"
              required
            />
          </div>
          
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

          {/* Foto de perfil */}
          <div className="mb-4">
            <label className="block mb-2">Foto de Perfil</label>
            <div className="flex items-center gap-4">
              {fotoPreview ? (
                <img 
                  src={fotoPreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                  id="foto-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('foto-upload')?.click()}
                  icon={<Upload className="w-4 h-4" />}
                >
                  Seleccionar Foto
                </Button>
              </label>
            </div>
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedCliente ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, title: '', description: '', onConfirm: () => {} })}
        title={alertState.title}
        description={alertState.description}
        onConfirm={alertState.onConfirm}
        type="danger"
      />
    </div>
  );
}