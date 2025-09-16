'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClockIcon, UserIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils/format';
import { ActionType } from '@prisma/client';

interface HistoryEntry {
  id: string;
  action: ActionType | 'CREATE' | 'UPDATE' | 'DELETE';
  changes: Record<string, any>;
  previousData: Record<string, any>;
  newData: Record<string, any>;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface BuyerHistoryProps {
  buyerId: string;
}

export function BuyerHistory({ buyerId }: BuyerHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const response = await fetch(`/api/buyers/${buyerId}/history`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch history');
      const normalized: HistoryEntry[] = (result.data || []).map((entry: any) => {
        const actionRaw = entry?.diff?.action || 'update';
        const actionUpper = String(actionRaw).toUpperCase();
        const action: 'CREATE' | 'UPDATE' | 'DELETE' =
          actionUpper === 'CREATE' ? 'CREATE' : actionUpper === 'DELETE' ? 'DELETE' : 'UPDATE';
        return {
          id: entry.id,
          action,
          changes: entry?.diff?.changes || {},
          previousData: entry?.diff?.previousData || {},
          newData: entry?.diff?.newData || {},
          createdAt: entry.changedAt || entry.createdAt,
          user: entry.changedByUser || entry.user || { id: '', name: null, email: 'Unknown' },
        };
      });
      setHistory(normalized);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buyerId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    function onBuyerUpdated(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (!detail?.buyerId || detail.buyerId !== buyerId) return;
      refetch();
    }
    window.addEventListener('buyer:updated', onBuyerUpdated);
    return () => window.removeEventListener('buyer:updated', onBuyerUpdated);
  }, [buyerId, refetch]);

  const getActionIcon = (action: ActionType | 'CREATE' | 'UPDATE' | 'DELETE') => {
    switch (action) {
      case 'CREATE':
        return <PlusIcon className="h-4 w-4 text-green-600" />;
      case 'UPDATE':
        return <PencilIcon className="h-4 w-4 text-blue-600" />;
      case 'DELETE':
        return <TrashIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionText = (action: ActionType | 'CREATE' | 'UPDATE' | 'DELETE') => {
    switch (action) {
      case 'CREATE':
        return 'Created';
      case 'UPDATE':
        return 'Updated';
      case 'DELETE':
        return 'Deleted';
      default:
        return String(action);
    }
  };

  const getActionColor = (action: ActionType | 'CREATE' | 'UPDATE' | 'DELETE') => {
    switch (action) {
      case 'CREATE':
        return 'text-green-800 bg-green-100';
      case 'UPDATE':
        return 'text-blue-800 bg-blue-100';
      case 'DELETE':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  const formatFieldName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      city: 'City',
      propertyType: 'Property Type',
      bhk: 'BHK',
      purpose: 'Purpose',
      budgetMin: 'Budget Min',
      budgetMax: 'Budget Max',
      timeline: 'Timeline',
      source: 'Source',
      status: 'Status',
      notes: 'Notes',
      tags: 'Tags',
    };
    
    return fieldNames[fieldName] || fieldName;
  };

  const formatFieldValue = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) return 'Not set';
    
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None';
    }
    
    if (fieldName === 'budgetMin' || fieldName === 'budgetMax') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    if (typeof value === 'string') {
      return value.replace(/_/g, ' ');
    }
    
    return String(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change History</h3>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change History</h3>
        <p className="text-red-600">Error loading history: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change History</h3>
      
      {history.length === 0 ? (
        <p className="text-gray-500">No history available</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="border-l-4 border-gray-200 pl-4 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getActionIcon(entry.action)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(entry.action)}`}>
                        {getActionText(entry.action)}
                      </span>
                      <span className="text-sm text-gray-600">
                        by {entry.user?.name || entry.user?.email || 'Unknown user'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {entry.action === 'UPDATE' && Object.keys(entry.changes).length > 0 && (
                <div className="mt-3 bg-gray-50 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Changes:</h4>
                  <div className="space-y-2">
                    {Object.entries(entry.changes).map(([field, change]: [string, any]) => (
                      <div key={field} className="text-sm">
                        <span className="font-medium text-gray-700">
                          {formatFieldName(field)}:
                        </span>
                        <div className="ml-4 flex items-center space-x-2">
                          <span className="text-red-600 line-through">
                            {formatFieldValue(change.from, field)}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600">
                            {formatFieldValue(change.to, field)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.action === 'CREATE' && (
                <div className="mt-3 text-sm text-gray-600">
                  Initial buyer record created
                </div>
              )}

              {entry.action === 'DELETE' && (
                <div className="mt-3 text-sm text-red-600">
                  Buyer record deleted
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
