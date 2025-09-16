import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { BuyerService } from '@/services/buyer.service';
import { BuyerForm } from '@/components/buyers/buyer-form';

interface EditBuyerPageProps {
  params: { id: string };
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
  const user = await getSession();
  
  if (!user) {
    redirect('/auth/signin');
  }

  const buyerService = new BuyerService();
  const buyer = await buyerService.getBuyer(params.id, user.id);

  if (!buyer) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Buyer</h1>
        <p className="text-gray-600">Update {buyer.fullName}'s information</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <BuyerForm buyer={buyer} />
      </div>
    </div>
  );
}

