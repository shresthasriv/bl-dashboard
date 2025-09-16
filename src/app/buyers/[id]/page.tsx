import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { BuyerService } from '@/services/buyer.service';
import { BuyerDetails } from '@/components/buyers/buyer-details';

interface BuyerPageProps {
  params: { id: string };
}

export default async function BuyerPage({ params }: BuyerPageProps) {
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
      <BuyerDetails buyer={buyer} />
    </div>
  );
}

