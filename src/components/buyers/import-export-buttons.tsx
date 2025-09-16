'use client';

import { useState } from 'react';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { ImportModal } from './import-modal';
import { toast } from '@/lib/utils/toast';

interface ImportExportButtonsProps {
  searchParams?: Record<string, string | undefined>;
}

export function ImportExportButtons({ searchParams = {} }: ImportExportButtonsProps) {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add current filters to export
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/buyers/export?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'buyers-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Export completed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsImportOpen(true)}
        >
          <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          loading={isExporting}
          disabled={isExporting}
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <ImportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </>
  );
}
