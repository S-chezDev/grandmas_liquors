import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus } from 'lucide-react';
import { abonos as abonosAPI, pedidos as pedidosAPI } from '../../../services/api';

interface Abono {
  id: string;
  numero_abono: string;
  pedido_id: number;
  cliente_id: number;
  monto: number;
  fecha: string;
  metodo_pago: string;
  estado: string;
}

export function Abonos() {
  const [abonos, setAbonos] = useState<Abono[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbonos();
  }, []);

  const loadAbonos = async () => {
    try {
      setLoading(true);
      const data = await abonosAPI.getAll();
      setAbonos(data);
    } catch (error) {
      console.error('Error al cargar abonos:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAbono, setSelectedAbono] = useState<Abono | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [formData, setFormData] = useState({
    numero_abono: '',
    pedido_id: 0,
    cliente_id: 0,
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    metodo_pago: '',
    estado: 'Activo'
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const columns: Column[] = [
    { key: 'numero_abono', label: 'Número Abono' },
    { key: 'pedido_id', label: 'Pedido ID' },
    { 
      key: 'monto', 
      label: 'Monto',
      render: (monto: number) => formatCurrency(monto)
    },
    { key: 'fecha', label: 'Fecha' },
    { key: 'metodo_pago', label: 'Método Pago' },
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
    setFormData({ 
      numero_abono: `ABO-${Date.now()}`,
      pedido_id: 0,
      cliente_id: 0,
      monto: 0, 
      fecha: new Date().toISOString().split('T')[0],
      metodo_pago: 'Efectivo',
      estado: 'Activo'
    });
    setIsModalOpen(true);
  };

  const handleAnular = async (abono: Abono) => {
    if (confirm(`¿Está seguro de anular el abono ${abono.numero_abono}?`)) {
      try {
        await abonosAPI.update(Number(abono.id), { estado: 'Anulado' });
        await loadAbonos();
      } catch (error) {
        console.error('Error al anular abono:', error);
      }
    }
  };

  const handleGeneratePDF = (abono: Abono) => {
    const content = `
╔════════════════════════════════════════════════════════════╗
║         GRANDMA'S LIQUEURS - COMPROBANTE DE ABONO         ║
╚════════════════════════════════════════════════════════════╝

ID Abono:           ${abono.id}
Pedido Asociado:    ${abono.pedido}
Cliente:            ${abono.cliente}
Monto:              ${formatCurrency(abono.monto)}
Fecha:              ${abono.fecha}
Método de Pago:     ${abono.metodoPago}
Estado:             ${abono.estado}

────────────────────────────────────────────────────────────
Este comprobante certifica el pago parcial del pedido
${abono.pedido} por un valor de ${formatCurrency(abono.monto)}
────────────────────────────────────────────────────────────

Firma Cliente:      _______________________

Firma Autorizado:   _______________________

Fecha Impresión:    ${new Date().toLocaleString('es-CO')}
────────────────────────────────────────────────────────────
    `.trim();

    setPdfContent(content);
    setIsPdfModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await abonosAPI.create(formData);
      await loadAbonos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear abono:', error);
      alert('Error al crear el abono');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Abonos</h2>
          <p className="text-muted-foreground">Registra y consulta los abonos a ventas</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nuevo Abono
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando abonos...</div>
      ) : (
        <DataTable
          columns={columns}
          data={abonos}
          actions={[
            commonActions.view((abono) => {
              setSelectedAbono(abono);
              setIsDetailModalOpen(true);
            }),
            commonActions.pdf(handleGeneratePDF),
            commonActions.cancel(handleAnular)
          ]}
          onSearch={(query) => console.log('Searching:', query)}
          searchPlaceholder="Buscar abonos..."
        />
      )}

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detalle de Abono ${selectedAbono?.id}`}
        size="lg"
      >
        {selectedAbono && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">ID Abono</p>
                <p>{selectedAbono.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pedido</p>
                <p>{selectedAbono.pedido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p>{selectedAbono.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monto</p>
                <p>{formatCurrency(selectedAbono.monto)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p>{selectedAbono.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p>{selectedAbono.metodoPago}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedAbono.estado === 'Registrado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedAbono.estado}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Abono"
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Pedido"
              name="pedido"
              type="select"
              value={formData.pedido}
              onChange={(value) => setFormData({ ...formData, pedido: value as string })}
              options={[
                { value: 'PED-001', label: 'PED-001 - Juan Pérez García' },
                { value: 'PED-002', label: 'PED-002 - María González López' },
                { value: 'PED-003', label: 'PED-003 - Carlos Ramírez' }
              ]}
              required
            />
            
            <FormField
              label="Cliente"
              name="cliente"
              value={formData.cliente}
              onChange={(value) => setFormData({ ...formData, cliente: value as string })}
              placeholder="Nombre del cliente"
              required
            />
            
            <FormField
              label="Monto del Abono"
              name="monto"
              type="number"
              value={formData.monto}
              onChange={(value) => setFormData({ ...formData, monto: value as number })}
              placeholder="0"
              required
            />
            
            <FormField
              label="Método de Pago"
              name="metodoPago"
              type="select"
              value={formData.metodoPago}
              onChange={(value) => setFormData({ ...formData, metodoPago: value as string })}
              options={[
                { value: 'Efectivo', label: 'Efectivo' },
                { value: 'Tarjeta', label: 'Tarjeta' },
                { value: 'Transferencia', label: 'Transferencia' },
                { value: 'Nequi', label: 'Nequi' },
                { value: 'Daviplata', label: 'Daviplata' }
              ]}
              required
            />
            
            <div className="col-span-2">
              <FormField
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={(value) => setFormData({ ...formData, fecha: value as string })}
                required
              />
            </div>
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Abono
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Comprobante de Abono"
        size="lg"
      >
        <pre className="whitespace-pre-wrap">
          {pdfContent}
        </pre>
      </Modal>
    </div>
  );
}