import type { BuyerFilters } from '@/lib/validation';

export function buildFilters(searchParams: Record<string, string | undefined>): BuyerFilters {
  const filters: BuyerFilters = {
    page: parseInt(searchParams.page || '1'),
    limit: 20,
    sortBy: (searchParams.sortBy as any) || 'createdAt',
    sortOrder: (searchParams.sortOrder as 'asc' | 'desc') || 'desc',
  };

  if (searchParams.search) {
    filters.search = searchParams.search;
  }

  if (searchParams.city && searchParams.city !== 'all') {
    filters.city = searchParams.city as any;
  }

  if (searchParams.propertyType && searchParams.propertyType !== 'all') {
    filters.propertyType = searchParams.propertyType as any;
  }

  if (searchParams.status && searchParams.status !== 'all') {
    filters.status = searchParams.status as any;
  }

  if (searchParams.timeline && searchParams.timeline !== 'all') {
    filters.timeline = searchParams.timeline as any;
  }

  if (searchParams.source && searchParams.source !== 'all') {
    filters.source = searchParams.source as any;
  }

  if (searchParams.budgetMin) {
    filters.budgetMin = parseInt(searchParams.budgetMin);
  }

  if (searchParams.budgetMax) {
    filters.budgetMax = parseInt(searchParams.budgetMax);
  }

  return filters;
}
