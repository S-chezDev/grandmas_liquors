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
  showEmptyOption?: boolean;
  emptyOptionLabel?: string;
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
  helperText,
  showEmptyOption = true,
  emptyOptionLabel = 'Seleccionar...'
}: FormFieldProps) {
  const baseInputClasses = `w-full min-h-9 rounded-xl border border-border/80 bg-white px-3 py-2 text-sm shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 ${
    error ? 'border-destructive focus:ring-destructive' : 'border-border'
  }`;
  const fieldId = name;
  const helperId = `${name}-helper`;
  const errorId = `${name}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className="space-y-1 min-w-0">
      <label htmlFor={fieldId} className="block text-sm font-medium leading-tight text-foreground/90">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
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
          aria-describedby={describedBy}
          className={`${baseInputClasses} min-h-[72px] resize-y sm:min-h-[88px]`}
        />
      ) : type === 'select' ? (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={baseInputClasses}
        >
          {showEmptyOption ? <option value="">{emptyOptionLabel}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <input
          id={fieldId}
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
          aria-describedby={describedBy}
          className={`${baseInputClasses} file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1 file:text-sm file:text-foreground hover:file:bg-accent/70`}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={(e) => {
            if (type === 'number') {
              const rawValue = e.target.value;
              onChange?.(rawValue === '' ? 0 : Number(rawValue));
              return;
            }
            onChange?.(e.target.value);
          }}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={baseInputClasses}
        />
      )}

      {helperText && !error ? (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function Form({ children, onSubmit, className = '', id, ...props }: FormProps) {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className={`min-w-0 space-y-0 rounded-3xl border border-border/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-black/5 overflow-hidden ${className}`}
      {...props}
    >
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
    <div className={`sticky bottom-0 z-20 flex gap-3 border-t border-border/80 bg-white/95 px-1 pt-4 pb-1 backdrop-blur-sm ${alignClasses[align]} [&>button]:flex-1`}>
      {children}
    </div>
  );
}