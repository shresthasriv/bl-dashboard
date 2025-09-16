import Link from 'next/link';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { DeleteBuyerButton } from './delete-buyer-button';
import { BuyerHistory } from './buyer-history';
import { StatusQuickActions } from './status-quick-actions';

interface BuyerDetailsProps {
  buyer: any;
}

export function BuyerDetails({ buyer }: BuyerDetailsProps) {
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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{buyer.fullName}</h1>
          <p className="text-gray-600">Buyer Lead Details</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/buyers/${buyer.id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <DeleteBuyerButton buyerId={buyer.id} buyerName={buyer.fullName} />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-sm rounded-full ${statusColors[buyer.status as keyof typeof statusColors] || statusColors.New}`}>
                {buyer.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 border-b">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Quick Status Update:</h3>
            <StatusQuickActions 
              buyerId={buyer.id} 
              currentStatus={buyer.status}
            />
          </div>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-sm text-gray-900">
                  <a href={`tel:${buyer.phone}`} className="hover:text-blue-600">
                    {buyer.phone}
                  </a>
                </dd>
              </div>
            </div>

            {buyer.email && (
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">
                    <a href={`mailto:${buyer.email}`} className="hover:text-blue-600">
                      {buyer.email}
                    </a>
                  </dd>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="text-sm text-gray-900">{buyer.city}</dd>
              </div>
            </div>

            <div className="flex items-center">
              <BuildingOffice2Icon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                <dd className="text-sm text-gray-900">
                  {buyer.propertyType}
                  {buyer.bhk && ` - ${buyer.bhk} BHK`}
                </dd>
              </div>
            </div>

            <div className="flex items-center">
              <dt className="text-sm font-medium text-gray-500">Purpose</dt>
              <dd className="text-sm text-gray-900 ml-3">{buyer.purpose}</dd>
            </div>

            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                <dd className="text-sm text-gray-900">{buyer.timeline.replace('_', ' ')}</dd>
              </div>
            </div>

            <div className="flex items-center">
              <dt className="text-sm font-medium text-gray-500">Source</dt>
              <dd className="text-sm text-gray-900 ml-3">{buyer.source.replace('_', ' ')}</dd>
            </div>

            {(buyer.budgetMin || buyer.budgetMax) && (
              <div className="flex items-center">
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Budget Range</dt>
                  <dd className="text-sm text-gray-900">
                    {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>
      </div>

      {buyer.tags && buyer.tags.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {buyer.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {buyer.notes && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{buyer.notes}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Created: {formatDate(buyer.createdAt)}</div>
          <div>Last Updated: {formatDate(buyer.updatedAt)}</div>
          <div>Added by: {buyer.owner.name || buyer.owner.email}</div>
        </div>
      </div>

      <BuyerHistory buyerId={buyer.id} />
    </div>
  );
}

