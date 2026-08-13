import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Reusable form input with label, error, and helper text.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    id,
    className = '',
    containerClassName = '',
    required = false,
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'form-input',
            leftIcon  && 'pl-9',
            rightIcon && 'pr-9',
            error     && 'border-red-400 focus:ring-red-500 focus:border-red-400',
            className
          )}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error  && <p id={`${inputId}-error`}  className="form-error">{error}</p>}
      {helper && !error && <p id={`${inputId}-helper`} className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
});

export default Input;

/**
 * Select (dropdown) component sharing the same styling.
 */
export const Select = forwardRef(function Select(
  { label, error, id, className = '', containerClassName = '', required = false, children, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={clsx('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={clsx(
          'form-input appearance-none',
          error && 'border-red-400 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

/**
 * Textarea component.
 */
export const Textarea = forwardRef(function Textarea(
  { label, error, id, className = '', containerClassName = '', required = false, rows = 3, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={clsx('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx('form-input resize-y', error && 'border-red-400', className)}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});
