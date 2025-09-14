import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/db';

interface AuthUser {
  id: string;
  email?: string | null;
}

interface AuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface AuthToken {
  sub?: string;
  [key: string]: unknown;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // For development, we'll use a console transport
      ...(process.env.NODE_ENV === 'development' && {
        sendVerificationRequest: async ({ identifier, url }) => {
          console.log('\n=== MAGIC LINK ===');
          console.log(`To: ${identifier}`);
          console.log(`URL: ${url}`);
          console.log('==================\n');
        },
      }),
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session: async ({ session, token }: { session: AuthSession; token: AuthToken }) => {
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ token, user }: { token: AuthToken; user?: AuthUser }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  events: {
    createUser: async ({ user }: { user: AuthUser }) => {
      console.log(`New user created: ${user.email}`);
    },
  },
};
