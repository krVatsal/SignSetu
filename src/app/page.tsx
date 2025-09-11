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

  const handleSocialClick = (platform: string) => {
    alert(`Opening ${platform} page... (Social media links will be implemented later)`);
  };

  const handleFooterLinkClick = (link: string) => {
    alert(`Opening ${link} page... (This will be implemented later)`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Focus better with</span>{' '}
                  <span className="block text-[#FF9505] xl:inline">scheduled quiet hours</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Schedule your deep work sessions and receive smart notifications. Never miss a focus block again with our intelligent scheduling system.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button 
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF9505] hover:bg-[#E6850A] md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Start scheduling
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button 
                      onClick={handleLearnMore}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#FF9505] bg-orange-50 hover:bg-orange-100 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Learn more
                    </button>
                  </div>
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
            
            <div className="text-white text-center relative z-20 px-8">
              <div className="w-28 h-28 bg-white/25 backdrop-blur-sm rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg border border-white/30">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Smart Focus</h3>
              <p className="text-lg font-medium text-white/90 mb-4">Management System</p>
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
          <div className="lg:text-center">
            <h2 className="text-base text-[#FF9505] font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay focused
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
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

              <div className="relative">
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
      <footer className="bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">QuietHours</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Transform your productivity with intelligent focus time management. 
                Schedule distraction-free work sessions and receive smart notifications.
              </p>
              <div className="flex space-x-4">
                <div 
                  onClick={() => handleSocialClick('Twitter')}
                  className="w-10 h-10 bg-[#FF9505] rounded-lg flex items-center justify-center hover:bg-[#E6850A] transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div 
                  onClick={() => handleSocialClick('LinkedIn')}
                  className="w-10 h-10 bg-[#FF7A00] rounded-lg flex items-center justify-center hover:bg-[#E6850A] transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <div 
                  onClick={() => handleSocialClick('GitHub')}
                  className="w-10 h-10 bg-[#FFB366] rounded-lg flex items-center justify-center hover:bg-[#FF9505] transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-3 text-gray-300">
                <li 
                  onClick={() => handleFooterLinkClick('Smart Scheduling')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Smart Scheduling
                </li>
                <li 
                  onClick={() => handleFooterLinkClick('Email Notifications')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Email Notifications
                </li>
                <li 
                  onClick={() => handleFooterLinkClick('Analytics Dashboard')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Analytics Dashboard
                </li>
                <li 
                  onClick={() => handleFooterLinkClick('Team Collaboration')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Team Collaboration
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li 
                  onClick={() => handleFooterLinkClick('Help Center')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Help Center
                </li>
                <li 
                  onClick={() => handleFooterLinkClick('Contact Us')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Contact Us
                </li>
                <li 
                  onClick={() => handleFooterLinkClick('Privacy Policy')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </li>
                <li 
                  onClick={() => handleFooterLinkClick('Terms of Service')}
                  className="hover:text-[#FF9505] transition-colors cursor-pointer"
                >
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 QuietHours. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FF9505]/10 text-[#FF9505] border border-[#FF9505]/20">
                Built with Next.js & Supabase
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
