'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type AuthData } from '@/lib/validation';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthData) => {
    setIsLoading(true);
    setDevLink(null);
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        if (process.env.NODE_ENV !== 'production') {
          // Dev-only endpoint to retrieve magic link without email
          const res = await fetch(`/api/auth/dev-magic-link?email=${encodeURIComponent(data.email)}`);
          if (res.ok) {
            const { magicLink } = await res.json();
            setDevLink(magicLink);
          }
        }
      } else {
        console.error('Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-3">
        <div className="rounded-md bg-green-50 p-4">
          <div className="text-sm text-green-700">
            Check your email for a magic link to sign in.
          </div>
        </div>
        {process.env.NODE_ENV !== 'production' && devLink && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="text-sm text-blue-700">
              Development: 
              <button
                type="button"
                onClick={() => { window.location.href = devLink; }}
                className="underline font-medium"
              >
                Click here to login
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          required
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send magic link'}
        </button>
      </div>
    </form>
  );
}