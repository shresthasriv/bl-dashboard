// Base types for the application

export type City = 'Chandigarh' | 'Mohali' | 'Zirakpur' | 'Panchkula' | 'Other';

export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail';

export type BHK = 'Studio' | 'One' | 'Two' | 'Three' | 'Four';

export type Purpose = 'Buy' | 'Rent';

export type Timeline = 'ZeroToThree' | 'ThreeToSix' | 'SixPlus' | 'Exploring';

export type Source = 'Website' | 'Referral' | 'WalkIn' | 'Call' | 'Other';

export type Status = 
  | 'New' 
  | 'Qualified' 
  | 'Contacted' 
  | 'Visited' 
  | 'Negotiation' 
  | 'Converted' 
  | 'Dropped';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter and Search types
export interface BuyerFilters {
  city?: City;
  propertyType?: PropertyType;
  status?: Status;
  timeline?: Timeline;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// CSV Import types
export interface CSVImportRow {
  fullName: string;
  email?: string;
  phone: string;
  city: City;
  propertyType: PropertyType;
  bhk?: BHK;
  purpose: Purpose;
  budgetMin?: number;
  budgetMax?: number;
  timeline: Timeline;
  source: Source;
  notes?: string;
  tags?: string;
  status?: Status;
}

export interface CSVImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    message: string;
    data: Partial<CSVImportRow>;
  }>;
}
