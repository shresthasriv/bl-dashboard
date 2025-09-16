import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/validation/middleware';
import { csvImportRowSchema } from '@/lib/validation';
import { BuyerService } from '@/services/buyer.service';
import { z } from 'zod';

const importSchema = z.object({
  data: z.array(z.record(z.string(), z.any())),
  skipErrors: z.boolean().default(false),
});

async function importHandler(req: NextRequest, { user }: { user: any }) {
  const body = await req.json();
  const { data, skipErrors } = importSchema.parse(body);
  
  const buyerService = new BuyerService();
  const results = {
    total: data.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ row: number; errors: string[]; data: any }>,
    created: [] as any[],
  };

  for (let i = 0; i < data.length; i++) {
    const rowData = data[i];
    
    try {
      // Parse numeric fields
      const processedData = {
        ...rowData,
        budgetMin: rowData.budgetMin ? parseInt(rowData.budgetMin.toString()) : undefined,
        budgetMax: rowData.budgetMax ? parseInt(rowData.budgetMax.toString()) : undefined,
        tags: rowData.tags ? rowData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
      };

      // Validate against schema
      const validatedData = csvImportRowSchema.parse(processedData);
      
      // Create buyer
      const buyer = await buyerService.createBuyer(validatedData as any, user.id);
      
      results.successful++;
      results.created.push(buyer);
    } catch (error: any) {
      results.failed++;
      
      const errorMessages = [];
      if (error.errors) {
        errorMessages.push(...error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`));
      } else {
        errorMessages.push(error.message || 'Unknown error');
      }
      
      results.errors.push({
        row: i + 1,
        errors: errorMessages,
        data: rowData,
      });

      if (!skipErrors && results.failed >= 10) {
        break;
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: results,
  });
}

export const POST = withAuth(importHandler);
