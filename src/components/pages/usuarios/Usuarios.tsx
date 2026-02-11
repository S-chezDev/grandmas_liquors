import React, { useState } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus } from 'lucide-react';
import { AlertDialog } from '../../AlertDialog';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  tipoDocumento: 'CC' | 'CE' | 'TI' | 'Pasaporte';
  documento: string;
  direccion: string;
  email: string;
  telefono: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: string;
}

const mockUsuarios: Usuario[] = [
  { 
    id: '1', 
    nombre: 'Nubia Amparo', 
    apellido: 'Acevedo', 
    tipoDocumento: 'CC',
    documento: '43123456',
    direccion: 'Calle 10 #45-67, Medellín',
    email: 'nubiaamparoacevedo@gmail.com', 
    telefono: '324 610 2339', 
    rol: 'Administrador', 
    estado: 'Activo', 
    fechaCreacion: '2024-01-15' 
  },
  { 
    id: '2', 
    nombre: 'Carlos', 
    apellido: 'Gómez', 
    tipoDocumento: 'CC',
    documento: '1020304050',
    direccion: 'Carrera 50 #30-20, Medellín',
    email: 'carlos.gomez@gmail.com', 
    telefono: '300 123 4567', 
    rol: 'Vendedor', 
    estado: 'Activo', 
    fechaCreacion: '2024-03-20' 
  },
  { 
    id: '3', 
    nombre: 'María', 
    apellido: 'Rodríguez', 
    tipoDocumento: 'CC',
    documento: '39876543',
    direccion: 'Avenida 80 #100-15, Medellín',
    email: 'maria.rodriguez@gmail.com', 
    telefono: '310 987 6543', 
    rol: 'Vendedor', 
    estado: 'Activo', 
    fechaCreacion: '2024-05-10' 
  },
  { 
    id: '4', 
    nombre: 'Juan', 
    apellido: 'Pérez', 
    tipoDocumento: 'CC',
    documento: '71234567',
    direccion: 'Calle 33 #70-40, Medellín',
    email: 'juan.perez@gmail.com', 
    telefono: '315 456 7890', 
    rol: 'Bodeguero', 
    estado: 'Activo', 
    fechaCreacion: '2024-06-05' 
  }
];

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    documento: '',
    direccion: '',
    email: '',
    telefono: '',
    rol: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  const columns: Column[] = [
    { 
      key: 'nombre', 
      label: 'Nombre Completo',
      render: (_: any, row: Usuario) => `${row.nombre} ${row.apellido}`
    },
    { key: 'documento', label: 'Documento' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'rol', label: 'Rol' },
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
    setSelectedUsuario(null);
    setFormData({ nombre: '', apellido: '', tipoDocumento: 'CC', documento: '', direccion: '', email: '', telefono: '', rol: '', estado: 'Activo' });
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      tipoDocumento: usuario.tipoDocumento,
      documento: usuario.documento,
      direccion: usuario.direccion,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      estado: usuario.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setAlertState({
      isOpen: true,
      title: 'Confirmar eliminación',
      description: `¿Está seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellido}"? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        setUsuarios(usuarios.filter(u => u.id !== usuario.id));
      }
    });
  };

  const handleChangeState = (usuario: Usuario) => {
    const newState = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    setUsuarios(usuarios.map(u => 
      u.id === usuario.id ? { ...u, estado: newState } : u
    ));
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsuario) {
      setUsuarios(usuarios.map(u => u.id === selectedUsuario.id ? { ...u, ...formData } : u));
    } else {
      const newUsuario: Usuario = {
        id: (usuarios.length + 1).toString(),
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setUsuarios([...usuarios, newUsuario]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nuevo Usuario
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
        actions={[
          commonActions.view(handleView),
          commonActions.edit(handleEdit),
          {
            label: 'Cambiar Estado',
            icon: <span className="text-xs">⚡</span>,
            onClick: handleChangeState,
            variant: 'default'
          },
          commonActions.delete(handleDelete)
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar usuarios..."
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
            onChange={(value) => setFormData({ ...formData, nombre: value as string })}
            placeholder="Ej: Juan"
            required
          />
          
          <FormField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={(value) => setFormData({ ...formData, apellido: value as string })}
            placeholder="Ej: Pérez"
            required
          />
          
          <FormField
            label="Tipo de Documento"
            name="tipoDocumento"
            type="select"
            value={formData.tipoDocumento}
            onChange={(value) => setFormData({ ...formData, tipoDocumento: value as 'CC' | 'CE' | 'TI' | 'Pasaporte' })}
            options={[
              { value: 'CC', label: 'Cédula de Ciudadanía' },
              { value: 'CE', label: 'Cédula de Extranjería' },
              { value: 'TI', label: 'Tarjeta de Identidad' },
              { value: 'Pasaporte', label: 'Pasaporte' }
            ]}
            required
          />
          
          <FormField
            label="Número de Documento"
            name="documento"
            value={formData.documento}
            onChange={(value) => setFormData({ ...formData, documento: value as string })}
            placeholder="Ej: 1020304050"
            required
          />
          
          <FormField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={(value) => setFormData({ ...formData, direccion: value as string })}
            placeholder="Ej: Calle 10 #45-67, Medellín"
            required
          />
          
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value as string })}
            placeholder="ejemplo@email.com"
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
            label="Rol"
            name="rol"
            type="select"
            value={formData.rol}
            onChange={(value) => setFormData({ ...formData, rol: value as string })}
            options={[
              { value: 'Administrador', label: 'Administrador' },
              { value: 'Vendedor', label: 'Vendedor' },
              { value: 'Bodeguero', label: 'Bodeguero' },
              { value: 'Cajero', label: 'Cajero' }
            ]}
            required
          />
          
          <FormField
            label="Estado"
            name="estado"
            type="select"
            value={formData.estado}
            onChange={(value) => setFormData({ ...formData, estado: value as 'Activo' | 'Inactivo' })}
            options={[
              { value: 'Activo', label: 'Activo' },
              { value: 'Inactivo', label: 'Inactivo' }
            ]}
            required
          />

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedUsuario ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUsuario(null);
        }}
        title={`Detalle de Usuario - ${selectedUsuario?.nombre} ${selectedUsuario?.apellido}`}
        size="lg"
      >
        {selectedUsuario && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p>{selectedUsuario.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Apellido</p>
                <p>{selectedUsuario.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                <p>{selectedUsuario.tipoDocumento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de Documento</p>
                <p>{selectedUsuario.documento}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{selectedUsuario.direccion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{selectedUsuario.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p>{selectedUsuario.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rol</p>
                <p>{selectedUsuario.rol}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedUsuario.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedUsuario.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                <p>{selectedUsuario.fechaCreacion}</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedUsuario(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, title: '', description: '', onConfirm: () => {} })}
        title={alertState.title}
        description={alertState.description}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
}