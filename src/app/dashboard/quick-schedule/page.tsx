'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function QuickSchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState('60');
  const [selectedTime, setSelectedTime] = useState('now');
  const [customTime, setCustomTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ];

  const timeOptions = [
    { value: 'now', label: 'Start now' },
    { value: '15', label: 'In 15 minutes' },
    { value: '30', label: 'In 30 minutes' },
    { value: '60', label: 'In 1 hour' },
    { value: 'custom', label: 'Custom time' }
  ];

  const handleQuickSchedule = async () => {
    if (!user) {
      alert('Please sign in to schedule sessions');
      return;
    }

    setIsScheduling(true);

    try {
      const duration = parseInt(selectedDuration);
      let startTime = new Date();
      
      if (selectedTime === 'now') {
        // Start immediately
      } else if (selectedTime === 'custom') {
        if (!customTime) {
          alert('Please select a custom time');
          setIsScheduling(false);
          return;
        }
        const [hours, minutes] = customTime.split(':');
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        // Add minutes to current time
        startTime.setMinutes(startTime.getMinutes() + parseInt(selectedTime));
      }

      const endTime = new Date(startTime.getTime() + duration * 60000);

      const sessionData = {
        title: `Quick Focus Session (${selectedDuration} min)`,
        date: startTime.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        description: 'Quick scheduled focus session',
        notifyBefore: 15,
        userId: user.id
      };

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        alert(`Scheduled ${selectedDuration} minute focus session!`);
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(`Failed to schedule session: ${error.error}`);
      }
    } catch (error) {
      console.error('Error scheduling session:', error);
      alert('Failed to schedule session. Please try again.');
    } finally {
      setIsScheduling(false);
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
              <h1 className="text-xl font-bold text-slate-900">Quick Schedule</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9505] to-[#E6850A] rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Focus Session</h2>
            <p className="text-slate-600">Get into focus mode with just a few clicks</p>
          </div>

          {/* Duration Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">How long do you want to focus?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedDuration === duration.value
                      ? 'border-[#FF9505] bg-[#FF9505] text-white'
                      : 'border-slate-200 hover:border-[#FF9505] text-slate-700'
                  }`}
                >
                  <div className="font-medium">{duration.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">When do you want to start?</h3>
            <div className="space-y-3">
              {timeOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="startTime"
                    value={option.value}
                    checked={selectedTime === option.value}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-4 h-4 text-[#FF9505] border-slate-300 focus:ring-[#FF9505]"
                  />
                  <span className="text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Custom Time Input */}
            {selectedTime === 'custom' && (
              <div className="mt-4 ml-7">
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9505] focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Session Preview */}
          <div className="bg-slate-50 rounded-lg p-4 mb-8">
            <h4 className="font-medium text-slate-900 mb-2">Session Preview</h4>
            <div className="text-sm text-slate-600 space-y-1">
              <div>Duration: {selectedDuration} minutes</div>
              <div>
                Start: {selectedTime === 'now' ? 'Immediately' : 
                       selectedTime === 'custom' ? (customTime || 'Select time') :
                       `In ${selectedTime} minutes`}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleQuickSchedule}
              disabled={isScheduling}
              className="flex-1 bg-[#FF9505] hover:bg-[#E6850A] disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isScheduling ? 'Scheduling...' : 'Start Focus Session'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
