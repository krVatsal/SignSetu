'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [recentSessions, setRecentSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      fetchRecentSessions();
    }
  }, [user, loading, router]);

  const fetchRecentSessions = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/sessions?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Get the 3 most recent sessions
        setRecentSessions(data.sessions.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleScheduleQuietHour = () => {
    router.push('/dashboard/schedule');
  };

  const handleQuickSchedule = () => {
    router.push('/dashboard/quick-schedule');
  };

  const handleViewCalendar = () => {
    router.push('/dashboard/calendar');
  };

  const handleViewStats = () => {
    router.push('/dashboard/analytics');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF9505] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">


      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF9505] to-[#E6850A] rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Welcome to QuietHours, {userName}!
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              You're all set up! Start scheduling your focused work sessions and receive smart notifications to boost your productivity.
            </p>
            <button 
              onClick={handleScheduleQuietHour}
              className="bg-[#FF9505] hover:bg-[#E6850A] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Schedule Your First Quiet Hour
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-[#FF9505] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Schedule</h3>
            <p className="text-slate-600 mb-4">Schedule a focus session for today or tomorrow with just a few clicks.</p>
            <button 
              onClick={handleQuickSchedule}
              className="text-[#FF9505] hover:text-[#E6850A] font-medium text-sm"
            >
              Schedule Now →
            </button>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-[#FF7A00] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Upcoming Sessions</h3>
            <p className="text-slate-600 mb-4">View and manage your scheduled quiet hours for the week.</p>
            <button 
              onClick={handleViewCalendar}
              className="text-[#FF9505] hover:text-[#E6850A] font-medium text-sm"
            >
              View Calendar →
            </button>
          </div>


        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
          {sessionsLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#FF9505] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Loading your sessions...</p>
            </div>
          ) : recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session: any, index: number) => (
                <div key={session._id || index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#FF9505] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{session.title}</h4>
                      <p className="text-sm text-slate-600">
                        {new Date(session.date).toLocaleDateString()} • {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              ))}
              <div className="text-center pt-4">
                <button
                  onClick={handleViewCalendar}
                  className="text-[#FF9505] hover:text-[#E6850A] font-medium text-sm"
                >
                  View all sessions →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500 mb-4">No recent activity. Schedule your first quiet hour to get started!</p>
              <button
                onClick={handleScheduleQuietHour}
                className="text-[#FF9505] hover:text-[#E6850A] font-medium"
              >
                Schedule now →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
