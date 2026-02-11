import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Card } from '../../Card';
import { Button } from '../../Button';
import { Form, FormField, FormActions } from '../../Form';
import { Plus, Shield, Check, X } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { roles as rolesAPI } from '../../../services/api';

interface Role {
  id: string;
  nombre: 'Administrador' | 'Asesor' | 'Productor' | 'Repartidor' | 'Cliente';
  descripcion: string;
  permisos: string[];
  estado: 'Activo' | 'Inactivo';
  usuarios: number;
}

// Lista de todos los permisos disponibles en el sistema
const todosLosPermisos = [
  // Dashboard
  { modulo: 'Dashboard', permiso: 'Ver Dashboard' },
  
  // Usuarios
  { modulo: 'Usuarios', permiso: 'Ver Usuarios' },
  { modulo: 'Usuarios', permiso: 'Crear Usuarios' },
  { modulo: 'Usuarios', permiso: 'Editar Usuarios' },
  { modulo: 'Usuarios', permiso: 'Eliminar Usuarios' },
  
  // Roles
  { modulo: 'Configuración', permiso: 'Ver Roles' },
  { modulo: 'Configuración', permiso: 'Asignar Permisos' },
  
  // Compras
  { modulo: 'Compras', permiso: 'Ver Proveedores' },
  { modulo: 'Compras', permiso: 'Crear Proveedores' },
  { modulo: 'Compras', permiso: 'Editar Proveedores' },
  { modulo: 'Compras', permiso: 'Ver Compras' },
  { modulo: 'Compras', permiso: 'Registrar Compras' },
  { modulo: 'Compras', permiso: 'Anular Compras' },
  { modulo: 'Compras', permiso: 'Ver Productos' },
  { modulo: 'Compras', permiso: 'Crear Productos' },
  { modulo: 'Compras', permiso: 'Editar Productos' },
  { modulo: 'Compras', permiso: 'Ver Categorías' },
  { modulo: 'Compras', permiso: 'Crear Categorías' },
  
  // Producción
  { modulo: 'Producción', permiso: 'Ver Insumos' },
  { modulo: 'Producción', permiso: 'Entregar Insumos' },
  { modulo: 'Producción', permiso: 'Ver Producción' },
  { modulo: 'Producción', permiso: 'Registrar Producción' },
  
  // Ventas
  { modulo: 'Ventas', permiso: 'Ver Clientes' },
  { modulo: 'Ventas', permiso: 'Crear Clientes' },
  { modulo: 'Ventas', permiso: 'Editar Clientes' },
  { modulo: 'Ventas', permiso: 'Ver Ventas' },
  { modulo: 'Ventas', permiso: 'Registrar Ventas' },
  { modulo: 'Ventas', permiso: 'Anular Ventas' },
  { modulo: 'Ventas', permiso: 'Ver Abonos' },
  { modulo: 'Ventas', permiso: 'Registrar Abonos' },
  { modulo: 'Ventas', permiso: 'Ver Pedidos' },
  { modulo: 'Ventas', permiso: 'Crear Pedidos' },
  { modulo: 'Ventas', permiso: 'Ver Domicilios' },
  { modulo: 'Ventas', permiso: 'Gestionar Domicilios' },
];

