export const SAMPLE_CSV_TEMPLATE = `Full Name,Email,Phone,City,Property Type,BHK,Purpose,Budget Min,Budget Max,Timeline,Source,Notes,Tags,Status
John Doe,john@example.com,9876543210,Chandigarh,Apartment,Two,Buy,5000000,7000000,ZeroToThree,Website,Looking for 2BHK apartment in good locality,urgent family,New
Jane Smith,jane@example.com,9876543211,Mohali,Villa,Three,Buy,8000000,12000000,ThreeToSix,Referral,Prefers gated community with amenities,luxury investment,Qualified
Rahul Kumar,rahul@example.com,9876543212,Zirakpur,Plot,,,Buy,2000000,3000000,SixPlus,WalkIn,Interested in residential plot for future construction,investment,Contacted
Priya Sharma,,9876543213,Panchkula,Apartment,One,Rent,15000,25000,ZeroToThree,Call,Looking for furnished 1BHK for rent,temporary,New
Amit Singh,amit@example.com,9876543214,Chandigarh,Office,,Buy,3000000,5000000,ThreeToSix,Website,Commercial space for IT startup,business,Visited`;

export const CSV_IMPORT_INSTRUCTIONS = [
  'Required columns: Full Name, Phone, City, Property Type, Purpose, Timeline, Source',
  'BHK is required for Apartment and Villa properties',
  'Budget values should be numbers (without currency symbols)',
  'Tags should be comma-separated within the Tags column',
  'Valid Cities: Chandigarh, Mohali, Zirakpur, Panchkula, Other',
  'Valid Property Types: Apartment, Villa, Plot, Office, Retail',
  'Valid BHK: Studio, One, Two, Three, Four',
  'Valid Purpose: Buy, Rent',
  'Valid Timeline: ZeroToThree, ThreeToSix, SixPlus, Exploring',
  'Valid Source: Website, Referral, WalkIn, Call, Other',
  'Valid Status: New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped',
];

export const CSV_FIELD_DESCRIPTIONS = {
  'Full Name': 'Required. Buyer\'s full name (2-80 characters)',
  'Email': 'Optional. Valid email address',
  'Phone': 'Required. 10-15 digit phone number',
  'City': 'Required. One of: Chandigarh, Mohali, Zirakpur, Panchkula, Other',
  'Property Type': 'Required. One of: Apartment, Villa, Plot, Office, Retail',
  'BHK': 'Required for Apartment/Villa. One of: Studio, One, Two, Three, Four',
  'Purpose': 'Required. One of: Buy, Rent',
  'Budget Min': 'Optional. Minimum budget in rupees (numbers only)',
  'Budget Max': 'Optional. Maximum budget in rupees (numbers only)',
  'Timeline': 'Required. One of: ZeroToThree, ThreeToSix, SixPlus, Exploring',
  'Source': 'Required. One of: Website, Referral, WalkIn, Call, Other',
  'Notes': 'Optional. Additional notes (max 1000 characters)',
  'Tags': 'Optional. Comma-separated tags',
  'Status': 'Optional. One of: New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped',
} as const;
