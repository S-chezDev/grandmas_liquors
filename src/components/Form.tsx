import React from 'react';
import { ModalContext } from './Modal';

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
  emptyOptionLabel = 'Seleccionar...',
}: FormFieldProps) {
  const stateClasses = error
    ? 'border-destructive/80 hover:border-destructive focus:border-destructive focus:ring-destructive/25'
    : 'border-border hover:border-foreground/30 focus:border-primary/70 focus:ring-primary/20';

  const baseInputClasses = `block w-full min-h-10 rounded-lg border-2 bg-white px-3 py-2 text-sm text-foreground/90 shadow-sm transition-colors duration-150 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground disabled:border-border/60 read-only:bg-muted/30 read-only:cursor-default ${stateClasses}`;

  const fieldId = name;
  const helperId = `${name}-helper`;
  const errorId = `${name}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className="space-y-1.5 min-w-0">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium leading-tight text-foreground/90"
      >
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
          className={`${baseInputClasses} min-h-[80px] resize-y leading-relaxed sm:min-h-[96px]`}
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
          className={`${baseInputClasses} appearance-none bg-[length:1.1rem_1.1rem] bg-[right_0.65rem_center] bg-no-repeat pr-9 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%221.7%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 8 10 12 14 8%22/></svg>')]`}
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
          className={`${baseInputClasses} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent/80`}
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
        <p id={helperId} className="text-xs leading-snug text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs font-medium leading-snug text-destructive">
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
      noValidate
      className={`flex min-w-0 flex-col gap-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

export function FormActions({ children, align = 'right', sticky }: FormActionsProps) {
  const isInModal = React.useContext(ModalContext);
  const shouldStick = sticky ?? isInModal;

  const alignClasses = {
    left: 'sm:justify-start',
    center: 'sm:justify-center',
    right: 'sm:justify-end',
  };

  const stickyClasses = shouldStick
    ? 'sticky bottom-0 z-20 mt-2 border-t-2 border-border/80 bg-white/95 py-3 backdrop-blur-sm shadow-[0_-10px_24px_-18px_rgba(15,23,42,0.25)]'
    : 'pt-2';

  return (
    <div
      className={`flex flex-col gap-2 ${stickyClasses} sm:flex-row sm:flex-wrap sm:gap-3 ${alignClasses[align]} [&>button]:w-full sm:[&>button]:w-auto sm:[&>button]:min-w-[140px]`}
    >
      {children}
    </div>
  );
}
