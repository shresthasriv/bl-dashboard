import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Esahayak - Buyer Lead Management',
  description: 'Professional buyer lead intake and management system for real estate',
  keywords: ['real estate', 'lead management', 'CRM', 'buyer leads'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </div>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}