import { NextRequest, NextResponse } from 'next/server';
import { generateMagicLink } from '@/lib/auth';
import { authSchema } from '@/lib/validation';
import { withValidation, withRateLimit, compose } from '@/lib/validation/middleware';
import { sendMagicLinkEmail } from '@/lib/email';

async function signInHandler(req: NextRequest, data: { email: string }) {
  const magicLink = await generateMagicLink(data.email);

  if (process.env.RESEND_API_KEY) {
    try {
      await sendMagicLinkEmail(data.email, magicLink);
    } catch (err) {
      console.error('Email send failed:', err);
      // Do not reveal email provider errors to client
    }
  } else if (process.env.NODE_ENV !== 'production') {
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
