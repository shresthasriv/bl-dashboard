import { Suspense } from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BuyerList } from '@/components/buyers/buyer-list';
import { BuyerSearch } from '@/components/buyers/buyer-search';
import { BuyerFilters } from '@/components/buyers/buyer-filters';
import { BuyerStats } from '@/components/buyers/buyer-stats';
import { CreateBuyerButton } from '@/components/buyers/create-buyer-button';
import { ImportExportButtons } from '@/components/buyers/import-export-buttons';

interface SearchParams extends Record<string, string | undefined> {
  page?: string;
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  source?: string;
  budgetMin?: string;
  budgetMax?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface BuyersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const params = await searchParams;
  const user = await getSession();
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Buyer Leads</h1>
          <p className="text-base text-gray-800 mt-2">Manage and track your buyer leads</p>
        </div>
        <div className="flex items-center gap-4">
          <ImportExportButtons searchParams={params} />
          <CreateBuyerButton />
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-xl" />}>
        <BuyerStats />
      </Suspense>

      <div className="bg-white rounded-xl border border-gray-300 shadow-md">
        <div className="p-8 border-b border-gray-200">
          <BuyerSearch initialValue={params.search || ''} />
        </div>
        
        <div className="flex">
          <div className="w-80 border-r border-gray-200 p-8 bg-gray-50">
            <BuyerFilters searchParams={params} />
          </div>
          
          <div className="flex-1">
            <Suspense fallback={<BuyerListSkeleton />}>
              <BuyerList searchParams={params} userId={user.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuyerListSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
