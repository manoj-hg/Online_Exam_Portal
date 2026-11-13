import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  KeyRound,
  AlertCircle,
  ArrowRight,
  Clock,
  Database,
  BookCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

export interface AuthenticatedPortalUser {
  uid: string;
  displayName: string;
  email: string;
  candidateId: string;
  department: string;
  role: 'student' | 'faculty';
  isAdmin?: boolean;
  photoURL?: string | null;
}

interface LoginPortalViewProps {
  onLoginSuccess: (user: AuthenticatedPortalUser) => void;
  cachedFirebaseUser?: any;
}

const VALID_CANDIDATES: Record<
  string,
  { id: string; name: string; email: string; department: string; pass: string }
> = {
  'cs-2024-8841': {
    id: 'CS-2024-8841',
    name: 'Elena Vance',
    email: 'e.vance@oxford.edu',
    department: 'Computer Science',
    pass: 'student@123'
  },
  'e.vance@oxford.edu': {
    id: 'CS-2024-8841',
    name: 'Elena Vance',
    email: 'e.vance@oxford.edu',
    department: 'Computer Science',
    pass: 'student@123'
  },
  'cs-2024-8842': {
    id: 'CS-2024-8842',
    name: 'Marcus Thorne',
    email: 'm.thorne@oxford.edu',
    department: 'Computer Science',
    pass: 'student@123'
  },
  'cs-2024-8844': {
    id: 'CS-2024-8844',
    name: 'David Zhang',
    email: 'd.zhang@oxford.edu',
    department: 'Computer Science',
    pass: 'student@123'
  }
};

export const LoginPortalView: React.FC<LoginPortalViewProps> = ({
  onLoginSuccess,
  cachedFirebaseUser
}) => {
  const [loginMode, setLoginMode] = useState<'student' | 'admin' | 'google'>('student');

  const [studentIdentifier, setStudentIdentifier] = useState('CS-2024-8841');
  const [studentPassword, setStudentPassword] = useState('student@123');
  const [showStudentPass, setShowStudentPass] = useState(false);

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const key = studentIdentifier.trim().toLowerCase();
    const record = VALID_CANDIDATES[key];

    if (!record || studentPassword.trim() !== record.pass) {
      setErrorMsg('Invalid ID or password. Demo: CS-2024-8841 / student@123');
      return;
    }

    onLoginSuccess({
      uid: `student-${record.id.toLowerCase()}`,
      displayName: record.name,
      email: record.email,
      candidateId: record.id,
      department: record.department,
      role: 'student',
      isAdmin: false
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (adminUsername.trim() === 'admin@123' && adminPassword.trim() === 'admin@123') {
      onLoginSuccess({
        uid: 'admin-123',
        displayName: 'Prof. Arthur Vance',
        email: 'admin@123',
        candidateId: 'FAC-0491',
        department: 'Computer Science',
        role: 'faculty',
        isAdmin: true
      });
    } else {
      setErrorMsg('Invalid credentials. Use admin@123 / admin@123.');
    }
  };

  const handleGoogleSSO = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const firebaseUser = await loginWithGoogle();
      const isFaculty = firebaseUser.email?.toLowerCase().includes('faculty') ?? false;
      onLoginSuccess({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Oxford Scholar',
        email: firebaseUser.email || '',
        candidateId: isFaculty
          ? 'FAC-SSO'
          : `CS-2024-${firebaseUser.uid.substring(0, 4).toUpperCase()}`,
        department: 'Computer Science',
        role: isFaculty ? 'faculty' : 'student',
        isAdmin: false,
        photoURL: firebaseUser.photoURL
      });
    } catch (err: any) {
      console.error('Google SSO failed:', err);
      setErrorMsg(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-12 font-sans">
      {/* Left Panel: Clean Institutional Identity */}
      <aside className="lg:col-span-5 bg-[#0B132B] text-white p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight block">ExamSphere</span>
              <span className="text-xs text-slate-400">University Examination Portal</span>
            </div>
          </div>

          <div className="mt-12 max-w-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Simple, secure online exams.
            </h1>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Sign in to take scheduled tests, track results, or manage questions and grading.
            </p>
          </div>

          <div className="mt-10 space-y-4 max-w-sm border-t border-slate-800 pt-8 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Timed tests with auto-submit</span>
            </div>
            <div className="flex items-center gap-3">
              <BookCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>MCQ auto-grading & written reviews</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Automatic answer saving</span>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-400">
          Oxford Collegiate Assessment System
        </div>
      </aside>

      {/* Right Panel: Focused Login Card */}
      <main className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:px-8 sm:pt-8 pb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Choose your account type to continue.</p>

            {/* Role Tabs */}
            <div className="mt-5 p-1 bg-slate-100 rounded-lg flex items-center gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('student');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'student'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('google');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'google'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Google</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STUDENT FORM */}
            {loginMode === 'student' && (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Student ID or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      placeholder="CS-2024-8841"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showStudentPass ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPass((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      aria-label={showStudentPass ? 'Hide password' : 'Show password'}
                    >
                      {showStudentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">CS-2024-8841 / student@123</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentIdentifier('CS-2024-8841');
                      setStudentPassword('student@123');
                      setErrorMsg('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
                  >
                    Quick Fill
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ADMIN FORM */}
            {loginMode === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin@123"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      aria-label={showAdminPass ? 'Hide password' : 'Show password'}
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">admin@123 / admin@123</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsername('admin@123');
                      setAdminPassword('admin@123');
                      setErrorMsg('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
                  >
                    Quick Fill
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* GOOGLE SSO */}
            {loginMode === 'google' && (
              <div className="space-y-4">
                {cachedFirebaseUser && (
                  <button
                    type="button"
                    onClick={() => {
                      const isFaculty = cachedFirebaseUser.email?.toLowerCase().includes('faculty') ?? false;
                      onLoginSuccess({
                        uid: cachedFirebaseUser.uid,
                        displayName: cachedFirebaseUser.displayName || 'Oxford Scholar',
                        email: cachedFirebaseUser.email || '',
                        candidateId: isFaculty
                          ? 'FAC-SSO'
                          : `CS-2024-${cachedFirebaseUser.uid.substring(0, 4).toUpperCase()}`,
                        department: 'Computer Science',
                        role: isFaculty ? 'faculty' : 'student',
                        isAdmin: false,
                        photoURL: cachedFirebaseUser.photoURL
                      });
                    }}
                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-900 block truncate">
                        Continue as {cachedFirebaseUser.displayName || cachedFirebaseUser.email}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono block truncate">
                        {cachedFirebaseUser.email}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleGoogleSSO}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
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
                  <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
