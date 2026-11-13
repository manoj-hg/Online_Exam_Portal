import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Award,
  ShieldCheck,
  BookOpen,
  Calendar,
  LogOut,
  GraduationCap,
  Sparkles,
  Users,
  Network,
  Database,
  LogIn,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: 'student' | 'faculty';
  setUserRole: (role: 'student' | 'faculty') => void;
  onOpenRules: () => void;
  currentUser?: any;
  onOpenLoginModal: () => void;
  onSignOut?: () => void;
  isAdminVerified: boolean;
  onRequireAdminAuth: () => void;
  onOpenAddQuestionModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  onOpenRules,
  currentUser,
  onOpenLoginModal,
  onSignOut,
  isAdminVerified,
  onRequireAdminAuth,
  onOpenAddQuestionModal
}) => {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'active_exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'auth_db', label: 'Cloud Sync', icon: Database },
  ];

  const facultyNavItems = [
    { id: 'dashboard', label: 'Exams', icon: LayoutDashboard },
    { id: 'proctor', label: 'Live Proctoring', icon: ShieldCheck },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'results', label: 'Grading', icon: Award },
    { id: 'auth_db', label: 'Cloud Sync', icon: Database },
  ];

  const navItems = userRole === 'student' ? studentNavItems : facultyNavItems;

  const handleSwitchToFaculty = () => {
    if (!isAdminVerified) {
      onRequireAdminAuth();
    } else {
      setUserRole('faculty');
    }
  };

  return (
    <aside className="w-68 bg-[#0B132B] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800/80 z-20 select-none">
      {/* Brand & Crest */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-400/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">ExamSphere</span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-normal">
              Online Exam Portal
            </p>
          </div>
        </div>

        {/* Role Switcher Pill Bar */}
        <div className="px-5 pt-4 pb-2">
          <div className="p-1 bg-[#152042] rounded-lg border border-slate-700/60 flex items-center">
            <button
              onClick={() => setUserRole('student')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                userRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={handleSwitchToFaculty}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                userRole === 'faculty'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isAdminVerified ? 'Admin / Faculty Mode' : 'Admin Login Required (admin@123)'}
            >
              Admin
            </button>
          </div>
          {userRole === 'faculty' && isAdminVerified && (
            <span className="text-[10px] text-emerald-400 font-mono block text-center mt-1">
              ✓ Admin Verified
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {userRole === 'student' ? 'Menu' : 'Admin Menu'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-[#152042] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {userRole === 'faculty' && onOpenAddQuestionModal && (
            <button
              onClick={onOpenAddQuestionModal}
              className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/40 hover:text-white transition-colors text-left cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">Add Question</span>
            </button>
          )}

          <div className="pt-4 px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Resources
          </div>

          <button
            onClick={() => setCurrentTab('diagrams')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
              currentTab === 'diagrams'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-300 hover:bg-[#152042] hover:text-white'
            }`}
          >
            <Network className={`w-4 h-4 shrink-0 ${currentTab === 'diagrams' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span className="truncate">Use Case Diagram</span>
          </button>

          <button
            onClick={onOpenRules}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#152042] hover:text-white transition-colors text-left"
          >
            <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Exam Instructions</span>
          </button>
        </nav>
      </div>

      {/* User Information & Session Card */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0E172E]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-xs font-semibold text-white overflow-hidden">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : userRole === 'student' ? (
              'EV'
            ) : (
              'AV'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser?.displayName || (userRole === 'student' ? 'Elena Vance' : 'Prof. Arthur Vance')}
            </p>
            <p className="text-[11px] text-slate-400 truncate font-mono">
              {currentUser?.email ? currentUser.email : userRole === 'student' ? 'ID: CS-2024-8841' : 'ID: FAC-0491'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
          <button
            onClick={onOpenLoginModal}
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3 h-3" />
            <span>Switch</span>
          </button>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-slate-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
