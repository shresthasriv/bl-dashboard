import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/validation/middleware';
import { buyerFiltersSchema } from '@/lib/validation';
import { BuyerService } from '@/services/buyer.service';
import { generateCSV } from '@/lib/utils/csv';

async function exportHandler(req: NextRequest, { user }: { user: any }) {
  const { searchParams } = new URL(req.url);
  
  // Parse filters from query params
  const rawFilters = Object.fromEntries(searchParams.entries());
  const filters = buyerFiltersSchema.parse({
    ...rawFilters,
    page: 1,
    limit: 10000, // Export all matching records
    ownerId: user.id,
  });

  const buyerService = new BuyerService();
  const { data: buyers } = await buyerService.getAllBuyers(filters, user.id);

  // Convert to CSV format
  const csvData = buyers.map(buyer => ({
    'Full Name': buyer.fullName,
    'Email': buyer.email || '',
    'Phone': buyer.phone,
    'City': buyer.city,
    'Property Type': buyer.propertyType,
    'BHK': buyer.bhk || '',
    'Purpose': buyer.purpose,
    'Budget Min': buyer.budgetMin || '',
    'Budget Max': buyer.budgetMax || '',
    'Timeline': buyer.timeline.replace('_', ' '),
    'Source': buyer.source.replace('_', ' '),
    'Status': buyer.status.replace('_', ' '),
    'Notes': (buyer.notes || '').replace(/\n/g, ' '),
    'Tags': (buyer.tags || []).join(', '),
    'Created At': new Date(buyer.createdAt).toISOString(),
    'Updated At': new Date(buyer.updatedAt).toISOString(),
  }));

  const csvContent = generateCSV(csvData);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `buyers-export-${timestamp}.csv`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export const GET = withAuth(exportHandler);
