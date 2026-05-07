import React, { useState } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'file';
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  /** En type=select: si es true (defecto), se agrega la opción vacía "Seleccionar...". Desactívelo cuando las opciones ya incluyen su propio placeholder (p. ej. valor 0). */
  selectPlaceholder?: boolean;
  rows?: number;
  accept?: string;
  min?: number;
  max?: number;
  pattern?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  selectPlaceholder = true,
  rows = 4,
  accept,
  min,
  max,
  pattern
}: FormFieldProps) {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const baseInputClasses = `w-full px-4 py-2 bg-input-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
    error && touched ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-ring'
  }`;

  const validateField = (val: string | number) => {
    if (!touched) return;

    // Validaciones básicas
    if (required && (!val || val === '')) {
      setError('Este campo es obligatorio');
      return;
    }

    // Validaciones por tipo
    if (type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.toString())) {
        setError('Ingresa un correo electrónico válido');
        return;
      }
    }

    if (type === 'number' && val) {
      const numVal = Number(val);
      if (min !== undefined && numVal < min) {
        setError(`El valor debe ser al menos ${min}`);
        return;
      }
      if (max !== undefined && numVal > max) {
        setError(`El valor no puede ser mayor a ${max}`);
        return;
      }
    }

    if (pattern && val) {
      const regex = new RegExp(pattern);
      if (!regex.test(val.toString())) {
        setError('El formato ingresado no es válido');
        return;
      }
    }

    // Si pasa todas las validaciones
    setError('');
  };

  const handleChange = (newValue: string | number) => {
    onChange?.(newValue);
    validateField(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    validateField(value || '');
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={baseInputClasses}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value === undefined || value === null ? '' : value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          required={required}
          className={baseInputClasses}
        >
          {selectPlaceholder ? <option value="">Seleccionar...</option> : null}
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <input
          id={name}
          name={name}
          type="file"
          onChange={(e) => {
            // Para file input no usamos el onChange normal
            const event = e as any;
            if (event.target && onChange) {
              onChange(event);
            }
          }}
          accept={accept}
          required={required}
          className={baseInputClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => handleChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          pattern={pattern}
          className={baseInputClasses}
        />
      )}
      
      {error && touched && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  /** Desactiva la validación HTML5 del navegador (útil cuando hay campos auxiliares que no deben bloquear el envío). */
  noValidate?: boolean;
}

export function Form({ children, onSubmit, className = '', noValidate = false }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} noValidate={noValidate}>
      {children}
    </form>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function FormActions({ children, align = 'right' }: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div className={`flex gap-3 pt-4 ${alignClasses[align]}`}>
      {children}
    </div>
  );
}