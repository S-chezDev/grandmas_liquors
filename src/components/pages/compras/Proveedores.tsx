import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Building2, User, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { proveedores as proveedoresAPI } from '../../../services/api';

interface Proveedor {
  id: string;
  tipo_persona: 'Juridica' | 'Natural';
  // Para Persona Jurídica
  nombre_empresa?: string;
  nit?: string;
  // Para Persona Natural
  nombre?: string;
  apellido?: string;
  tipo_documento?: 'CC' | 'CE' | 'TI' | 'Pasaporte';
  numero_documento?: string;
  // Comunes
  telefono: string;
  email: string;
  direccion: string;
  estado: 'Activo' | 'Inactivo';
}

export function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [formData, setFormData] = useState({
    tipo_persona: 'Juridica' as 'Juridica' | 'Natural',
    nombre_empresa: '',
    nit: '',
    nombre: '',
    apellido: '',
    tipo_documento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    numero_documento: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  // Cargar proveedores al montar el componente
  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const data = await proveedoresAPI.getAll();
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudieron cargar los proveedores. Verifique que el backend esté activo.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    { 
      key: 'tipo_persona', 
      label: 'Tipo',
      render: (tipo: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          tipo === 'Juridica' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-purple-100 text-purple-700'
        }`}>
          {tipo === 'Juridica' ? <Building2 className="w-3 h-3 inline mr-1" /> : <User className="w-3 h-3 inline mr-1" />}
          {tipo === 'Juridica' ? 'Jurídica' : 'Natural'}
        </span>
      )
    },
    { 
      key: 'nombre', 
      label: 'Nombre/Razón Social',
      render: (_, proveedor: Proveedor) => {
        if (proveedor.tipo_persona === 'Juridica') {
          return proveedor.nombre_empresa;
        }
        return `${proveedor.nombre} ${proveedor.apellido}`;
      }
    },
    { 
      key: 'documento', 
      label: 'NIT/Documento',
      render: (_, proveedor: Proveedor) => {
        if (proveedor.tipo_persona === 'Juridica') {
          return proveedor.nit;
        }
        return `${proveedor.tipo_documento} ${proveedor.numero_documento}`;
      }
    },
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
    setSelectedProveedor(null);
    setFormData({ 
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
      estado: 'Activo'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setFormData({
      tipo_persona: proveedor.tipo_persona,
      nombre_empresa: proveedor.nombre_empresa || '',
      nit: proveedor.nit || '',
      nombre: proveedor.nombre || '',
      apellido: proveedor.apellido || '',
      tipo_documento: proveedor.tipo_documento || 'CC',
      numero_documento: proveedor.numero_documento || '',
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      estado: proveedor.estado
    });
    setIsModalOpen(true);
  };

  const handleToggleEstado = async (proveedor: Proveedor) => {
    const nuevoEstado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo';
    showAlert({
      title: 'Cambiar estado',
      description: `¿Está seguro de cambiar el estado del proveedor a "${nuevoEstado}"?`,
      type: 'warning',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await proveedoresAPI.update(Number(proveedor.id), { estado: nuevoEstado });
          await loadProveedores();
        } catch (error) {
          console.error('Error al cambiar estado:', error);
        }
      }
    });
  };

  const handleView = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (proveedor: Proveedor) => {
    const nombreProveedor = proveedor.tipo_persona === 'Juridica' 
      ? proveedor.nombre_empresa 
      : `${proveedor.nombre} ${proveedor.apellido}`;
    
    showAlert({
      title: '¿Eliminar proveedor?',
      description: `¿Está seguro de eliminar el proveedor "${nombreProveedor}"?`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await proveedoresAPI.delete(Number(proveedor.id));
          await loadProveedores();
          showAlert({
            title: 'Éxito',
            description: 'Proveedor eliminado correctamente',
            type: 'success',
            confirmText: 'Entendido',
            onConfirm: () => {}
          });
        } catch (error) {
          console.error('Error al eliminar proveedor:', error);
          showAlert({
            title: 'Error',
            description: 'No se pudo eliminar el proveedor',
            type: 'danger',
            confirmText: 'Entendido',
            onConfirm: () => {}
          });
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        // Limpiar campos no usados según tipo de persona
        ...(formData.tipo_persona === 'Juridica' 
          ? { nombre: undefined, apellido: undefined, tipo_documento: undefined, numero_documento: undefined }
          : { nombre_empresa: undefined, nit: undefined }
        )
      };
      
      if (selectedProveedor) {
        await proveedoresAPI.update(Number(selectedProveedor.id), dataToSend);
      } else {
        await proveedoresAPI.create(dataToSend);
      }
      await loadProveedores();
      setIsModalOpen(false);
      showAlert({
        title: 'Éxito',
        description: `Proveedor ${selectedProveedor ? 'actualizado' : 'creado'} correctamente`,
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo guardar el proveedor',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    }
  };

  return (
    <div className="space-y-6">
      {AlertComponent}
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Proveedores</h2>
          <p className="text-muted-foreground">Administra los proveedores de la empresa</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nuevo Proveedor
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando proveedores...</div>
      ) : (
        <DataTable
          columns={columns}
          data={proveedores}
          actions={[
            {
              label: 'Cambiar Estado',
              icon: <ToggleRight className="w-4 h-4" />,
              onClick: handleToggleEstado,
              variant: 'outline'
            },
            commonActions.view(handleView),
            commonActions.edit(handleEdit),
            commonActions.delete(handleDelete)
          ]}
          onSearch={(query) => console.log('Searching:', query)}
          searchPlaceholder="Buscar proveedores..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          {/* Selector de Tipo de Persona */}
          <div className="mb-6">
            <label className="block mb-3">Tipo de Proveedor</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo_persona: 'Juridica' })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.tipo_persona === 'Juridica'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                  formData.tipo_persona === 'Juridica' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div className={formData.tipo_persona === 'Juridica' ? 'text-primary' : 'text-muted-foreground'}>
                  Persona Jurídica
                </div>
                <p className="text-xs text-muted-foreground mt-1">Empresa o Sociedad</p>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo_persona: 'Natural' })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.tipo_persona === 'Natural'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <User className={`w-8 h-8 mx-auto mb-2 ${
                  formData.tipo_persona === 'Natural' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div className={formData.tipo_persona === 'Natural' ? 'text-primary' : 'text-muted-foreground'}>
                  Persona Natural
                </div>
                <p className="text-xs text-muted-foreground mt-1">Persona Individual</p>
              </button>
            </div>
          </div>

          {/* Campos para Persona Jurídica */}
          {formData.tipo_persona === 'Juridica' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Nombre de la Empresa"
                name="nombre_empresa"
                value={formData.nombre_empresa}
                onChange={(value) => setFormData({ ...formData, nombre_empresa: value as string })}
                placeholder="Ej: Distribuidora Nacional S.A.S"
                required
              />
              
              <FormField
                label="NIT"
                name="nit"
                value={formData.nit}
                onChange={(value) => setFormData({ ...formData, nit: value as string })}
                placeholder="900.123.456-7"
                required
              />
            </div>
          )}

          {/* Campos para Persona Natural */}
          {formData.tipo_persona === 'Natural' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(value) => setFormData({ ...formData, nombre: value as string })}
                  placeholder="Juan"
                  required
                />
                
                <FormField
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={(value) => setFormData({ ...formData, apellido: value as string })}
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
                  onChange={(value) => setFormData({ ...formData, tipo_documento: value as any })}
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
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={(value) => setFormData({ ...formData, numero_documento: value as string })}
                  placeholder="1234567890"
                  required
                />
              </div>
            </>
          )}

          {/* Campos Comunes */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={(value) => setFormData({ ...formData, telefono: value as string })}
              placeholder="604 123 4567"
              required
            />
            
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value as string })}
              placeholder="contacto@proveedor.com"
              required
            />
          </div>
          
          <FormField
            label="Dirección"
            name="direccion"
            type="textarea"
            value={formData.direccion}
            onChange={(value) => setFormData({ ...formData, direccion: value as string })}
            placeholder="Dirección completa del proveedor"
            rows={2}
            required
          />

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedProveedor ? 'Actualizar' : 'Crear'} Proveedor
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProveedor(null);
        }}
        title={`Detalle de Proveedor - ${selectedProveedor?.tipoPersona === 'Juridica' ? selectedProveedor.nombreEmpresa : `${selectedProveedor?.nombre} ${selectedProveedor?.apellido}`}`}
        size="lg"
      >
        {selectedProveedor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Proveedor</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  selectedProveedor.tipoPersona === 'Juridica' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {selectedProveedor.tipoPersona === 'Juridica' ? <Building2 className="w-3 h-3 inline mr-1" /> : <User className="w-3 h-3 inline mr-1" />}
                  {selectedProveedor.tipoPersona === 'Juridica' ? 'Persona Jurídica' : 'Persona Natural'}
                </span>
              </div>
              
              {selectedProveedor.tipoPersona === 'Juridica' ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">NIT</p>
                    <p>{selectedProveedor.nit}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Razón Social</p>
                    <p>{selectedProveedor.nombreEmpresa}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                    <p>{selectedProveedor.tipoDocumento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Documento</p>
                    <p>{selectedProveedor.numeroDocumento}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p>{selectedProveedor.nombre} {selectedProveedor.apellido}</p>
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
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedProveedor.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedProveedor.estado}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedProveedor(null);
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