'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastData {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<(ToastData & { id: number })[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastData>) => {
      const toast = {
        ...event.detail,
        id: Date.now(),
      };
      
      setToasts(prev => [...prev, toast]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000);
    };

    window.addEventListener('toast', handleToast as EventListener);
    
    return () => {
      window.removeEventListener('toast', handleToast as EventListener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center p-4 rounded-md shadow-lg max-w-sm
            ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : ''}
            ${toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircleIcon className="h-5 w-5 mr-3 flex-shrink-0" />}
          {toast.type === 'error' && <XCircleIcon className="h-5 w-5 mr-3 flex-shrink-0" />}
          {toast.type === 'info' && <InformationCircleIcon className="h-5 w-5 mr-3 flex-shrink-0" />}
          
          <p className="text-sm font-medium">{toast.message}</p>
          
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
