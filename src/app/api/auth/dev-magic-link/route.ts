import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const latest = await prisma.magicLink.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });

  if (!latest) {
    return NextResponse.json({ error: 'No magic link found' }, { status: 404 });
  }

  const magicLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${latest.token}`;
  return NextResponse.json({ magicLink });
}
