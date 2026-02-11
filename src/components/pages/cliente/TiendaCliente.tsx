import React, { useState } from 'react';
import { Card } from '../../Card';
import { Button } from '../../Button';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, X, Check } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion: string;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

// Productos simulados
const productosDisponibles: Producto[] = [
  {
    id: 'P001',
    nombre: 'Whisky Jack Daniels',
    categoria: 'Whiskies',
    precio: 125000,
    stock: 45,
    imagen: 'https://images.unsplash.com/photo-1527281400986-0cc1d2c1e1af?w=400&h=400&fit=crop',
    descripcion: 'Whisky Tennessee 750ml, sabor suave y ahumado'
  },
  {
    id: 'P002',
    nombre: 'Ron Medellín Añejo',
    categoria: 'Rones',
    precio: 85000,
    stock: 60,
    imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop',
    descripcion: 'Ron añejo colombiano 750ml, añejado en barricas de roble'
  },
  {
    id: 'P003',
    nombre: 'Aguardiente Antioqueño',
    categoria: 'Aguardientes',
    precio: 45000,
    stock: 100,
    imagen: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop',
    descripcion: 'Aguardiente tradicional sin azúcar 750ml'
  },
  {
    id: 'P004',
    nombre: 'Cerveza Corona',
    categoria: 'Cervezas',
    precio: 3500,
    stock: 200,
    imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    descripcion: 'Cerveza mexicana 355ml, pack de 6 unidades'
  },
  {
    id: 'P005',
    nombre: 'Vino Tinto Reserva',
    categoria: 'Vinos',
    precio: 65000,
    stock: 30,
    imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop',
    descripcion: 'Vino tinto chileno 750ml, reserva especial'
  },
  {
    id: 'P006',
    nombre: 'Tequila Patrón Silver',
    categoria: 'Tequilas',
    precio: 180000,
    stock: 25,
    imagen: 'https://images.unsplash.com/photo-1606483784958-4ed6bafdab2f?w=400&h=400&fit=crop',
    descripcion: 'Tequila premium 750ml, 100% agave'
  },
  {
    id: 'P007',
    nombre: 'Vodka Absolut',
    categoria: 'Vodkas',
    precio: 95000,
    stock: 40,
    imagen: 'https://images.unsplash.com/photo-1560508992-24c0ce5d4b2c?w=400&h=400&fit=crop',
    descripcion: 'Vodka sueco premium 750ml'
  },
  {
    id: 'P008',
    nombre: 'Ginebra Bombay Sapphire',
    categoria: 'Ginebras',
    precio: 110000,
    stock: 35,
    imagen: 'https://images.unsplash.com/photo-1585553616435-2dc130a2e44c?w=400&h=400&fit=crop',
    descripcion: 'Ginebra premium 750ml, botánica equilibrada'
  }
];

