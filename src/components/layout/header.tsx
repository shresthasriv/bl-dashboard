import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { UserNav } from '@/components/auth/user-nav';

export async function Header() {
  const user = await getSession();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Esahayak
            </Link>
            {user && (
              <nav className="ml-10 flex space-x-8">
                <Link
                  href="/buyers"
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Buyers
                </Link>
                <Link
                  href="/buyers/new"
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Add Lead
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <UserNav user={user} />
            ) : (
              <Link
                href="/auth/signin"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}