export function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nombre: '' as 'Administrador' | 'Asesor' | 'Productor' | 'Repartidor' | 'Cliente',
    descripcion: ''
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesAPI.getAll();
      setRoles(data);
    } catch (error) {
      console.error('Error cargando roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    { key: 'nombre', label: 'Rol' },
    { key: 'descripcion', label: 'Descripción' },
    { 
      key: 'permisos', 
      label: 'Permisos Asignados',
      render: (permisos: string[]) => (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
            {permisos.length} permisos
          </span>
        </div>
      )
    },
    { 
      key: 'usuarios', 
      label: 'Usuarios',
      render: (value: number) => `${value} usuario${value !== 1 ? 's' : ''}`
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string, role: Role) => (
        <select
          value={estado}
          onChange={(e) => handleEstadoChange(role.id, e.target.value as 'Activo' | 'Inactivo')}
          className={`px-3 py-1 rounded-full text-xs border-0 cursor-pointer ${
            estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      )
    }
  ];

  const handleEstadoChange = async (id: string, nuevoEstado: 'Activo' | 'Inactivo') => {
    try {
      await rolesAPI.update(id, { estado: nuevoEstado });
      await loadRoles();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo cambiar el estado del rol',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRole = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        permisos: [],
        estado: 'Activo'
      };
      await rolesAPI.create(newRole);
      await loadRoles();
      setIsCreateModalOpen(false);
      setFormData({ nombre: '' as any, descripcion: '' });
      showAlert({
        title: 'Éxito',
        description: 'Rol creado correctamente',
        type: 'success',
        confirmText: 'Aceptar',
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Error creando rol:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo crear el rol',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      try {
        await rolesAPI.update(selectedRole.id, {
          nombre: formData.nombre,
          descripcion: formData.descripcion
        });
        await loadRoles();
        setIsEditModalOpen(false);
        setSelectedRole(null);
        setFormData({ nombre: '' as any, descripcion: '' });
        showAlert({
          title: 'Éxito',
          description: 'Rol actualizado correctamente',
          type: 'success',
          confirmText: 'Aceptar',
          onConfirm: () => {}
        });
      } catch (error) {
        console.error('Error actualizando rol:', error);
        showAlert({
          title: 'Error',
          description: 'No se pudo actualizar el rol',
          type: 'warning',
          confirmText: 'Entendido',
          onConfirm: () => {}
        });
      }
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({ nombre: role.nombre, descripcion: role.descripcion });
    setIsEditModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    if (role.usuarios > 0) {
      showAlert({
        title: 'No se puede eliminar',
        description: `No se puede eliminar el rol ${role.nombre} porque tiene ${role.usuarios} usuario(s) asignado(s).`,
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }
    showAlert({
      title: '¿Eliminar rol?',
      description: `¿Está seguro de eliminar el rol ${role.nombre}?`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await rolesAPI.delete(role.id);
          await loadRoles();
        } catch (error) {
          console.error('Error eliminando rol:', error);
          showAlert({
            title: 'Error',
            description: 'No se pudo eliminar el rol',
            type: 'warning',
            confirmText: 'Entendido',
            onConfirm: () => {}
          });
        }
      }
    });
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setIsDetailModalOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permisos);
    setIsPermissionsModalOpen(true);
  };

  const togglePermission = (permiso: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permiso)
        ? prev.filter(p => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleSavePermissions = async () => {
    if (selectedRole) {
      try {
        await rolesAPI.update(selectedRole.id, { permisos: selectedPermissions });
        await loadRoles();
        setIsPermissionsModalOpen(false);
        showAlert({
          title: 'Éxito',
          description: 'Permisos actualizados correctamente',
          type: 'success',
          confirmText: 'Aceptar',
          onConfirm: () => {}
        });
      } catch (error) {
        console.error('Error guardando permisos:', error);
        showAlert({
          title: 'Error',
          description: 'No se pudieron guardar los permisos',
          type: 'warning',
          confirmText: 'Entendido',
          onConfirm: () => {}
        });
      }
    }
  };

  // Agrupar permisos por módulo
  const permisosPorModulo = todosLosPermisos.reduce((acc, { modulo, permiso }) => {
    if (!acc[modulo]) acc[modulo] = [];
    acc[modulo].push(permiso);
    return acc;
  }, {} as { [key: string]: string[] });

  return (
    <div className="space-y-6">
      {AlertComponent}
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Roles</h2>
          <p className="text-muted-foreground">Administra los roles y sus permisos en el sistema</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setIsCreateModalOpen(true)}>
          Nuevo Rol
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        actions={[
          commonActions.view(handleView),
          {
            label: 'Gestionar Permisos',
            icon: <Shield className="w-4 h-4" />,
            onClick: handleManagePermissions,
            variant: 'default'
          },
          commonActions.edit(handleEdit),
          commonActions.delete(handleDelete)
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar roles..."
      />

      {/* Modal de Crear Rol */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ nombre: '' as any, descripcion: '' });
        }}
        title="Crear Nuevo Rol"
        size="md"
      >
        <Form onSubmit={handleCreateRole}>
          <FormField
            label="Nombre del Rol"
            name="nombre"
            type="select"
            value={formData.nombre}
            onChange={(value) => setFormData({ ...formData, nombre: value as any })}
            options={[
              { value: 'Administrador', label: 'Administrador' },
              { value: 'Asesor', label: 'Asesor' },
              { value: 'Productor', label: 'Productor' },
              { value: 'Repartidor', label: 'Repartidor' },
              { value: 'Cliente', label: 'Cliente' }
            ]}
            required
          />
          
          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            value={formData.descripcion}
            onChange={(value) => setFormData({ ...formData, descripcion: value as string })}
            rows={3}
            required
          />
          
          <FormActions>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ nombre: '' as any, descripcion: '' });
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Crear Rol
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal de Editar Rol */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
          setFormData({ nombre: '' as any, descripcion: '' });
        }}
        title={`Editar Rol - ${selectedRole?.nombre}`}
        size="md"
      >
        <Form onSubmit={handleUpdateRole}>
          <FormField
            label="Nombre del Rol"
            name="nombre"
            type="select"
            value={formData.nombre}
            onChange={(value) => setFormData({ ...formData, nombre: value as any })}
            options={[
              { value: 'Administrador', label: 'Administrador' },
              { value: 'Asesor', label: 'Asesor' },
              { value: 'Productor', label: 'Productor' },
              { value: 'Repartidor', label: 'Repartidor' },
              { value: 'Cliente', label: 'Cliente' }
            ]}
            required
          />
          
          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            value={formData.descripcion}
            onChange={(value) => setFormData({ ...formData, descripcion: value as string })}
            rows={3}
            required
          />
          
          <FormActions>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedRole(null);
                setFormData({ nombre: '' as any, descripcion: '' });
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Cambios
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal de Detalle */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRole(null);
        }}
        title={`Detalle de Rol - ${selectedRole?.nombre}`}
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nombre del Rol</p>
                <p>{selectedRole.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedRole.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedRole.estado}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p>{selectedRole.descripcion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Asignados</p>
                <p>{selectedRole.usuarios} usuario{selectedRole.usuarios !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Permisos Asignados</p>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {selectedRole.permisos.length} permisos
                </span>
              </div>
            </div>

            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">Lista de Permisos</p>
              {selectedRole.permisos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRole.permisos.map((permiso) => (
                    <div key={permiso} className="flex items-center gap-2 p-2 bg-background rounded border">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{permiso}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sin permisos asignados</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedRole(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Gestión de Permisos */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title={`Gestionar Permisos - ${selectedRole?.nombre}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">
              Selecciona los permisos que deseas asignar al rol <strong>{selectedRole?.nombre}</strong>.
              Los permisos activos están marcados con una palomita verde.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span>Permisos seleccionados: <strong>{selectedPermissions.length}</strong> de {todosLosPermisos.length}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPermissions(todosLosPermisos.map(p => p.permiso))}
              >
                Seleccionar Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPermissions([])}
              >
                Quitar Todos
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(permisosPorModulo).map(([modulo, permisos]) => (
              <Card key={modulo}>
                <h4 className="mb-3 text-primary">{modulo}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {permisos.map((permiso) => {
                    const isSelected = selectedPermissions.includes(permiso);
                    return (
                      <button
                        key={permiso}
                        onClick={() => togglePermission(permiso)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-5 h-5 rounded border-2 ${
                          isSelected
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={isSelected ? 'text-foreground' : 'text-muted-foreground'}>
                          {permiso}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsPermissionsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSavePermissions} className="flex-1">
              Guardar Permisos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}