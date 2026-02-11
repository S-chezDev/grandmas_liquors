import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { compras as comprasAPI } from '../../../services/api';

interface CompraItem {
  productoId: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Compra {
  id: string;
  numero_compra: string;
  proveedor_id: number;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
}

export function Compras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompras();
  }, []);

  const loadCompras = async () => {
    try {
      setLoading(true);
      const data = await comprasAPI.getAll();
      setCompras(data);
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
    items: [] as CompraItem[]
  });

  const [currentItem, setCurrentItem] = useState({
    producto: '',
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
    { key: 'id', label: 'ID Compra' },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'fecha', label: 'Fecha' },
    { 
      key: 'items', 
      label: 'Items',
      render: (items: CompraItem[]) => `${items.length} producto${items.length !== 1 ? 's' : ''}`
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
      items: [] 
    });
    setIsModalOpen(true);
  };

  const handleView = (compra: Compra) => {
    setSelectedCompra(compra);
    setIsDetailModalOpen(true);
  };

  const handleAnular = (compra: Compra) => {
    if (confirm(`¿Está seguro de anular la compra ${compra.id}?`)) {
      setCompras(compras.map(c => c.id === compra.id ? { ...c, estado: 'Anulada' as const } : c));
    }
  };

  const handleGeneratePDF = (compra: Compra) => {
    const itemsDetail = compra.items.map((item, index) => 
      `${index + 1}. ${item.producto}
   Cantidad: ${item.cantidad} unidades
   Precio Unitario: ${formatCurrency(item.precioUnitario)}
   Subtotal: ${formatCurrency(item.subtotal)}`
    ).join('\n\n');

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
    if (!currentItem.producto || currentItem.cantidad <= 0 || currentItem.precioUnitario <= 0) {
      alert('Complete todos los campos del producto');
      return;
    }
    
    const newItem: CompraItem = {
      productoId: Math.random().toString(),
      producto: currentItem.producto,
      cantidad: currentItem.cantidad,
      precioUnitario: currentItem.precioUnitario,
      subtotal: currentItem.cantidad * currentItem.precioUnitario
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
    
    setCurrentItem({ producto: '', cantidad: 0, precioUnitario: 0 });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }
    
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    const newCompra: Compra = {
      id: `COM-${String(compras.length + 1).padStart(3, '0')}`,
      proveedor: formData.proveedor,
      fecha: formData.fecha,
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaCompra: formData.fecha,
      items: formData.items,
      subtotal,
      iva,
      total,
      estado: 'Pendiente'
    };
    
    setCompras([...compras, newCompra]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
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
              options={[
                { value: 'Distribuidora Nacional S.A.S', label: 'Distribuidora Nacional S.A.S' },
                { value: 'Licores Premium Ltda', label: 'Licores Premium Ltda' },
                { value: 'Importadora Global', label: 'Importadora Global' }
              ]}
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
                value={currentItem.producto}
                onChange={(value) => setCurrentItem({ ...currentItem, producto: value as string })}
                options={[
                  { value: 'Whisky Jack Daniels 750ml', label: 'Whisky Jack Daniels 750ml' },
                  { value: 'Ron Medellín Añejo 750ml', label: 'Ron Medellín Añejo 750ml' },
                  { value: 'Aguardiente Antioqueño 750ml', label: 'Aguardiente Antioqueño 750ml' },
                  { value: 'Cerveza Corona 355ml', label: 'Cerveza Corona 355ml' }
                ]}
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
              />
              
              <div className="flex items-end">
                <Button type="button" onClick={handleAddItem} className="w-full">
                  Agregar
                </Button>
              </div>
            </div>
          </div>

          {/* Items List */}
          {formData.items.length > 0 && (
            <div className="border border-border rounded-lg p-4 max-h-60 overflow-y-auto">
              <table className="w-full">
                <thead className="text-sm bg-muted">
                  <tr>
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
                    <td colSpan={3} className="p-2 text-right">Total:</td>
                    <td className="p-2 text-right">
                      {formatCurrency(formData.items.reduce((sum, item) => sum + item.subtotal, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

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
                  {selectedCompra.items.map((item, index) => (
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