import React, { useEffect, useMemo, useState } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Search, RotateCcw } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { categorias as categoriasAPI } from '../../../services/api';

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  productos: number;
  estado: 'Activo' | 'Inactivo';
}

interface CategoryFilters {
  query: string;
  estado: '' | 'Activo' | 'Inactivo';
}

interface CategoryStateChangeRequest {
  categoria: Categoria;
  to: 'Activo' | 'Inactivo';
}

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [pendingStateChange, setPendingStateChange] = useState<CategoryStateChangeRequest | null>(null);
  const [stateChangeReason, setStateChangeReason] = useState('');
  const [stateChangeSaving, setStateChangeSaving] = useState(false);
  const [filters, setFilters] = useState<CategoryFilters>({ query: '', estado: '' });
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [nameTouched, setNameTouched] = useState(false);
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    void loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriasAPI.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorias:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudieron cargar las categorias.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  const categoriasVisibles = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return categorias.filter((categoria) => {
      const byQuery = !query || categoria.nombre.toLowerCase().includes(query);
      const byEstado = !filters.estado || categoria.estado === filters.estado;
      return byQuery && byEstado;
    });
  }, [categorias, filters]);

  const duplicateNameError = useMemo(() => {
    const normalizedName = formData.nombre.trim().toLowerCase();
    if (!normalizedName) return '';

    const duplicate = categorias.find((categoria) => {
      const sameName = categoria.nombre.trim().toLowerCase() === normalizedName;
      if (!sameName) return false;
      if (!selectedCategoria) return true;
      return String(categoria.id) !== String(selectedCategoria.id);
    });

    return duplicate ? 'No se puede repetir el nombre de la categoria. Ya existe una categoria registrada con ese nombre.' : '';
  }, [categorias, formData.nombre, selectedCategoria]);

  const columns: Column[] = [
    { key: 'nombre', label: 'Categoria' },
    { key: 'descripcion', label: 'Descripcion' },
    {
      key: 'productos',
      label: 'Productos',
      render: (value: number) => `${value} producto${value !== 1 ? 's' : ''}`,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado: string, categoria: Categoria) => (
        <select
          value={estado}
          onChange={(event) =>
            openStateChangeModal(categoria, event.target.value as 'Activo' | 'Inactivo')
          }
          disabled={stateChangeSaving}
          className={`px-3 py-1 rounded-full text-xs border-0 cursor-pointer ${
            estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedCategoria(null);
    setNameTouched(false);
    setFormData({ nombre: '', descripcion: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setNameTouched(false);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    if (categoria.productos > 0) {
      showAlert({
        title: 'No se puede eliminar',
        description: 'No se puede eliminar una categoria con productos asociados.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    showAlert({
      title: 'Eliminar categoria',
      description: `¿Estas seguro de eliminar la categoria "${categoria.nombre}"?`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await categoriasAPI.delete(Number(categoria.id));
          await loadCategorias();
          showAlert({
            title: 'Exito',
            description: 'Categoria eliminada correctamente.',
            type: 'success',
            confirmText: 'Entendido',
            onConfirm: () => {},
          });
        } catch (error: any) {
          showAlert({
            title: 'Error',
            description: error?.message || 'No se pudo eliminar la categoria.',
            type: 'danger',
            confirmText: 'Entendido',
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const openStateChangeModal = (categoria: Categoria, to: 'Activo' | 'Inactivo') => {
    if (categoria.estado === to) return;
    setPendingStateChange({ categoria, to });
    setStateChangeReason('');
  };

  const confirmStateChange = async () => {
    if (!pendingStateChange) return;

    if (stateChangeReason.trim().length < 10) {
      showAlert({
        title: 'Motivo requerido',
        description: 'El motivo del cambio de estado debe tener al menos 10 caracteres.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStateChangeSaving(true);
      await categoriasAPI.updateStatus(Number(pendingStateChange.categoria.id), {
        estado: pendingStateChange.to,
        motivo: stateChangeReason.trim(),
      });

      await loadCategorias();
      setPendingStateChange(null);
      setStateChangeReason('');

      showAlert({
        title: 'Estado actualizado',
        description: 'El estado de la categoria se actualizo correctamente.',
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error: any) {
      showAlert({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar el estado de la categoria.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setStateChangeSaving(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (duplicateNameError) {
      showAlert({
        title: 'Nombre duplicado',
        description: duplicateNameError,
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      if (selectedCategoria) {
        await categoriasAPI.update(Number(selectedCategoria.id), formData);
      } else {
        await categoriasAPI.create(formData);
      }

      await loadCategorias();
      setIsModalOpen(false);
      showAlert({
        title: 'Exito',
        description: `Categoria ${selectedCategoria ? 'actualizada' : 'creada'} correctamente.`,
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error: any) {
      showAlert({
        title: 'Error',
        description: error?.message || 'No se pudo guardar la categoria.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    }
  };

  return (
    <div className="space-y-6">
      {AlertComponent}

      <div className="flex items-center justify-between">
        <div>
          <h2>Gestion de Categorias</h2>
          <p className="text-muted-foreground">Administra las categorias de productos</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nueva Categoria
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={filters.query}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Buscar por categoria..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setFilters({ query: '', estado: '' })}
            disabled={!filters.query.trim() && !filters.estado}
          >
            Limpiar filtros
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={filters.estado}
            onChange={(event) => setFilters((current) => ({ ...current, estado: event.target.value as CategoryFilters['estado'] }))}
            className="h-8 rounded-md border border-border px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Estado (todos)</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando categorias...</div>
      ) : (
        <DataTable
          columns={columns}
          data={categoriasVisibles}
          actions={[
            commonActions.view((categoria) => {
              setSelectedCategoria(categoria);
              setIsDetailModalOpen(true);
            }),
            commonActions.edit(handleEdit),
            commonActions.delete(handleDelete),
          ]}
        />
      )}

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCategoria(null);
        }}
        title={`Detalle de Categoria ${selectedCategoria?.nombre || ''}`}
        size="lg"
      >
        {selectedCategoria ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID Categoria</p>
                <p>{selectedCategoria.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p>{selectedCategoria.nombre}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Descripcion</p>
                <p>{selectedCategoria.descripcion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos Asociados</p>
                <p>{selectedCategoria.productos} producto{selectedCategoria.productos !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedCategoria.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedCategoria.estado}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategoria ? 'Editar Categoria' : 'Nueva Categoria'}
      >
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Nombre de la Categoria"
            name="nombre"
            value={formData.nombre}
            onChange={(value) => {
              setFormData((current) => ({ ...current, nombre: value as string }));
              setNameTouched(true);
            }}
            onBlur={() => setNameTouched(true)}
            placeholder="Ej: Whiskies"
            required
            error={nameTouched ? duplicateNameError || undefined : undefined}
            helperText={nameTouched && duplicateNameError ? undefined : 'El nombre debe ser unico.'}
          />

          <FormField
            label="Descripcion"
            name="descripcion"
            type="textarea"
            value={formData.descripcion}
            onChange={(value) => setFormData((current) => ({ ...current, descripcion: value as string }))}
            placeholder="Describe esta categoria"
            required
          />

          <p className="text-xs text-muted-foreground">
            El estado no se define en la creacion. Toda categoria nueva se crea en Activo y su estado se cambia desde la tabla.
          </p>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={Boolean(duplicateNameError)}>
              {selectedCategoria ? 'Actualizar' : 'Crear'} Categoria
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={Boolean(pendingStateChange)}
        onClose={() => {
          if (stateChangeSaving) return;
          setPendingStateChange(null);
          setStateChangeReason('');
        }}
        title={`Cambiar estado - ${pendingStateChange?.categoria.nombre || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Estado actual: {pendingStateChange?.categoria.estado || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Nuevo estado: {pendingStateChange?.to || 'N/A'}</p>
          </div>

          <FormField
            label="Motivo"
            name="motivo-cambio-estado-categoria"
            type="textarea"
            value={stateChangeReason}
            onChange={(value) => setStateChangeReason(String(value))}
            rows={3}
            required
            placeholder="Describe por que se realiza el cambio de estado (minimo 10 caracteres)"
          />

          <FormActions>
            <Button
              variant="outline"
              onClick={() => {
                if (stateChangeSaving) return;
                setPendingStateChange(null);
                setStateChangeReason('');
              }}
              disabled={stateChangeSaving}
            >
              Cancelar
            </Button>
            <Button onClick={confirmStateChange} disabled={stateChangeSaving}>
              {stateChangeSaving ? 'Guardando...' : 'Confirmar cambio'}
            </Button>
          </FormActions>
        </div>
      </Modal>
    </div>
  );
}
