import jwt from 'jsonwebtoken';
import crypto from 'crypto-js';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const SESSION_COOKIE = 'session-token';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function generateMagicLink(email: string): Promise<string> {
  const token = crypto.lib.WordArray.random(32).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.magicLink.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;
}

export async function verifyMagicLink(token: string): Promise<User | null> {
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
  });

  if (!magicLink || magicLink.expires < new Date()) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { email: magicLink.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: magicLink.email,
      },
    });
  }

  await prisma.magicLink.delete({
    where: { token },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name || undefined,
  };
}

export async function createSession(user: User): Promise<string> {
  const sessionToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return sessionToken;
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    jwt.verify(token, JWT_SECRET);
    
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || undefined,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function deleteSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      });
    }
  } catch {
    // Ignore errors
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
