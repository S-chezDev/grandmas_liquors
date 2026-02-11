import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { domicilios as domiciliosAPI, pedidos as pedidosAPI } from '../../../services/api';

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

export function Domicilios() {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidosDisponibles, setPedidosDisponibles] = useState<Array<{value: string, label: string}>>([]);
  const [selectedDomicilio, setSelectedDomicilio] = useState<Domicilio | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string, domicilio: Domicilio) => (
        <select
          value={estado}
          onChange={(e) => handleEstadoChange(domicilio.id, e.target.value as Domicilio['estado'])}
          className={`px-3 py-1 rounded-full text-xs border-0 cursor-pointer ${
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

  const handleEstadoChange = async (id: string, nuevoEstado: Domicilio['estado']) => {
    try {
      await domiciliosAPI.update(Number(id), { estado: nuevoEstado });
      await loadDomicilios();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
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

      <DataTable
        columns={columns}
        data={domicilios}
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
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar domicilios..."
      />

      {loading && (
        <div className="text-center py-8">
          <p>Cargando domicilios...</p>
        </div>
      )}

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