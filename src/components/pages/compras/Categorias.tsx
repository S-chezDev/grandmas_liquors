import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Tags } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { categorias as categoriasAPI } from '../../../services/api';

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  productos: number;
  estado: 'Activo' | 'Inactivo';
}

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriasAPI.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudieron cargar las categorías. Verifique que el backend esté activo.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    { key: 'nombre', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' },
    { 
      key: 'productos', 
      label: 'Productos',
      render: (value: number) => `${value} producto${value !== 1 ? 's' : ''}`
    },
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
    setSelectedCategoria(null);
    setFormData({ nombre: '', descripcion: '', estado: 'Activo' });
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

  const handleDelete = async (categoria: Categoria) => {
    if (categoria.productos > 0) {
      showAlert({
        title: 'No se puede eliminar',
        description: 'No se puede eliminar una categoría con productos asociados',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }
    showAlert({
      title: '¿Eliminar categoría?',
      description: `¿Está seguro de eliminar la categoría "${categoria.nombre}"?`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await categoriasAPI.delete(Number(categoria.id));
          await loadCategorias();
          showAlert({
            title: 'Éxito',
            description: 'Categoría eliminada correctamente',
            type: 'success',
            confirmText: 'Entendido',
            onConfirm: () => {}
          });
        } catch (error) {
          console.error('Error al eliminar categoría:', error);
          showAlert({
            title: 'Error',
            description: 'No se pudo eliminar la categoría',
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
      if (selectedCategoria) {
        await categoriasAPI.update(Number(selectedCategoria.id), formData);
      } else {
        await categoriasAPI.create(formData);
      }
      await loadCategorias();
      setIsModalOpen(false);
      showAlert({
        title: 'Éxito',
        description: `Categoría ${selectedCategoria ? 'actualizada' : 'creada'} correctamente`,
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo guardar la categoría',
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
          <h2>Gestión de Categorías</h2>
          <p className="text-muted-foreground">Administra las categorías de productos</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nueva Categoría
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando categorías...</div>
      ) : (
        <DataTable
          columns={columns}
          data={categorias}
          actions={[
            commonActions.view((categoria) => {
              setSelectedCategoria(categoria);
              setIsDetailModalOpen(true);
            }),
            commonActions.edit(handleEdit),
            commonActions.delete(handleDelete)
          ]}
          onSearch={(query) => console.log('Searching:', query)}
          searchPlaceholder="Buscar categorías..."
        />
      )}

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detalle de Categoría ${selectedCategoria?.nombre}`}
        size="lg"
      >
        {selectedCategoria && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID Categoría</p>
                <p>{selectedCategoria.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p>{selectedCategoria.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p>{selectedCategoria.descripcion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos Asociados</p>
                <p>{selectedCategoria.productos} producto{selectedCategoria.productos !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedCategoria.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedCategoria.estado}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

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
            onChange={(value) => setFormData({ ...formData, nombre: value as string })}
            placeholder="Ej: Whiskies"
            required
          />
          
          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            value={formData.descripcion}
            onChange={(value) => setFormData({ ...formData, descripcion: value as string })}
            placeholder="Describe esta categoría"
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
              {selectedCategoria ? 'Actualizar' : 'Crear'} Categoría
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
}