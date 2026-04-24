import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Pencil, Trash2, Search, RotateCcw } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { domicilios as domiciliosAPI, pedidos as pedidosAPI } from '../../../services/api';
import { formatDateEsCo } from '../../../utils/date';

interface Domicilio {
  id: string;
  numero_domicilio?: string;
  pedido_id: number;
  pedido?: string;
  cliente?: string;
  direccion: string;
  repartidor: string;
  fecha: string;
  hora: string;
  estado: 'Pendiente' | 'En Camino' | 'Entregado' | 'Cancelado';
  detalle: string;
}

interface StateChangeRequest {
  domicilio: Domicilio;
  from: Domicilio['estado'];
  to: Domicilio['estado'];
}

export function Domicilios() {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    repartidor: '',
    fecha: '',
    estado: ''
  });
  const [pedidosDisponibles, setPedidosDisponibles] = useState<Array<{value: string, label: string}>>([]);
  const [selectedDomicilio, setSelectedDomicilio] = useState<Domicilio | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pendingStateChange, setPendingStateChange] = useState<StateChangeRequest | null>(null);
  const [stateChangeReason, setStateChangeReason] = useState('');
  const [stateChangeSaving, setStateChangeSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<Domicilio | null>(null);
  const [createFormData, setCreateFormData] = useState<Omit<Domicilio, 'id'>>({
    pedido_id: 0,
    direccion: '',
    repartidor: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '14:00',
    estado: 'Pendiente',
    detalle: ''
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    loadDomicilios();
    loadPedidos();
  }, []);

  const loadDomicilios = async () => {
    try {
      setLoading(true);
      const data = await domiciliosAPI.getAll();
      setDomicilios(data);
    } catch (error) {
      console.error('Error cargando domicilios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPedidos = async () => {
    try {
      const data = await pedidosAPI.getAll();
      setPedidosDisponibles(data.map((p: any) => ({
        value: p.id.toString(),
        label: `${p.numero_pedido || p.id} - ${p.cliente || 'Sin cliente'}`
      })));
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    }
  };

  const columns: Column[] = [
    { key: 'numero_domicilio', label: 'ID Domicilio' },
    { key: 'pedido', label: 'Pedido' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'repartidor', label: 'Repartidor' },
    { key: 'fecha', label: 'Fecha', render: (fecha: string) => formatDateEsCo(fecha) },
    { key: 'hora', label: 'Hora' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string, domicilio: Domicilio) => (
        <select
          value={estado}
          onChange={(e) => handleEstadoChangeRequest(domicilio, e.target.value as Domicilio['estado'])}
          disabled={stateChangeSaving}
          className={`min-h-8 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
            estado === 'Entregado' ? 'bg-green-100 text-green-700' :
            estado === 'En Camino' ? 'bg-blue-100 text-blue-700' :
            estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Camino">En Camino</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      )
    }
  ];

  const repartidoresOptions = useMemo(
    () => Array.from(new Set(domicilios.map((domicilio) => domicilio.repartidor).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es')),
    [domicilios]
  );

  const domiciliosFiltrados = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return domicilios.filter((domicilio) => {
      const matchesQuery =
        !normalizedQuery ||
        String(domicilio.numero_domicilio || domicilio.id).toLowerCase().includes(normalizedQuery) ||
        String(domicilio.cliente || '').toLowerCase().includes(normalizedQuery) ||
        String(domicilio.direccion || '').toLowerCase().includes(normalizedQuery);
      const matchesRepartidor = !filters.repartidor || domicilio.repartidor === filters.repartidor;
      const matchesFecha = !filters.fecha || String(domicilio.fecha || '').includes(filters.fecha);
      const matchesEstado = !filters.estado || domicilio.estado === filters.estado;
      return matchesQuery && matchesRepartidor && matchesFecha && matchesEstado;
    });
  }, [domicilios, filters]);

  const handleEstadoChangeRequest = (domicilio: Domicilio, nuevoEstado: Domicilio['estado']) => {
    if (domicilio.estado === nuevoEstado) return;

    setPendingStateChange({
      domicilio,
      from: domicilio.estado,
      to: nuevoEstado,
    });
    setStateChangeReason('');
  };

  const handleConfirmEstadoChange = async () => {
    if (!pendingStateChange) return;

    if (pendingStateChange.to === 'Cancelado' && stateChangeReason.trim().length < 10) {
      showAlert({
        title: 'Motivo requerido',
        description: 'Para cancelar el domicilio debes indicar un motivo de al menos 10 caracteres.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStateChangeSaving(true);
      await domiciliosAPI.update(Number(pendingStateChange.domicilio.id), {
        estado: pendingStateChange.to,
        detalle: stateChangeReason.trim() || undefined,
      });
      await loadDomicilios();
      setPendingStateChange(null);
      setStateChangeReason('');
      showAlert({
        title: 'Estado actualizado',
        description: 'El estado del domicilio fue actualizado correctamente.',
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo actualizar el estado del domicilio.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setStateChangeSaving(false);
    }
  };

  const handleCancelEstadoChange = () => {
    setPendingStateChange(null);
    setStateChangeReason('');
  };

  const handleView = (domicilio: Domicilio) => {
    setSelectedDomicilio(domicilio);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (domicilio: Domicilio) => {
    setEditFormData(domicilio);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (domicilio: Domicilio) => {
    showAlert({
      title: '¿Eliminar domicilio?',
      description: `¿Está seguro de eliminar el domicilio ${domicilio.numero_domicilio || domicilio.id}?`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await domiciliosAPI.delete(Number(domicilio.id));
          await loadDomicilios();
        } catch (error) {
          console.error('Error eliminando domicilio:', error);
        }
      }
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      try {
        await domiciliosAPI.update(Number(editFormData.id), editFormData);
        await loadDomicilios();
        setIsEditModalOpen(false);
        setEditFormData(null);
      } catch (error) {
        console.error('Error actualizando domicilio:', error);
        alert('Error al actualizar el domicilio');
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await domiciliosAPI.create(createFormData);
      await loadDomicilios();
      setIsCreateModalOpen(false);
      setCreateFormData({
        pedido_id: 0,
        direccion: '',
        repartidor: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '14:00',
        estado: 'Pendiente',
        detalle: ''
      });
    } catch (error) {
      console.error('Error creando domicilio:', error);
      alert('Error al crear el domicilio');
    }
  };

  return (
    <div className="space-y-6">
      {AlertComponent}
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Domicilios</h2>
          <p className="text-muted-foreground">Administra las entregas a domicilio</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setIsCreateModalOpen(true)}>
          Nuevo Domicilio
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
              placeholder="Buscar domicilio por ID, cliente o dirección..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setFilters({ query: '', repartidor: '', fecha: '', estado: '' })}
            disabled={!filters.query.trim() && !filters.repartidor && !filters.fecha && !filters.estado}
          >
            Limpiar filtros
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={filters.repartidor}
            onChange={(event) => setFilters((current) => ({ ...current, repartidor: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Repartidor (todos)</option>
            {repartidoresOptions.map((repartidor) => (
              <option key={repartidor} value={repartidor}>
                {repartidor}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.fecha}
            onChange={(event) => setFilters((current) => ({ ...current, fecha: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={filters.estado}
            onChange={(event) => setFilters((current) => ({ ...current, estado: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Estado (todos)</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Camino">En Camino</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={domiciliosFiltrados}
        actions={[
          commonActions.view(handleView),
          {
            label: 'Editar',
            icon: <Pencil className="w-4 h-4" />,
            onClick: handleEdit,
            variant: 'default'
          },
          {
            label: 'Eliminar',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: handleDelete,
            variant: 'danger'
          }
        ]}
      />

      {loading && (
        <div className="text-center py-8">
          <p>Cargando domicilios...</p>
        </div>
      )}

      <Modal
        isOpen={Boolean(pendingStateChange)}
        onClose={handleCancelEstadoChange}
        title={`Cambiar estado - Domicilio ${pendingStateChange?.domicilio.numero_domicilio || pendingStateChange?.domicilio.id || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Estado actual: {pendingStateChange?.from || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Nuevo estado: {pendingStateChange?.to || 'N/A'}</p>
          </div>

          {pendingStateChange?.to === 'Cancelado' ? (
            <FormField
              label="Motivo del cambio"
              name="motivo-cambio-domicilio"
              type="textarea"
              value={stateChangeReason}
              onChange={(value) => setStateChangeReason(String(value))}
              rows={3}
              required
              placeholder="Explica por qué se cancela el domicilio (mínimo 10 caracteres)"
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
        title={`Detalle de Domicilio ${selectedDomicilio?.id}`}
        size="lg"
      >
        {selectedDomicilio && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID Domicilio</p>
                <p>{selectedDomicilio.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pedido</p>
                <p>{selectedDomicilio.pedido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p>{selectedDomicilio.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{selectedDomicilio.direccion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repartidor</p>
                <p>{selectedDomicilio.repartidor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p>{selectedDomicilio.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hora</p>
                <p>{selectedDomicilio.hora}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedDomicilio.estado === 'Entregado' ? 'bg-green-100 text-green-700' :
                  selectedDomicilio.estado === 'En Camino' ? 'bg-blue-100 text-blue-700' :
                  selectedDomicilio.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedDomicilio.estado}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Detalle del Pedido</p>
              <p>{selectedDomicilio.detalle}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditFormData(null);
        }}
        title={`Editar Domicilio ${editFormData?.id}`}
        size="lg"
      >
        {editFormData && (
          <Form onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Pedido"
                name="pedido_id"
                type="select"
                value={editFormData.pedido_id.toString()}
                onChange={(value) => setEditFormData({ ...editFormData, pedido_id: parseInt(value as string) })}
                options={pedidosDisponibles}
                required
              />
              
              <FormField
                label="Repartidor"
                name="repartidor"
                type="select"
                value={editFormData.repartidor}
                onChange={(value) => setEditFormData({ ...editFormData, repartidor: value as string })}
                options={[
                  { value: 'Carlos Domiciliario', label: 'Carlos Domiciliario' },
                  { value: 'Luis Mensajero', label: 'Luis Mensajero' },
                  { value: 'Ana Repartidora', label: 'Ana Repartidora' }
                ]}
                required
              />
              
              <FormField
                label="Dirección"
                name="direccion"
                value={editFormData.direccion}
                onChange={(value) => setEditFormData({ ...editFormData, direccion: value as string })}
                required
              />
              
              <FormField
                label="Fecha"
                name="fecha"
                type="date"
                value={editFormData.fecha}
                onChange={(value) => setEditFormData({ ...editFormData, fecha: value as string })}
                required
              />
              
              <FormField
                label="Hora"
                name="hora"
                type="time"
                value={editFormData.hora}
                onChange={(value) => setEditFormData({ ...editFormData, hora: value as string })}
                required
              />
            </div>
            
            <FormField
              label="Detalle del Pedido"
              name="detalle"
              type="textarea"
              value={editFormData.detalle}
              onChange={(value) => setEditFormData({ ...editFormData, detalle: value as string })}
              rows={3}
              required
            />
            
            <FormActions>
              <Button variant="outline" onClick={() => {
                setIsEditModalOpen(false);
                setEditFormData(null);
              }}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </FormActions>
          </Form>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateFormData({
            pedido_id: 0,
            direccion: '',
            repartidor: '',
            fecha: new Date().toISOString().split('T')[0],
            hora: '14:00',
            estado: 'Pendiente',
            detalle: ''
          });
        }}
        title="Crear Nuevo Domicilio"
        size="lg"
      >
        <Form onSubmit={handleCreate}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Pedido"
              name="pedido_id"
              type="select"
              value={createFormData.pedido_id.toString()}
              onChange={(value) => setCreateFormData({ ...createFormData, pedido_id: parseInt(value as string) })}
              options={pedidosDisponibles}
              required
            />
            
            <FormField
              label="Repartidor"
              name="repartidor"
              type="select"
              value={createFormData.repartidor}
              onChange={(value) => setCreateFormData({ ...createFormData, repartidor: value as string })}
              options={[
                { value: 'Carlos Domiciliario', label: 'Carlos Domiciliario' },
                { value: 'Luis Mensajero', label: 'Luis Mensajero' },
                { value: 'Ana Repartidora', label: 'Ana Repartidora' }
              ]}
              required
            />
            
            <FormField
              label="Dirección"
              name="direccion"
              value={createFormData.direccion}
              onChange={(value) => setCreateFormData({ ...createFormData, direccion: value as string })}
              required
            />
            
            <FormField
              label="Fecha"
              name="fecha"
              type="date"
              value={createFormData.fecha}
              onChange={(value) => setCreateFormData({ ...createFormData, fecha: value as string })}
              required
            />
            
            <FormField
              label="Hora"
              name="hora"
              type="time"
              value={createFormData.hora}
              onChange={(value) => setCreateFormData({ ...createFormData, hora: value as string })}
              required
            />
          </div>
          
          <FormField
            label="Detalle del Pedido"
            name="detalle"
            type="textarea"
            value={createFormData.detalle}
            onChange={(value) => setCreateFormData({ ...createFormData, detalle: value as string })}
            rows={3}
            required
          />
          
          <FormActions>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setCreateFormData({
                pedido: '',
                cliente: '',
                direccion: '',
                repartidor: '',
                fecha: new Date().toISOString().split('T')[0],
                hora: '14:00',
                estado: 'Pendiente',
                detalle: ''
              });
            }}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Domicilio
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
}