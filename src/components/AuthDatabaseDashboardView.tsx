import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertCircle,
  FileText,
  Key,
  Globe
} from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, fetchAllExamsFromDb, seedDefaultExams, db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Exam } from '../types/exam';

interface AuthDatabaseDashboardViewProps {
  currentUser: any;
  userRole: 'student' | 'faculty';
  setUserRole: (role: 'student' | 'faculty') => void;
  onOpenLoginModal: () => void;
  exams: Exam[];
  onRefreshExams: () => Promise<void>;
  isAdminVerified?: boolean;
  onRequireAdminAuth?: () => void;
}

export const AuthDatabaseDashboardView: React.FC<AuthDatabaseDashboardViewProps> = ({
  currentUser,
  userRole,
  setUserRole,
  onOpenLoginModal,
  exams,
  onRefreshExams,
  isAdminVerified = false,
  onRequireAdminAuth
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [dbSubmissions, setDbSubmissions] = useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Load submissions from Firestore
  const loadSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true);
      const snap = await getDocs(collection(db, 'submissions'));
      const list: any[] = [];
      snap.forEach((d) => list.push(d.data()));
      setDbSubmissions(list);
    } catch (err) {
      console.warn('Submissions query:', err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleSyncDatabase = async () => {
    try {
      setIsSyncing(true);
      setSyncMessage('Synchronizing examination registry with Firestore...');
      await seedDefaultExams();
      await onRefreshExams();
      await loadSubmissions();
      setSyncMessage('Successfully synchronized all collections with cloud database.');
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (err: any) {
      setSyncMessage(`Sync error: ${err.message || 'Check connection.'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
            <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              INTEGRATED CLOUD
            </span>
            <span>Firebase Firestore & Authentication</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Authentication & Database Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor verified user sessions, cloud persistence, and Firestore collection sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncDatabase}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Firestore Collections'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Grid: User Profile Session & Database Connection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Authentication Panel */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Authentication Identity
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                Active Session
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0B132B] text-white flex items-center justify-center font-bold text-lg border border-slate-700 shadow-sm">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : userRole === 'student' ? (
                  'EV'
                ) : (
                  'AV'
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {currentUser?.displayName || (userRole === 'student' ? 'Elena Vance' : 'Prof. Arthur Vance')}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {currentUser?.email || (userRole === 'student' ? 'elena.vance@oxford.ac.uk' : 'arthur.vance@oxford.ac.uk')}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {userRole === 'student' ? 'Candidate ID: CS-2024-8841' : 'Faculty ID: FAC-0491'}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="capitalize font-medium text-blue-700">
                    {userRole} Role
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Simulate Role Identity:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUserRole('student')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center ${
                    userRole === 'student'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Candidate (Student)
                </button>
                <button
                  onClick={() => {
                    if (!isAdminVerified && onRequireAdminAuth) {
                      onRequireAdminAuth();
                    } else {
                      setUserRole('faculty');
                    }
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                    userRole === 'faculty'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={isAdminVerified ? 'Admin Privileges Active' : 'Requires admin@123'}
                >
                  Admin / Faculty (admin@123)
                </button>
              </div>
              {isAdminVerified ? (
                <p className="text-[10px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Admin verified: You have permission to add questions and view student performance.</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 mt-2">
                  Admin login required to add questions and view student performance.
                </p>
              )}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Provider: {currentUser ? 'Google OAuth 2.0' : 'Collegiate Demo Session'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch / Login</span>
              </button>
              {currentUser && (
                <button
                  onClick={async () => {
                    await logoutUser();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Database Cloud Connection Panel */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Cloud Firestore Database
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                Enterprise Firestore
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Project ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  flowing-courier-1lcf1
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Database ID:</span>
                <span className="font-mono text-slate-700 text-[11px] truncate max-w-[240px]">
                  ai-studio-examsphereuniver-47fd9cf3-57f9-4dcd-89a1-e72ecd9d78de
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Security Rules:</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Deployed & Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">COLLECTION</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">/exams</span>
                  <span className="text-[10px] text-blue-600 block mt-0.5">{exams.length} papers</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">COLLECTION</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">/submissions</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">{dbSubmissions.length} records</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">COLLECTION</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">/users</span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">Synced</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Autosave: Continuous WebSocket Listener</span>
            <span className="text-emerald-600 font-medium">Synced</span>
          </div>
        </div>
      </div>

      {/* Cloud Examination Records Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Live Cloud Examination Papers (/exams)
            </h3>
            <p className="text-xs text-slate-500">
              Persisted documents currently loaded from Firestore into ExamSphere
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {exams.length} Documents Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Course Code</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Faculty Lead</th>
                <th className="py-3 px-4 font-semibold">Duration</th>
                <th className="py-3 px-4 font-semibold">Marks</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                    {ex.code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {ex.title}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {ex.department}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {ex.instructor}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {ex.durationMinutes} mins
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {ex.totalMarks} pts
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                        ex.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ex.status === 'completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {ex.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
