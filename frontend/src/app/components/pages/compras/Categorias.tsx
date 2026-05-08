import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import type { Categoria } from '../../../services/types';
import { toast } from 'sonner';

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [categoriaEstadoPendiente, setCategoriaEstadoPendiente] = useState<{
    categoria: Categoria;
    nuevoEstado: 'activo' | 'inactivo';
  } | null>(null);
  const [motivoEstado, setMotivoEstado] = useState('');
  const [motivoEliminacion, setMotivoEliminacion] = useState('');
  const [categoriaDestinoEliminar, setCategoriaDestinoEliminar] = useState('');
  const [alertState, setAlertState] = useState({
    isOpen: false
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo' as 'activo' | 'inactivo'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await api.categorias.getAll();
      setCategorias(data);
    } catch (error: any) {
      toast.error('Error al cargar categorías', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Validar nombre único
  const validarNombreUnico = (nombre: string, idActual?: number) => {
    const existe = categorias.find(c =>
      c.nombre.toLowerCase() === nombre.toLowerCase() &&
      c.id !== idActual
    );
    return !existe;
  };

  // Filtrar categorías
  const categoriasFiltradas = categorias.filter(c => {
    const matchBusqueda = searchQuery.length < 2 ||
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchEstado = filtroEstado === 'Todos' ||
      (filtroEstado === 'Activo' && c.estado === 'activo') ||
      (filtroEstado === 'Inactivo' && c.estado === 'inactivo');

    return matchBusqueda && matchEstado;
  });

  const columns: Column[] = [
    { key: 'nombre', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'id',
      label: 'Productos',
      render: (_: number, row: Categoria) => {
        const count = row.productos ?? 0;
        return `${count} producto${count !== 1 ? 's' : ''}`;
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Categoria) => (
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

  const handleEstadoChange = (categoria: Categoria, nuevoEstado: 'activo' | 'inactivo') => {
    if (categoria.estado === nuevoEstado) return;
    setCategoriaEstadoPendiente({ categoria, nuevoEstado });
    setMotivoEstado('');
    setIsEstadoModalOpen(true);
  };

  const confirmarCambioEstado = async () => {
    if (!categoriaEstadoPendiente) return;

    if (motivoEstado.length < 10 || motivoEstado.length > 50) {
      toast.error('Error de validación', {
        description: 'El motivo debe tener entre 10 y 50 caracteres'
      });
      return;
    }

    try {
      await api.categorias.changeEstado(
        categoriaEstadoPendiente.categoria.id,
        categoriaEstadoPendiente.nuevoEstado,
        motivoEstado
      );

      toast.success('Estado actualizado', {
        description: `Categoría ${
          categoriaEstadoPendiente.nuevoEstado === 'activo' ? 'activada' : 'inactivada'
        } exitosamente`
      });

      setIsEstadoModalOpen(false);
      setMotivoEstado('');
      setCategoriaEstadoPendiente(null);
      cargarCategorias();
    } catch (error: any) {
      toast.error('Error al cambiar estado', { description: error.message });
      cargarCategorias();
    }
  };

  const handleAdd = () => {
    setSelectedCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'activo'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setMotivoEliminacion('');
    setCategoriaDestinoEliminar('');
    setAlertState({ isOpen: true });
  };

  const confirmarEliminacion = async () => {
    if (!selectedCategoria) return;

    if (motivoEliminacion.length < 10 || motivoEliminacion.length > 50) {
      toast.error('Error de validación', {
        description: 'El motivo debe tener entre 10 y 50 caracteres'
      });
      return;
    }

    const productosAsociados = selectedCategoria.productos ?? 0;
    const otrasCategorias = categorias.filter((c) => c.id !== selectedCategoria.id);

    if (productosAsociados > 0) {
      if (otrasCategorias.length === 0) {
        toast.error('No se puede eliminar', {
          description:
            'Esta categoría tiene productos y no hay otra categoría destino. Cree una categoría nueva primero.'
        });
        return;
      }
      const destId = parseInt(categoriaDestinoEliminar, 10);
      if (!Number.isFinite(destId)) {
        toast.error('Error de validación', {
          description: 'Seleccione la categoría a la que se moverán los productos.'
        });
        return;
      }
    }

    try {
      await api.categorias.delete(
        selectedCategoria.id,
        motivoEliminacion,
        productosAsociados > 0 ? parseInt(categoriaDestinoEliminar, 10) : undefined
      );

      toast.success('Categoría eliminada', {
        description: 'La categoría ha sido eliminada exitosamente'
      });

      setAlertState({ isOpen: false });
      setMotivoEliminacion('');
      setCategoriaDestinoEliminar('');
      setSelectedCategoria(null);
      cargarCategorias();
    } catch (error: any) {
      toast.error('Error al eliminar categoría', { description: error.message });
    }
  };

  const handleView = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!validarNombreUnico(formData.nombre, selectedCategoria?.id)) {
      toast.error('Error de validación', {
        description: 'Ya existe una categoría con ese nombre'
      });
      return;
    }

    if (formData.nombre.trim().length < 3) {
      toast.error('Error de validación', {
        description: 'El nombre debe tener al menos 3 caracteres'
      });
      return;
    }

    if (formData.descripcion.trim().length < 10) {
      toast.error('Error de validación', {
        description: 'La descripción debe tener al menos 10 caracteres'
      });
      return;
    }

    try {
      if (selectedCategoria) {
        await api.categorias.update(selectedCategoria.id, formData, 'Actualización de datos');

        toast.success('Categoría actualizada', {
          description: 'Los datos de la categoría han sido actualizados exitosamente'
        });
      } else {
        await api.categorias.create(formData);

        toast.success('Categoría creada', {
          description: 'La categoría ha sido creada exitosamente'
        });
      }

      setIsModalOpen(false);
      cargarCategorias();
    } catch (error: any) {
      toast.error(selectedCategoria ? 'Error al actualizar categoría' : 'Error al crear categoría', {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Categorías</h2>
          <p className="text-muted-foreground">Administra las categorías de productos</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nueva Categoría
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
              placeholder="Buscar... (mín. 2, máx. 50 caracteres)"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={50}
            />
          </div>
          <div className="flex gap-2">
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
        data={categoriasFiltradas}
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

      {/* Modal Nuevo/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Nombre de la Categoría"
            name="nombre"
            value={formData.nombre}
            onChange={(value) => {
              setFormData({ ...formData, nombre: value as string });
              if (value && !validarNombreUnico(value as string, selectedCategoria?.id)) {
                toast.warning('Advertencia', {
                  description: 'Ya existe una categoría con ese nombre',
                  duration: 2000
                });
              }
            }}
            placeholder="Ej: Licores Artesanales"
            required
          />

          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            value={formData.descripcion}
            onChange={(value) => setFormData({ ...formData, descripcion: value as string })}
            placeholder="Descripción de la categoría"
            required
          />

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

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedCategoria ? 'Actualizar' : 'Crear'} Categoría
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal Detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCategoria(null);
        }}
        title="Detalle de Categoría"
        size="lg"
      >
        {selectedCategoria && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{selectedCategoria.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedCategoria.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedCategoria.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="font-medium">{selectedCategoria.descripcion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p className="font-medium">{(selectedCategoria.productos ?? 0)} productos</p>
              </div>
            </div>

            {/* Historial de cambios */}
            {selectedCategoria.historialCambios && selectedCategoria.historialCambios.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Historial de Modificaciones</h4>
                <div className="space-y-2">
                  {selectedCategoria.historialCambios.map((cambio, index) => (
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
                  setSelectedCategoria(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Cambio de Estado */}
      <Modal
        isOpen={isEstadoModalOpen}
        onClose={() => {
          setIsEstadoModalOpen(false);
          setMotivoEstado('');
          setCategoriaEstadoPendiente(null);
        }}
        title="Cambiar Estado de Categoría"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Está a punto de cambiar el estado de la categoría{' '}
            <strong>{categoriaEstadoPendiente?.categoria.nombre}</strong> a{' '}
            <strong>
              {categoriaEstadoPendiente?.nuevoEstado === 'activo' ? 'Activo' : 'Inactivo'}
            </strong>
            .
          </p>

          <FormField
            label="Motivo del cambio"
            name="motivo"
            type="textarea"
            value={motivoEstado}
            onChange={(value) => setMotivoEstado(value as string)}
            placeholder="Ingrese el motivo del cambio de estado"
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
                setCategoriaEstadoPendiente(null);
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

      {/* Modal Eliminación */}
      <Modal
        isOpen={alertState.isOpen}
        onClose={() => {
          setAlertState({ isOpen: false });
          setMotivoEliminacion('');
          setCategoriaDestinoEliminar('');
          setSelectedCategoria(null);
        }}
        title="Confirmar Eliminación de Categoría"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>¡Advertencia!</strong> Está a punto de eliminar la categoría{' '}
              <strong>{selectedCategoria?.nombre}</strong>.
            </p>
            <p className="text-sm text-red-700 mt-2">
              Esta acción no se puede deshacer.
            </p>
            {(selectedCategoria?.productos ?? 0) > 0 && (
              <p className="text-sm text-amber-800 mt-2">
                Esta categoría tiene <strong>{selectedCategoria!.productos}</strong> producto
                {selectedCategoria!.productos !== 1 ? 's' : ''}. Debe elegir otra categoría
                para reubicarlos antes de eliminar.
              </p>
            )}
          </div>

          {(selectedCategoria?.productos ?? 0) > 0 &&
            categorias.filter((c) => c.id !== selectedCategoria!.id).length > 0 && (
              <FormField
                label="Reubicar productos en"
                name="categoriaDestinoEliminar"
                type="select"
                value={categoriaDestinoEliminar}
                onChange={(v) => setCategoriaDestinoEliminar(String(v))}
                required
                options={categorias
                  .filter((c) => c.id !== selectedCategoria!.id)
                  .map((c) => ({ value: c.id, label: c.nombre }))}
              />
            )}

          {(selectedCategoria?.productos ?? 0) > 0 &&
            categorias.filter((c) => c.id !== selectedCategoria!.id).length === 0 && (
              <p className="text-sm text-destructive">
                No hay otra categoría disponible. Cree una categoría nueva y vuelva a intentar.
              </p>
            )}

          <FormField
            label="Motivo de la eliminación"
            name="motivoEliminacion"
            type="textarea"
            value={motivoEliminacion}
            onChange={(value) => setMotivoEliminacion(value as string)}
            placeholder="Ingrese el motivo de la eliminación"
            required
          />

          <p className="text-xs text-muted-foreground">
            {motivoEliminacion.length}/50 caracteres (mínimo 10)
          </p>

          <FormActions>
            <Button
              variant="outline"
              onClick={() => {
                setAlertState({ isOpen: false });
                setMotivoEliminacion('');
                setCategoriaDestinoEliminar('');
                setSelectedCategoria(null);
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

