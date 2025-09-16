export const toast = {
    success: (message: string) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('toast', {
          detail: { type: 'success', message }
        });
        window.dispatchEvent(event);
      }
    },
    
    error: (message: string) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('toast', {
          detail: { type: 'error', message }
        });
        window.dispatchEvent(event);
      }
    },
    
    info: (message: string) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('toast', {
          detail: { type: 'info', message }
        });
        window.dispatchEvent(event);
      }
    }
  };