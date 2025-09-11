'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for a password reset link!');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-slate-900 hover:text-[#FF9505] transition-colors">
              QuietHours
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-semibold text-slate-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600">{message}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-[#FF9505] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9505] hover:bg-[#E6850A] disabled:bg-[#FFB366] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-[#FF9505] focus:ring-offset-2"
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Remember your password?{' '}
              <Link
                href="/auth/signin"
                className="text-[#FF9505] hover:text-[#E6850A] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
