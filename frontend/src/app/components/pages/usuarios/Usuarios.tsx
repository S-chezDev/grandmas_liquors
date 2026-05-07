import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { AlertDialog } from '../../AlertDialog';
import { api } from '../../../services/api';
import type { Usuario } from '../../../services/types';
import { toast } from 'sonner';

type RolCatalogo = { id: number; nombre: string; estado: string };

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<RolCatalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarioEstadoPendiente, setUsuarioEstadoPendiente] = useState<{
    usuario: Usuario;
    nuevoEstado: 'activo' | 'inactivo';
  } | null>(null);
  const [motivoEstado, setMotivoEstado] = useState('');
  const [motivoEliminacion, setMotivoEliminacion] = useState('');
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'info' as 'warning' | 'info' | 'success' | 'danger',
    onConfirm: () => {}
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC' as 'CC' | 'CE' | 'TI' | 'Pasaporte',
    numeroDocumento: '',
    direccion: '',
    email: '',
    telefono: '',
    password: '',
    rol: '',
    estado: 'activo' as 'activo' | 'inactivo'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [filtroRol, setFiltroRol] = useState<string>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  // Estados para validaciones en tiempo real
  const [emailValido, setEmailValido] = useState<boolean | null>(null);
  const [telefonoValido, setTelefonoValido] = useState<boolean | null>(null);
  const [documentoValido, setDocumentoValido] = useState<boolean | null>(null);
  const [passwordValido, setPasswordValido] = useState<boolean | null>(null);

  // Debounce de búsqueda para evitar saturar API
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Cargar usuarios
  useEffect(() => {
    cargarUsuarios({
      q: searchDebounced.length >= 2 ? searchDebounced : '',
      rol: filtroRol,
      estado: filtroEstado,
    });
  }, [searchDebounced, filtroRol, filtroEstado, roles]);

  useEffect(() => {
    api.roles
      .getAll()
      .then((data: unknown) => {
        const rows = Array.isArray(data) ? data : [];
        setRoles(
          rows.map((r: Record<string, unknown>) => ({
            id: Number(r.id),
            nombre: String(r.nombre ?? '').trim(),
            estado: String(r.estado ?? 'Activo').trim(),
          }))
        );
      })
      .catch(() => {
        setRoles([]);
        toast.error('No se pudieron cargar los roles');
      });
  }, []);

  const cargarUsuarios = async (opts: { q?: string; rol?: string; estado?: string } = {}) => {
    const q = opts.q ?? '';
    const rol = opts.rol ?? 'Todos';
    const estado = opts.estado ?? 'Todos';
    try {
      setLoading(true);
      const rolId = rol !== 'Todos' ? roles.find((r) => r.nombre === rol)?.id : undefined;
      const estados = estado === 'Todos' ? '' : estado;
      const data = await api.usuarios.getAll({
        q,
        rol_id: rolId ? String(rolId) : '',
        estados,
      });
      setUsuarios(data);
    } catch (error: any) {
      toast.error('Error al cargar usuarios', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const rolesActivos = roles.filter((r) => r.nombre && r.estado.toLowerCase() !== 'inactivo');

  const opcionesRolModal = (() => {
    const base = rolesActivos.map((r) => ({ value: r.nombre, label: r.nombre }));
    if (selectedUsuario?.rol && !base.some((o) => o.value === selectedUsuario.rol)) {
      return [...base, { value: selectedUsuario.rol, label: `${selectedUsuario.rol} (rol actual)` }];
    }
    return base;
  })();

  // Validaciones en tiempo real
  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTelefono = (telefono: string) => {
    const regex = /^[0-9\s]+$/;
    return regex.test(telefono);
  };

  const validarDocumento = (documento: string) => {
    return documento.length >= 6 && documento.length <= 15;
  };

  const validarPassword = (password: string) => {
    if (password.length < 8) return false;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    return tieneMayuscula && tieneMinuscula && tieneNumero;
  };

  const usuariosFiltrados = usuarios;

  const columns: Column[] = [
    {
      key: 'tipoDocumento',
      label: 'Tipo Doc.',
      render: (tipoDocumento: string) => tipoDocumento
    },
    {
      key: 'numeroDocumento',
      label: 'Documento'
    },
    {
      key: 'nombre',
      label: 'Nombre Completo',
      render: (_: any, row: Usuario) => `${row.nombre} ${row.apellido}`
    },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Usuario) => (
        <select
          value={row.estado}
          onChange={(e) => handleEstadoChange(row, e.target.value as 'activo' | 'inactivo')}
          className="px-3 py-1 rounded-full text-xs border-0 cursor-pointer"
          style={{
            backgroundColor: row.estado === 'activo' ? '#dcfce7' : '#fee2e2',
            color: row.estado === 'activo' ? '#166534' : '#991b1b'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      )
    }
  ];

  const handleEstadoChange = (usuario: Usuario, nuevoEstado: 'activo' | 'inactivo') => {
    if (usuario.estado === nuevoEstado) return;
    setUsuarioEstadoPendiente({ usuario, nuevoEstado });
    setMotivoEstado('');
    setIsEstadoModalOpen(true);
  };

  const confirmarCambioEstado = async () => {
    if (!usuarioEstadoPendiente) return;

    // Validar motivo
    if (motivoEstado.length < 10 || motivoEstado.length > 50) {
      toast.error('Error de validación', {
        description: 'El motivo debe tener entre 10 y 50 caracteres'
      });
      return;
    }

    try {
      await api.usuarios.changeEstado(
        usuarioEstadoPendiente.usuario.id,
        usuarioEstadoPendiente.nuevoEstado,
        motivoEstado
      );

      toast.success('Estado actualizado', {
        description: `Usuario ${
          usuarioEstadoPendiente.nuevoEstado === 'activo' ? 'activado' : 'inactivado'
        } exitosamente`
      });

      setIsEstadoModalOpen(false);
      setMotivoEstado('');
      setUsuarioEstadoPendiente(null);
      cargarUsuarios({
        q: searchDebounced.length >= 2 ? searchDebounced : '',
        rol: filtroRol,
        estado: filtroEstado,
      });
    } catch (error: any) {
      toast.error('Error al cambiar estado', { description: error.message });
      cargarUsuarios({
        q: searchDebounced.length >= 2 ? searchDebounced : '',
        rol: filtroRol,
        estado: filtroEstado,
      });
    }
  };

  const handleAdd = () => {
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      apellido: '',
      tipoDocumento: 'CC',
      numeroDocumento: '',
      direccion: '',
      email: '',
      telefono: '',
      password: '',
      rol: rolesActivos[0]?.nombre ?? '',
      estado: 'activo'
    });
    // Resetear validaciones
    setEmailValido(null);
    setTelefonoValido(null);
    setDocumentoValido(null);
    setPasswordValido(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      tipoDocumento: usuario.tipoDocumento,
      numeroDocumento: usuario.numeroDocumento,
      direccion: usuario.direccion,
      email: usuario.email,
      telefono: usuario.telefono,
      password: '', // No mostramos la contraseña actual
      rol: usuario.rol,
      estado: usuario.estado
    });
    // Validar datos existentes
    setEmailValido(validarEmail(usuario.email));
    setTelefonoValido(validarTelefono(usuario.telefono));
    setDocumentoValido(validarDocumento(usuario.numeroDocumento));
    setPasswordValido(null); // No validar password en edición si está vacía
    setIsModalOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    // Verificar si el usuario está activo
    if (usuario.estado === 'activo') {
      toast.warning('Advertencia de eliminación', {
        description: 'Está intentando eliminar un usuario activo. Se recomienda inactivarlo antes de eliminarlo.'
      });
    }

    setSelectedUsuario(usuario);
    setMotivoEliminacion('');
    setAlertState({
      isOpen: true,
      title: 'Confirmar eliminación',
      description: '',
      type: 'danger',
      onConfirm: () => {}
    });
  };

  const confirmarEliminacion = async () => {
    if (!selectedUsuario) return;

    // Validar motivo
    if (motivoEliminacion.length < 10 || motivoEliminacion.length > 50) {
      toast.error('Error de validación', {
        description: 'El motivo debe tener entre 10 y 50 caracteres'
      });
      return;
    }

    try {
      await api.usuarios.delete(selectedUsuario.id, motivoEliminacion);

      toast.success('Usuario eliminado', {
        description: 'El usuario ha sido eliminado exitosamente'
      });

      setAlertState({ isOpen: false, title: '', description: '', type: 'info', onConfirm: () => {} });
      setMotivoEliminacion('');
      setSelectedUsuario(null);
      cargarUsuarios();
    } catch (error: any) {
      toast.error('Error al eliminar usuario', { description: error.message });
    }
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rol?.trim()) {
      toast.error('Seleccione un rol', {
        description:
          rolesActivos.length === 0
            ? 'No hay roles activos en el sistema. Cree un rol en Gestión de roles.'
            : 'Elija un rol de la lista.',
      });
      return;
    }

    // Validaciones
    if (!validarEmail(formData.email)) {
      toast.error('Email inválido', {
        description: 'Por favor ingrese un email válido'
      });
      return;
    }

    if (!validarTelefono(formData.telefono)) {
      toast.error('Teléfono inválido', {
        description: 'El teléfono solo puede contener números y espacios'
      });
      return;
    }

    if (!validarDocumento(formData.numeroDocumento)) {
      toast.error('Documento inválido', {
        description: 'El documento debe tener entre 6 y 15 caracteres'
      });
      return;
    }

    if (!selectedUsuario && !validarPassword(formData.password)) {
      toast.error('Contraseña inválida', {
        description: 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas y números'
      });
      return;
    }

    // Validar contraseña en edición si se ingresó
    if (selectedUsuario && formData.password && !validarPassword(formData.password)) {
      toast.error('Contraseña inválida', {
        description: 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas y números'
      });
      return;
    }

    try {
      if (selectedUsuario) {
        // Actualizar
        const updates: any = { ...formData };
        if (!formData.password) {
          delete updates.password; // No actualizar contraseña si está vacía
        }

        await api.usuarios.update(selectedUsuario.id, updates, 'Actualización de datos');

        toast.success('Usuario actualizado exitosamente', {
          description: `Los datos de ${formData.nombre} ${formData.apellido} han sido actualizados correctamente.`
        });
      } else {
        // Crear
        await api.usuarios.create(formData);

        toast.success('Usuario creado exitosamente', {
          description: `Se ha enviado un email de bienvenida a ${formData.email}`
        });
      }

      setIsModalOpen(false);
      cargarUsuarios();
    } catch (error: any) {
      toast.error(selectedUsuario ? 'Error al actualizar usuario' : 'Error al crear usuario', {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

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

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, email o documento... (mín. 2, máx. 50 caracteres)"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={50}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="px-3 py-2.5 border border-border rounded-lg bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]"
            >
              <option value="Todos">Filtrar por rol</option>
              {roles
                .filter((r) => r.nombre)
                .map((r) => (
                  <option key={r.id} value={r.nombre}>
                    {r.nombre}
                  </option>
                ))}
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2.5 border border-border rounded-lg bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px]"
            >
              <option value="Todos">Filtrar por estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFiltroRol('Todos');
                setFiltroEstado('Todos');
              }}
              className="px-4"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={usuariosFiltrados}
        actions={[
          {
            label: 'Ver',
            icon: <Eye className="w-4 h-4" />,
            onClick: handleView,
            variant: 'default'
          },
          {
            label: 'Editar',
            icon: <Edit className="w-4 h-4" />,
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

      {/* Modal de Nuevo/Editar Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
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
              placeholder="Ej: Pérez"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Tipo de Documento"
              name="tipoDocumento"
              type="select"
              value={formData.tipoDocumento}
              onChange={(value) => setFormData({ ...formData, tipoDocumento: value as any })}
              options={[
                { value: 'CC', label: 'Cédula de Ciudadanía' },
                { value: 'CE', label: 'Cédula de Extranjería' },
                { value: 'TI', label: 'Tarjeta de Identidad' },
                { value: 'Pasaporte', label: 'Pasaporte' }
              ]}
              required
            />

            {/* Número de Documento con validación visual */}
            <div>
              <label className="block text-sm font-medium mb-2">Número de Documento</label>
              <input
                type="text"
                value={formData.numeroDocumento}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, numeroDocumento: value });
                  if (value) {
                    setDocumentoValido(validarDocumento(value));
                  } else {
                    setDocumentoValido(null);
                  }
                }}
                placeholder="Ej: 1020304050"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  documentoValido === null ? 'border-border focus:ring-primary' :
                  documentoValido ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
                }`}
                required
              />
              {documentoValido === false && (
                <p className="text-xs text-red-600 mt-1">El documento debe tener entre 6 y 15 caracteres</p>
              )}
              {documentoValido === true && (
                <p className="text-xs text-green-600 mt-1">✓ Documento válido</p>
              )}
            </div>
          </div>

          <FormField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={(value) => setFormData({ ...formData, direccion: value as string })}
            placeholder="Ej: Calle 10 #45-67, Medellín"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Email con validación visual */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, email: value });
                  if (value) {
                    setEmailValido(validarEmail(value));
                  } else {
                    setEmailValido(null);
                  }
                }}
                placeholder="ejemplo@email.com"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  emailValido === null ? 'border-border focus:ring-primary' :
                  emailValido ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
                }`}
                required
              />
              {emailValido === false && (
                <p className="text-xs text-red-600 mt-1">Formato de email inválido</p>
              )}
              {emailValido === true && (
                <p className="text-xs text-green-600 mt-1">✓ Email válido</p>
              )}
            </div>

            {/* Teléfono con validación visual */}
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, telefono: value });
                  if (value) {
                    setTelefonoValido(validarTelefono(value));
                  } else {
                    setTelefonoValido(null);
                  }
                }}
                placeholder="300 123 4567"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  telefonoValido === null ? 'border-border focus:ring-primary' :
                  telefonoValido ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
                }`}
                required
              />
              {telefonoValido === false && (
                <p className="text-xs text-red-600 mt-1">Solo se permiten números y espacios</p>
              )}
              {telefonoValido === true && (
                <p className="text-xs text-green-600 mt-1">✓ Teléfono válido</p>
              )}
            </div>
          </div>

          {/* Contraseña con validación visual */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {selectedUsuario ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, password: value });
                if (value) {
                  setPasswordValido(validarPassword(value));
                } else {
                  setPasswordValido(null);
                }
              }}
              placeholder="Mínimo 8 caracteres"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                passwordValido === null ? 'border-border focus:ring-primary' :
                passwordValido ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
              }`}
              required={!selectedUsuario}
            />
            {passwordValido === false && (
              <p className="text-xs text-red-600 mt-1">
                Debe tener al menos 8 caracteres con mayúsculas, minúsculas y números
              </p>
            )}
            {passwordValido === true && (
              <p className="text-xs text-green-600 mt-1">✓ Contraseña segura</p>
            )}
          </div>

          {/* Nota informativa sobre contraseñas */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas y números para mayor seguridad.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Rol"
              name="rol"
              type="select"
              value={formData.rol}
              onChange={(value) => setFormData({ ...formData, rol: String(value ?? '') })}
              options={opcionesRolModal}
              selectPlaceholder={opcionesRolModal.length === 0}
              required
            />
            {opcionesRolModal.length === 0 && (
              <p className="text-sm text-muted-foreground -mt-2">
                No hay roles activos disponibles. Cree o active roles en la sección de gestión de roles.
              </p>
            )}

            <FormField
              label="Estado"
              name="estado"
              type="select"
              value={formData.estado}
              onChange={(value) => setFormData({ ...formData, estado: value as any })}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' }
              ]}
              required
            />
          </div>

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

      {/* Modal de Detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUsuario(null);
        }}
        title={`Detalle de Usuario`}
        size="lg"
      >
        {selectedUsuario && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p className="font-medium">{selectedUsuario.nombre} {selectedUsuario.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="font-medium">{selectedUsuario.tipoDocumento} {selectedUsuario.numeroDocumento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedUsuario.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{selectedUsuario.telefono}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{selectedUsuario.direccion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rol</p>
                <p className="font-medium">{selectedUsuario.rol}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedUsuario.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedUsuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Historial de cambios */}
            {selectedUsuario.historialCambios && selectedUsuario.historialCambios.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Historial de Cambios</h4>
                <div className="space-y-2">
                  {selectedUsuario.historialCambios.map((cambio, index) => (
                    <div key={index} className="p-3 bg-accent/30 rounded-lg text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{cambio.accion}</span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(cambio.fecha).toLocaleString('es-CO')}
                        </span>
                      </div>
                      {cambio.motivo && (
                        <p className="text-muted-foreground">{cambio.motivo}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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

      {/* Modal de Cambio de Estado */}
      <Modal
        isOpen={isEstadoModalOpen}
        onClose={() => {
          setIsEstadoModalOpen(false);
          setMotivoEstado('');
          setUsuarioEstadoPendiente(null);
        }}
        title="Cambiar Estado de Usuario"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Está a punto de cambiar el estado del usuario{' '}
            <strong>
              {usuarioEstadoPendiente?.usuario.nombre} {usuarioEstadoPendiente?.usuario.apellido}
            </strong>{' '}
            a{' '}
            <strong>
              {usuarioEstadoPendiente?.nuevoEstado === 'activo' ? 'Activo' : 'Inactivo'}
            </strong>
            .
          </p>

          <FormField
            label="Motivo del cambio"
            name="motivo"
            type="textarea"
            value={motivoEstado}
            onChange={(value) => setMotivoEstado(value as string)}
            placeholder="Ingrese el motivo del cambio de estado (10-50 caracteres)"
            required
          />

          <p className="text-xs text-muted-foreground">
            {motivoEstado.length}/50 caracteres (mínimo 10)
          </p>

          <FormActions>
            <Button
              variant="outline"
              onClick={() => {
                setIsEstadoModalOpen(false);
                setMotivoEstado('');
                setUsuarioEstadoPendiente(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={confirmarCambioEstado}>
              Confirmar Cambio
            </Button>
          </FormActions>
        </div>
      </Modal>

      {/* AlertDialog de Eliminación */}
      <Modal
        isOpen={alertState.isOpen}
        onClose={() => {
          setAlertState({ isOpen: false, title: '', description: '', type: 'info', onConfirm: () => {} });
          setMotivoEliminacion('');
          setSelectedUsuario(null);
        }}
        title="Confirmar Eliminación de Usuario"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>¡Advertencia!</strong> Está a punto de eliminar al usuario{' '}
              <strong>{selectedUsuario?.nombre} {selectedUsuario?.apellido}</strong>.
            </p>
            <p className="text-sm text-red-700 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Warning adicional para usuario activo */}
          {selectedUsuario?.estado === 'activo' && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>⚠️ Advertencia:</strong> Este usuario está activo. Se recomienda inactivarlo antes de eliminarlo para evitar problemas con registros asociados.
              </p>
            </div>
          )}

          <FormField
            label="Motivo de la eliminación"
            name="motivoEliminacion"
            type="textarea"
            value={motivoEliminacion}
            onChange={(value) => setMotivoEliminacion(value as string)}
            placeholder="Ingrese el motivo de la eliminación (10-50 caracteres)"
            required
          />

          <p className="text-xs text-muted-foreground">
            {motivoEliminacion.length}/50 caracteres (mínimo 10)
          </p>

          <FormActions>
            <Button
              variant="outline"
              onClick={() => {
                setAlertState({ isOpen: false, title: '', description: '', type: 'info', onConfirm: () => {} });
                setMotivoEliminacion('');
                setSelectedUsuario(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarEliminacion}>
              Confirmar Eliminación
            </Button>
          </FormActions>
        </div>
      </Modal>
    </div>
  );
}

