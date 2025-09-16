'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { toast } from '@/lib/utils/toast';
import { DocumentArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { parseCSV, mapCSVHeaders } from '@/lib/utils/csv';
import { SAMPLE_CSV_TEMPLATE, CSV_IMPORT_INSTRUCTIONS } from '@/lib/utils/sample-csv';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; errors: string[]; data: any }>;
  created: any[];
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);
  const [result, setResult] = useState<ImportResult | null>(null);


  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyers-import-sample.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const text = await file.text();
      const rawData = parseCSV(text);
      const data = mapCSVHeaders(rawData);

      if (data.length === 0) {
        throw new Error('CSV file is empty or invalid');
      }

      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, skipErrors }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setResult(result.data);
      
      if (result.data.successful > 0) {
        toast.success(`Successfully imported ${result.data.successful} buyers`);
        router.refresh();
      }
      
      if (result.data.failed > 0) {
        toast.error(`${result.data.failed} rows failed to import`);
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Import failed');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    setResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Buyers from CSV"
      size="lg"
    >
      <div className="space-y-6">
        {!result ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <span className="text-sm text-gray-600">
                    Click to upload CSV file or drag and drop
                  </span>
                  <input
                    ref={fileInputRef}
                    id="csv-upload"
                    name="csv-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="skip-errors"
                type="checkbox"
                checked={skipErrors}
                onChange={(e) => setSkipErrors(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="skip-errors" className="ml-2 text-sm text-gray-700">
                Skip rows with errors and continue importing
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {CSV_IMPORT_INSTRUCTIONS.map((instruction, index) => (
                  <li key={index}>• {instruction}</li>
                ))}
              </ul>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadSample}
                className="mt-3"
              >
                Download Sample CSV
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-green-800">Import Summary</h4>
              <div className="mt-2 text-sm text-green-700">
                <p>Total rows: {result.total}</p>
                <p>Successfully imported: {result.successful}</p>
                <p>Failed: {result.failed}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 max-h-60 overflow-y-auto">
                <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Import Errors ({result.errors.length})
                </h4>
                <div className="space-y-2">
                  {result.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      <strong>Row {error.row}:</strong>
                      <ul className="ml-4 list-disc">
                        {error.errors.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {result.errors.length > 10 && (
                    <p className="text-sm text-red-600">
                      ... and {result.errors.length - 10} more errors
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isProcessing}
          >
            {result ? 'Close' : 'Cancel'}
          </Button>
          
          {!result && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              loading={isProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Select File'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
