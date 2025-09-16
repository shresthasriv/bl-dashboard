import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/validation/middleware';
import { BuyerService } from '@/services/buyer.service';

async function historyHandler(
  req: NextRequest,
  userId: string,
  context: { params: Promise<{ id: string }> }
) {
  const buyerService = new BuyerService();
  const { id } = await context.params;
  const history = await buyerService.getBuyerHistory(id, userId);

  return NextResponse.json({
    success: true,
    data: history,
  });
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withAuth((req, userId) => historyHandler(req, userId, context))(req);
}
