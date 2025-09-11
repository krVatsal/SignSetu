'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <h1 
                onClick={handleLogoClick}
                className="text-xl font-bold text-slate-900 cursor-pointer hover:text-[#FF9505] transition-colors"
              >
                QuietHours
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600">
                  Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}!
                </span>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleSignOut}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleSignIn}
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="bg-[#FF9505] hover:bg-[#E6850A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
