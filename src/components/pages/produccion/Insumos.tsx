import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, Column, commonActions } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, FileText, Search, RotateCcw } from 'lucide-react';
import { useAlertDialog } from '../../AlertDialog';
import {
  entregas_insumos as entregasAPI,
  insumos as insumosAPI,
  usuarios as usuariosAPI,
} from '../../../services/api';
import { downloadPdfText } from '../../../utils/pdf';

interface EntregaInsumo {
  id: string;
  numero_entrega: string;
  insumo_id?: number;
  insumo: string;
  insumo_nombre?: string;
  cantidad: number;
  unidad: string;
  operario: string;
  fecha: string;
  hora: string;
}

interface InsumoOption {
  id: number;
  nombre: string;
  unidad?: string;
  estado?: string;
}

interface OperarioOption {
  id: number;
  nombre: string;
  apellido: string;
  rol?: string;
  estado?: string;
}

interface EntregaInsumoForm {
  numero_entrega: string;
  insumo_id: number;
  insumo: string;
  cantidad: number;
  unidad: string;
  operario: string;
  fecha: string;
  hora: string;
}

export function Insumos() {
  const [entregas, setEntregas] = useState<EntregaInsumo[]>([]);
  const [insumosList, setInsumosList] = useState<InsumoOption[]>([]);
  const [operarios, setOperarios] = useState<OperarioOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    id: '',
    operario: '',
    fecha: ''
  });

  const formatDate = (value: string) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(parsed);
    }

    const [year, month, day] = value.split('-');
    if (year && month && day) return `${day}/${month}/${year}`;
    return value;
  };

  const formatTime = (value: string) => {
    if (!value) return '';
    const [hours, minutes] = value.split(':');
    if (hours === undefined || minutes === undefined) return value;

    const parsed = new Date();
    parsed.setHours(Number(hours), Number(minutes), 0, 0);
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(parsed);
  };

  useEffect(() => {
    loadEntregas();
    loadInsumos();
    loadOperarios();
  }, []);

  const loadEntregas = async () => {
    try {
      setLoading(true);
      const data = await entregasAPI.getAll();
      const normalized = Array.isArray(data)
        ? data.map((entrega: any) => ({
            ...entrega,
            insumo: entrega.insumo || entrega.insumo_nombre || ''
          }))
        : [];
      setEntregas(normalized);
    } catch (error) {
      console.error('Error al cargar entregas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsumos = async () => {
    try {
      const data = await insumosAPI.getAll();
      const normalized = (Array.isArray(data) ? data : [])
        .map((insumo: any) => ({
          id: Number(insumo?.id),
          nombre: String(insumo?.nombre || '').trim(),
          unidad: String(insumo?.unidad || '').trim(),
          estado: String(insumo?.estado || '').trim(),
        }))
        .filter((insumo) => insumo.id > 0 && insumo.nombre)
        .filter((insumo) => !insumo.estado || insumo.estado.toLowerCase() === 'activo');
      setInsumosList(normalized);
    } catch (error) {
      console.error('Error al cargar insumos:', error);
      setInsumosList([]);
    }
  };

  const loadOperarios = async () => {
    try {
      // Trae todos los usuarios y filtramos por rol Asesor o Productor
      const data = await usuariosAPI.getAll();
      const list: OperarioOption[] = (Array.isArray(data) ? data : [])
        .map((user: any) => ({
          id: Number(user?.id),
          nombre: String(user?.nombre || '').trim(),
          apellido: String(user?.apellido || '').trim(),
          rol: String(user?.rol || user?.rol_nombre || '').trim(),
          estado: String(user?.estado || '').trim(),
        }))
        .filter((user) => {
          if (!user.id || !user.nombre) return false;
          const rol = user.rol.toLowerCase();
          if (rol !== 'asesor' && rol !== 'productor') return false;
          if (user.estado && user.estado.toLowerCase() !== 'activo') return false;
          return true;
        })
        .sort((a, b) =>
          `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`, 'es')
        );
      setOperarios(list);
    } catch (error) {
      console.error('Error al cargar operarios:', error);
      setOperarios([]);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaInsumo | null>(null);
  const [formData, setFormData] = useState<EntregaInsumoForm>({
    numero_entrega: '',
    insumo_id: 0,
    insumo: '',
    cantidad: 0,
    unidad: '',
    operario: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5)
  });
  const { showAlert, AlertComponent } = useAlertDialog();

  const columns: Column[] = [
    { key: 'numero_entrega', label: 'ID' },
    { key: 'insumo', label: 'Producto' },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (cantidad: number, row: EntregaInsumo) => `${cantidad} ${row.unidad}`
    },
    { key: 'operario', label: 'Operario' },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (fecha: string) => formatDate(fecha)
    },
    {
      key: 'hora',
      label: 'Hora',
      render: (hora: string) => formatTime(hora)
    }
  ];

  const operariosOptions = useMemo(
    () => Array.from(new Set(entregas.map((entrega) => entrega.operario).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es')),
    [entregas]
  );

  const entregasFiltradas = useMemo(() => {
    return entregas.filter((entrega) => {
      const matchesId =
        !filters.id.trim() ||
        String(entrega.numero_entrega || '').toLowerCase().includes(filters.id.trim().toLowerCase()) ||
        String(entrega.id || '').toLowerCase().includes(filters.id.trim().toLowerCase());
      const matchesOperario = !filters.operario || entrega.operario === filters.operario;
      const matchesFecha = !filters.fecha || String(entrega.fecha || '').includes(filters.fecha);
      return matchesId && matchesOperario && matchesFecha;
    });
  }, [entregas, filters]);

  const handleAdd = () => {
    setSelectedEntrega(null);
    setFormData({
      numero_entrega: `ENT-${Date.now()}`,
      insumo_id: 0,
      insumo: '',
      cantidad: 0,
      unidad: 'Unidades',
      operario: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5)
    });
    setIsModalOpen(true);
  };

  const handleInsumoChange = (insumoIdValue: string) => {
    const insumoId = Number(insumoIdValue);
    const insumoSeleccionado = insumosList.find((i) => i.id === insumoId);
    if (insumoSeleccionado) {
      setFormData((current) => ({
        ...current,
        insumo_id: insumoSeleccionado.id,
        insumo: insumoSeleccionado.nombre,
        unidad: insumoSeleccionado.unidad || current.unidad,
      }));
    } else {
      setFormData((current) => ({
        ...current,
        insumo_id: 0,
        insumo: '',
      }));
    }
  };

  const handleViewDetail = (entrega: EntregaInsumo) => {
    setSelectedEntrega(entrega);
    setIsDetailModalOpen(true);
  };

  const handleGeneratePDF = (entrega: EntregaInsumo) => {
    const content = `
╔════════════════════════════════════════════════════════════╗
║         GRANDMA'S LIQUEURS - ENTREGA DE INSUMOS           ║
╚════════════════════════════════════════════════════════════╝

ID Entrega:         ${entrega.id}
Producto:           ${entrega.insumo}
Cantidad:           ${entrega.cantidad} ${entrega.unidad}
Operario:           ${entrega.operario}
Fecha:              ${formatDate(entrega.fecha)}
Hora:               ${formatTime(entrega.hora)}

────────────────────────────────────────────────────────────
Firma Operario:     _______________________

Firma Supervisor:   _______________________

Fecha Impresión:    ${new Date().toLocaleString('es-CO')}
────────────────────────────────────────────────────────────
    `.trim();

    setPdfContent(content);
    setIsPdfModalOpen(true);
  };

  const handleAnular = async (entrega: EntregaInsumo) => {
    showAlert({
      title: '¿Anular entrega?',
      description: `¿Está seguro de anular la entrega ${entrega.numero_entrega}? Esta acción no se puede revertir.`,
      type: 'danger',
      confirmText: 'Anular',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await entregasAPI.delete(Number(entrega.id));
          await loadEntregas();
        } catch (error) {
          console.error('Error al anular:', error);
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.insumo_id || formData.insumo_id <= 0) {
      showAlert({
        title: 'Insumo requerido',
        description: 'Debes seleccionar un insumo del catálogo.',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    if (!formData.operario) {
      showAlert({
        title: 'Operario requerido',
        description: 'Debes seleccionar un operario responsable (rol Asesor o Productor).',
        type: 'warning',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
      return;
    }

    try {
      await entregasAPI.create({
        numero_entrega: formData.numero_entrega,
        insumo_id: formData.insumo_id,
        cantidad: Number(formData.cantidad),
        unidad: formData.unidad,
        operario: formData.operario,
        fecha: formData.fecha,
        hora: formData.hora,
      });
      await loadEntregas();
      setIsModalOpen(false);
      showAlert({
        title: 'Entrega registrada',
        description: 'La entrega de insumo se registró correctamente.',
        type: 'success',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
    } catch (error) {
      console.error('Error al crear entrega:', error);
      showAlert({
        title: 'Error',
        description:
          (error as Error)?.message || 'No se pudo registrar la entrega de insumo.',
        type: 'danger',
        confirmText: 'Entendido',
        onConfirm: () => {},
      });
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

      <div className="rounded-lg border border-border bg-white p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={filters.id}
              onChange={(event) => setFilters((current) => ({ ...current, id: event.target.value }))}
              placeholder="Buscar por ID de entrega..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setFilters({ id: '', operario: '', fecha: '' })}
            disabled={!filters.id.trim() && !filters.operario && !filters.fecha}
          >
            Limpiar filtros
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por:</span>
          <select
            value={filters.operario}
            onChange={(event) => setFilters((current) => ({ ...current, operario: event.target.value }))}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Operario (todos)</option>
            {operariosOptions.map((operario) => (
              <option key={operario} value={operario}>
                {operario}
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
        data={entregasFiltradas}
        actions={[
          commonActions.view(handleViewDetail),
          commonActions.pdf(handleGeneratePDF),
          commonActions.cancel(handleAnular)
        ]}
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
              name="insumo_id"
              type="select"
              value={formData.insumo_id || ''}
              onChange={(value) => handleInsumoChange(String(value))}
              options={
                insumosList.length > 0
                  ? insumosList.map((insumo) => ({
                      value: String(insumo.id),
                      label: insumo.unidad
                        ? `${insumo.nombre} (${insumo.unidad})`
                        : insumo.nombre,
                    }))
                  : [{ value: '', label: 'No hay insumos registrados' }]
              }
              placeholder="Seleccionar insumo"
              required
            />

            <FormField
              label="Operario responsable"
              name="operario"
              type="select"
              value={formData.operario}
              onChange={(value) => setFormData({ ...formData, operario: value as string })}
              options={
                operarios.length > 0
                  ? operarios.map((user) => {
                      const fullName = `${user.nombre} ${user.apellido}`.trim();
                      return {
                        value: fullName,
                        label: `${fullName}${user.rol ? ` · ${user.rol}` : ''}`,
                      };
                    })
                  : [{ value: '', label: 'No hay usuarios Asesor/Productor activos' }]
              }
              placeholder="Seleccionar operario"
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
                <label className="text-sm text-muted-foreground">Producto</label>
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
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <pre className="text-sm text-muted-foreground">
              {pdfContent}
            </pre>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => downloadPdfText(pdfContent, `entrega-insumo-${selectedEntrega?.numero_entrega || selectedEntrega?.id || 'entrega'}.pdf`)}
            >
              Descargar PDF
            </Button>
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