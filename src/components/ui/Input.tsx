import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: LucideIcon;
  as?: 'input' | 'textarea';
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft: IconLeft,
      type = 'text',
      as = 'input',
      rows = 4,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

    const baseInputClasses = [
      'w-full bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827]',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]',
      'transition-colors duration-150',
      error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : '',
      IconLeft ? 'pl-10' : 'pl-3.5',
      isPassword ? 'pr-10' : 'pr-3.5',
      'py-2.5',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#374151]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {IconLeft && (
            <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
              <IconLeft size={16} />
            </span>
          )}

          {as === 'textarea' ? (
            <textarea
              id={inputId}
              rows={rows}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={[baseInputClasses, 'resize-none'].join(' ')}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              type={resolvedType}
              ref={ref as React.Ref<HTMLInputElement>}
              className={baseInputClasses}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
