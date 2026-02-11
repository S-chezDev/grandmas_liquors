import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Truck, FileText } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { entregas_insumos as entregasAPI } from '../../../services/api';

interface EntregaInsumo {
  id: string;
  numero_entrega: string;
  insumo_id: number;
  cantidad: number;
  unidad: string;
  operario: string;
  fecha: string;
  hora: string;
}

export function Insumos() {
  const [entregas, setEntregas] = useState<EntregaInsumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntregas();
  }, []);

  const loadEntregas = async () => {
    try {
      setLoading(true);
      const data = await entregasAPI.getAll();
      setEntregas(data);
    } catch (error) {
      console.error('Error al cargar entregas:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaInsumo | null>(null);
  const [formData, setFormData] = useState({
    numero_entrega: '',
    insumo_id: 0,
    cantidad: 0,
    unidad: '',
    operario: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5)
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  const columns: Column[] = [
    { key: 'numero_entrega', label: 'ID' },
    { key: 'insumo_id', label: 'Insumo ID' },
    { 
      key: 'cantidad', 
      label: 'Cantidad',
      render: (cantidad: number, row: EntregaInsumo) => `${cantidad} ${row.unidad}`
    },
    { key: 'operario', label: 'Operario' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' }
  ];

  const handleAdd = () => {
    setSelectedEntrega(null);
    setFormData({ 
      numero_entrega: `ENT-${Date.now()}`,
      insumo_id: 0,
      cantidad: 0, 
      unidad: 'Unidades', 
      operario: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5)
    });
    setIsModalOpen(true);
  };

  const handleViewDetail = (entrega: EntregaInsumo) => {
    setSelectedEntrega(entrega);
    setIsDetailModalOpen(true);
  };

  const handleGeneratePDF = (entrega: EntregaInsumo) => {
    // Crear contenido del PDF
    const content = `
╔════════════════════════════════════════════════════════════╗
║         GRANDMA'S LIQUEURS - ENTREGA DE INSUMOS           ║
╚════════════════════════════════════════════════════════════╝

ID Entrega:         ${entrega.id}
Insumo:             ${entrega.insumo}
Cantidad:           ${entrega.cantidad} ${entrega.unidad}
Operario:           ${entrega.operario}
Fecha:              ${entrega.fecha}
Hora:               ${entrega.hora}

────────────────────────────────────────────────────────────
Firma Operario:     _______________________

Firma Supervisor:   _______________________

Fecha Impresión:    ${new Date().toLocaleString('es-CO')}
────────────────────────────────────────────────────────────
    `.trim();

    // Mostrar en modal en lugar de descargar
    setPdfContent(content);
    setIsPdfModalOpen(true);
  };

  const handleDelete = async (entrega: EntregaInsumo) => {
    showAlert({
      title: '¿Eliminar entrega?',
      description: `¿Está seguro de eliminar la entrega ${entrega.numero_entrega}?`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await entregasAPI.delete(Number(entrega.id));
          await loadEntregas();
        } catch (error) {
          console.error('Error al eliminar:', error);
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await entregasAPI.create(formData);
      await loadEntregas();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear entrega:', error);
    }
  };

  return (
    <div className="space-y-6">
      {AlertComponent}
      <div className="flex items-center justify-between">
        <div>
          <h2>Entrega de Insumos</h2>
          <p className="text-muted-foreground">Registra las entregas de insumos a operarios</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nueva Entrega
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={entregas}
        actions={[
          commonActions.view(handleViewDetail),
          commonActions.pdf(handleGeneratePDF),
          commonActions.delete(handleDelete)
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar entregas..."
      />

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Entrega de Insumos"
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Insumo"
              name="insumo"
              type="select"
              value={formData.insumo}
              onChange={(value) => setFormData({ ...formData, insumo: value as string })}
              options={[
                { value: 'Botellas 750ml', label: 'Botellas 750ml' },
                { value: 'Botellas 375ml', label: 'Botellas 375ml' },
                { value: 'Etiquetas personalizadas', label: 'Etiquetas personalizadas' },
                { value: 'Tapas de seguridad', label: 'Tapas de seguridad' },
                { value: 'Cajas de empaque', label: 'Cajas de empaque' }
              ]}
              required
            />
            
            <FormField
              label="Operario"
              name="operario"
              type="select"
              value={formData.operario}
              onChange={(value) => setFormData({ ...formData, operario: value as string })}
              options={[
                { value: 'Carlos Gómez', label: 'Carlos Gómez' },
                { value: 'María Rodríguez', label: 'María Rodríguez' },
                { value: 'Juan Pérez', label: 'Juan Pérez' },
                { value: 'Ana López', label: 'Ana López' },
                { value: 'Luis Ramírez', label: 'Luis Ramírez' }
              ]}
              required
            />
            
            <FormField
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={(value) => setFormData({ ...formData, cantidad: value as number })}
              required
            />
            
            <FormField
              label="Unidad"
              name="unidad"
              type="select"
              value={formData.unidad}
              onChange={(value) => setFormData({ ...formData, unidad: value as string })}
              options={[
                { value: 'Unidades', label: 'Unidades' },
                { value: 'Litros', label: 'Litros' },
                { value: 'Kilogramos', label: 'Kilogramos' },
                { value: 'Cajas', label: 'Cajas' }
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
            
            <FormField
              label="Hora"
              name="hora"
              value={formData.hora}
              onChange={(value) => setFormData({ ...formData, hora: value as string })}
              placeholder="HH:MM"
              required
            />
          </div>

          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              El registro de entrega se guardará con la fecha y hora especificadas.
            </p>
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Entrega
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal de detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalle de Entrega de Insumo"
        size="lg"
      >
        {selectedEntrega && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div>
                <h3 className="text-lg">{selectedEntrega.id}</h3>
                <p className="text-sm text-muted-foreground">{selectedEntrega.insumo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Entregado a</p>
                <p>{selectedEntrega.operario}</p>
              </div>
            </div>

            {/* Información general */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Insumo</label>
                <p className="mt-1">{selectedEntrega.insumo}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Cantidad</label>
                <p className="mt-1">{selectedEntrega.cantidad} {selectedEntrega.unidad}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Operario Receptor</label>
                <p className="mt-1">{selectedEntrega.operario}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">ID Entrega</label>
                <p className="mt-1">{selectedEntrega.id}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fecha de Entrega</label>
                <p className="mt-1">{selectedEntrega.fecha}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Hora de Entrega</label>
                <p className="mt-1">{selectedEntrega.hora}</p>
              </div>
            </div>

            {/* Observaciones */}
            <div className="p-4 bg-accent/50 rounded-lg">
              <label className="text-sm text-muted-foreground block mb-2">Información</label>
              <p className="text-sm">
                Este insumo fue entregado al operario {selectedEntrega.operario} el día {selectedEntrega.fecha} a las {selectedEntrega.hora}.
              </p>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                icon={<FileText className="w-4 h-4" />}
                onClick={() => handleGeneratePDF(selectedEntrega)}
                className="flex-1"
              >
                Descargar PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDetailModalOpen(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de PDF */}
      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="PDF de Entrega de Insumo"
        size="lg"
      >
        <div className="p-4 bg-accent/50 rounded-lg">
          <pre className="text-sm">
            {pdfContent}
          </pre>
        </div>
      </Modal>
    </div>
  );
}