import { Suspense } from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BuyerList } from '@/components/buyers/buyer-list';
import { BuyerSearch } from '@/components/buyers/buyer-search';
import { BuyerFilters } from '@/components/buyers/buyer-filters';
import { BuyerStats } from '@/components/buyers/buyer-stats';
import { CreateBuyerButton } from '@/components/buyers/create-buyer-button';

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
  searchParams: SearchParams;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const user = await getSession();
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Leads</h1>
          <p className="text-gray-600">Manage and track your buyer leads</p>
        </div>
        <CreateBuyerButton />
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
        <BuyerStats />
      </Suspense>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <BuyerSearch initialValue={searchParams.search || ''} />
        </div>
        
        <div className="flex">
          <div className="w-64 border-r p-6">
            <BuyerFilters searchParams={searchParams} />
          </div>
          
          <div className="flex-1">
            <Suspense fallback={<BuyerListSkeleton />}>
              <BuyerList searchParams={searchParams} userId={user.id} />
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
