'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.replace(`/buyers?${params.toString()}`);
  };

  if (pagination.totalPages <= 1) return null;

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
  const showPages = pages.slice(
    Math.max(0, pagination.page - 3),
    Math.min(pagination.totalPages, pagination.page + 2)
  );

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <div className="text-sm text-gray-600">
        Page {pagination.page} of {pagination.totalPages} 
        ({pagination.total} total)
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => updatePage(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {showPages[0] > 1 && (
          <>
            <button
              onClick={() => updatePage(1)}
              className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50"
            >
              1
            </button>
            {showPages[0] > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {showPages.map((page) => (
          <button
            key={page}
            onClick={() => updatePage(page)}
            className={`px-3 py-1 text-sm rounded-md border ${
              page === pagination.page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {showPages[showPages.length - 1] < pagination.totalPages && (
          <>
            {showPages[showPages.length - 1] < pagination.totalPages - 1 && 
              <span className="px-2 text-gray-400">...</span>
            }
            <button
              onClick={() => updatePage(pagination.totalPages)}
              className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => updatePage(pagination.page + 1)}
          disabled={!pagination.hasNext}
          className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