export function TiendaCliente() {
  const [productos] = useState<Producto[]>(productosDisponibles);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todos');
  const [busqueda, setBusqueda] = useState('');
  const { showAlert, AlertComponent } = useAlertDialog();

  // Datos del pedido
  const [datosEntrega, setDatosEntrega] = useState({
    direccion: '',
    telefono: '',
    observaciones: '',
    metodoPago: 'Efectivo' as 'Efectivo' | 'Transferencia' | 'Contraentrega'
  });

  // Obtener categorías únicas
  const categorias = ['Todos', ...Array.from(new Set(productos.map(p => p.categoria)))];

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const matchCategoria = categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Agregar al carrito
  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        showAlert({
          title: 'Stock insuficiente',
          description: `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}`,
          type: 'warning',
          confirmText: 'Entendido',
          onConfirm: () => {}
        });
      }
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  // Actualizar cantidad en carrito
  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    const item = carrito.find(i => i.producto.id === productoId);
    if (!item) return;

    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else if (nuevaCantidad <= item.producto.stock) {
      setCarrito(carrito.map(i =>
        i.producto.id === productoId ? { ...i, cantidad: nuevaCantidad } : i
      ));
    } else {
      showAlert({
        title: 'Stock insuficiente',
        description: `Solo hay ${item.producto.stock} unidades disponibles`,
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
    }
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  };

  // Realizar pedido
  const realizarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (carrito.length === 0) {
      showAlert({
        title: 'Carrito vacío',
        description: 'Debes agregar al menos un producto al carrito',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    showAlert({
      title: 'Pedido realizado',
      description: `Tu pedido por $${calcularTotal().toLocaleString('es-CO')} ha sido registrado exitosamente.\n\nRecibirás un correo de confirmación con los detalles.`,
      type: 'success',
      confirmText: 'Entendido',
      onConfirm: () => {
        setCarrito([]);
        setIsCheckoutOpen(false);
        setDatosEntrega({
          direccion: '',
          telefono: '',
          observaciones: '',
          metodoPago: 'Efectivo'
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {AlertComponent}
      
      <div className="flex items-center justify-between">
        <div>
          <h2>Tienda de Productos</h2>
          <p className="text-muted-foreground">Explora nuestro catálogo y realiza tus pedidos</p>
        </div>
        <Button 
          icon={<ShoppingCart className="w-5 h-5" />} 
          onClick={() => setIsCarritoOpen(true)}
          className="relative"
        >
          Carrito ({carrito.reduce((sum, item) => sum + item.cantidad, 0)})
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs">
              {carrito.reduce((sum, item) => sum + item.cantidad, 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Buscar producto</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block mb-2">Filtrar por categoría</label>
            <div className="flex flex-wrap gap-2">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categoriaFiltro === cat
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosFiltrados.map(producto => (
          <Card key={producto.id} className="flex flex-col">
            <div className="relative pb-[100%] mb-4 overflow-hidden rounded-lg bg-muted">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                {producto.categoria}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col">
              <h3 className="mb-2">{producto.nombre}</h3>
              <p className="text-sm text-muted-foreground mb-3 flex-1">
                {producto.descripcion}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Precio</p>
                  <p className="text-primary">${producto.precio.toLocaleString('es-CO')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className={producto.stock < 10 ? 'text-destructive' : 'text-foreground'}>
                    {producto.stock} und.
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => agregarAlCarrito(producto)}
                icon={<Plus className="w-4 h-4" />}
                disabled={producto.stock === 0}
                className="w-full"
              >
                {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No se encontraron productos</p>
          </div>
        </Card>
      )}

      {/* Modal del Carrito */}
      <Modal
        isOpen={isCarritoOpen}
        onClose={() => setIsCarritoOpen(false)}
        title="Mi Carrito de Compras"
        size="lg"
      >
        {carrito.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <Button onClick={() => setIsCarritoOpen(false)}>
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {carrito.map(item => (
              <div key={item.producto.id} className="flex gap-4 p-4 bg-accent/50 rounded-lg">
                <img
                  src={item.producto.imagen}
                  alt={item.producto.nombre}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h4 className="mb-1">{item.producto.nombre}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    ${item.producto.precio.toLocaleString('es-CO')} c/u
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarDelCarrito(item.producto.id)}
                      className="ml-auto text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-primary">
                    ${(item.producto.precio * item.cantidad).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Total:</span>
                <span className="text-2xl text-primary">
                  ${calcularTotal().toLocaleString('es-CO')}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsCarritoOpen(false)} className="flex-1">
                  Continuar Comprando
                </Button>
                <Button 
                  onClick={() => {
                    setIsCarritoOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  icon={<ShoppingBag className="w-5 h-5" />}
                  className="flex-1"
                >
                  Realizar Pedido
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Checkout */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Completar Pedido"
        size="lg"
      >
        <Form onSubmit={realizarPedido}>
          <div className="space-y-4 mb-6">
            <h4>Resumen del Pedido</h4>
            <div className="p-4 bg-accent/50 rounded-lg space-y-2">
              {carrito.map(item => (
                <div key={item.producto.id} className="flex justify-between text-sm">
                  <span>{item.producto.nombre} x {item.cantidad}</span>
                  <span>${(item.producto.precio * item.cantidad).toLocaleString('es-CO')}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between">
                <span>Total:</span>
                <span className="text-primary">${calcularTotal().toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          <FormField
            label="Dirección de Entrega"
            name="direccion"
            type="textarea"
            value={datosEntrega.direccion}
            onChange={(value) => setDatosEntrega({ ...datosEntrega, direccion: value as string })}
            placeholder="Ingresa la dirección completa de entrega"
            rows={2}
            required
          />

          <FormField
            label="Teléfono de Contacto"
            name="telefono"
            value={datosEntrega.telefono}
            onChange={(value) => setDatosEntrega({ ...datosEntrega, telefono: value as string })}
            placeholder="300 123 4567"
            required
          />

          <FormField
            label="Método de Pago"
            name="metodoPago"
            type="select"
            value={datosEntrega.metodoPago}
            onChange={(value) => setDatosEntrega({ ...datosEntrega, metodoPago: value as any })}
            options={[
              { value: 'Efectivo', label: 'Efectivo' },
              { value: 'Transferencia', label: 'Transferencia Bancaria' },
              { value: 'Contraentrega', label: 'Pago Contraentrega' }
            ]}
            required
          />

          <FormField
            label="Observaciones (Opcional)"
            name="observaciones"
            type="textarea"
            value={datosEntrega.observaciones}
            onChange={(value) => setDatosEntrega({ ...datosEntrega, observaciones: value as string })}
            placeholder="Instrucciones especiales para la entrega..."
            rows={3}
          />

          <FormActions>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" icon={<Check className="w-5 h-5" />}>
              Confirmar Pedido
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
}
