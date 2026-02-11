import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, UserCircle, RefreshCcw, Upload } from 'lucide-react';
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

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

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
    tipo_documento: 'CC' as 'CC' | 'CE' | 'TI' | 'PP',
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
      render: (estado: string) => (
        <span className={`px-3 py-1 rounded-full text-xs ${
          estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {estado}
        </span>
      )
    }
  ];

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

  const handleToggleEstado = async (cliente: Cliente) => {
    const nuevoEstado = cliente.estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await clientesAPI.update(Number(cliente.id), { estado: nuevoEstado });
      await loadClientes();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
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

      {loading ? (
        <div className="text-center py-8">Cargando clientes...</div>
      ) : (
        <DataTable
          columns={columns}
          data={clientes}
          actions={[
            commonActions.view((cliente) => {
              setSelectedCliente(cliente);
              setIsDetailModalOpen(true);
            }),
            {
              label: 'Cambiar Estado',
              icon: <RefreshCcw className="w-4 h-4" />,
              onClick: handleToggleEstado,
              variant: 'primary'
            },
            commonActions.edit(handleEdit),
            commonActions.delete(handleDelete)
          ]}
          onSearch={(query) => console.log('Searching:', query)}
          searchPlaceholder="Buscar clientes..."
        />
      )}

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
              onChange={(value) => setFormData({ ...formData, tipo_documento: value as 'CC' | 'CE' | 'TI' | 'PP' })}
              options={[
                { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
                { value: 'CE', label: 'Cédula de Extranjería (CE)' },
                { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
                { value: 'PP', label: 'Pasaporte (PP)' }
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