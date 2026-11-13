import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  X,
  Sparkles,
  ArrowRight,
  Database,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDemoLogin: (role: 'student' | 'faculty') => void;
  onSuccessLogin: (user: any) => void;
  onAdminVerified?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onDemoLogin,
  onSuccessLogin,
  onAdminVerified
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'candidate' | 'sso'>('admin');
  const [adminUsername, setAdminUsername] = useState('admin@123');
  const [adminPassword, setAdminPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin@123' && adminPassword.trim() === 'admin@123') {
      setErrorMsg('');
      if (onAdminVerified) {
        onAdminVerified();
      } else {
        onDemoLogin('faculty');
      }
      onClose();
    } else {
      setErrorMsg('Access denied. Admin credentials must be username: admin@123, pass: admin@123.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginWithGoogle();
      onSuccessLogin(user);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-[#0B132B] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-400/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight">ExamSphere Access</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-400/30 font-semibold">
                  RBAC Gate
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Authorized Academic Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-1.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin Login</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('candidate');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'candidate'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('sso');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sso'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Google SSO</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: ADMIN LOGIN (admin@123 / admin@123) */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-blue-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Admin Privilege Required:</span>
                </div>
                <span>Only verified administrators can <strong>add questions</strong> and <strong>view student performance</strong> records.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Identifier
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin@123"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="admin@123"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-400 font-mono">
                  Default: <code className="text-slate-700 font-bold">admin@123</code> / <code className="text-slate-700 font-bold">admin@123</code>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminUsername('admin@123');
                    setAdminPassword('admin@123');
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-blue-500/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Access Admin Console</span>
              </button>
            </form>
          )}

          {/* TAB 2: CANDIDATE / STUDENT LOGIN */}
          {activeTab === 'candidate' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <span>Candidates may take proctored examinations and review their personal grade sheets. Question authoring and peer records are restricted.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onDemoLogin('student');
                  onClose();
                }}
                className="w-full p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-all group cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Enter as Candidate: Elena Vance
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                      Student
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    ID: CS-2024-8841 · Oxford Computing Faculty
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          )}

          {/* TAB 3: GOOGLE SSO */}
          {activeTab === 'sso' && (
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2.5 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Authenticating...' : 'Sign In with Institutional Google SSO'}</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                User token registered with Firebase Cloud Auth
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 font-mono">
          Security Policy: Admin credentials <span className="font-semibold text-slate-600">admin@123</span> enforced
        </div>
      </div>
    </div>
  );
};
