'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { City, PropertyType, Status, Timeline, Source } from '@prisma/client';

interface BuyerFiltersProps {
  searchParams: Record<string, string | undefined>;
}

export function BuyerFilters({ searchParams }: BuyerFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(urlSearchParams);
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page');
    
    router.replace(`/buyers?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const search = urlSearchParams.get('search');
    if (search) params.set('search', search);
    
    router.replace(`/buyers?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        <FilterSelect
          label="City"
          value={searchParams.city || 'all'}
          onChange={(value) => updateFilter('city', value)}
          options={[
            { value: 'all', label: 'All Cities' },
            ...Object.values(City).map(city => ({ value: city, label: city }))
          ]}
        />

        <FilterSelect
          label="Property Type"
          value={searchParams.propertyType || 'all'}
          onChange={(value) => updateFilter('propertyType', value)}
          options={[
            { value: 'all', label: 'All Types' },
            ...Object.values(PropertyType).map(type => ({ value: type, label: type }))
          ]}
        />

        <FilterSelect
          label="Status"
          value={searchParams.status || 'all'}
          onChange={(value) => updateFilter('status', value)}
          options={[
            { value: 'all', label: 'All Status' },
            ...Object.values(Status).map(status => ({ value: status, label: status.replace('_', ' ') }))
          ]}
        />

        <FilterSelect
          label="Timeline"
          value={searchParams.timeline || 'all'}
          onChange={(value) => updateFilter('timeline', value)}
          options={[
            { value: 'all', label: 'All Timelines' },
            ...Object.values(Timeline).map(timeline => ({ value: timeline, label: timeline.replace('_', ' ') }))
          ]}
        />

        <FilterSelect
          label="Source"
          value={searchParams.source || 'all'}
          onChange={(value) => updateFilter('source', value)}
          options={[
            { value: 'all', label: 'All Sources' },
            ...Object.values(Source).map(source => ({ value: source, label: source.replace('_', ' ') }))
          ]}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Budget Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={searchParams.budgetMin || ''}
              onChange={(e) => updateFilter('budgetMin', e.target.value)}
              className="flex-1 rounded-md border-gray-300 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={searchParams.budgetMax || ''}
              onChange={(e) => updateFilter('budgetMax', e.target.value)}
              className="flex-1 rounded-md border-gray-300 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
