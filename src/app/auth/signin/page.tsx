import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SignInForm } from '@/components/auth/signin-form';

export default async function SignInPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const params = await searchParams;
  const user = await getSession();
  
  if (user) {
    redirect('/buyers');
  }

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case 'invalid':
        return 'Invalid or missing verification token.';
      case 'expired':
        return 'Verification link has expired. Please request a new one.';
      case 'server':
        return 'Server error occurred. Please try again.';
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Esahayak
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a magic link
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        )}

        <SignInForm />
      </div>
    </div>
  );
}