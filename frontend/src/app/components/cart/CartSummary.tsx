import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../Button';
import { FieldError } from '../Form';
import { UserData } from '../hooks/landingShared';

interface CartSummaryProps {
  totalCarrito: number;
  hayErroresDeStock: boolean;
  user?: UserData;
  onCheckout: () => void;
}

export function CartSummary({
  totalCarrito,
  hayErroresDeStock,
  user,
  onCheckout,
}: CartSummaryProps) {
  return (
    <>
      <div className="border-t border-border pt-4 mb-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totalCarrito.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Domicilio</span>
            <span className="text-primary">A calcular</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-border pt-4">
          <span>Total</span>
          <span className="text-primary">${totalCarrito.toLocaleString('es-CO')}</span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        className="w-full bg-primary text-white py-3"
        icon={<ShoppingBag className="w-5 h-5" />}
        disabled={hayErroresDeStock}
      >
        Realizar Pedido
      </Button>

      {hayErroresDeStock ? (
        <FieldError className="mt-4">
          Ajusta las cantidades antes de continuar. Hay productos que superan el stock disponible.
        </FieldError>
      ) : !user ? (
        <p className="text-xs text-center text-muted-foreground mt-4">
          Inicia sesión para completar tu compra
        </p>
      ) : null}
    </>
  );
}
