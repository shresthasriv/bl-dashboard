import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface BuyerCardProps {
  buyer: any;
}

export function BuyerCard({ buyer }: BuyerCardProps) {
  const statusColors = {
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-yellow-100 text-yellow-800',
    Qualified: 'bg-green-100 text-green-800',
    Proposal_Sent: 'bg-purple-100 text-purple-800',
    Negotiation: 'bg-orange-100 text-orange-800',
    Closed_Won: 'bg-green-100 text-green-800',
    Closed_Lost: 'bg-red-100 text-red-800',
    On_Hold: 'bg-gray-100 text-gray-800',
  };

  return (
    <Link href={`/buyers/${buyer.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{buyer.fullName}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${statusColors[buyer.status as keyof typeof statusColors] || statusColors.New}`}>
                {buyer.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              {buyer.email && (
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-1.5" />
                  {buyer.email}
                </div>
              )}
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1.5" />
                {buyer.phone}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1.5" />
                {buyer.city}
              </div>
            </div>
          </div>

          <div className="ml-6 text-right text-sm">
            <div className="text-gray-900 font-medium">
              {buyer.propertyType}
              {buyer.bhk && ` - ${buyer.bhk} BHK`}
            </div>
            <div className="text-gray-600">
              {buyer.purpose}
            </div>
            {(buyer.budgetMin || buyer.budgetMax) && (
              <div className="text-gray-600">
                {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(buyer.createdAt)}
            </div>
          </div>
        </div>

        {buyer.tags && buyer.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {buyer.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {buyer.notes && (
          <div className="mt-2 text-sm text-gray-600 line-clamp-2">
            {buyer.notes}
          </div>
        )}
      </div>
    </Link>
  );
}
