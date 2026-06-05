/**
 * /frontend/src/pages/TimeAttendanceModule.tsx
 *
 * Time tracking and attendance management page.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

type AttendanceTab = 'overview' | 'clock' | 'leaves' | 'reports';

const TimeAttendanceModule: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [activeTab, setActiveTab] = useState<AttendanceTab>('overview');
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<Date | null>(null);

  const handleClockAction = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setClockTime(new Date());
    } else {
      setClockedIn(false);
      setClockTime(null);
    }
  };

  const tabs: { id: AttendanceTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'clock', label: 'Clock In/Out', icon: '🕐' },
    { id: 'leaves', label: 'Leave Requests', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      } p-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Time & Attendance</h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Track working hours, manage leave requests, and generate attendance reports.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-900'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'clock' && (
            <div
              className={`rounded-lg border p-12 text-center ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-6xl mb-6">🕐</div>
              <h2 className="text-2xl font-bold mb-2">
                {clockedIn ? 'Currently Clocked In' : 'Not Clocked In'}
              </h2>
              {clockedIn && clockTime && (
                <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Clocked in at {clockTime.toLocaleTimeString()}
                </p>
              )}
              <motion.button
                onClick={handleClockAction}
                className={`mt-4 px-8 py-4 rounded-xl font-bold text-lg transition ${
                  clockedIn
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {clockedIn ? '🔴 Clock Out' : '🟢 Clock In'}
              </motion.button>
            </div>
          )}

          {(activeTab === 'overview' ||
            activeTab === 'leaves' ||
            activeTab === 'reports') && (
            <div
              className={`rounded-lg border p-12 text-center ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <p className="text-4xl mb-4">
                {activeTab === 'overview' ? '📊' : activeTab === 'leaves' ? '📅' : '📈'}
              </p>
              <p className="font-semibold text-lg mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Connect to your attendance backend to view data here.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TimeAttendanceModule;