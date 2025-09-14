import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateMagicLink } from '@/lib/auth';

const signInSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = signInSchema.parse(body);

    const magicLink = await generateMagicLink(email);

    if (process.env.NODE_ENV === 'development') {
      console.log(`Magic link for ${email}: ${magicLink}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Magic link sent to your email' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' }, 
      { status: 400 }
    );
  }
}
