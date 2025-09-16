import { forwardRef } from 'react';

interface TextareaFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, required = false, error, className = '', rows = 3, ...props }, ref) => {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          {...props}
          rows={rows}
          className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 bg-white text-gray-900"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';

