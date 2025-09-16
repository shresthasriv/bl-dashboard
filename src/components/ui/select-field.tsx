import { forwardRef, ReactNode } from 'react';

interface SelectFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, required = false, error, children, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          ref={ref}
          {...props}
          className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 bg-white text-gray-900"
        >
          {children}
        </select>
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

