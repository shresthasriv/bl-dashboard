'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  sortBy: string;
  sortOrder: string;
}

export function SortSelect({ sortBy, sortOrder }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSort = (newSortBy: string, newSortOrder: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', newSortBy);
    params.set('sortOrder', newSortOrder);
    params.delete('page');
    
    router.replace(`/buyers?${params.toString()}`);
  };

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'fullName:asc', label: 'Name A-Z' },
    { value: 'fullName:desc', label: 'Name Z-A' },
    { value: 'budgetMax:desc', label: 'Highest Budget' },
    { value: 'budgetMax:asc', label: 'Lowest Budget' },
    { value: 'updatedAt:desc', label: 'Recently Updated' },
  ];

  const currentValue = `${sortBy}:${sortOrder}`;

  return (
    <select
      value={currentValue}
      onChange={(e) => {
        const [newSortBy, newSortOrder] = e.target.value.split(':');
        updateSort(newSortBy, newSortOrder);
      }}
      className="text-sm rounded-lg border-2 border-gray-300 bg-white text-gray-900 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
