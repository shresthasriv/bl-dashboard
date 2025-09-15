import { z } from 'zod';

export const citySchema = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);

export const propertyTypeSchema = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);

export const bhkSchema = z.enum(['Studio', 'One', 'Two', 'Three', 'Four']);

export const purposeSchema = z.enum(['Buy', 'Rent']);

export const timelineSchema = z.enum(['ZeroToThree', 'ThreeToSix', 'SixPlus', 'Exploring']);

export const sourceSchema = z.enum(['Website', 'Referral', 'WalkIn', 'Call', 'Other']);

export const statusSchema = z.enum([
  'New',
  'Qualified', 
  'Contacted',
  'Visited',
  'Negotiation',
  'Converted',
  'Dropped'
]);

export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const buyerSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be less than 80 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string()
    .regex(/^\d{10,15}$/, 'Phone must be 10-15 digits')
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must be less than 15 digits'),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional(),
  purpose: purposeSchema,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: timelineSchema,
  source: sourceSchema,
  status: statusSchema.default('New'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  ownerId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine(
  (data) => {
    if (data.budgetMin && data.budgetMax) {
      return data.budgetMax >= data.budgetMin;
    }
    return true;
  },
  {
    message: 'Budget max must be greater than or equal to budget min',
    path: ['budgetMax'],
  }
).refine(
  (data) => {
    if (data.propertyType === 'Apartment' || data.propertyType === 'Villa') {
      return data.bhk !== undefined;
    }
    return true;
  },
  {
    message: 'BHK is required for Apartments and Villas',
    path: ['bhk'],
  }
);

export const createBuyerSchema = buyerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const updateBuyerSchema = createBuyerSchema.partial().extend({
  id: z.string().uuid(),
});

export const buyerFiltersSchema = z.object({
  city: citySchema.optional(),
  propertyType: propertyTypeSchema.optional(),
  status: statusSchema.optional(),
  timeline: timelineSchema.optional(),
  source: sourceSchema.optional(),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['fullName', 'createdAt', 'updatedAt', 'budgetMax']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ownerId: z.string().optional(),
});

export const csvImportRowSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional().or(z.literal('')),
  purpose: purposeSchema,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: timelineSchema,
  source: sourceSchema,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  status: statusSchema.optional(),
}).refine(
  (data) => {
    if (data.budgetMin && data.budgetMax) {
      return data.budgetMax >= data.budgetMin;
    }
    return true;
  },
  {
    message: 'Budget max must be greater than or equal to budget min',
    path: ['budgetMax'],
  }
).refine(
  (data) => {
    if (data.propertyType === 'Apartment' || data.propertyType === 'Villa') {
      return data.bhk !== undefined;
    }
    return true;
  },
  {
    message: 'BHK is required for Apartments and Villas',
    path: ['bhk'],
  }
);

export const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const sessionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  token: z.string(),
  expires: z.date(),
  createdAt: z.date(),
});

export const magicLinkSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  token: z.string(),
  expires: z.date(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export type Buyer = z.infer<typeof buyerSchema>;
export type CreateBuyer = z.infer<typeof createBuyerSchema>;
export type UpdateBuyer = z.infer<typeof updateBuyerSchema>;
export type BuyerFilters = z.infer<typeof buyerFiltersSchema>;
export type CSVImportRow = z.infer<typeof csvImportRowSchema>;
export type AuthData = z.infer<typeof authSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type MagicLink = z.infer<typeof magicLinkSchema>;

