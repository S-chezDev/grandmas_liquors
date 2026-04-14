import React, { useState, useEffect } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Factory, FileText, X } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import { produccion as produccionAPI } from '../../../services/api';

interface OrdenProduccion {
  id: string;
  numero_produccion: string;
  producto_id: number;
  cantidad: number;
  fecha: string;
  responsable: string;
  estado: string;
  notes: string;
}

export function Produccion() {
  const [produccion, setProduccion] = useState<OrdenProduccion[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    loadProduccion();
  }, []);

  const loadProduccion = async () => {
    try {
      setLoading(true);
      const data = await produccionAPI.getAll();
      setProduccion(data);
    } catch (error) {
      console.error('Error al cargar producción:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);
  const [formData, setFormData] = useState({
    numero_produccion: '',
    producto_id: 0,
    cantidad: 0,
    fecha: new Date().toISOString().split('T')[0],
    responsable: '',
    estado: 'En Proceso',
    notes: ''
  });

  const columns: Column[] = [
    { key: 'numero_produccion', label: 'ID Orden' },
    { key: 'producto_id', label: 'Producto ID' },
    { 
      key: 'cantidad', 
      label: 'Cantidad',
      render: (cantidad: number) => `${cantidad} unidades`
    },
    { key: 'responsable', label: 'Responsable' },
    { key: 'fecha', label: 'Fecha' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string) => (
        <span className={`px-3 py-1 rounded-full text-xs ${
          estado === 'Completada' ? 'bg-green-100 text-green-700' :
          estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
          'bg-red-100 text-red-700'
        }`}>
          {estado}
        </span>
      )
    }
  ];

  const handleAdd = () => {
    setSelectedOrden(null);
    setFormData({ 
      numero_produccion: `PROD-${Date.now()}`,
      producto_id: 0,
      cantidad: 0,
      fecha: new Date().toISOString().split('T')[0],
      responsable: '',
      estado: 'En Proceso',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = async (orden: OrdenProduccion) => {
    setSelectedOrden(orden);
    setFormData({
      numero_produccion: orden.numero_produccion,
      producto_id: orden.producto_id,
      cantidad: orden.cantidad,
      fecha: orden.fecha,
      responsable: orden.responsable,
      estado: orden.estado,
      notes: orden.notes
    });
    setIsModalOpen(true);
  };

  const handleCancelar = async (orden: OrdenProduccion) => {
    if (orden.estado === 'Cancelada') {
      showAlert({
        title: 'Orden ya cancelada',
        description: 'Esta orden ya está cancelada.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }
    showAlert({
      title: 'Confirmar cancelación',
      description: `¿Está seguro de cancelar la orden ${orden.numero_produccion}? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Cancelar orden',
      cancelText: 'Cerrar',
      onConfirm: async () => {
        try {
          await produccionAPI.update(Number(orden.id), { estado: 'Cancelada' });
          await loadProduccion();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });
  };

  const handleChangeState = async (orden: OrdenProduccion) => {
    if (orden.estado === 'Cancelada') {
      showAlert({
        title: 'Acción no permitida',
        description: 'No se puede cambiar el estado de una orden cancelada.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }
    
    const newState = orden.estado === 'En Proceso' ? 'Completada' : 'En Proceso';
    try {
      await produccionAPI.update(Number(orden.id), { estado: newState });
      await loadProduccion();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewDetail = (orden: OrdenProduccion) => {
    setSelectedOrden(orden);
    setIsDetailModalOpen(true);
  };

  const handleGeneratePDF = (orden: OrdenProduccion) => {
    // Crear contenido del PDF
    const content = `
╔════════════════════════════════════════════════════════════╗
║           GRANDMA'S LIQUEURS - ORDEN DE PRODUCCIÓN        ║
╚════════════════════════════════════════════════════════════╝

ID Orden:           ${orden.id}
Producto:           ${orden.producto}
Cantidad:           ${orden.cantidad} unidades
Lote:               ${orden.lote}
Operario:           ${orden.operario}
Fecha Inicio:       ${orden.fechaInicio}
Fecha Fin:          ${orden.fechaFin || 'En proceso'}
Estado:             ${orden.estado}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedOrden) {
        await produccionAPI.update(Number(selectedOrden.id), formData);
      } else {
        await produccionAPI.create(formData);
      }
      await loadProduccion();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar orden:', error);
      showAlert({
        title: 'Error',
        description: 'No se pudo guardar la orden de producción.',
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
          <h2>Gestión de Producción</h2>
          <p className="text-muted-foreground">Administra las órdenes de producción de bebidas</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAdd}>
          Nueva Orden
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={produccion}
        actions={[
          commonActions.view(handleViewDetail),
          {
            label: 'Cambiar Estado',
            icon: <span className="text-xs">🔄</span>,
            onClick: handleChangeState,
            variant: 'primary'
          },
          commonActions.pdf(handleGeneratePDF),
          commonActions.cancel(handleCancelar)
        ]}
        onSearch={(query) => console.log('Searching:', query)}
        searchPlaceholder="Buscar órdenes..."
      />

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOrden ? 'Editar Orden de Producción' : 'Nueva Orden de Producción'}
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Producto"
              name="producto"
              type="select"
              value={formData.producto}
              onChange={(value) => setFormData({ ...formData, producto: value as string })}
              options={[
                { value: 'Micheladas Especiales', label: 'Micheladas Especiales' },
                { value: 'Cócteles Premium', label: 'Cócteles Premium' },
                { value: 'Bebidas Locales Mix', label: 'Bebidas Locales Mix' },
                { value: 'Cócteles Tropicales', label: 'Cócteles Tropicales' },
                { value: 'Bebidas Personalizadas', label: 'Bebidas Personalizadas' }
              ]}
              required
            />
            
            <FormField
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={(value) => setFormData({ ...formData, cantidad: value as number })}
              placeholder="Unidades a producir"
              required
            />
            
            <FormField
              label="Lote"
              name="lote"
              value={formData.lote}
              onChange={(value) => setFormData({ ...formData, lote: value as string })}
              placeholder="LOT-2024-XXX"
              required
            />
            
            <FormField
              label="Operario Responsable"
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
              label="Fecha de Inicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={(value) => setFormData({ ...formData, fechaInicio: value as string })}
              required
            />
            
            <FormField
              label="Fecha de Finalización (opcional)"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={(value) => setFormData({ ...formData, fechaFin: value as string })}
            />
          </div>

          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              La orden de producción se creará en estado "En Proceso". 
              Puedes cambiar el estado usando las acciones de la tabla.
            </p>
          </div>

          <FormActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedOrden ? 'Actualizar' : 'Crear'} Orden
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal de detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalle de Orden de Producción"
        size="lg"
      >
        {selectedOrden && (
          <div className="space-y-6">
            {/* Header con estado */}
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div>
                <h3 className="text-lg">{selectedOrden.id}</h3>
                <p className="text-sm text-muted-foreground">{selectedOrden.producto}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm ${
                selectedOrden.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                selectedOrden.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedOrden.estado}
              </span>
            </div>

            {/* Información general */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Producto</label>
                <p className="mt-1">{selectedOrden.producto}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Cantidad</label>
                <p className="mt-1">{selectedOrden.cantidad} unidades</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Lote</label>
                <p className="mt-1">{selectedOrden.lote}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Operario Responsable</label>
                <p className="mt-1">{selectedOrden.operario}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fecha de Inicio</label>
                <p className="mt-1">{selectedOrden.fechaInicio}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fecha de Finalización</label>
                <p className="mt-1">{selectedOrden.fechaFin || 'En proceso'}</p>
              </div>
            </div>

            {/* Observaciones */}
            <div className="p-4 bg-accent/50 rounded-lg">
              <label className="text-sm text-muted-foreground block mb-2">Observaciones</label>
              <p className="text-sm">
                {selectedOrden.estado === 'Cancelada' 
                  ? 'Esta orden ha sido cancelada y no puede ser modificada.'
                  : selectedOrden.estado === 'Completada'
                  ? 'Orden completada exitosamente.'
                  : 'Orden en proceso de producción.'}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                icon={<FileText className="w-4 h-4" />}
                onClick={() => handleGeneratePDF(selectedOrden)}
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
        title="Orden de Producción"
        size="lg"
      >
        <div className="p-4 bg-accent/50 rounded-lg">
          <pre className="text-sm text-muted-foreground">
            {pdfContent}
          </pre>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsPdfModalOpen(false)}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
}