import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button';
import { FieldError, FormField } from '../Form';
import { CartItem, CheckoutData } from '../hooks/landingShared';

interface CheckoutModalProps {
  isOpen: boolean;
  carrito: CartItem[];
  totalCarrito: number;
  metodoPago: 'efectivo' | 'transferencia';
  porcentajePago: '100' | '50';
  checkoutData: CheckoutData;
  shouldShowDireccionError: boolean;
  shouldShowTelefonoError: boolean;
  checkoutDireccionError: string;
  checkoutTelefonoError: string;
  checkoutTelefonoDigits: string;
  checkoutStockError: CartItem | null;
  checkoutValid: boolean;
  isSubmittingPedido: boolean;
  onClose: () => void;
  onMetodoPagoChange: (value: 'efectivo' | 'transferencia') => void;
  onPorcentajePagoChange: (value: '100' | '50') => void;
  onDireccionChange: (value: string) => void;
  onTelefonoChange: (value: string) => void;
  onObservacionesChange: (value: string) => void;
  onConfirm: () => Promise<void> | void;
  getCartItemStockError: (item: CartItem) => string;
}

export function CheckoutModal({
  isOpen,
  carrito,
  totalCarrito,
  metodoPago,
  porcentajePago,
  checkoutData,
  shouldShowDireccionError,
  shouldShowTelefonoError,
  checkoutDireccionError,
  checkoutTelefonoError,
  checkoutTelefonoDigits,
  checkoutStockError,
  checkoutValid,
  isSubmittingPedido,
  onClose,
  onMetodoPagoChange,
  onPorcentajePagoChange,
  onDireccionChange,
  onTelefonoChange,
  onObservacionesChange,
  onConfirm,
  getCartItemStockError,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto main-content-scroll">
          <div className="sticky top-0 bg-primary text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-base sm:text-lg md:text-xl">Finalizar Pedido</h3>
              <button
                onClick={() => {
                  if (!isSubmittingPedido) {
                    onClose();
                  }
                }}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                disabled={isSubmittingPedido}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h4 className="mb-4">Resumen del Pedido</h4>
              <div className="space-y-2 bg-background p-4 rounded-lg">
                {carrito.map((item) => (
                  <div key={item.producto.id} className="flex justify-between text-sm">
                    <span>
                      {item.producto.nombre} x{item.cantidad}
                    </span>
                    <span className="text-primary">
                      ${(item.producto.precio * item.cantidad).toLocaleString('es-CO')}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-primary">${totalCarrito.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-4">Método de Pago</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    className="w-4 h-4 text-primary"
                    checked={metodoPago === 'efectivo'}
                    onChange={() => onMetodoPagoChange('efectivo')}
                  />
                  <div>
                    <p>Efectivo</p>
                    <p className="text-xs text-muted-foreground">Pago al recibir tu pedido</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    className="w-4 h-4 text-primary"
                    checked={metodoPago === 'transferencia'}
                    onChange={() => onMetodoPagoChange('transferencia')}
                  />
                  <div>
                    <p>Transferencia Bancaria</p>
                    <p className="text-xs text-muted-foreground">
                      Te enviaremos los datos por WhatsApp
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-4">Forma de Pago</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="percentage"
                    className="w-4 h-4 text-primary"
                    checked={porcentajePago === '100'}
                    onChange={() => onPorcentajePagoChange('100')}
                  />
                  <div className="flex-1">
                    <p>Pago Total (100%)</p>
                    <p className="text-xs text-muted-foreground">
                      ${totalCarrito.toLocaleString('es-CO')}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="percentage"
                    className="w-4 h-4 text-primary"
                    checked={porcentajePago === '50'}
                    onChange={() => onPorcentajePagoChange('50')}
                  />
                  <div className="flex-1">
                    <p>Abono Mínimo (50%)</p>
                    <p className="text-xs text-muted-foreground">
                      ${(totalCarrito * 0.5).toLocaleString('es-CO')} (Saldo: $
                      {(totalCarrito * 0.5).toLocaleString('es-CO')})
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-4">Información de Entrega</h4>
              <div className="space-y-4">
                <FormField
                  label="Dirección de entrega"
                  name="checkout-direccion"
                  value={checkoutData.direccion}
                  onChange={(value) => onDireccionChange(value as string)}
                  placeholder="Calle 104 # 79D - 65"
                  required
                  error={shouldShowDireccionError ? checkoutDireccionError : undefined}
                  helperText={
                    checkoutData.direccion.trim()
                      ? 'Puedes editar esta dirección si deseas recibir el pedido en otra ubicación.'
                      : undefined
                  }
                />

                <FormField
                  label="Teléfono de contacto"
                  name="checkout-telefono"
                  value={checkoutData.telefono}
                  onChange={(value) => onTelefonoChange(value as string)}
                  placeholder="3246102339"
                  required
                  inputDigitRule="telefono10"
                  error={shouldShowTelefonoError ? checkoutTelefonoError : undefined}
                  helperText={
                    checkoutTelefonoDigits
                      ? 'Puedes editar este teléfono si quieres usar otro número de contacto.'
                      : undefined
                  }
                />

                <FormField
                  label="Observaciones (Opcional)"
                  name="checkout-observaciones"
                  type="textarea"
                  rows={3}
                  value={checkoutData.observaciones}
                  onChange={(value) => onObservacionesChange(value as string)}
                  placeholder="Instrucciones especiales para la entrega..."
                />
              </div>
            </div>

            {checkoutStockError && (
              <FieldError className="mb-4">
                Ajusta el carrito antes de confirmar. {getCartItemStockError(checkoutStockError)}
              </FieldError>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={isSubmittingPedido}
                onClick={() => {
                  if (!isSubmittingPedido) {
                    onClose();
                  }
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                disabled={!checkoutValid || isSubmittingPedido}
                onClick={() => {
                  void onConfirm();
                }}
                className="flex-1 bg-primary text-white"
              >
                {isSubmittingPedido ? 'Enviando...' : 'Confirmar Pedido'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
