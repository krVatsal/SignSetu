'use client';

import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();

  const handleSignIn = () => {
    // For now, show an alert. Later this will navigate to auth/signin
    alert('Redirecting to sign in page... (This will be implemented with authentication)');
    // router.push('/auth/signin');
  };

  const handleGetStarted = () => {
    // For now, show an alert. Later this will navigate to auth/signup
    alert('Redirecting to sign up page... (This will be implemented with authentication)');
    // router.push('/auth/signup');
  };

  const handleLogoClick = () => {
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
          </div>
        </div>
      </div>
    </nav>
  );
}
