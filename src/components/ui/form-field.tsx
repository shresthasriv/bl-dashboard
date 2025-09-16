import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  required = false, 
  error, 
  children, 
  className = '' 
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="[&>input]:bg-white [&>input]:text-gray-900 [&>select]:bg-white [&>select]:text-gray-900 [&>textarea]:bg-white [&>textarea]:text-gray-900">
        {children}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

