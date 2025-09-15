import { NextRequest, NextResponse } from 'next/server';
import { generateMagicLink } from '@/lib/auth';
import { authSchema } from '@/lib/validation';
import { withValidation, withRateLimit, compose } from '@/lib/validation/middleware';

async function signInHandler(req: NextRequest, data: { email: string }) {
  const magicLink = await generateMagicLink(data.email);

  if (process.env.NODE_ENV === 'development') {
    console.log(`Magic link for ${data.email}: ${magicLink}`);
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Magic link sent to your email' 
  });
}

export const POST = compose(
  withRateLimit(5, 60000), // 5 requests per minute
  withValidation(authSchema)
)(signInHandler);
