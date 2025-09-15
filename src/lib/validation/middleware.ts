import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateWithZod } from './utils';

export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler?: (req: NextRequest, data: T, ...args: any[]) => Promise<NextResponse>
) {
  if (!handler) {
    return (actualHandler: (req: NextRequest, userId: string, data: T, ...args: any[]) => Promise<NextResponse>) => {
      return async (req: NextRequest, userId: string, ...args: any[]): Promise<NextResponse> => {
        try {
          let body: any;
          
          if (req.method === 'GET') {
            const { searchParams } = new URL(req.url);
            body = Object.fromEntries(searchParams.entries());
            
            Object.keys(body).forEach(key => {
              const value = body[key];
              if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
                body[key] = Number(value);
              }
            });
          } else {
            body = await req.json();
          }

          const validation = validateWithZod(schema, body);
          
          if (!validation.success) {
            return NextResponse.json(
              { 
                error: 'Validation failed', 
                details: validation.errors 
              },
              { status: 400 }
            );
          }

          return await actualHandler(req, userId, validation.data!, ...args);
        } catch (error) {
          console.error('Validation middleware error:', error);
          return NextResponse.json(
            { error: 'Invalid request format' },
            { status: 400 }
          );
        }
      };
    };
  }

  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      let body: any;
      
      if (req.method === 'GET') {
        const { searchParams } = new URL(req.url);
        body = Object.fromEntries(searchParams.entries());
        
        Object.keys(body).forEach(key => {
          const value = body[key];
          if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
            body[key] = Number(value);
          }
        });
      } else {
        body = await req.json();
      }

      const validation = validateWithZod(schema, body);
      
      if (!validation.success) {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: validation.errors 
          },
          { status: 400 }
        );
      }

      return await handler!(req, validation.data!, ...args);
    } catch (error) {
      console.error('Validation middleware error:', error);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
  };
}

export function withAuth(
  handler: (req: NextRequest, userId: string, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const token = req.cookies.get('session-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId;

      if (!userId) {
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        );
      }

      return await handler(req, userId, ...args);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
  };
}

export function withRateLimit(
  requests: number = 10,
  windowMs: number = 60000 // 1 minute
) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return function rateLimitMiddleware(
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const now = Date.now();
      
      const record = requestCounts.get(ip);
      
      if (!record || now > record.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
        return await handler(req);
      }
      
      if (record.count >= requests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      record.count++;
      return await handler(req);
    };
  };
}

export function compose(...middlewares: any[]) {
  return function composedMiddleware(handler: any) {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}

