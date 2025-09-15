export const differenceTracker = {
  getDifferences(original: any, updated: any): Record<string, { from: any; to: any }> {
    const changes: Record<string, { from: any; to: any }> = {};
    
    const compareKeys = new Set([
      ...Object.keys(original || {}),
      ...Object.keys(updated || {})
    ]);

    for (const key of compareKeys) {
      if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === 'ownerId') {
        continue;
      }

      const oldValue = original?.[key];
      const newValue = updated?.[key];

      if (newValue !== undefined && !this.isEqual(oldValue, newValue)) {
        changes[key] = { from: oldValue, to: newValue };
      }
    }

    return changes;
  },

  isEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => this.isEqual(item, b[index]));
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      return keysA.every(key => this.isEqual(a[key], b[key]));
    }
    
    return false;
  }
};
