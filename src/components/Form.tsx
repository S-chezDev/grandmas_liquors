import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'file';
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  rows?: number;
  accept?: string;
  error?: string;
  helperText?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  accept,
  error,
  helperText
}: FormFieldProps) {
  const baseInputClasses = `w-full px-3 py-1.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${
    error ? 'border-destructive focus:ring-destructive' : 'border-border'
  }`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium leading-tight">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={baseInputClasses}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={baseInputClasses}
        >
          <option value="">Seleccionar...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
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
          onBlur={onBlur}
          accept={accept}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={baseInputClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={baseInputClasses}
        />
      )}

      {helperText && !error ? (
        <p id={`${name}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className = '' }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-3 ${className}`}>
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
    <div className={`flex gap-2 pt-3 ${alignClasses[align]}`}>
      {children}
    </div>
  );
}