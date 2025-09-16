export interface CSVParseOptions {
  headers?: boolean;
  delimiter?: string;
  quote?: string;
  escape?: string;
}

export function parseCSV(
  text: string, 
  options: CSVParseOptions = {}
): Array<Record<string, string>> {
  const {
    headers = true,
    delimiter = ',',
    quote = '"',
    escape = '"'
  } = options;

  const lines = text.trim().split('\n');
  
  if (lines.length === 0) {
    return [];
  }

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === quote) {
        if (inQuotes && nextChar === quote) {
          // Escaped quote
          current += quote;
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field delimiter
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    result.push(current.trim());
    return result;
  };

  const headerRow = parseLine(lines[0]);
  const dataLines = lines.slice(headers ? 1 : 0);

  if (!headers) {
    return dataLines.map(line => {
      const values = parseLine(line);
      const row: Record<string, string> = {};
      values.forEach((value, index) => {
        row[`column_${index}`] = value;
      });
      return row;
    });
  }

  return dataLines.map(line => {
    const values = parseLine(line);
    const row: Record<string, string> = {};
    
    headerRow.forEach((header, index) => {
      row[header.trim()] = values[index] || '';
    });
    
    return row;
  });
}

export function generateCSV(
  data: Array<Record<string, any>>,
  headers?: string[]
): string {
  if (data.length === 0) {
    return '';
  }

  const actualHeaders = headers || Object.keys(data[0]);
  
  const escapeField = (field: any): string => {
    const str = String(field || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = actualHeaders.map(escapeField).join(',');
  const dataRows = data.map(row => 
    actualHeaders.map(header => escapeField(row[header])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

export const CSV_FIELD_MAPPING = {
  'Full Name': 'fullName',
  'Email': 'email',
  'Phone': 'phone',
  'City': 'city',
  'Property Type': 'propertyType',
  'BHK': 'bhk',
  'Purpose': 'purpose',
  'Budget Min': 'budgetMin',
  'Budget Max': 'budgetMax',
  'Timeline': 'timeline',
  'Source': 'source',
  'Notes': 'notes',
  'Tags': 'tags',
  'Status': 'status',
} as const;

export function mapCSVHeaders(data: Array<Record<string, string>>): Array<Record<string, string>> {
  return data.map(row => {
    const mappedRow: Record<string, string> = {};
    
    Object.entries(row).forEach(([key, value]) => {
      const mappedKey = CSV_FIELD_MAPPING[key as keyof typeof CSV_FIELD_MAPPING] || key;
      mappedRow[mappedKey] = value;
    });
    
    return mappedRow;
  });
}
