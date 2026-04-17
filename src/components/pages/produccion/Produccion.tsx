import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, FileText, Search, RotateCcw } from 'lucide-react';
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

interface StateChangeRequest {
  orden: OrdenProduccion;
  from: string;
  to: string;
}

const normalizeEstadoProduccion = (value: unknown): 'Orden Recibida' | 'Orden en preparacion' | 'Orden Lista' | 'Cancelada' => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'orden recibida' || normalized === 'pendiente') return 'Orden Recibida';
  if (normalized === 'orden en preparacion' || normalized === 'en proceso' || normalized === 'en preparación') {
    return 'Orden en preparacion';
  }
  if (normalized === 'orden lista' || normalized === 'completada' || normalized === 'lista') return 'Orden Lista';
  return 'Cancelada';
};

const toDateOnly = (value: unknown): string => {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (raw.includes('T')) return raw.split('T')[0];

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return raw;
};

export function Produccion() {
  const [produccion, setProduccion] = useState<OrdenProduccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    responsable: '',
    fecha: ''
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  useEffect(() => {
    loadProduccion();
  }, []);

  const loadProduccion = async () => {
    try {
      setLoading(true);
      const data = await produccionAPI.getAll();
      const normalized = (Array.isArray(data) ? data : []).map((orden: any) => ({
        ...orden,
        fecha: toDateOnly(orden?.fecha),
      }));
      setProduccion(normalized);
    } catch (error) {
      console.error('Error al cargar producción:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pendingStateChange, setPendingStateChange] = useState<StateChangeRequest | null>(null);
  const [stateChangeReason, setStateChangeReason] = useState('');
  const [stateChangeSaving, setStateChangeSaving] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);
  const [formData, setFormData] = useState({
    numero_produccion: '',
    producto_id: 0,
    cantidad: 0,
    fecha: new Date().toISOString().split('T')[0],
    responsable: '',
    estado: 'Orden Recibida',
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
    {
      key: 'fecha',
      label: 'Fecha',
      render: (fecha: string) => toDateOnly(fecha),
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (estado: string, orden: OrdenProduccion) => (
        <select
          value={normalizeEstadoProduccion(estado)}
          onChange={(event) =>
            handleEstadoChangeRequest(
              orden,
              event.target.value as 'Orden Recibida' | 'Orden en preparacion' | 'Orden Lista' | 'Cancelada'
            )
          }
          disabled={
            stateChangeSaving ||
            normalizeEstadoProduccion(estado) === 'Cancelada' ||
            normalizeEstadoProduccion(estado) === 'Orden Lista'
          }
          className={`min-h-8 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
            normalizeEstadoProduccion(estado) === 'Orden Lista' ? 'bg-green-100 text-green-700' :
            normalizeEstadoProduccion(estado) === 'Orden en preparacion' ? 'bg-blue-100 text-blue-700' :
            normalizeEstadoProduccion(estado) === 'Orden Recibida' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          } ${
            normalizeEstadoProduccion(estado) === 'Cancelada' || normalizeEstadoProduccion(estado) === 'Orden Lista'
              ? 'opacity-70 cursor-not-allowed'
              : ''
          }`}
        >
          <option value="Orden Recibida">Orden Recibida</option>
          <option value="Orden en preparacion">Orden en preparacion</option>
          <option value="Orden Lista">Orden Lista</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      )
    }
  ];

  const responsablesOptions = useMemo(
    () => Array.from(new Set(produccion.map((orden) => orden.responsable).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es')),
    [produccion]
  );

  const produccionFiltrada = useMemo(() => {
    return produccion.filter((orden) => {
      const matchesResponsable = !filters.responsable || orden.responsable === filters.responsable;
      const matchesFecha = !filters.fecha || String(orden.fecha || '').includes(filters.fecha);
      return matchesResponsable && matchesFecha;
    });
  }, [produccion, filters]);

  const handleAdd = () => {
    setSelectedOrden(null);
    setFormData({ 
      numero_produccion: `PROD-${Date.now()}`,
      producto_id: 0,
      cantidad: 0,
      fecha: new Date().toISOString().split('T')[0],
      responsable: '',
      estado: 'Orden Recibida',
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
      fecha: toDateOnly(orden.fecha),
      responsable: orden.responsable,
      estado: orden.estado,
      notes: orden.notes
    });
    setIsModalOpen(true);
  };

  const handleEstadoChangeRequest = async (
    orden: OrdenProduccion,
    targetState: 'Orden Recibida' | 'Orden en preparacion' | 'Orden Lista' | 'Cancelada'
  ) => {
    const estadoActual = normalizeEstadoProduccion(orden.estado);

    if (estadoActual === 'Cancelada') {
      showAlert({
        title: 'Acción no permitida',
        description: 'No se puede cambiar el estado de una orden cancelada.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (estadoActual === 'Orden Lista') {
      showAlert({
        title: 'Orden lista',
        description: 'Esta orden ya está en estado Orden Lista y no puede modificarse.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {}
      });
      return;
    }

    if (estadoActual === targetState) return;

    if (estadoActual === 'Orden Recibida' && targetState === 'Orden en preparacion') {
      try {
        setStateChangeSaving(true);
        try {
          await produccionAPI.updateStatus(Number(orden.id), {
            estado: 'Orden en preparacion',
          });
        } catch (error: any) {
          // Fallback for environments where backend status route is not yet reloaded.
          if (error?.status === 404 || String(error?.message || '').includes('/estado')) {
            await produccionAPI.update(Number(orden.id), {
              estado: 'Orden en preparacion',
            });
          } else {
            throw error;
          }
        }
        await loadProduccion();
      } catch (error) {
        showAlert({
          title: 'Error',
          description: (error as any)?.message || 'No se pudo actualizar el estado de la orden de producción.',
          type: 'danger',
          confirmText: 'Entendido',
          onConfirm: () => {},
        });
      } finally {
        setStateChangeSaving(false);
      }
      return;
    }

    setPendingStateChange({
      orden,
      from: estadoActual,
      to: targetState,
    });
    setStateChangeReason('');
  };

  const handleConfirmStateChange = async () => {
    if (!pendingStateChange) return;

    const targetState = pendingStateChange.to;

    if (pendingStateChange.to === 'Cancelada' && stateChangeReason.trim().length < 10) {
      showAlert({
        title: 'Motivo requerido',
        description: 'Para cancelar la orden debes indicar un motivo de al menos 10 caracteres.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      setStateChangeSaving(true);
      try {
        await produccionAPI.updateStatus(Number(pendingStateChange.orden.id), {
          estado: targetState,
          motivo_cancelacion: stateChangeReason.trim() || undefined,
        });
      } catch (error: any) {
        // Fallback for environments where backend status route is not yet reloaded.
        if (error?.status === 404 || String(error?.message || '').includes('/estado')) {
          await produccionAPI.update(Number(pendingStateChange.orden.id), {
            estado: targetState,
            notes:
              targetState === 'Cancelada' && stateChangeReason.trim()
                ? stateChangeReason.trim()
                : pendingStateChange.orden.notes,
          });
        } else {
          throw error;
        }
      }
      await loadProduccion();
      setPendingStateChange(null);
      setStateChangeReason('');

      if (targetState !== 'Orden en preparacion') {
        showAlert({
          title: 'Estado actualizado',
          description:
            targetState === 'Orden Lista'
              ? 'La orden pasó a Orden Lista. El estado quedó bloqueado y no podrá modificarse nuevamente.'
              : targetState === 'Cancelada'
              ? 'La orden de producción fue cancelada correctamente.'
              : 'Estado actualizado correctamente.',
          type: 'success',
          confirmText: 'Entendido',
          onConfirm: () => {},
        });
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert({
        title: 'Error',
        description: (error as any)?.message || 'No se pudo actualizar el estado de la orden de producción.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } finally {
      setStateChangeSaving(false);
    }
  };

  const handleCancelStateChange = () => {
    setPendingStateChange(null);
    setStateChangeReason('');
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
        showAlert({
          title: 'Orden actualizada',
          description: 'La orden de producción se actualizó correctamente.',
          type: 'success',
          confirmText: 'Entendido',
          onConfirm: () => {}
        });
      } else {
        await produccionAPI.create(formData);
        showAlert({
          title: 'Orden creada',
          description: 'La orden de producción se creó correctamente.',
          type: 'success',
          confirmText: 'Entendido',
          onConfirm: () => {}
        });
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

      <div className="rounded-lg border border-border bg-white p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={filters.responsable}
              onChange={(event) => setFilters((current) => ({ ...current, responsable: event.target.value }))}
              placeholder="Buscar por responsable..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setFilters({ responsable: '', fecha: '' })}
            disabled={!filters.responsable.trim() && !filters.fecha}
          >
            Limpiar filtros
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={filters.responsable}
            onChange={(event) => setFilters((current) => ({ ...current, responsable: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Responsable (todos)</option>
            {responsablesOptions.map((responsable) => (
              <option key={responsable} value={responsable}>
                {responsable}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.fecha}
            onChange={(event) => setFilters((current) => ({ ...current, fecha: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={produccionFiltrada}
        actions={[
          commonActions.view(handleViewDetail),
          commonActions.pdf(handleGeneratePDF),
        ]}
      />

      <Modal
        isOpen={Boolean(pendingStateChange)}
        onClose={handleCancelStateChange}
        title={`Cambiar estado - Orden ${pendingStateChange?.orden.numero_produccion || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Estado actual: {pendingStateChange?.from || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Nuevo estado: {pendingStateChange?.to || 'N/A'}</p>
          </div>

          {pendingStateChange?.to === 'Orden Lista' ? (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
              Al confirmar, la orden cambiará a estado Orden Lista y este estado no podrá volver a modificarse.
            </div>
          ) : null}

          {pendingStateChange?.to === 'Cancelada' ? (
            <FormField
              label="Motivo de cancelación"
              name="motivo-cambio-produccion"
              type="textarea"
              value={stateChangeReason}
              onChange={(value) => setStateChangeReason(String(value))}
              rows={3}
              required
              placeholder="Explica por qué se cancela la orden (mínimo 10 caracteres)"
            />
          ) : null}

          <FormActions>
            <Button variant="outline" onClick={handleCancelStateChange} disabled={stateChangeSaving}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmStateChange} disabled={stateChangeSaving}>
              {stateChangeSaving ? 'Guardando...' : 'Confirmar'}
            </Button>
          </FormActions>
        </div>
      </Modal>

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
              La orden de producción se creará en estado "Orden Recibida".
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
                normalizeEstadoProduccion(selectedOrden.estado) === 'Orden Lista' ? 'bg-green-100 text-green-700' :
                normalizeEstadoProduccion(selectedOrden.estado) === 'Orden en preparacion' ? 'bg-blue-100 text-blue-700' :
                normalizeEstadoProduccion(selectedOrden.estado) === 'Orden Recibida' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {normalizeEstadoProduccion(selectedOrden.estado)}
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
                {normalizeEstadoProduccion(selectedOrden.estado) === 'Cancelada' 
                  ? 'Esta orden ha sido cancelada y no puede ser modificada.'
                  : normalizeEstadoProduccion(selectedOrden.estado) === 'Orden Lista'
                  ? 'Orden lista y cerrada. No admite cambios adicionales.'
                  : normalizeEstadoProduccion(selectedOrden.estado) === 'Orden en preparacion'
                  ? 'Orden en preparacion de producción.'
                  : 'Orden recibida pendiente por iniciar preparación.'}
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