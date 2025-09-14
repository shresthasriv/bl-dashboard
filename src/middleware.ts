import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session-token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/buyers');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/buyers', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/buyers/:path*', '/auth/:path*'],
};