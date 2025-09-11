'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-6 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="block xl:inline">Focus better with</span>{' '}
                  <span className="block text-[#FF9505] xl:inline">scheduled quiet hours</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Schedule your deep work sessions and receive smart notifications. Never miss a focus block again with our intelligent scheduling system.
                </p>
                <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF9505] hover:bg-[#E6850A] md:py-4 md:text-lg md:px-8 transition-colors"
                  >
                    Start scheduling
                  </button>
                  <button 
                    onClick={handleLearnMore}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#FF9505] bg-orange-50 hover:bg-orange-100 md:py-4 md:text-lg md:px-8 transition-colors"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-[#FF9505] via-[#FF8000] to-[#E6850A] sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white rounded-lg rotate-45"></div>
            </div>
            
            <div className="text-white text-center relative z-20 px-4 sm:px-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white/25 backdrop-blur-sm rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg border border-white/30">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Smart Focus</h3>
              <p className="text-base sm:text-lg font-medium text-white/90 mb-2 sm:mb-4">Management System</p>
              <p className="text-sm text-white/80 max-w-xs mx-auto leading-relaxed">
                Intelligent scheduling that adapts to your productivity patterns and prevents conflicts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-center">
            <h2 className="text-base text-[#FF9505] font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-2xl sm:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Everything you need to stay focused
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#FF9505] text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Scheduling</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  AI-powered scheduling that prevents conflicts and optimizes your focus time based on your patterns.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#FF9505] text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l4.95 4.95-1.414 1.414L3.414 8.414A2 2 0 013.414 6L7 2.414A2 2 0 019.414 2.414l1.414 1.414L6.242 8.414z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Instant Notifications</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Get timely reminders via email 10 minutes before your focus session begins.
                </p>
              </div>

              <div className="relative md:col-span-2 lg:col-span-1">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#FF9505] text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Progress Analytics</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Track your focus sessions and see detailed analytics about your productivity patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#FF9505]">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your productivity?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-orange-100">
            Join thousands of professionals who have improved their focus with QuietHours.
          </p>
          <button 
            onClick={handleGetStarted}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#FF9505] bg-white hover:bg-orange-50 sm:w-auto transition-colors"
          >
            Get started for free
          </button>
        </div>
      </section>

      {/* Footer */}
            {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <span className="text-lg font-bold text-white">Quiet Hours</span>
              <p className="mt-1 text-sm text-gray-400">Focus. Schedule. Achieve.</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-400">
                © 2024 Quiet Hours Scheduler. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
