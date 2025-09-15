import { BuyerService } from '@/services/buyer.service';
import { BuyerCard } from './buyer-card';
import { Pagination } from '../ui/pagination';
import { SortSelect } from './sort-select';
import { buildFilters } from '@/lib/utils/filters';

interface BuyerListProps {
  searchParams: Record<string, string | undefined>;
  userId: string;
}

export async function BuyerList({ searchParams, userId }: BuyerListProps) {
  const buyerService = new BuyerService();
  const filters = buildFilters(searchParams);
  
  const result = await buyerService.getAllBuyers(filters, userId);

  if (result.data.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No buyers found</div>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Showing {result.data.length} of {result.pagination.total} buyers
        </div>
        <SortSelect 
          sortBy={searchParams.sortBy || 'createdAt'} 
          sortOrder={searchParams.sortOrder || 'desc'} 
        />
      </div>

      <div className="space-y-4 mb-6">
        {result.data.map((buyer) => (
          <BuyerCard key={buyer.id} buyer={buyer} />
        ))}
      </div>

      <Pagination pagination={result.pagination} />
    </div>
  );
}
