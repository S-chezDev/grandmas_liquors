import React, { useState } from 'react';
import { ShoppingBag, X, Download, Search } from 'lucide-react';
import { Button } from '../Button';
import { openPrintablePdf } from '../DataTable';
import { formatEntityCode, formatCurrencyCop } from '../../services/mappers';
import { PedidoRecord, getPedidoStatusClasses } from '../hooks/landingShared';

function formatFechaCreacionPedido(pedido: PedidoRecord): string {
  const ts = String(pedido.createdAt || pedido.created_at || '').trim();
  if (ts) {
    const parsed = new Date(ts);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
  const fechaSolo = String(pedido.fechaPedido || pedido.fecha || '').split('T')[0];
  if (fechaSolo) {
    const [y, m, d] = fechaSolo.split('-').map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  return '—';
}

interface MyOrdersModalProps {
  isOpen: boolean;
  pedidos: PedidoRecord[];
  misPedidosLoading: boolean;
  onClose: () => void;
  onCancelPedido?: (id: number) => void;
}

export function MyOrdersModal({
  isOpen,
  pedidos,
  misPedidosLoading,
  onClose,
  onCancelPedido,
}: MyOrdersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPedidos = pedidos.filter((pedido) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const code = formatEntityCode('P', pedido.id).toLowerCase();
    const estado = String(pedido.estado || '').toLowerCase();
    const total = String(pedido.total || '');
    return code.includes(term) || estado.includes(term) || total.includes(term);
  });

  const handleDownloadPdf = (pedido: PedidoRecord) => {
    openPrintablePdf({
      title: `Pedido ${formatEntityCode('P', pedido.id)}`,
      subtitle: `Generado el ${new Date().toLocaleString('es-CO')}`,
      sections: [
        {
          title: 'Datos generales',
          rows: [
            { label: 'Estado', value: String(pedido.estado || '') },
            { label: 'Fecha del pedido', value: formatFechaCreacionPedido(pedido) },
            { label: 'Dirección de entrega', value: pedido.direccion || 'No especificada' },
            { label: 'Teléfono de contacto', value: pedido.telefono || 'No especificado' },
            { label: 'Método de pago', value: String(pedido.metodoPago || 'Efectivo') },
          ],
        },
        {
          title: 'Detalle de Productos',
          table: {
            headers: ['Producto', 'Cant.', 'V. Unit.', 'Subtotal'],
            rows: (pedido.productos || []).map((item) => {
              const nombre = item.nombre || item.producto?.nombre || `Prod #${item.productoId || 'N/A'}`;
              const cantidad = Number(item.cantidad) || 0;
              const unitario = Number(item.precio ?? item.producto?.precio ?? 0);
              const subtotal = unitario * cantidad;
              return [
                nombre,
                String(cantidad),
                formatCurrencyCop(unitario),
                formatCurrencyCop(subtotal),
              ];
            }),
          },
        },
        {
          title: 'Resumen Financiero',
          rows: [
            { label: 'Monto pagado', value: formatCurrencyCop(Number(pedido.montoAbonado ?? pedido.montoPagado ?? pedido.total ?? 0)) },
            { label: 'Saldo pendiente', value: formatCurrencyCop(Number(pedido.saldo || 0)) },
            { label: 'Total', value: formatCurrencyCop(Number(pedido.total || 0)), isTotal: true },
          ],
        },
      ],
      footer: 'Comprobante generado por Grandma\'s Liquors. Use "Descargar PDF" para guardar o imprimir.',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[500px] bg-white z-50 shadow-2xl overflow-y-auto main-content-scroll">
        <div className="sticky top-0 bg-primary text-white p-4 sm:p-6 shadow-md z-10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-white text-base sm:text-lg">Mis Pedidos</h3>
            </div>
            <button onClick={onClose} className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          {pedidos.length > 0 && (
            <p className="text-xs sm:text-sm text-white/80 mt-2">
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
            </p>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {misPedidosLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Actualizando tus pedidos...</p>
              </div>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-2">No tienes pedidos aún</p>
              <p className="text-sm text-muted-foreground mb-6">
                Realiza tu primera compra y aparecerá aquí
              </p>
              <Button onClick={onClose} className="bg-primary text-white">
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="search-pedidos"
                  placeholder="Buscar por número, estado o total..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {filteredPedidos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No se encontraron pedidos que coincidan con la búsqueda.</p>
                </div>
              ) : (
                filteredPedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-sm mb-1">Pedido {formatEntityCode('P', pedido.id)}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatFechaCreacionPedido(pedido)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getPedidoStatusClasses(
                          String(pedido.estado || '')
                        )}`}
                      >
                        {pedido.estado}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {(pedido.productos || []).map((item, idx) => {
                        const nombre =
                          item.nombre || item.producto?.nombre || `Producto #${item.productoId || 'N/A'}`;
                        const cantidad = Number(item.cantidad) || 0;
                        const unitario = Number(item.precio ?? item.producto?.precio ?? 0);
                        const subtotal = unitario * cantidad;
                        return (
                          <div key={`${pedido.id}-${idx}`} className="border-b border-border pb-2 last:border-b-0 last:pb-0">
                            <p className="text-sm font-medium">{nombre}</p>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Cantidad: {cantidad}</span>
                              <span>Unitario: {formatCurrencyCop(unitario)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatCurrencyCop(subtotal)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Entrega</span>
                        <span>{String(pedido.fechaEntrega || 'Por confirmar')}</span>
                      </div>
                      {pedido.domicilio?.estado && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estado del domicilio</span>
                          <span>{pedido.domicilio.estado}</span>
                        </div>
                      )}
                      {pedido.direccion && (
                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-muted-foreground">Dirección</span>
                          <span className="text-right">{pedido.direccion}</span>
                        </div>
                      )}
                      {pedido.telefono && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Teléfono</span>
                          <span>{pedido.telefono}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Método de pago</span>
                        <span>{String(pedido.metodoPago || 'Efectivo')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Esquema de pago</span>
                        <span>{pedido.porcentajeAbono === 50 ? 'Abono 50%' : 'Pago total 100%'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monto pagado</span>
                        <span className="text-primary">
                          {formatCurrencyCop(
                            Number(pedido.montoAbonado ?? pedido.montoPagado ?? pedido.total ?? 0)
                          )}
                        </span>
                      </div>
                      {Number(pedido.saldo || 0) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Saldo pendiente</span>
                          <span className="text-destructive">
                            {formatCurrencyCop(Number(pedido.saldo || 0))}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border pt-2">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatCurrencyCop(Number(pedido.total || 0))}
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2 flex-wrap">
                        <Button onClick={() => handleDownloadPdf(pedido)} variant="outline" className="w-full sm:w-auto text-xs py-1.5 h-auto">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
