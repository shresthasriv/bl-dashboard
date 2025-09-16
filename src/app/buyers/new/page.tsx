import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BuyerForm } from '@/components/buyers/buyer-form';

export default async function NewBuyerPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Add New Buyer</h1>
          <p className="text-lg text-gray-700 mt-2">Create a new buyer lead with detailed information</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg">
          <BuyerForm />
        </div>
      </div>
    </div>
  );
}

