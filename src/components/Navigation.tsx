'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    router.push('/auth/signin');
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    router.push('/dashboard');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                onClick={handleLogoClick}
                className="text-xl font-bold text-slate-900 cursor-pointer hover:text-[#FF9505] transition-colors"
              >
                QuietHours
              </h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600 max-w-48 truncate">
                  Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}!
                </span>
                <button 
                  onClick={handleDashboard}
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF9505] transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200 shadow-lg">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-600 border-b border-slate-100">
                  Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}!
                </div>
                <button 
                  onClick={handleDashboard}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleSignIn}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="block w-full text-left px-3 py-2 text-base font-medium bg-[#FF9505] text-white hover:bg-[#E6850A] rounded-lg mx-3 mt-2 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
