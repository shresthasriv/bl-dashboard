'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Status } from '@prisma/client';
import { toast } from '@/lib/utils/toast';

interface StatusQuickActionsProps {
  buyerId: string;
  currentStatus: Status;
  className?: string;
}

export function StatusQuickActions({ buyerId, currentStatus, className = '' }: StatusQuickActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'Visited', label: 'Visited', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { value: 'Negotiation', label: 'Negotiation', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
    { value: 'Converted', label: 'Converted', color: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
    { value: 'Dropped', label: 'Dropped', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  ];

  const updateStatus = async (newStatus: Status) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/buyers/${buyerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update status');
      }

      toast.success(`Status updated to ${newStatus}`);
      // Notify listeners (e.g., BuyerHistory) to refetch
      window.dispatchEvent(new CustomEvent('buyer:updated', { detail: { buyerId, changedAt: Date.now() } }));
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {statusOptions.map((status) => (
        <button
          key={status.value}
          onClick={() => updateStatus(status.value as Status)}
          disabled={isUpdating || status.value === currentStatus}
          className={`
            px-2 py-1 text-xs rounded-full transition-colors
            ${status.value === currentStatus 
              ? 'ring-2 ring-offset-1 ring-blue-500' 
              : 'opacity-70 hover:opacity-100'
            }
            ${status.color}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
