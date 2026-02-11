import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { AlertDialog } from '../../AlertDialog';
import { ventas as ventasAPI, clientes as clientesAPI, productos as productosAPI } from '../../../services/api';

interface VentaItem {
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Venta {
  id: string;
  numero_venta: string;
  tipo: string;
  cliente_id: number;
  pedido_id?: number;
  fecha: string;
  metodo_pago: string;
  total: number;
  estado: string;
}

export function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const data = await ventasAPI.getAll();
      setVentas(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setLoading(false);
    }
  };
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  const [formData, setFormData] = useState({
    tipo: 'Directa' as 'Directa' | 'Por Pedido',
    cliente: '',
    pedido: '',
    metodoPago: 'Efectivo',
    items: [] as VentaItem[]
  });
  const [currentItem, setCurrentItem] = useState({
    producto: '',
    productoId: '',
    cantidad: 0,
    precioUnitario: 0
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const columns: Column[] = [
    { key: 'id', label: 'ID Venta' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha' },
    { 
      key: 'items', 
      label: 'Items',
      render: (items: VentaItem[]) => `${items.length} producto${items.length !== 1 ? 's' : ''}`
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (total: number) => formatCurrency(total)
    },
    { key: 'metodoPago', label: 'Método Pago' },
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

  const handleView = (venta: Venta) => {
    setSelectedVenta(venta);
    setIsDetailModalOpen(true);
  };

  const handleAnular = (venta: Venta) => {
    setAlertState({
      isOpen: true,
      title: 'Confirmar anulación',
      description: `¿Está seguro de anular la venta ${venta.id}? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        setVentas(ventas.map(v => v.id === venta.id ? { ...v, estado: 'Anulada' as const } : v));
      }
    });
  };

  const handleGeneratePDF = (venta: Venta) => {
    const itemsDetail = venta.items.map((item, index) => 
      `${index + 1}. ${item.producto}
   Cantidad: ${item.cantidad} unidades
   Precio Unitario: ${formatCurrency(item.precioUnitario)}
   Subtotal: ${formatCurrency(item.subtotal)}`
    ).join('\n\n');

    const content = `
╔════════════════════════════════════════════════════════════╗
║           GRANDMA'S LIQUEURS - FACTURA DE VENTA           ║
╚════════════════════════════════════════════════════════════╝

ID Venta:           ${venta.id}
Cliente:            ${venta.cliente}
Fecha:              ${venta.fecha}
Método de Pago:     ${venta.metodoPago}
Estado:             ${venta.estado}

────────────────────────────────────────────────────────────
PRODUCTOS VENDIDOS:
───────────────────────────────────────────────────────────

${itemsDetail}

────────────────────────────────────────────────────────────
TOTAL:              ${formatCurrency(venta.total)}
────────────────────────────────────────────────────────────

Gracias por su compra

Fecha Impresión:    ${new Date().toLocaleString('es-CO')}
────────────────────────────────────────────────────────────
    `.trim();

    setPdfContent(content);
    setIsPdfModalOpen(true);
  };

  const handleAddItem = () => {
    if (currentItem.producto && currentItem.cantidad > 0 && currentItem.precioUnitario > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { 
          producto: currentItem.producto,
          cantidad: currentItem.cantidad, 
          precioUnitario: currentItem.precioUnitario,
          subtotal: currentItem.cantidad * currentItem.precioUnitario 
        }]
      });
      setCurrentItem({ producto: '', productoId: '', cantidad: 0, precioUnitario: 0 });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleSaveVenta = () => {
    if (formData.cliente && formData.items.length > 0) {
      const newVenta: Venta = {
        id: `VEN-${(ventas.length + 1).toString().padStart(3, '0')}`,
        tipo: formData.tipo,
        cliente: formData.cliente,
        pedido: formData.pedido,
        fecha: new Date().toISOString().split('T')[0],
        items: formData.items,
        total: formData.items.reduce((acc, item) => acc + item.subtotal, 0),
        metodoPago: formData.metodoPago,
        estado: 'Pendiente'
      };
      setVentas([...ventas, newVenta]);
      setIsModalOpen(false);
      setFormData({
        tipo: 'Directa' as 'Directa' | 'Por Pedido',
        cliente: '',
        pedido: '',
        metodoPago: 'Efectivo',
        items: [] as VentaItem[]
      });
      setCurrentItem({ producto: '', productoId: '', cantidad: 0, precioUnitario: 0 });
    }
  };

  const handleProductoChange = (productoId: string) => {
    const productoSeleccionado = mockProductosDisponibles.find(p => p.id === productoId);
    if (productoSeleccionado) {
      setCurrentItem({
        ...currentItem,
        productoId: productoId,
        producto: productoSeleccionado.nombre,
        precioUnitario: productoSeleccionado.precio
      });
    } else {
      setCurrentItem({
        ...currentItem,
        productoId: '',
        producto: '',
        precioUnitario: 0
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Ventas</h2>
          <p className="text-muted-foreground">Consulta y administra las ventas realizadas</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          Nueva Venta
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={ventas}
        actions={[
          commonActions.view(handleView),
          commonActions.pdf(handleGeneratePDF),
          commonActions.cancel(handleAnular)
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar ventas..."
      />

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detalle de Venta ${selectedVenta?.id}`}
        size="lg"
      >
        {selectedVenta && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p>{selectedVenta.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p>{selectedVenta.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p>{selectedVenta.metodoPago}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedVenta.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                  selectedVenta.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedVenta.estado}
                </span>
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
                  {selectedVenta.items.map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-3">{item.producto}</td>
                      <td className="p-3 text-right">{item.cantidad}</td>
                      <td className="p-3 text-right">{formatCurrency(item.precioUnitario)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border bg-accent/50">
                    <td colSpan={3} className="p-3 text-right">Total:</td>
                    <td className="p-3 text-right">{formatCurrency(selectedVenta.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Factura de Venta"
        size="lg"
      >
        <pre className="p-4 bg-accent/50 rounded-lg text-sm">
          {pdfContent}
        </pre>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Venta"
        size="lg"
      >
        <div className="space-y-4">
          <FormField
            label="Tipo de Venta"
            name="tipo"
            type="select"
            value={formData.tipo}
            onChange={(value) => setFormData({ ...formData, tipo: value as 'Directa' | 'Por Pedido' })}
            options={[
              { value: 'Directa', label: 'Venta Directa' },
              { value: 'Por Pedido', label: 'Venta Por Pedido' }
            ]}
            required
          />

          <FormField
            label="Cliente"
            name="cliente"
            type="select"
            value={formData.cliente}
            onChange={(value) => setFormData({ ...formData, cliente: value as string })}
            options={[
              { value: '', label: 'Seleccionar cliente...' },
              ...mockClientesDisponibles.map(c => ({
                value: c.nombre,
                label: `${c.nombre} (${c.id})`
              }))
            ]}
            placeholder="Seleccionar cliente"
            required
          />

          {formData.tipo === 'Por Pedido' && (
            <FormField
              label="Número de Pedido"
              name="pedido"
              value={formData.pedido}
              onChange={(value) => setFormData({ ...formData, pedido: value as string })}
              placeholder="PED-001"
              required
            />
          )}

          <FormField
            label="Método de Pago"
            name="metodoPago"
            type="select"
            value={formData.metodoPago}
            onChange={(value) => setFormData({ ...formData, metodoPago: value as string })}
            options={[
              { value: 'Efectivo', label: 'Efectivo' },
              { value: 'Tarjeta', label: 'Tarjeta' },
              { value: 'Transferencia', label: 'Transferencia' }
            ]}
            required
          />

          <div className="space-y-4 border-t border-border pt-4">
            <h4>Agregar Productos</h4>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Producto"
                name="producto"
                type="select"
                value={currentItem.productoId}
                onChange={(value) => handleProductoChange(value as string)}
                options={[
                  { value: '', label: 'Seleccionar producto...' },
                  ...mockProductosDisponibles.map(p => ({
                    value: p.id,
                    label: `${p.nombre} (Stock: ${p.stock})`
                  }))
                ]}
                placeholder="Seleccionar producto"
              />

              <FormField
                label="Cantidad"
                name="cantidad"
                type="number"
                value={currentItem.cantidad}
                onChange={(value) => setCurrentItem({ ...currentItem, cantidad: value as number })}
                placeholder="0"
              />

              <FormField
                label="Precio Unitario"
                name="precioUnitario"
                type="number"
                value={currentItem.precioUnitario}
                onChange={(value) => setCurrentItem({ ...currentItem, precioUnitario: value as number })}
                placeholder="0"
              />
            </div>

            <Button type="button" onClick={handleAddItem} icon={<Plus className="w-4 h-4" />}>
              Agregar Producto
            </Button>
          </div>

          {formData.items.length > 0 && (
            <div className="space-y-2">
              <h4>Productos Agregados</h4>
              <table className="w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-right">Cantidad</th>
                    <th className="p-3 text-right">Precio Unit.</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-3">{item.producto}</td>
                      <td className="p-3 text-right">{item.cantidad}</td>
                      <td className="p-3 text-right">{formatCurrency(item.precioUnitario)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.subtotal)}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border bg-accent/50">
                    <td colSpan={3} className="p-3 text-right">Total:</td>
                    <td className="p-3 text-right">{formatCurrency(formData.items.reduce((acc, item) => acc + item.subtotal, 0))}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-3 pt-4 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVenta} disabled={formData.items.length === 0}>
              Guardar Venta
            </Button>
          </div>
        </div>
      </Modal>

      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, title: '', description: '', onConfirm: () => {} })}
        title={alertState.title}
        description={alertState.description}
        onConfirm={alertState.onConfirm}
        type="warning"
      />
    </div>
  );
}