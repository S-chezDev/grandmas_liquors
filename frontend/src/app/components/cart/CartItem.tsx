import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { FieldError, FieldHelper } from '../Form';
import { CartItem as CartItemType } from '../hooks/landingShared';

interface CartItemProps {
  item: CartItemType;
  stockError: string;
  stockHelper: string;
  onDecrement: (productoId: string) => void;
  onIncrement: (productoId: string) => void;
  onUpdateQuantity: (productoId: string, value: string) => void;
  onRemove: (productoId: string) => void;
}

export function CartItem({
  item,
  stockError,
  stockHelper,
  onDecrement,
  onIncrement,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-background rounded-lg border border-border">
      <img
        src={item.producto.imagen}
        alt={item.producto.nombre}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-sm mb-1 line-clamp-1">{item.producto.nombre}</h4>
        <p className="text-xs text-muted-foreground mb-2">{item.producto.categoria}</p>
        <div className="flex items-center justify-between">
          <p className="text-primary">${item.producto.precio.toLocaleString('es-CO')}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrement(item.producto.id)}
              className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={999}
              inputMode="numeric"
              value={item.cantidad}
              onChange={(e) => onUpdateQuantity(item.producto.id, e.target.value)}
              className="w-16 rounded-md border border-border bg-white px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label={`Cantidad de ${item.producto.nombre}`}
            />
            <button
              onClick={() => onIncrement(item.producto.id)}
              className="w-7 h-7 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {stockError ? <FieldError>{stockError}</FieldError> : <FieldHelper>{stockHelper}</FieldHelper>}
        </div>
      </div>
      <button
        onClick={() => onRemove(item.producto.id)}
        className="p-2 h-fit rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
