'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

interface ScheduledSession {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status: 'upcoming' | 'completed' | 'missed';
}

export default function CalendarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch sessions from API
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/sessions?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleScheduleNew = () => {
    router.push('/dashboard/schedule');
  };

  const getSessionsForDate = (date: string) => {
    return sessions.filter(session => session.date === date);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);

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
              <h1 className="text-xl font-bold text-slate-900">Focus Calendar</h1>
            </div>
            <button
              onClick={handleScheduleNew}
              className="bg-[#FF9505] hover:bg-[#E6850A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Schedule New
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Your Schedule</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
                />
              </div>

              {/* Sessions for Selected Date */}
              <div className="space-y-4">
                {selectedDateSessions.length > 0 ? (
                  selectedDateSessions.map((session) => (
                    <div key={session._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{session.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </div>
                          {session.description && (
                            <p className="text-sm text-slate-500">{session.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-slate-400 hover:text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="text-slate-400 hover:text-red-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-500 mb-4">No sessions scheduled for this date</p>
                    <button
                      onClick={handleScheduleNew}
                      className="text-[#FF9505] hover:text-[#E6850A] font-medium"
                    >
                      Schedule a session →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Sessions</span>
                  <span className="font-medium">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {sessions.filter(s => s.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Upcoming</span>
                  <span className="font-medium text-blue-600">
                    {sessions.filter(s => s.status === 'upcoming').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/quick-schedule')}
                  className="w-full text-gray-700 text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-[#FF9505] hover:bg-[#FF9505] hover:text-white transition-all"
                >
                  Quick Schedule
                </button>
                <button
                  onClick={handleScheduleNew}
                  className="w-full text-gray-700 text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-[#FF9505] hover:bg-[#FF9505] hover:text-white transition-all"
                >
                  Full Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
