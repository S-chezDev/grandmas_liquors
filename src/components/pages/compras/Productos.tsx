import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Package } from 'lucide-react';
import { AlertDialog } from '../../AlertDialog';
import { productos as productosAPI, categorias as categoriasAPI } from '../../../services/api';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  categoria_id: number;
  precio: number;
  stock: number;
  stock_minimo: number;
  imagen_url: string;
  estado: 'Activo' | 'Inactivo';
}

interface Categoria {
  id: number;
  nombre: string;
  estado: string;
}

export function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  const [formData, setFormData] = useState({
    nombre: '',
    categoria_id: 0,
    precio: 0,
    stock: 0,
    stock_minimo: 0,
    imagen_url: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productosAPI.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'No se pudieron cargar los productos. Verifique que el backend esté activo.',
        onConfirm: () => {}
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await categoriasAPI.getAll();
      setCategorias(data.filter((c: any) => c.estado === 'Activo'));
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const columns: Column[] = [
    { key: 'nombre', label: 'Producto' },
    { key: 'categoria', label: 'Categoría' },
    { 
      key: 'precio', 
      label: 'Precio',
      render: (precio: number) => formatCurrency(precio)
    },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (stock: number, row: Producto) => (
        <span className={stock < row.stock_minimo ? 'text-destructive' : ''}>
          {stock} {stock < row.stock_minimo && '⚠️'}
        </span>
      )
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
    setSelectedProducto(null);
    setFormData({ nombre: '', categoria_id: 0, precio: 0, stock: 0, stock_minimo: 0, imagen_url: '', estado: 'Activo' });
    setIsModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setFormData({
      nombre: producto.nombre,
      categoria_id: producto.categoria_id,
      precio: producto.precio,
      stock: producto.stock,
      stock_minimo: producto.stock_minimo,
      imagen_url: producto.imagen_url,
      estado: producto.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
    setAlertState({
      isOpen: true,
      title: 'Confirmar eliminación',
      description: `¿Está seguro de eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await productosAPI.delete(Number(producto.id));
          await loadProductos();
          setAlertState({
            isOpen: true,
            title: 'Éxito',
            description: 'Producto eliminado correctamente',
            onConfirm: () => {}
          });
        } catch (error) {
          console.error('Error al eliminar producto:', error);
          setAlertState({
            isOpen: true,
            title: 'Error',
            description: 'No se pudo eliminar el producto',
            onConfirm: () => {}
          });
        }
      }
    });
  };

  const handleView = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProducto) {
        await productosAPI.update(Number(selectedProducto.id), formData);
      } else {
        await productosAPI.create(formData);
      }
      await loadProductos();
      setIsModalOpen(false);
      setAlertState({
        isOpen: true,
        title: 'Éxito',
        description: `Producto ${selectedProducto ? 'actualizado' : 'creado'} correctamente`,
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'No se pudo guardar el producto',
        onConfirm: () => {}
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Productos</h2>
          <p className="text-muted-foreground">Administra el inventario de productos</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nuevo Producto
        </Button>
      </div>

      {/* Low Stock Alert */}
      {productos.some(p => p.stock < p.stock_minimo) && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">
            ⚠️ Hay {productos.filter(p => p.stock < p.stock_minimo).length} producto(s) con stock bajo el mínimo
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Cargando productos...</div>
      ) : (
        <DataTable
          columns={columns}
          data={productos}
          actions={[
            commonActions.view(handleView),
            commonActions.edit(handleEdit),
            commonActions.delete(handleDelete)
          ]}
          onSearch={(query) => console.log('Searching:', query)}
          searchPlaceholder="Buscar productos..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField
                label="Nombre del Producto"
                name="nombre"
                value={formData.nombre}
                onChange={(value) => setFormData({ ...formData, nombre: value as string })}
                placeholder="Ej: Whisky Jack Daniels 750ml"
                required
              />
            </div>
            
            <FormField
              label="Categoría"
              name="categoria_id"
              type="select"
              value={formData.categoria_id}
              onChange={(value) => setFormData({ ...formData, categoria_id: value as number })}
              options={categorias.map(cat => ({
                value: cat.id,
                label: cat.nombre
              }))}
              required
            />
            
            <FormField
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={(value) => setFormData({ ...formData, precio: value as number })}
              placeholder="0"
              required
            />
            
            <FormField
              label="Stock Actual"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={(value) => setFormData({ ...formData, stock: value as number })}
              placeholder="0"
              required
            />
            
            <FormField
              label="Stock Mínimo"
              name="stock_minimo"
              type="number"
              value={formData.stock_minimo}
              onChange={(value) => setFormData({ ...formData, stock_minimo: value as number })}
              placeholder="0"
              required
            />
            
            <FormField
              label="Imagen URL"
              name="imagen_url"
              type="text"
              value={formData.imagen_url}
              onChange={(value) => setFormData({ ...formData, imagen_url: value as string })}
              placeholder="https://ejemplo.com/imagen.jpg"
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
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedProducto ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProducto(null);
        }}
        title={`Detalle de Producto - ${selectedProducto?.nombre}`}
        size="lg"
      >
        {selectedProducto && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Nombre del Producto</p>
                <p>{selectedProducto.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categoría</p>
                <p>{selectedProducto.categoria}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Precio</p>
                <p>{formatCurrency(selectedProducto.precio)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Actual</p>
                <p className={selectedProducto.stock < selectedProducto.stock_minimo ? 'text-destructive' : ''}>
                  {selectedProducto.stock} unidades {selectedProducto.stock < selectedProducto.stock_minimo && '⚠️'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Mínimo</p>
                <p>{selectedProducto.stock_minimo} unidades</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedProducto.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedProducto.estado}
                </span>
              </div>
            </div>
            
            {selectedProducto.stock < selectedProducto.stock_minimo && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  ⚠️ Este producto tiene stock bajo el mínimo establecido. Se recomienda realizar un nuevo pedido.
                </p>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedProducto(null);
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
        type="danger"
      />
    </div>
  );
}