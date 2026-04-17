import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  contentClassName?: string;
  zIndexClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  contentClassName = '',
  zIndexClassName = 'z-[60]'
}: ModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const modalContent = (
    <div
      className={`fixed inset-0 ${zIndexClassName} flex items-start justify-center p-2 sm:items-center sm:p-4`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative mt-2 w-full ${sizeClasses[size]} max-h-[94dvh] min-h-0 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] ring-1 ring-black/5 flex flex-col sm:mt-0 sm:max-h-[88dvh]`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/80 bg-white/95 px-4 py-4 backdrop-blur-sm">
          <h2 className="text-base sm:text-lg font-semibold leading-tight text-foreground/95">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-xl transition-colors shrink-0 border border-transparent hover:border-border/60"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 ${contentClassName}`}>
          {children}
        </div>

        {footer ? (
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-border/80 bg-white/95 px-4 py-4 sm:px-5 sm:py-4 backdrop-blur-sm">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
