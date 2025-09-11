'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    notifyBefore: '15'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to schedule sessions');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        alert('Quiet hour scheduled successfully!');
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(`Failed to schedule session: ${error.error}`);
      }
    } catch (error) {
      console.error('Error scheduling session:', error);
      alert('Failed to schedule session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-slate-900">Schedule Quiet Hour</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9505] to-[#E6850A] rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Schedule Your Quiet Hour</h2>
            <p className="text-slate-600">Set up a focused work session with smart notifications</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Session Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Deep Work Session, Writing Time, Code Review"
                className="w-full px-4 py-3 border border-slate-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border text-gray-600 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full text-gray-600 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border text-gray-600 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="What will you be working on during this session?"
                className="w-full px-4 py-3 border text-gray-600 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
              />
            </div>

            {/* Notification Settings */}
            <div>
              <label htmlFor="notifyBefore" className="block text-sm font-medium text-slate-700 mb-2">
                Notify me before session starts
              </label>
              <select
                id="notifyBefore"
                name="notifyBefore"
                value={formData.notifyBefore}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border text-gray-600 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
              >
                <option value="5">5 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#FF9505] hover:bg-[#E6850A] disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Quiet Hour'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
