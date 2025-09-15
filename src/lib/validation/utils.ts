import { z } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export function validateWithZod<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: formatZodError(error),
      };
    }
    return {
      success: false,
      errors: { _general: ['Validation failed'] },
    };
  }
}

export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    const key = path || '_general';
    
    if (!formattedErrors[key]) {
      formattedErrors[key] = [];
    }
    
    formattedErrors[key].push(err.message);
  });
  
  return formattedErrors;
}

export function safeParseJson<T>(
  json: string,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const parsed = JSON.parse(json);
    return validateWithZod(schema, parsed);
  } catch {
    return {
      success: false,
      errors: { _general: ['Invalid JSON format'] },
    };
  }
}

export function createFieldValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): ValidationResult<T> => {
    return validateWithZod(schema, data);
  };
}

export function createAsyncValidator<T>(
  schema: z.ZodSchema<T>,
  asyncCheck?: (data: T) => Promise<boolean>
) {
  return async (data: unknown): Promise<ValidationResult<T>> => {
    const result = validateWithZod(schema, data);
    
    if (!result.success || !result.data) {
      return result;
    }
    
    if (asyncCheck) {
      const isValid = await asyncCheck(result.data);
      if (!isValid) {
        return {
          success: false,
          errors: { _general: ['Validation failed'] },
        };
      }
    }
    
    return result;
  };
}

