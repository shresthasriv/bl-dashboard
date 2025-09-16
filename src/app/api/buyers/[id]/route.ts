import { NextRequest, NextResponse } from 'next/server';
import { BuyerService } from '@/services/buyer.service';
import { updateBuyerBodySchema } from '@/lib/validation';
import { withValidation, withAuth, withRateLimit, compose } from '@/lib/validation/middleware';
import { handleApiError } from '@/lib/errors';

const buyerService = new BuyerService();

async function getBuyerHandler(req: NextRequest, userId: string, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const buyer = await buyerService.getBuyer(id, userId);
  
  if (!buyer) {
    return NextResponse.json(
      { error: 'Buyer not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: buyer,
  });
}

async function updateBuyerHandler(
  req: NextRequest, 
  userId: string, 
  data: any,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const buyer = await buyerService.updateBuyer(id, data, userId);
    
    return NextResponse.json({
      success: true,
      data: buyer,
      message: 'Buyer updated successfully',
    });
  } catch (error) {
    const errorInfo = handleApiError(error);
    return NextResponse.json(
      { error: errorInfo.error, code: errorInfo.code },
      { status: errorInfo.statusCode }
    );
  }
}

async function deleteBuyerHandler(req: NextRequest, userId: string, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await buyerService.deleteBuyer(id, userId);
    
    return NextResponse.json({
      success: true,
      message: 'Buyer deleted successfully',
    });
  } catch (error) {
    const errorInfo = handleApiError(error);
    return NextResponse.json(
      { error: errorInfo.error, code: errorInfo.code },
      { status: errorInfo.statusCode }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withAuth((req, userId) => getBuyerHandler(req, userId, context))(req);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return compose(
    withRateLimit(30, 60000),
    withAuth,
    withValidation(updateBuyerBodySchema)
  )((req: NextRequest, data: any, userId: string) => 
    updateBuyerHandler(req, userId, data, context)
  )(req);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return compose(
    withRateLimit(10, 60000),
    withAuth
  )((req: NextRequest, userId: string) => deleteBuyerHandler(req, userId, context))(req);
}
