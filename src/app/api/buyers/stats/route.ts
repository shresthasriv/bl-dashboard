import { NextRequest, NextResponse } from 'next/server';
import { BuyerService } from '@/services/buyer.service';
import { withAuth } from '@/lib/validation/middleware';

const buyerService = new BuyerService();

async function getStatsHandler(req: NextRequest, userId: string) {
  const stats = await buyerService.getBuyerStats(userId);
  
  return NextResponse.json({
    success: true,
    data: stats,
  });
}

export const GET = withAuth(getStatsHandler);
