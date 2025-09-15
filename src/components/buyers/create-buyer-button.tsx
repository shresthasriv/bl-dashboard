import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export function CreateBuyerButton() {
  return (
    <Link
      href="/buyers/new"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Buyer
    </Link>
  );
}
