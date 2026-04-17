import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle, Trash2 } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: 'warning' | 'info' | 'success' | 'danger';
  confirmText?: string;
  cancelText?: string;
}

type AlertVariant = 'warning' | 'info' | 'success' | 'danger';

const alertVariants: Record<
  AlertVariant,
  {
    icon: React.ReactNode;
    iconBgClass: string;
    iconColorClass: string;
    panelClass: string;
    buttonVariant: 'primary' | 'destructive';
  }
> = {
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    iconBgClass: 'bg-yellow-100',
    iconColorClass: 'text-yellow-700',
    panelClass: 'border-yellow-200 bg-yellow-50',
    buttonVariant: 'primary'
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    iconBgClass: 'bg-primary/15',
    iconColorClass: 'text-primary',
    panelClass: 'border-primary/20 bg-primary/5',
    buttonVariant: 'primary'
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    iconBgClass: 'bg-green-100',
    iconColorClass: 'text-green-700',
    panelClass: 'border-green-200 bg-green-50',
    buttonVariant: 'primary'
  },
  danger: {
    icon: <Trash2 className="w-5 h-5" />,
    iconBgClass: 'bg-destructive/15',
    iconColorClass: 'text-destructive',
    panelClass: 'border-destructive/20 bg-destructive/5',
    buttonVariant: 'destructive'
  }
};

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  const variant = alertVariants[type];
  const shouldShowCancel = typeof cancelText === 'string' && cancelText.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      contentClassName="pt-3"
      zIndexClassName="z-[70]"
    >
      <div className="space-y-4">
        <div className={`rounded-xl border p-4 ${variant.panelClass}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${variant.iconBgClass} ${variant.iconColorClass}`}>
              {variant.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/90 max-h-56 overflow-y-auto pr-1 whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 justify-end border-t border-border">
          {shouldShowCancel ? (
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          ) : null}
          <Button 
            onClick={handleConfirm}
            variant={variant.buttonVariant}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Hook para usar alertas programáticamente
export function useAlertDialog() {
  const [alertState, setAlertState] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'warning' | 'info' | 'success' | 'danger';
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'warning',
    onConfirm: () => {},
  });

  const showAlert = React.useCallback(
    (config: Omit<typeof alertState, 'isOpen'>) => {
      setAlertState({ ...config, isOpen: true });
    },
    []
  );

  const hideAlert = React.useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const AlertComponent = React.useMemo(
    () => (
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        onConfirm={alertState.onConfirm}
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    ),
    [alertState, hideAlert]
  );

  return { showAlert, hideAlert, AlertComponent };
}
