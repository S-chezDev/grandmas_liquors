import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus } from 'lucide-react';
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
  estado: 'Activo' | 'Inactivo';
  created_at?: string;
}

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Array<{value: string, label: string}>>([]);
  const [loading, setLoading] = useState(true);
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
    tipo_documento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    documento: '',
    direccion: '',
    email: '',
    telefono: '',
    password: '',
    rol_id: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  useEffect(() => {
    loadUsuarios();
    loadRoles();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosAPI.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await rolesAPI.getAll();
      const rolesOptions = data.map((rol: any) => ({
        value: rol.id.toString(),
        label: rol.nombre
      }));
      setRoles(rolesOptions);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

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
    setFormData({ nombre: '', apellido: '', tipo_documento: 'CC', documento: '', direccion: '', email: '', telefono: '', password: '', rol_id: '', estado: 'Activo' });
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
      password: '',
      rol_id: usuario.rol_id?.toString() || '',
      estado: usuario.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setAlertState({
      isOpen: true,
      title: 'Confirmar eliminación',
      description: `¿Está seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellido}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await usuariosAPI.delete(usuario.id);
          await loadUsuarios();
        } catch (error) {
          console.error('Error eliminando usuario:', error);
          alert('Error al eliminar el usuario');
        }
      }
    });
  };

  const handleChangeState = async (usuario: Usuario) => {
    try {
      const newState = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await usuariosAPI.update(usuario.id, { estado: newState });
      await loadUsuarios();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        tipo_documento: formData.tipo_documento,
        documento: formData.documento,
        direccion: formData.direccion,
        email: formData.email,
        telefono: formData.telefono,
        rol_id: parseInt(formData.rol_id),
        estado: formData.estado,
        ...((!selectedUsuario || formData.password) && { password: formData.password })
      };

      if (selectedUsuario) {
        await usuariosAPI.update(selectedUsuario.id, dataToSend);
      } else {
        await usuariosAPI.create(dataToSend);
      }
      await loadUsuarios();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error al guardar el usuario');
    }
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
            name="tipo_documento"
            type="select"
            value={formData.tipo_documento}
            onChange={(value) => setFormData({ ...formData, tipo_documento: value as 'CC' | 'CE' | 'TI' | 'Pasaporte' })}
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
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value as string })}
            placeholder={selectedUsuario ? "Dejar vacío para mantener la actual" : "Contraseña"}
            required={!selectedUsuario}
          />
          
          <FormField
            label="Rol"
            name="rol_id"
            type="select"
            value={formData.rol_id}
            onChange={(value) => setFormData({ ...formData, rol_id: value as string })}
            options={roles}
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
                <p>{selectedUsuario.tipo_documento}</p>
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
                <p>{selectedUsuario.created_at ? new Date(selectedUsuario.created_at).toLocaleDateString() : 'N/A'}</p>
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