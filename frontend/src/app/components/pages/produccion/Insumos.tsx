import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../../DataTable';
import { Modal } from '../../Modal';
import { FormField } from '../../Form';
import { Button } from '../../Button';
import { Package } from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from 'sonner';
import type { Insumo, Usuario, Producto } from '../../../services/types';

interface InsumoView extends Insumo {
  operarioNombre?: string;
  productoNombre?: string;
}

export function Insumos() {
  const [insumos, setInsumos] = useState<InsumoView[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<InsumoView | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [filtroOperario, setFiltroOperario] = useState<string>('');
  const [operarios, setOperarios] = useState<Usuario[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [insumosData, usuariosData, productosData] = await Promise.all([
        api.insumos.getAll(),
        api.usuarios.getAll(),
        api.productos.getAll()
      ]);

      const operariosData = usuariosData.filter(u => u.rol === 'Productor');
      setOperarios(operariosData);

      const insumosConInfo = insumosData.map(insumo => {
        const operario = usuariosData.find(u => u.id === insumo.operarioId);
        const producto = insumo.productoRelacionadoId
          ? productosData.find(p => p.id === insumo.productoRelacionadoId)
          : null;
        return {
          ...insumo,
          operarioNombre: operario ? `${operario.nombre} ${operario.apellido}` : 'Desconocido',
          productoNombre: producto?.nombre
        };
      });

      setInsumos(insumosConInfo);
    } catch (error) {
      toast.error('Error al cargar datos');
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => `#${String(value).padStart(4, '0')}`
    },
    {
      key: 'nombre',
      label: 'Insumo'
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (cantidad: number) => `${cantidad} unidades`
    },
    {
      key: 'operarioNombre',
      label: 'Operario'
    },
    {
      key: 'fecha',
      label: 'Fecha'
    },
    {
      key: 'productoNombre',
      label: 'Producto Relacionado',
      render: (value: string | undefined) => value || '-'
    }
  ];

  const handleViewDetail = (insumo: InsumoView) => {
    setSelectedInsumo(insumo);
    setIsDetailModalOpen(true);
  };

  const insumosFiltrados = insumos.filter(insumo => {
    const matchBusqueda = busqueda.length === 0 ||
      busqueda.length >= 2 &&
      (insumo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
       insumo.operarioNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
       String(insumo.id).includes(busqueda));

    const matchFecha = !filtroFecha || insumo.fecha === filtroFecha;
    const matchOperario = !filtroOperario || String(insumo.operarioId) === filtroOperario;

    return matchBusqueda && matchFecha && matchOperario;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Inventario de Insumos</h2>
          <p className="text-muted-foreground">Visualiza el inventario de insumos entregados a operarios</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Total: {insumos.reduce((sum, i) => sum + i.cantidad, 0)} unidades
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar... (mín. 2, máx. 50 caracteres)"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={50}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="px-3 py-2.5 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
            />
            <select
              value={filtroOperario}
              onChange={(e) => setFiltroOperario(e.target.value)}
              className="px-3 py-2.5 border border-border rounded-lg bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
            >
              <option value="">Filtrar por operario</option>
              {operarios.map(o => (
                <option key={o.id} value={String(o.id)}>
                  {o.nombre} {o.apellido}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setBusqueda('');
                setFiltroFecha('');
                setFiltroOperario('');
              }}
              className="px-4"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-accent/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Los insumos se agregan automáticamente al inventario cuando se registra una entrega en el módulo "Entrega de Insumos".
          Este módulo es de solo visualización.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={insumosFiltrados}
        actions={[
          {
            label: 'Ver Detalle',
            icon: <span className="text-xs">ðŸ‘ï¸</span>,
            onClick: handleViewDetail,
            variant: 'secondary'
          }
        ]}
      />

      {/* Modal de detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalle de Insumo"
        size="lg"
      >
        {selectedInsumo && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div>
                <h3 className="text-lg">#{String(selectedInsumo.id).padStart(4, '0')}</h3>
                <p className="text-sm text-muted-foreground">{selectedInsumo.nombre}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Cantidad</p>
                <p className="text-xl font-semibold">{selectedInsumo.cantidad}</p>
              </div>
            </div>

            {/* Información general */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">ID</label>
                <p className="mt-1">#{String(selectedInsumo.id).padStart(4, '0')}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Insumo</label>
                <p className="mt-1">{selectedInsumo.nombre}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Cantidad</label>
                <p className="mt-1">{selectedInsumo.cantidad} unidades</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Operario</label>
                <p className="mt-1">{selectedInsumo.operarioNombre}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fecha</label>
                <p className="mt-1">{selectedInsumo.fecha}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Producto Relacionado</label>
                <p className="mt-1">{selectedInsumo.productoNombre || 'No especificado'}</p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="p-4 bg-accent/50 rounded-lg">
              <label className="text-sm text-muted-foreground block mb-2">Información</label>
              <p className="text-sm">
                Este insumo fue entregado al operario {selectedInsumo.operarioNombre} el día {selectedInsumo.fecha}.
                {selectedInsumo.productoNombre && ` Relacionado con el producto "${selectedInsumo.productoNombre}".`}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
