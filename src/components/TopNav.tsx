import React, { useState } from 'react';
import { Search, Bell, Shield, SlidersHorizontal, CheckCircle2, AlertTriangle, X, User as UserIcon, Database } from 'lucide-react';

interface TopNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenQuickDemo: () => void;
  userRole: 'student' | 'faculty';
  onOpenNewExamModal?: () => void;
  currentUser?: any;
  onOpenLoginModal: () => void;
  isAdminVerified?: boolean;
  onRequireAdminAuth?: () => void;
  onOpenAddQuestionModal?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenQuickDemo,
  userRole,
  onOpenNewExamModal,
  currentUser,
  onOpenLoginModal,
  isAdminVerified = false,
  onRequireAdminAuth,
  onOpenAddQuestionModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'CS-301 Examination Room Opened',
      desc: 'Advanced Algorithms portal is now accepting authenticated candidates.',
      time: '12m ago',
      urgent: true
    },
    {
      id: 2,
      title: 'Proctor System Verified',
      desc: 'Webcam stream, microphone, and browser integrity check completed.',
      time: '1h ago',
      urgent: false
    },
    {
      id: 3,
      title: 'Grade Released: CS-204',
      desc: 'Final score 94/100 (Grade A) verified by Examination Committee.',
      time: '1d ago',
      urgent: false
    }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 sticky top-0 z-10">
      {/* Zone 1: Context & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams or course codes..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 2: Term Info */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Fall 2026</span>
        <span aria-hidden="true">·</span>
        <span className="text-emerald-700 font-medium">Online</span>
      </div>

      {/* Zone 3: Actions & Notifications */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-medium text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / SSO Status Button */}
        <button
          onClick={onOpenLoginModal}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : userRole === 'student' ? (
              'EV'
            ) : (
              'AV'
            )}
          </div>
          <span className="font-medium text-slate-700 hidden sm:inline truncate max-w-[100px]">
            {currentUser?.displayName ? currentUser.displayName.split(' ')[0] : userRole === 'student' ? 'Elena' : 'Prof. Arthur'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Firestore Connected"></span>
        </button>

        {/* Primary CTA */}
        {userRole === 'student' ? (
          <button
            onClick={onOpenQuickDemo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 whitespace-nowrap cursor-pointer"
          >
            Start CS-301
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {onOpenAddQuestionModal && (
              <button
                onClick={() => {
                  if (!isAdminVerified && onRequireAdminAuth) {
                    onRequireAdminAuth();
                  } else {
                    onOpenAddQuestionModal();
                  }
                }}
                className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors shadow-xs whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <span>+ Add Question</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!isAdminVerified && onRequireAdminAuth) {
                  onRequireAdminAuth();
                } else if (onOpenNewExamModal) {
                  onOpenNewExamModal();
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 whitespace-nowrap cursor-pointer"
            >
              + New Exam
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
