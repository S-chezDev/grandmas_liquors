import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const ModalContext = React.createContext(false);

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
  zIndexClassName = 'z-[60]',
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  const modalContent = (
    <div
      className={`fixed inset-0 ${zIndexClassName} flex items-start justify-center overflow-y-auto overscroll-contain p-2 sm:items-center sm:p-4`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 my-2 w-full ${sizeClasses[size]} max-h-[94dvh] min-h-0 overflow-hidden rounded-2xl border-2 border-border/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] ring-1 ring-black/5 flex flex-col sm:my-0 sm:max-h-[88dvh]`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-border/80 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <h2 className="text-base sm:text-lg font-semibold leading-tight text-foreground/95 truncate">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground hover:border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [scrollbar-gutter:stable] ${contentClassName}`}
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t-2 border-border/80 bg-white/95 px-5 py-4 backdrop-blur-sm">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(
    <ModalContext.Provider value={true}>{modalContent}</ModalContext.Provider>,
    document.body
  );
}
