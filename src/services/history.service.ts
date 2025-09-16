import { HistoryRepository } from '@/lib/db/repositories/history.repository';
import { ActionType } from '@prisma/client';

export class HistoryService {
  private historyRepo = new HistoryRepository();

  async createHistoryEntry(data: {
    buyerId: string;
    userId: string;
    action: ActionType;
    changes?: Record<string, any>;
    previousData?: Record<string, any>;
    newData?: Record<string, any>;
  }) {
    return this.historyRepo.create({
      buyerId: data.buyerId,
      userId: data.userId,
      action: data.action,
      changes: data.changes || {},
      previousData: data.previousData || {},
      newData: data.newData || {},
    });
  }

  async getBuyerHistory(buyerId: string, ownerId: string) {
    return this.historyRepo.findByBuyerId(buyerId, ownerId);
  }

  generateChangeDiff(previousData: any, newData: any): Record<string, any> {
    const changes: Record<string, any> = {};
    
    // Compare all fields
    const allKeys = new Set([
      ...Object.keys(previousData || {}),
      ...Object.keys(newData || {})
    ]);

    for (const key of allKeys) {
      const oldValue = previousData?.[key];
      const newValue = newData?.[key];
      
      // Skip system fields
      if (['id', 'createdAt', 'updatedAt', 'ownerId'].includes(key)) {
        continue;
      }
      
      // Handle arrays (like tags)
      if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (JSON.stringify(oldValue.sort()) !== JSON.stringify(newValue.sort())) {
          changes[key] = {
            from: oldValue,
            to: newValue,
            type: 'array'
          };
        }
      }
      // Handle primitive values
      else if (oldValue !== newValue) {
        changes[key] = {
          from: oldValue,
          to: newValue,
          type: typeof newValue
        };
      }
    }

    return changes;
  }

  formatFieldName(fieldName: string): string {
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
  }

  formatFieldValue(value: any, fieldName: string): string {
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
  }
}
