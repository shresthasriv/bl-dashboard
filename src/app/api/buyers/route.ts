import { NextRequest, NextResponse } from 'next/server';
import { BuyerService } from '@/services/buyer.service';
import { createBuyerSchema, buyerFiltersSchema } from '@/lib/validation';
import { withValidation, withAuth, withRateLimit, compose } from '@/lib/validation/middleware';

const buyerService = new BuyerService();

async function getBuyersHandler(req: NextRequest, filters: any, userId: string) {
  const result = await buyerService.getAllBuyers(filters, userId);
  
  return NextResponse.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

async function createBuyerHandler(req: NextRequest, data: any, userId: string) {
  console.log('Handler received data:', data);
  console.log('Handler received userId:', userId);
  const buyer = await buyerService.createBuyer(data, userId);
  
  return NextResponse.json({
    success: true,
    data: buyer,
    message: 'Buyer created successfully',
  });
}

export const GET = compose(
  withAuth,
  withValidation(buyerFiltersSchema)
)(getBuyersHandler);

export const POST = compose(
  withRateLimit(20, 60000),
  withAuth,  
  withValidation(createBuyerSchema)
)(createBuyerHandler);
