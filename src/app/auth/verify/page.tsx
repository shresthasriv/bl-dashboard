'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setError('No verification token provided');
      setTimeout(() => router.push('/auth/signin?error=invalid'), 2000);
      return;
    }

    // Call the verification API
    fetch(`/api/auth/verify?token=${token}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(async (response) => {
      if (response.redirected) {
        // API route redirected, follow the redirect
        window.location.href = response.url;
        return;
      }
      
      if (response.ok) {
        setStatus('success');
        setTimeout(() => router.push('/buyers'), 1000);
      } else {
        const result = await response.json().catch(() => ({}));
        setStatus('error');
        setError(result.error || 'Verification failed');
        setTimeout(() => router.push('/auth/signin?error=expired'), 2000);
      }
    })
    .catch((err) => {
      console.error('Verification error:', err);
      setStatus('error');
      setError('Network error during verification');
      setTimeout(() => router.push('/auth/signin?error=server'), 2000);
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verifying your email...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we verify your magic link.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verification successful!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting to your dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verification failed
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {error || 'Something went wrong. Redirecting to sign in...'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
