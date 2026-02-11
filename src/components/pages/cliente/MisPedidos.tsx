import React, { useState } from 'react';
import { DataTable, Column } from '../../DataTable';
import { Modal } from '../../Modal';
import { Button } from '../../Button';
import { Eye, Package } from 'lucide-react';

interface Pedido {
  id: string;
  fecha: string;
  productos: string;
  total: number;
  estado: 'Pendiente' | 'En Preparación' | 'En Camino' | 'Entregado' | 'Cancelado';
  direccion: string;
  metodoPago: string;
  observaciones?: string;
}

const mockPedidos: Pedido[] = [
  {
    id: 'PED-001',
    fecha: '2024-12-15',
    productos: '2x Whisky Jack Daniels, 1x Ron Medellín',
    total: 335000,
    estado: 'Entregado',
    direccion: 'Calle 50 #45-23, Laureles',
    metodoPago: 'Efectivo',
    observaciones: 'Llamar al llegar'
  },
  {
    id: 'PED-002',
    fecha: '2024-12-16',
    productos: '3x Aguardiente Antioqueño, 6x Cerveza Corona',
    total: 156000,
    estado: 'En Camino',
    direccion: 'Carrera 70 #35-12, Laureles',
    metodoPago: 'Transferencia',
    observaciones: ''
  },
  {
    id: 'PED-003',
    fecha: '2024-12-16',
    productos: '1x Vino Tinto Reserva, 1x Tequila Patrón',
    total: 245000,
    estado: 'En Preparación',
    direccion: 'Calle 50 #45-23, Laureles',
    metodoPago: 'Contraentrega',
    observaciones: 'Entrega después de las 5pm'
  }
];

export function MisPedidos() {
  const [pedidos] = useState<Pedido[]>(mockPedidos);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const columns: Column[] = [
    { key: 'id', label: 'ID Pedido' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'productos', label: 'Productos' },
    { 
      key: 'total', 
      label: 'Total',
      render: (value: number) => `$${value.toLocaleString('es-CO')}`
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string) => (
        <span className={`px-3 py-1 rounded-full text-xs ${
          estado === 'Entregado' ? 'bg-green-100 text-green-700' :
          estado === 'En Camino' ? 'bg-blue-100 text-blue-700' :
          estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
          estado === 'En Preparación' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {estado}
        </span>
      )
    }
  ];

  const handleView = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Mis Pedidos</h2>
          <p className="text-muted-foreground">Consulta el estado de tus pedidos</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pedidos}
        actions={[
          {
            label: 'Ver Detalle',
            icon: <Eye className="w-4 h-4" />,
            onClick: handleView,
            variant: 'default'
          }
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar pedidos..."
      />

      {/* Modal de Detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPedido(null);
        }}
        title={`Detalle de Pedido ${selectedPedido?.id}`}
        size="lg"
      >
        {selectedPedido && (
          <div className="space-y-6">
            {/* Header con estado */}
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div>
                <h3 className="text-lg">{selectedPedido.id}</h3>
                <p className="text-sm text-muted-foreground">{selectedPedido.fecha}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm ${
                selectedPedido.estado === 'Entregado' ? 'bg-green-100 text-green-700' :
                selectedPedido.estado === 'En Camino' ? 'bg-blue-100 text-blue-700' :
                selectedPedido.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                selectedPedido.estado === 'En Preparación' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedPedido.estado}
              </span>
            </div>

            {/* Información del pedido */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Productos</label>
                <p className="mt-1">{selectedPedido.productos}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total</label>
                <p className="mt-1 text-primary text-lg">
                  ${selectedPedido.total.toLocaleString('es-CO')}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">Dirección de Entrega</label>
                <p className="mt-1">{selectedPedido.direccion}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Método de Pago</label>
                <p className="mt-1">{selectedPedido.metodoPago}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fecha del Pedido</label>
                <p className="mt-1">{selectedPedido.fecha}</p>
              </div>
            </div>

            {selectedPedido.observaciones && (
              <div className="p-4 bg-accent/50 rounded-lg">
                <label className="text-sm text-muted-foreground block mb-2">Observaciones</label>
                <p className="text-sm">{selectedPedido.observaciones}</p>
              </div>
            )}

            {/* Línea de tiempo del pedido */}
            <div className="p-4 bg-accent/50 rounded-lg">
              <label className="text-sm text-muted-foreground block mb-4">Estado del Pedido</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['Pendiente', 'En Preparación', 'En Camino', 'Entregado'].includes(selectedPedido.estado)
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm">Pedido Recibido</p>
                    <p className="text-xs text-muted-foreground">{selectedPedido.fecha}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['En Preparación', 'En Camino', 'Entregado'].includes(selectedPedido.estado)
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm">En Preparación</p>
                    {selectedPedido.estado !== 'Pendiente' && (
                      <p className="text-xs text-muted-foreground">En proceso</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['En Camino', 'Entregado'].includes(selectedPedido.estado)
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm">En Camino</p>
                    {selectedPedido.estado === 'En Camino' && (
                      <p className="text-xs text-muted-foreground">Tu pedido está en ruta</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedPedido.estado === 'Entregado'
                      ? 'bg-green-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm">Entregado</p>
                    {selectedPedido.estado === 'Entregado' && (
                      <p className="text-xs text-muted-foreground">Pedido completado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedPedido(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
