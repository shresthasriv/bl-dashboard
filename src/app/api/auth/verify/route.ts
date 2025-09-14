import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink, createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin?error=invalid', request.url));
  }

  try {
    const user = await verifyMagicLink(token);

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin?error=expired', request.url));
    }

    const sessionToken = await createSession(user);
    
    const response = NextResponse.redirect(new URL('/buyers', request.url));
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/signin?error=server', request.url));
  }
}
