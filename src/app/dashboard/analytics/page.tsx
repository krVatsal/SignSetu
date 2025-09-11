'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

interface AnalyticsData {
  totalSessions: number;
  completedSessions: number;
  totalFocusTime: number;
  averageSessionLength: number;
  weeklyProgress: number[];
  streakDays: number;
  productivity: {
    thisWeek: number;
    lastWeek: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    // TODO: Replace with actual analytics data fetching
    const mockAnalytics: AnalyticsData = {
      totalSessions: 24,
      completedSessions: 18,
      totalFocusTime: 2160, // minutes
      averageSessionLength: 90, // minutes
      weeklyProgress: [2, 4, 3, 5, 4, 6, 3], // Sessions per day this week
      streakDays: 5,
      productivity: {
        thisWeek: 75,
        lastWeek: 68
      }
    };
    setAnalytics(mockAnalytics);
  }, [timeframe]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCompletionRate = () => {
    if (!analytics) return 0;
    return Math.round((analytics.completedSessions / analytics.totalSessions) * 100);
  };

  const getProductivityChange = () => {
    if (!analytics) return 0;
    return analytics.productivity.thisWeek - analytics.productivity.lastWeek;
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF9505] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-slate-900">Focus Analytics</h1>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Sessions</p>
                <p className="text-2xl font-bold text-slate-900">{analytics.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-[#FF9505] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900">{getCompletionRate()}%</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Focus Time</p>
                <p className="text-2xl font-bold text-slate-900">{formatTime(analytics.totalFocusTime)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current Streak</p>
                <p className="text-2xl font-bold text-slate-900">{analytics.streakDays} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Progress</h3>
            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="flex items-center space-x-4">
                  <span className="w-8 text-sm text-slate-600">{day}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-[#FF9505] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.weeklyProgress[index] / 6) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm text-slate-900 font-medium">
                    {analytics.weeklyProgress[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Productivity Insights</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Average Session</p>
                  <p className="text-sm text-slate-600">{formatTime(analytics.averageSessionLength)}</p>
                </div>
                <div className="text-2xl font-bold text-[#FF9505]">
                  {formatTime(analytics.averageSessionLength)}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Productivity Change</p>
                  <p className="text-sm text-slate-600">vs last week</p>
                </div>
                <div className={`text-2xl font-bold ${getProductivityChange() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {getProductivityChange() >= 0 ? '+' : ''}{getProductivityChange()}%
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#FF9505] to-[#E6850A] rounded-lg text-white">
                <p className="font-medium mb-2">🎯 Goal Progress</p>
                <div className="flex justify-between items-center">
                  <span>Weekly target: 20 sessions</span>
                  <span className="font-bold">{analytics.completedSessions}/20</span>
                </div>
                <div className="mt-2 bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.completedSessions / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">📈 Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Optimal Focus Time</h4>
              <p className="text-sm text-slate-600">Your most productive sessions are 90 minutes long. Consider scheduling longer blocks.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Best Time Slots</h4>
              <p className="text-sm text-slate-600">You complete 85% more sessions when scheduled between 9-11 AM. Try morning blocks!</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Break Patterns</h4>
              <p className="text-sm text-slate-600">Taking 15-minute breaks between sessions improves your completion rate by 23%.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Consistency Goal</h4>
              <p className="text-sm text-slate-600">You're 3 sessions away from your best week! Keep up the momentum.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
