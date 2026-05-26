import { useCallback, useMemo, useState } from 'react';
import { toast } from '../AlertDialog';
import { api } from '../../services/api';
import {
  CartItem,
  CheckoutData,
  CheckoutTouched,
  UserData,
  buildCheckoutDefaults,
  calcularTotalCarrito,
  getCartItemStockError,
  getCheckoutValidation,
} from './landingShared';

interface UseCheckoutOptions {
  user?: UserData;
  carrito: CartItem[];
  clearCart: () => void;
  onRequireLogin: () => void;
  onPedidoCreated?: () => Promise<void> | void;
}

export function useCheckout({
  user,
  carrito,
  clearCart,
  onRequireLogin,
  onPedidoCreated,
}: UseCheckoutOptions) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmittingPedido, setIsSubmittingPedido] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [porcentajePago, setPorcentajePago] = useState<'100' | '50'>('100');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(() => buildCheckoutDefaults(user));
  const [checkoutTouched, setCheckoutTouched] = useState<CheckoutTouched>({
    direccion: false,
    telefono: false,
  });
  const [checkoutAttempted, setCheckoutAttempted] = useState(false);

  const totalCarrito = useMemo(() => calcularTotalCarrito(carrito), [carrito]);

  const {
    checkoutDireccion,
    checkoutTelefonoDigits,
    shouldShowDireccionError,
    shouldShowTelefonoError,
    checkoutDireccionError,
    checkoutTelefonoError,
    checkoutStockError,
    checkoutValid,
  } = useMemo(
    () =>
      getCheckoutValidation({
        carrito,
        checkoutData,
        checkoutTouched,
        checkoutAttempted,
      }),
    [carrito, checkoutData, checkoutTouched, checkoutAttempted]
  );

  const resetCheckoutForm = useCallback(() => {
    setMetodoPago('efectivo');
    setPorcentajePago('100');
    setCheckoutData(buildCheckoutDefaults(user));
    setCheckoutTouched({ direccion: false, telefono: false });
    setCheckoutAttempted(false);
  }, [user]);

  const realizarPedido = useCallback(() => {
    if (carrito.length === 0) {
      toast.error('Carrito vacío', {
        description: 'Agrega productos al carrito para realizar un pedido.',
      });
      return false;
    }

    if (carrito.some((item) => Boolean(getCartItemStockError(item)))) {
      toast.error('Ajusta las cantidades del carrito', {
        description: 'Hay productos con cantidades mayores al stock disponible.',
      });
      return false;
    }

    if (!user) {
      toast('Inicia sesión para continuar', {
        description: 'Debes iniciar sesión o registrarte para realizar un pedido.',
      });
      onRequireLogin();
      return false;
    }

    resetCheckoutForm();
    setShowCheckout(true);
    return true;
  }, [carrito, onRequireLogin, resetCheckoutForm, user]);

  const confirmarPedido = useCallback(async () => {
    if (isSubmittingPedido) return;

    try {
      setCheckoutAttempted(true);
      setCheckoutTouched({ direccion: true, telefono: true });

      if (!checkoutValid) {
        throw new Error(
          checkoutDireccionError ||
            checkoutTelefonoError ||
            (checkoutStockError ? getCartItemStockError(checkoutStockError) : '') ||
            'Completa los datos del pedido'
        );
      }

      setIsSubmittingPedido(true);

      await api.pedidos.create({
        clienteId: undefined,
        fechaPedido: new Date().toISOString().split('T')[0],
        fechaEntrega: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        metodoPago,
        porcentajeAbono: porcentajePago === '50' ? 50 : 100,
        total: totalCarrito,
        direccion: checkoutDireccion,
        telefono: checkoutTelefonoDigits,
        observaciones: checkoutData.observaciones.trim(),
        productos: carrito.map((item) => ({
          productoId: Number(item.producto.id),
          cantidad: item.cantidad,
          precio: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad,
        })),
      } as any);

      clearCart();
      setShowCheckout(false);
      resetCheckoutForm();
      toast.success('Pedido confirmado', {
        description: `Gracias por tu compra, ${user?.nombre}. Tu pedido fue registrado exitosamente.`,
      });

      try {
        await onPedidoCreated?.();
      } catch {
        // El pedido ya fue creado; si la recarga falla, no bloqueamos la confirmación al cliente.
      }
    } catch (error: any) {
      toast.error('Error al crear pedido', {
        description: error.message || 'No se pudo registrar el pedido.',
      });
    } finally {
      setIsSubmittingPedido(false);
    }
  }, [
    carrito,
    checkoutData.observaciones,
    checkoutDireccion,
    checkoutDireccionError,
    checkoutStockError,
    checkoutTelefonoDigits,
    checkoutTelefonoError,
    checkoutValid,
    clearCart,
    isSubmittingPedido,
    metodoPago,
    onPedidoCreated,
    porcentajePago,
    resetCheckoutForm,
    totalCarrito,
    user?.nombre,
  ]);

  return {
    showCheckout,
    setShowCheckout,
    isSubmittingPedido,
    metodoPago,
    setMetodoPago,
    porcentajePago,
    setPorcentajePago,
    checkoutData,
    setCheckoutData,
    checkoutTouched,
    setCheckoutTouched,
    checkoutAttempted,
    setCheckoutAttempted,
    checkoutDireccion,
    checkoutTelefonoDigits,
    shouldShowDireccionError,
    shouldShowTelefonoError,
    checkoutDireccionError,
    checkoutTelefonoError,
    checkoutStockError,
    checkoutValid,
    totalCarrito,
    resetCheckoutForm,
    realizarPedido,
    confirmarPedido,
  };
}
