import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { compras as comprasAPI, productos as productosAPI, proveedores as proveedoresAPI } from '../../../services/api';

interface CompraItem {
  productoId: number;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  permisoExtraordinario?: boolean;
  motivoPermiso?: string;
}

interface ProductoOption {
  id: number;
  nombre: string;
  precio: number;
  estado?: string;
}

interface ProveedorOption {
  id: number;
  label: string;
  estado?: string;
}

interface Compra {
  id: string;
  numero_compra: string;
  proveedor_id: number;
  proveedor: string;
  fecha: string;
  fechaCreacion: string;
  fechaCompra: string;
  items: CompraItem[];
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  observaciones?: string;
}

export function Compras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoOption[]>([]);
  const [proveedoresDisponibles, setProveedoresDisponibles] = useState<ProveedorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    loadCompras();
    loadCatalogos();
  }, []);

  const loadCatalogos = async () => {
    try {
      const [productosData, proveedoresData] = await Promise.all([
        productosAPI.getAll(),
        proveedoresAPI.getAll(),
      ]);

      const productosMapeados = (Array.isArray(productosData) ? productosData : []).map((p: any) => ({
        id: Number(p.id),
        nombre: String(p.nombre || ''),
        precio: Number(p.precio || 0),
        estado: String(p.estado || 'Activo'),
      })).filter((p) => p.estado === 'Activo');

      const proveedoresMapeados = (Array.isArray(proveedoresData) ? proveedoresData : [])
        .map((p: any) => ({
          id: Number(p.id),
          label: String(p.nombre_empresa || `${p.nombre || ''} ${p.apellido || ''}`.trim() || `Proveedor ${p.id}`),
          estado: String(p.estado || 'Activo'),
        }))
        .filter((p) => p.estado === 'Activo');

      setProductosDisponibles(productosMapeados);
      setProveedoresDisponibles(proveedoresMapeados);
    } catch (error) {
      console.error('Error cargando catalogos de compras:', error);
    }
  };

  const loadCompras = async () => {
    try {
      setLoading(true);
      const data = await comprasAPI.getAll();
      const normalizedCompras: Compra[] = (Array.isArray(data) ? data : []).map((compra: any) => ({
        id: String(compra.id),
        numero_compra: compra.numero_compra || `COM-${compra.id}`,
        proveedor_id: Number(compra.proveedor_id || 0),
        proveedor: compra.nombre_empresa || compra.proveedor_nombre || 'Sin proveedor',
        fecha: compra.fecha || '',
        fechaCreacion: compra.fecha_creacion || compra.fecha || '',
        fechaCompra: compra.fecha || '',
        items: Array.isArray(compra.items) ? compra.items : [],
        subtotal: Number(compra.subtotal || 0),
        iva: Number(compra.iva || 0),
        total: Number(compra.total || 0),
        estado: compra.estado || 'Pendiente',
        observaciones: compra.observaciones || '',
      }));

      setCompras(normalizedCompras);
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  
  const [formData, setFormData] = useState({
    proveedor: '',
    fecha: new Date().toISOString().split('T')[0],
    items: [] as CompraItem[],
    observaciones: '',
    aprobacionExtraordinaria: false,
    motivoAprobacion: ''
  });

  const [currentItem, setCurrentItem] = useState({
    productoId: '',
    cantidad: 0,
    precioUnitario: 0,
    permisoExtraordinario: false,
    motivoPermiso: ''
  });

  const subtotalCalculado = useMemo(
    () => formData.items.reduce((sum, item) => sum + item.subtotal, 0),
    [formData.items]
  );
  const ivaCalculado = useMemo(() => subtotalCalculado * 0.19, [subtotalCalculado]);
  const totalCalculado = useMemo(() => subtotalCalculado + ivaCalculado, [subtotalCalculado, ivaCalculado]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const columns: Column[] = [
    { key: 'id', label: 'ID Compra' },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'fecha', label: 'Fecha' },
    { 
      key: 'items', 
      label: 'Items',
      render: (items: CompraItem[] = []) => `${items.length} producto${items.length !== 1 ? 's' : ''}`
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (total: number) => formatCurrency(total)
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string) => (
        <span className={`px-3 py-1 rounded-full text-xs ${
          estado === 'Completada' ? 'bg-green-100 text-green-700' :
          estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {estado}
        </span>
      )
    }
  ];

  const handleAdd = () => {
    setSelectedCompra(null);
    setFormData({ 
      proveedor: '', 
      fecha: new Date().toISOString().split('T')[0], 
      items: [],
      observaciones: '',
      aprobacionExtraordinaria: false,
      motivoAprobacion: ''
    });
    setCurrentItem({ productoId: '', cantidad: 0, precioUnitario: 0, permisoExtraordinario: false, motivoPermiso: '' });
    setIsModalOpen(true);
  };

  const handleView = async (compra: Compra) => {
    try {
      const detalle = await comprasAPI.getById(Number(compra.id));
      const detalleItems = Array.isArray((detalle as any)?.detalles)
        ? (detalle as any).detalles.map((item: any) => ({
            productoId: Number(item.producto_id || 0),
            producto: String(item.producto_nombre || item.producto || ''),
            cantidad: Number(item.cantidad || 0),
            precioUnitario: Number(item.precio_unitario || 0),
            subtotal: Number(item.subtotal || 0),
          }))
        : compra.items;

      setSelectedCompra({
        ...compra,
        items: detalleItems,
        subtotal: Number((detalle as any)?.subtotal ?? compra.subtotal),
        iva: Number((detalle as any)?.iva ?? compra.iva),
        total: Number((detalle as any)?.total ?? compra.total),
        observaciones: String((detalle as any)?.observaciones || compra.observaciones || ''),
      });
    } catch {
      setSelectedCompra(compra);
    }
    setIsDetailModalOpen(true);
  };

  const handleAnular = (compra: Compra) => {
    showAlert({
      title: 'Confirmar anulación',
      description: `¿Está seguro de anular la compra ${compra.id}? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Anular',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setCompras(compras.map(c => c.id === compra.id ? { ...c, estado: 'Anulada' as const } : c));
      }
    });
  };

  const handleGeneratePDF = (compra: Compra) => {
    const items = Array.isArray(compra.items) ? compra.items : [];
    const itemsDetail = items.length > 0
      ? items.map((item, index) => 
      `${index + 1}. ${item.producto}
   Cantidad: ${item.cantidad} unidades
   Precio Unitario: ${formatCurrency(item.precioUnitario)}
   Subtotal: ${formatCurrency(item.subtotal)}`
        ).join('\n\n')
      : 'Sin detalle de productos registrado';

    const content = `
╔════════════════════════════════════════════════════════════╗
║           GRANDMA'S LIQUEURS - ORDEN DE COMPRA            ║
╚════════════════════════════════════════════════════════════╝

ID Compra:          ${compra.id}
Proveedor:          ${compra.proveedor}
Fecha:              ${compra.fecha}
Estado:             ${compra.estado}

────────────────────────────────────────────────────────────
PRODUCTOS COMPRADOS:
────────────────────────────────────────────────────────────

${itemsDetail}

────────────────────────────────────────────────────────────
SUBTOTAL:           ${formatCurrency(compra.subtotal)}
IVA (19%):          ${formatCurrency(compra.iva)}
TOTAL:              ${formatCurrency(compra.total)}
────────────────────────────────────────────────────────────

Firma Autorización: _______________________

Fecha Impresión:    ${new Date().toLocaleString('es-CO')}
────────────────────────────────────────────────────────────
    `.trim();

    setPdfContent(content);
    setIsPdfModalOpen(true);
  };

  const handleAddItem = () => {
    if (!currentItem.productoId || currentItem.cantidad <= 0 || currentItem.precioUnitario <= 0) {
      showAlert({
        title: 'Campos incompletos',
        description: 'Complete todos los campos del producto.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (formData.items.length >= 50) {
      showAlert({
        title: 'Limite alcanzado',
        description: 'No se pueden registrar mas de 50 productos por compra.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (currentItem.cantidad > 50 && (!currentItem.permisoExtraordinario || currentItem.motivoPermiso.trim().length < 10)) {
      showAlert({
        title: 'Permiso extraordinario requerido',
        description: 'Cantidades mayores a 50 requieren permiso extraordinario y un motivo de al menos 10 caracteres.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    const productoSeleccionado = productosDisponibles.find(
      (p) => p.id === Number(currentItem.productoId)
    );

    if (!productoSeleccionado) {
      showAlert({
        title: 'Producto no válido',
        description: 'Seleccione un producto válido antes de continuar.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }
    
    const newItem: CompraItem = {
      productoId: Number(currentItem.productoId),
      producto: productoSeleccionado.nombre,
      cantidad: currentItem.cantidad,
      precioUnitario: currentItem.precioUnitario,
      subtotal: currentItem.cantidad * currentItem.precioUnitario,
      permisoExtraordinario: currentItem.permisoExtraordinario,
      motivoPermiso: currentItem.motivoPermiso.trim()
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
    
    setCurrentItem({ productoId: '', cantidad: 0, precioUnitario: 0, permisoExtraordinario: false, motivoPermiso: '' });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proveedor) {
      showAlert({
        title: 'Proveedor requerido',
        description: 'Debe seleccionar un proveedor activo para la compra.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (formData.items.length === 0) {
      showAlert({
        title: 'Compra sin productos',
        description: 'Debe agregar al menos un producto para guardar la compra.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (formData.items.some((item) => item.cantidad <= 0 || item.precioUnitario <= 0)) {
      showAlert({
        title: 'Valores invalidos',
        description: 'Todas las cantidades deben ser mayores a 0 y los precios unitarios validos.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (totalCalculado >= 10000 && (!formData.aprobacionExtraordinaria || formData.motivoAprobacion.trim().length < 10)) {
      showAlert({
        title: 'Aprobacion requerida',
        description: 'Compras por total mayor o igual a $10,000 requieren aprobacion extraordinaria y motivo valido.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    try {
      const createResult: any = await comprasAPI.create({
        proveedor: formData.proveedor,
        fecha: formData.fecha,
        subtotal: subtotalCalculado,
        iva: ivaCalculado,
        total: totalCalculado,
        estado: 'Pendiente',
        observaciones: formData.observaciones,
        aprobacion_extraordinaria: formData.aprobacionExtraordinaria,
        motivo_aprobacion: formData.motivoAprobacion.trim() || undefined,
      });

      const compraId = Number(createResult?.id);
      if (!compraId) {
        throw new Error('No se obtuvo el id de la compra creada');
      }

      await Promise.all(
        formData.items.map((item) =>
          comprasAPI.addProducto({
            compraId,
            productoId: Number(item.productoId),
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            permisoExtraordinario: Boolean(item.permisoExtraordinario),
            motivoPermiso: item.motivoPermiso,
          })
        )
      );

      await loadCompras();
      setIsModalOpen(false);
      setFormData({
        proveedor: '',
        fecha: new Date().toISOString().split('T')[0],
        items: [],
        observaciones: '',
        aprobacionExtraordinaria: false,
        motivoAprobacion: '',
      });
      setCurrentItem({ productoId: '', cantidad: 0, precioUnitario: 0, permisoExtraordinario: false, motivoPermiso: '' });
      showAlert({
        title: 'Éxito',
        description: 'Compra guardada correctamente.',
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Error creando compra:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo guardar la compra.',
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
          <h2>Gestión de Compras</h2>
          <p className="text-muted-foreground">Administra las órdenes de compra</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nueva Compra
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={compras}
        actions={[
          commonActions.view(handleView),
          commonActions.pdf(handleGeneratePDF),
          commonActions.cancel(handleAnular)
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar compras..."
      />

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Compra"
        size="xl"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Proveedor"
              name="proveedor"
              type="select"
              value={formData.proveedor}
              onChange={(value) => setFormData({ ...formData, proveedor: value as string })}
              options={proveedoresDisponibles.map((p) => ({
                value: p.id.toString(),
                label: p.label,
              }))}
              required
            />
            
            <FormField
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={(value) => setFormData({ ...formData, fecha: value as string })}
              required
            />
          </div>

          {/* Add Items Section */}
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="mb-3">Agregar Productos</h4>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <FormField
                label="Producto"
                name="producto"
                type="select"
                value={currentItem.productoId}
                onChange={(value) => {
                  const productoSeleccionado = productosDisponibles.find(
                    (p) => p.id === Number(value)
                  );
                  setCurrentItem({
                    ...currentItem,
                    productoId: value as string,
                    precioUnitario: productoSeleccionado ? Number(productoSeleccionado.precio) : 0,
                  });
                }}
                options={productosDisponibles.map((p) => ({
                  value: p.id.toString(),
                  label: `COD-${p.id} | ${p.nombre} - ${formatCurrency(p.precio)}`,
                }))}
              />
              
              <FormField
                label="Cantidad"
                name="cantidad"
                type="number"
                value={currentItem.cantidad}
                onChange={(value) => setCurrentItem({ ...currentItem, cantidad: value as number })}
              />
              
              <FormField
                label="Precio Unitario"
                name="precioUnitario"
                type="number"
                value={currentItem.precioUnitario}
                onChange={(value) => setCurrentItem({ ...currentItem, precioUnitario: value as number })}
                readOnly
                helperText="Precio cargado automaticamente segun el producto seleccionado."
              />
              
              <div className="flex items-end">
                <Button type="button" onClick={handleAddItem} className="w-full">
                  Agregar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="rounded-lg border border-border p-3 bg-accent/20">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={currentItem.permisoExtraordinario}
                    onChange={(event) =>
                      setCurrentItem({
                        ...currentItem,
                        permisoExtraordinario: event.target.checked,
                        motivoPermiso: event.target.checked ? currentItem.motivoPermiso : '',
                      })
                    }
                    className="h-4 w-4 accent-primary"
                  />
                  Solicitar permiso extraordinario para cantidad mayor a 50
                </label>
              </div>
              <FormField
                label="Motivo permiso"
                name="motivoPermiso"
                type="textarea"
                value={currentItem.motivoPermiso}
                onChange={(value) => setCurrentItem({ ...currentItem, motivoPermiso: value as string })}
                rows={2}
                disabled={!currentItem.permisoExtraordinario}
                placeholder="Justifique la compra extraordinaria"
              />
            </div>
          </div>

          {/* Items List */}
          {formData.items.length > 0 && (
            <div className="border border-border rounded-lg p-4 max-h-60 overflow-y-auto">
              <table className="w-full">
                <thead className="text-sm bg-muted">
                  <tr>
                    <th className="p-2 text-left">Codigo</th>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Precio Unit.</th>
                    <th className="p-2 text-right">Subtotal</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-2">COD-{item.productoId}</td>
                      <td className="p-2">{item.producto}</td>
                      <td className="p-2 text-right">{item.cantidad}</td>
                      <td className="p-2 text-right">{formatCurrency(item.precioUnitario)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.subtotal)}</td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border">
                    <td colSpan={4} className="p-2 text-right">Total:</td>
                    <td className="p-2 text-right">
                      {formatCurrency(subtotalCalculado)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg border border-border bg-accent/20">
            <div>
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="font-medium">{formatCurrency(subtotalCalculado)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">IVA (19%)</p>
              <p className="font-medium">{formatCurrency(ivaCalculado)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(totalCalculado)}</p>
            </div>
          </div>

          <FormField
            label="Observaciones"
            name="observaciones"
            type="textarea"
            value={formData.observaciones}
            onChange={(value) => setFormData({ ...formData, observaciones: value as string })}
            rows={3}
            placeholder="Notas de la compra"
          />

          <div className="rounded-lg border border-border p-3 bg-accent/20 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.aprobacionExtraordinaria}
                onChange={(event) => setFormData({ ...formData, aprobacionExtraordinaria: event.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              Aprobacion extraordinaria
            </label>
            <FormField
              label="Motivo aprobacion"
              name="motivoAprobacion"
              type="textarea"
              value={formData.motivoAprobacion}
              onChange={(value) => setFormData({ ...formData, motivoAprobacion: value as string })}
              rows={2}
              placeholder="Obligatorio si el total es mayor o igual a $10,000"
            />
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Compra
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detalle de Compra ${selectedCompra?.id}`}
        size="lg"
      >
        {selectedCompra && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Proveedor</p>
                <p>{selectedCompra.proveedor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Compra</p>
                <p>{selectedCompra.fechaCompra}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                <p>{selectedCompra.fechaCreacion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedCompra.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                  selectedCompra.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedCompra.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p>{formatCurrency(selectedCompra.subtotal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IVA (19%)</p>
                <p>{formatCurrency(selectedCompra.iva)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p>{formatCurrency(selectedCompra.total)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Observaciones</p>
                <p>{selectedCompra.observaciones || 'Sin observaciones'}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2">Productos</h4>
              <table className="w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-right">Cantidad</th>
                    <th className="p-3 text-right">Precio Unit.</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedCompra.items || []).map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-3">{item.producto}</td>
                      <td className="p-3 text-right">{item.cantidad}</td>
                      <td className="p-3 text-right">{formatCurrency(item.precioUnitario)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border">
                    <td colSpan={3} className="p-3 text-right">Subtotal:</td>
                    <td className="p-3 text-right">{formatCurrency(selectedCompra.subtotal)}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="p-3 text-right">IVA (19%):</td>
                    <td className="p-3 text-right">{formatCurrency(selectedCompra.iva)}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="p-3 text-right">Total:</td>
                    <td className="p-3 text-right">{formatCurrency(selectedCompra.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* PDF Modal */}
      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Orden de Compra"
        size="xl"
      >
        <pre className="whitespace-pre-wrap text-sm">
          {pdfContent}
        </pre>
      </Modal>
    </div>
  );
}