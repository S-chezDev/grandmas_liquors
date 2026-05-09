import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../../DataTable';
import { Modal } from '../../Modal';
import { Form, FormField, FormActions } from '../../Form';
import { Button } from '../../Button';
import { Plus, Package, Search } from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../AlertDialog';
import type { Insumo, Producto } from '../../../services/types';
import { INSUMO_UNIDADES_API } from '../../../services/types';

interface InsumoView extends Insumo {
  operarioNombre?: string;
}

export function Insumos() {
  const [insumos, setInsumos] = useState<InsumoView[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<InsumoView | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [filtroOperario, setFiltroOperario] = useState<string>('');

  // Estado del buscador del campo "Nombre" (mismo patron que el select
  // "Producto *" de Nueva Compra). El usuario puede escribir un nombre nuevo
  // (ej. "Anis") o seleccionar un producto existente del catalogo.
  const [mostrarListaProductos, setMostrarListaProductos] = useState(false);

  const [formNuevo, setFormNuevo] = useState({
    nombre: '',
    descripcion: '',
    unidad: 'Unidades' as string,
    cantidad: 0,
    stockMinimo: 10,
    estado: 'activo' as 'activo' | 'inactivo',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  // Cerrar dropdown al clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.insumo-nombre-picker')) {
        setMostrarListaProductos(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cargarDatos = async () => {
    try {
      const [insumosData, productosData] = await Promise.all([
        api.insumos.getAll(),
        api.productos.getAll(),
      ]);

      const insumosConInfo: InsumoView[] = insumosData.map((insumo) => ({
        ...insumo,
        operarioNombre: insumo.operario?.trim() || undefined,
      }));

      setInsumos(insumosConInfo);
      // Solo productos activos para el selector del campo Nombre
      setProductos(productosData.filter((p) => p.estado === 'activo'));
    } catch {
      toast.error('Error al cargar datos');
    }
  };

  // Lista filtrada de productos que coincidan con lo que el usuario escribe
  // en el campo Nombre. Si no escribe nada, se muestra el catalogo completo.
  const productosFiltradosNombre = productos.filter((p) => {
    const term = formNuevo.nombre.trim().toLowerCase();
    if (!term) return true;
    return (
      p.nombre.toLowerCase().includes(term) || String(p.id).includes(term)
    );
  });

  const seleccionarProductoComoNombre = (producto: Producto) => {
    setFormNuevo({ ...formNuevo, nombre: producto.nombre });
    setMostrarListaProductos(false);
  };

  const handleNuevoInsumo = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = formNuevo.nombre.trim();
    if (nombre.length < 2 || nombre.length > 150) {
      toast.error('El nombre debe tener entre 2 y 150 caracteres');
      return;
    }
    if (!INSUMO_UNIDADES_API.includes(formNuevo.unidad as (typeof INSUMO_UNIDADES_API)[number])) {
      toast.error('Seleccione una unidad válida');
      return;
    }
    if (formNuevo.cantidad < 0) {
      toast.error('La cantidad no puede ser negativa');
      return;
    }
    if (formNuevo.stockMinimo < 0) {
      toast.error('El stock mínimo no puede ser negativo');
      return;
    }

    try {
      await api.insumos.create({
        nombre,
        descripcion: formNuevo.descripcion.trim() || undefined,
        unidad: formNuevo.unidad,
        cantidad: formNuevo.cantidad,
        stock_minimo: formNuevo.stockMinimo,
        estado: formNuevo.estado === 'activo' ? 'Activo' : 'Inactivo',
      });
      toast.success('Insumo registrado en catálogo');
      setIsCreateModalOpen(false);
      setMostrarListaProductos(false);
      setFormNuevo({
        nombre: '',
        descripcion: '',
        unidad: 'Unidades',
        cantidad: 0,
        stockMinimo: 10,
        estado: 'activo',
      });
      cargarDatos();
    } catch (err: any) {
      toast.error(err.message || 'Error al crear insumo');
    }
  };

  const operariosUnicos = Array.from(
    new Set(insumos.map((i) => i.operarioNombre).filter(Boolean) as string[])
  ).sort((a, b) => a.localeCompare(b, 'es'));

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => `#${String(value).padStart(4, '0')}`,
    },
    {
      key: 'nombre',
      label: 'Insumo',
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (_: number, row: InsumoView) =>
        `${row.cantidad} ${row.unidad ? `(${row.unidad})` : ''}`.trim(),
    },
    {
      key: 'operarioNombre',
      label: 'Último operario',
      render: (v: string | undefined) => v || '—',
    },
    {
      key: 'fechaUltimaModificacion',
      label: 'Última entrega',
      render: (v: string | undefined) => v || '—',
    },
  ];

  const handleViewDetail = (insumo: InsumoView) => {
    setSelectedInsumo(insumo);
    setIsDetailModalOpen(true);
  };

  const insumosFiltrados = insumos.filter((insumo) => {
    const matchBusqueda =
      busqueda.length === 0 ||
      (busqueda.length >= 2 &&
        (insumo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          (insumo.operarioNombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
          String(insumo.id).includes(busqueda)));

    const matchFecha =
      !filtroFecha || (insumo.fechaUltimaModificacion || '') === filtroFecha;
    const matchOperario =
      !filtroOperario || (insumo.operarioNombre || '') === filtroOperario;

    return matchBusqueda && matchFecha && matchOperario;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Inventario de Insumos</h2>
          <p className="text-muted-foreground">
            Catálogo y stock; las entregas a productores aumentan el inventario registrado.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Total en vista: {insumosFiltrados.reduce((sum, i) => sum + i.cantidad, 0)}
            </span>
          </div>
          <Button icon={<Plus className="w-5 h-5" />} onClick={() => setIsCreateModalOpen(true)}>
            Nuevo insumo
          </Button>
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
          <div className="flex gap-2 flex-wrap">
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
              {operariosUnicos.map((o) => (
                <option key={o} value={o}>
                  {o}
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
          Use <strong>Nuevo insumo</strong> para dar de alta materiales en el catálogo (con stock inicial
          opcional). Use <strong>Entrega de insumos</strong> para cargar inventario a un productor
          concretando cantidad y movimiento.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={insumosFiltrados}
        actions={[
          {
            label: 'Ver detalle',
            onClick: handleViewDetail,
            variant: 'secondary',
          },
        ]}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo insumo (catálogo)"
        size="lg"
      >
        <Form onSubmit={handleNuevoInsumo}>
          {/* Campo "Nombre" hibrido: permite escribir un nombre nuevo (insumo
              que no existe, ej. "Anis") o seleccionar un producto existente
              del catalogo (ej. "Tequila Patron 750ml"). Mismo diseno que el
              selector "Producto *" de Nueva Compra. */}
          <div className="relative insumo-nombre-picker">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Nombre *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formNuevo.nombre}
                onChange={(e) => {
                  setFormNuevo({ ...formNuevo, nombre: e.target.value });
                  setMostrarListaProductos(true);
                }}
                onFocus={() => setMostrarListaProductos(true)}
                placeholder="Escribe un nombre nuevo (ej. Anís) o selecciona un producto del catálogo..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-white"
                required
                minLength={2}
                maxLength={150}
              />
            </div>
            {mostrarListaProductos && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {productosFiltradosNombre.length > 0 ? (
                  <>
                    <div className="sticky top-0 bg-primary/10 px-4 py-2 border-b border-border font-medium text-sm">
                      {formNuevo.nombre.trim() === ''
                        ? `Todos los productos (${productosFiltradosNombre.length})`
                        : `${productosFiltradosNombre.length} producto(s) encontrado(s)`}
                    </div>
                    {productosFiltradosNombre.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => seleccionarProductoComoNombre(p)}
                        className="px-4 py-3 border-b border-border last:border-b-0 hover:bg-accent cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <span className="font-medium">{p.nombre}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              ID: {p.id} | Stock actual: {p.stock}
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-3 text-muted-foreground text-sm text-center">
                    Sin coincidencias. Continúa escribiendo para crear un insumo nuevo con este nombre.
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Puedes crear un insumo nuevo escribiendo su nombre, o seleccionar un producto existente.
            </p>
          </div>
          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            value={formNuevo.descripcion}
            onChange={(v) => setFormNuevo({ ...formNuevo, descripcion: v as string })}
            placeholder="Opcional (10-50 caracteres si se completa)"
            minLength={10}
            maxLength={50}
          />
          <FormField
            label="Unidad"
            name="unidad"
            type="select"
            selectPlaceholder={false}
            value={formNuevo.unidad}
            onChange={(v) => setFormNuevo({ ...formNuevo, unidad: v as string })}
            options={INSUMO_UNIDADES_API.map((u) => ({ value: u, label: u }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Cantidad inicial"
              name="cantidad"
              type="number"
              value={formNuevo.cantidad}
              min={0}
              onChange={(v) => setFormNuevo({ ...formNuevo, cantidad: Number(v) || 0 })}
            />
            <FormField
              label="Stock mínimo"
              name="stockMinimo"
              type="number"
              value={formNuevo.stockMinimo}
              min={0}
              onChange={(v) => setFormNuevo({ ...formNuevo, stockMinimo: Number(v) || 0 })}
            />
          </div>
          <FormField
            label="Estado"
            name="estado"
            type="select"
            selectPlaceholder={false}
            value={formNuevo.estado}
            onChange={(v) => setFormNuevo({ ...formNuevo, estado: v as 'activo' | 'inactivo' })}
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
          />
          <FormActions>
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalle de Insumo"
        size="lg"
      >
        {selectedInsumo && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div>
                <h3 className="text-lg">#{String(selectedInsumo.id).padStart(4, '0')}</h3>
                <p className="text-sm text-muted-foreground">{selectedInsumo.nombre}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Cantidad</p>
                <p className="text-xl font-semibold">
                  {selectedInsumo.cantidad}
                  {selectedInsumo.unidad ? ` ${selectedInsumo.unidad}` : ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Último operario (entrega)</label>
                <p className="mt-1">{selectedInsumo.operarioNombre || '—'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fecha última entrega</label>
                <p className="mt-1">{selectedInsumo.fechaUltimaModificacion || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
