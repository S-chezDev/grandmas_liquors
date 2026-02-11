import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Button } from '../../Button';
import { Form, FormField, FormActions } from '../../Form';
import { Plus, Eye, Trash2, Minus, DollarSign } from 'lucide-react';
import { pedidos as pedidosAPI, clientes as clientesAPI, productos as productosAPI } from '../../../services/api';

interface Pedido {
  id: string;
  numero_pedido?: string;
  cliente_id: number;
  cliente?: string;
  productos?: number;
  total: number;
  fecha: string;
  fecha_entrega: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
}

interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

interface ProductoEnPedido {
  producto_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const [clientesDisponibles, setClientesDisponibles] = useState<Array<{value: string, label: string}>>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado'>('Pendiente');
  const [isAbonosModalOpen, setIsAbonosModalOpen] = useState(false);
  const [pedidoParaAbonos, setPedidoParaAbonos] = useState<Pedido | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  
  // Form data para crear/editar
  const [formData, setFormData] = useState({
    cliente_id: 0,
    fecha: new Date().toISOString().split('T')[0],
    fecha_entrega: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadPedidos();
    loadProductos();
    loadClientes();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosAPI.getAll();
      setPedidos(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await productosAPI.getAll();
      setProductosDisponibles(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await clientesAPI.getAll();
      setClientesDisponibles(data.map((c: any) => ({
        value: c.id.toString(),
        label: c.nombre
      })));
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };
  
  const [productosEnPedido, setProductosEnPedido] = useState<ProductoEnPedido[]>([]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const columns: Column[] = [
    { key: 'numero_pedido', label: 'ID Pedido' },
    { key: 'cliente', label: 'Cliente' },
    { 
      key: 'productos', 
      label: 'Productos',
      render: (value: number) => `${value || 0} producto${value !== 1 ? 's' : ''}`
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (total: number) => formatCurrency(total)
    },
    { key: 'fecha', label: 'Fecha Pedido' },
    { key: 'fecha_entrega', label: 'Fecha Entrega' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string) => (
        <span className={`px-3 py-1 rounded-full text-xs ${
          estado === 'Completado' ? 'bg-green-100 text-green-700' :
          estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
          estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {estado}
        </span>
      )
    }
  ];

  // Calcular total del pedido
  const calcularTotal = () => {
    return productosEnPedido.reduce((sum, p) => sum + p.subtotal, 0);
  };

  // Agregar producto al pedido
  const handleAgregarProducto = () => {
    setProductosEnPedido([
      ...productosEnPedido,
      {
        producto_id: '',
        nombre: '',
        cantidad: 1,
        precio_unitario: 0,
        subtotal: 0
      }
    ]);
  };

  // Eliminar producto del pedido
  const handleEliminarProducto = (index: number) => {
    setProductosEnPedido(productosEnPedido.filter((_, i) => i !== index));
  };

  // Actualizar producto en el pedido
  const handleUpdateProducto = (index: number, field: keyof ProductoEnPedido, value: any) => {
    const newProductos = [...productosEnPedido];
    
    if (field === 'producto_id') {
      const producto = productosDisponibles.find(p => p.id === value);
      if (producto) {
        newProductos[index] = {
          ...newProductos[index],
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: producto.precio,
          subtotal: producto.precio * newProductos[index].cantidad
        };
      }
    } else if (field === 'cantidad') {
      const cantidad = parseInt(value) || 1;
      newProductos[index] = {
        ...newProductos[index],
        cantidad,
        subtotal: newProductos[index].precio_unitario * cantidad
      };
    } else if (field === 'precio_unitario') {
      const precio = parseFloat(value) || 0;
      newProductos[index] = {
        ...newProductos[index],
        precio_unitario: precio,
        subtotal: precio * newProductos[index].cantidad
      };
    }
    
    setProductosEnPedido(newProductos);
  };

  // Crear nuevo pedido
  const handleCreatePedido = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productosEnPedido.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }
    
    if (productosEnPedido.some(p => !p.producto_id)) {
      alert('Debe seleccionar un producto para cada fila');
      return;
    }
    
    try {
      const newPedido = {
        cliente_id: formData.cliente_id,
        total: calcularTotal(),
        fecha: formData.fecha,
        fecha_entrega: formData.fecha_entrega,
        estado: 'Pendiente' as const
      };
      
      await pedidosAPI.create(newPedido);
      await loadPedidos();
      setIsCreateModalOpen(false);
      
      // Limpiar formulario
      setFormData({
        cliente_id: 0,
        fecha: new Date().toISOString().split('T')[0],
        fecha_entrega: new Date().toISOString().split('T')[0],
      });
      setProductosEnPedido([]);
    } catch (error) {
      console.error('Error creando pedido:', error);
      alert('Error al crear el pedido');
    }
  };

  const handleChangeState = async (pedido: Pedido) => {
    const states: Array<'Pendiente' | 'En Proceso' | 'Completado'> = ['Pendiente', 'En Proceso', 'Completado'];
    const currentIndex = states.indexOf(pedido.estado as any);
    const nextState = states[(currentIndex + 1) % states.length];
    
    try {
      await pedidosAPI.update(Number(pedido.id), { estado: nextState });
      await loadPedidos();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const handleEdit = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setSelectedEstado(pedido.estado);
    setFormData({
      cliente_id: pedido.cliente_id,
      fecha: pedido.fecha,
      fecha_entrega: pedido.fecha_entrega
    });
    // Inicializar con productos de ejemplo
    setProductosEnPedido([
      {
        producto_id: 'PROD-001',
        nombre: 'Producto ejemplo',
        cantidad: 2,
        precio_unitario: 120000,
        subtotal: 240000
      }
    ]);
    setIsEditModalOpen(true);
  };

  const handleUpdatePedido = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productosEnPedido.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }
    
    if (productosEnPedido.some(p => !p.producto_id)) {
      alert('Debe seleccionar un producto para cada fila');
      return;
    }
    
    if (selectedPedido) {
      try {
        await pedidosAPI.update(Number(selectedPedido.id), {
          cliente_id: formData.cliente_id,
          fecha: formData.fecha,
          fecha_entrega: formData.fecha_entrega,
          total: calcularTotal(),
          estado: selectedEstado
        });
        await loadPedidos();
        setIsEditModalOpen(false);
        setSelectedPedido(null);
        setProductosEnPedido([]);
      } catch (error) {
        console.error('Error actualizando pedido:', error);
        alert('Error al actualizar el pedido');
      }
    }
  };

  const handleCancelar = async () => {
    if (selectedPedido && confirm(`¿Está seguro de cancelar el pedido ${selectedPedido.numero_pedido || selectedPedido.id}?`)) {
      try {
        await pedidosAPI.update(Number(selectedPedido.id), { estado: 'Cancelado' });
        await loadPedidos();
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Error cancelando pedido:', error);
        alert('Error al cancelar el pedido');
      }
    }
  };

  const handleVerAbonos = (pedido: Pedido) => {
    setPedidoParaAbonos(pedido);
    setIsAbonosModalOpen(true);
  };

  const getPedidoAbonos = () => {
    if (!pedidoParaAbonos) return [];
    return mockAbonos.filter(a => a.pedido === pedidoParaAbonos.id);
  };

  const handleGeneratePDF = (pedido: Pedido) => {
    const abonos = mockAbonos.filter(a => a.pedido === pedido.id);
    const totalAbonado = abonos.reduce((sum, a) => sum + a.monto, 0);
    const saldoPendiente = pedido.total - totalAbonado;

    const abonosDetail = abonos.length > 0 
      ? abonos.map((abono, index) => 
          `${index + 1}. ${abono.id} - ${formatCurrency(abono.monto)} (${abono.metodoPago}) - ${abono.fecha}`
        ).join('\n')
      : 'Sin abonos registrados';

    const content = `
╔════════════════════════════════════════════════════════════╗
║           GRANDMA'S LIQUEURS - DETALLE DE PEDIDO          ║
╚════════════════════════════════════════════════════════════╝

ID Pedido:          ${pedido.id}
Cliente:            ${pedido.cliente}
Fecha Pedido:       ${pedido.fecha}
Fecha Entrega:      ${pedido.fechaEntrega}
Estado:             ${pedido.estado}

──────────────────────────────────────���─────────────────────
RESUMEN DEL PEDIDO:
────────────────────────────────────────────────────────────

Productos:          ${pedido.productos} items
Total Pedido:       ${formatCurrency(pedido.total)}

────────────────────────────────────────────────────────────
ABONOS REGISTRADOS:
────────────────────────────────────────────────────────────

${abonosDetail}

────────────────────────────────────────────────────────────
Total Abonado:      ${formatCurrency(totalAbonado)}
Saldo Pendiente:    ${formatCurrency(saldoPendiente)}
────────────────────────────────────────────────────────────

Firma Cliente:      _______________________

Firma Autorizado:   _______________________

Fecha Impresión:    ${new Date().toLocaleString('es-CO')}
──────���─────────────────────────────────────────────────────
    `.trim();

    setPdfContent(content);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Pedidos</h2>
          <p className="text-muted-foreground">Administra los pedidos de clientes</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setIsCreateModalOpen(true)}>
          Nuevo Pedido
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pedidos}
        actions={[
          commonActions.view((pedido) => {
            setSelectedPedido(pedido);
            setIsDetailModalOpen(true);
          }),
          {
            label: 'Ver Abonos',
            icon: <DollarSign className="w-4 h-4" />,
            onClick: handleVerAbonos,
            variant: 'outline'
          },
          commonActions.edit(handleEdit),
          commonActions.pdf(handleGeneratePDF),
          commonActions.cancel(async (pedido) => {
            if (confirm(`¿Cancelar pedido ${pedido.numero_pedido || pedido.id}?`)) {
              try {
                await pedidosAPI.update(Number(pedido.id), { estado: 'Cancelado' });
                await loadPedidos();
              } catch (error) {
                console.error('Error:', error);
              }
            }
          })
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar pedidos..."
      />

      {loading && (
        <div className="text-center py-8">
          <p>Cargando pedidos...</p>
        </div>
      )}

      {/* Modal de Crear Pedido */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({
            cliente_id: 0,
            fecha: new Date().toISOString().split('T')[0],
            fecha_entrega: new Date().toISOString().split('T')[0],
          });
          setProductosEnPedido([]);
        }}
        title="Crear Nuevo Pedido"
        size="xl"
      >
        <Form onSubmit={handleCreatePedido}>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Cliente"
              name="cliente_id"
              type="select"
              value={formData.cliente_id.toString()}
              onChange={(value) => setFormData({ ...formData, cliente_id: parseInt(value as string) })}
              options={clientesDisponibles}
              required
            />
            
            <FormField
              label="Fecha Pedido"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={(value) => setFormData({ ...formData, fecha: value as string })}
              required
            />
            
            <FormField
              label="Fecha Entrega"
              name="fecha_entrega"
              type="date"
              value={formData.fecha_entrega}
              onChange={(value) => setFormData({ ...formData, fecha_entrega: value as string })}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label>Productos del Pedido</label>
              <Button 
                type="button"
                size="sm" 
                icon={<Plus className="w-4 h-4" />} 
                onClick={handleAgregarProducto}
              >
                Agregar Producto
              </Button>
            </div>

            {productosEnPedido.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-left w-24">Cantidad</th>
                      <th className="px-4 py-2 text-left w-32">Precio Unit.</th>
                      <th className="px-4 py-2 text-left w-32">Subtotal</th>
                      <th className="px-4 py-2 text-center w-20">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosEnPedido.map((producto, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          <select
                            className="w-full px-3 py-1 border rounded"
                            value={producto.producto_id}
                            onChange={(e) => handleUpdateProducto(index, 'producto_id', e.target.value)}
                            required
                          >
                            <option value="">Seleccionar producto...</option>
                            {productosDisponibles.map(p => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-1 border rounded"
                            value={producto.cantidad}
                            onChange={(e) => handleUpdateProducto(index, 'cantidad', e.target.value)}
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-1 border rounded"
                            value={producto.precio_unitario}
                            onChange={(e) => handleUpdateProducto(index, 'precio_unitario', e.target.value)}
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          {formatCurrency(producto.subtotal)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleEliminarProducto(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right">
                        <strong>Total:</strong>
                      </td>
                      <td colSpan={2} className="px-4 py-2">
                        <strong>{formatCurrency(calcularTotal())}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
              </div>
            )}
          </div>
          
          <FormActions>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({
                  cliente_id: 0,
                  fecha: new Date().toISOString().split('T')[0],
                  fecha_entrega: new Date().toISOString().split('T')[0],
                });
                setProductosEnPedido([]);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Crear Pedido
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detalle de Pedido ${selectedPedido?.id}`}
        size="lg"
      >
        {selectedPedido && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID Pedido</p>
                <p>{selectedPedido.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p>{selectedPedido.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p>{selectedPedido.productos} producto{selectedPedido.productos !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p>{formatCurrency(selectedPedido.total)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Pedido</p>
                <p>{selectedPedido.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Entrega</p>
                <p>{selectedPedido.fecha_entrega}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedPedido.estado === 'Completado' ? 'bg-green-100 text-green-700' :
                  selectedPedido.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                  selectedPedido.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedPedido.estado}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPedido(null);
          setProductosEnPedido([]);
        }}
        title={`Editar Pedido ${selectedPedido?.id}`}
        size="xl"
      >
        {selectedPedido && (
          <Form onSubmit={handleUpdatePedido}>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Cliente"
                name="cliente_id"
                type="select"
                value={formData.cliente_id.toString()}
                onChange={(value) => setFormData({ ...formData, cliente_id: parseInt(value as string) })}
                options={clientesDisponibles}
                required
              />
              
              <FormField
                label="Fecha Pedido"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={(value) => setFormData({ ...formData, fecha: value as string })}
                required
              />
              
              <FormField
                label="Fecha Entrega"
                name="fecha_entrega"
                type="date"
                value={formData.fecha_entrega}
                onChange={(value) => setFormData({ ...formData, fecha_entrega: value as string })}
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Estado del Pedido</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value as any)}
                disabled={selectedPedido.estado === 'Cancelado'}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label>Productos del Pedido</label>
                <Button 
                  type="button"
                  size="sm" 
                  icon={<Plus className="w-4 h-4" />} 
                  onClick={handleAgregarProducto}
                >
                  Agregar Producto
                </Button>
              </div>

              {productosEnPedido.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Producto</th>
                        <th className="px-4 py-2 text-left w-24">Cantidad</th>
                        <th className="px-4 py-2 text-left w-32">Precio Unit.</th>
                        <th className="px-4 py-2 text-left w-32">Subtotal</th>
                        <th className="px-4 py-2 text-center w-20">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosEnPedido.map((producto, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">
                            <select
                              className="w-full px-3 py-1 border rounded"
                              value={producto.producto_id}
                              onChange={(e) => handleUpdateProducto(index, 'producto_id', e.target.value)}
                              required
                            >
                              <option value="">Seleccionar producto...</option>
                              {productosDisponibles.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="1"
                              className="w-full px-3 py-1 border rounded"
                              value={producto.cantidad}
                              onChange={(e) => handleUpdateProducto(index, 'cantidad', e.target.value)}
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-1 border rounded"
                              value={producto.precio_unitario}
                              onChange={(e) => handleUpdateProducto(index, 'precio_unitario', e.target.value)}
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            {formatCurrency(producto.subtotal)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleEliminarProducto(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right">
                          <strong>Total:</strong>
                        </td>
                        <td colSpan={2} className="px-4 py-2">
                          <strong>{formatCurrency(calcularTotal())}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                  No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="destructive"
                onClick={handleCancelar}
                className="flex-1"
                disabled={selectedPedido.estado === 'Cancelado'}
              >
                Cancelar Pedido
              </Button>
            </div>

            {/* Acciones del modal */}
            <FormActions>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedPedido(null);
                  setProductosEnPedido([]);
                }}
              >
                Cerrar
              </Button>
              <Button 
                type="submit"
                disabled={selectedPedido.estado === 'Cancelado'}
              >
                Guardar Cambios
              </Button>
            </FormActions>
          </Form>
        )}
      </Modal>

      {/* Modal de Abonos */}
      <Modal
        isOpen={isAbonosModalOpen}
        onClose={() => setIsAbonosModalOpen(false)}
        title={`Abonos del Pedido ${pedidoParaAbonos?.id}`}
        size="lg"
      >
        <div className="space-y-4">
          {getPedidoAbonos().length > 0 ? (
            <>
              <div className="space-y-2">
                {getPedidoAbonos().map((abono) => (
                  <div key={abono.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{abono.id}</p>
                        <p className="text-sm text-muted-foreground">{abono.fecha}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(abono.monto)}</p>
                        <p className="text-sm text-muted-foreground">{abono.metodoPago}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Abonado:</span>
                  <span className="font-medium">
                    {formatCurrency(getPedidoAbonos().reduce((sum, a) => sum + a.monto, 0))}
                  </span>
                </div>
                {pedidoParaAbonos && (
                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>Saldo Pendiente:</span>
                    <span>
                      {formatCurrency(
                        pedidoParaAbonos.total - getPedidoAbonos().reduce((sum, a) => sum + a.monto, 0)
                      )}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No hay abonos registrados para este pedido
            </div>
          )}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsAbonosModalOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de PDF */}
      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title={`PDF del Pedido ${selectedPedido?.id}`}
        size="lg"
      >
        <div className="space-y-4">
          <pre className="p-4 bg-accent rounded-lg text-sm">
            {pdfContent}
          </pre>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsPdfModalOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}