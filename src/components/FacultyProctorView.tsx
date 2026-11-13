import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  Video,
  Clock,
  Radio,
  Send,
  CheckCircle,
  Eye,
  RefreshCw,
  FileText,
  Award,
  BookOpen,
  UserCheck,
  UserPlus,
  Settings,
  Activity,
  Database,
  Search,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { MOCK_PROCTOR_SESSIONS } from '../data/mockExams';
import { ProctorStudentSession } from '../types/exam';

interface SubmissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  examCode: string;
  submittedAt: string;
  objectiveScore: number;
  objectiveTotal: number;
  descriptiveScore?: number;
  descriptiveMax: number;
  descriptiveGraded: boolean;
  descriptiveAnswerText: string;
  examinerNotes?: string;
  isPublished: boolean;
  finalScore?: number;
  finalGrade?: string;
}

const INITIAL_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'sub-1',
    studentId: 'CS-2024-8841',
    studentName: 'Elena Vance',
    examCode: 'CS-301',
    submittedAt: 'Today, 10:45 AM',
    objectiveScore: 92,
    objectiveTotal: 100,
    descriptiveScore: undefined,
    descriptiveMax: 15,
    descriptiveGraded: false,
    descriptiveAnswerText:
      'We use the Bellman-Ford algorithm with |V|-1 edge relaxation passes. The invariant ensures dist[v] is minimal for paths of length ≤ k. On the |V|-th pass, if any dist[u] + w(u,v) < dist[v], a reachable negative cycle exists. Time complexity: O(V·E), Space complexity: O(V).',
    isPublished: false
  },
  {
    id: 'sub-2',
    studentId: 'CS-2024-8844',
    studentName: 'David Zhang',
    examCode: 'CS-301',
    submittedAt: 'Today, 11:15 AM',
    objectiveScore: 84,
    objectiveTotal: 100,
    descriptiveScore: 13,
    descriptiveMax: 15,
    descriptiveGraded: true,
    descriptiveAnswerText:
      'Bellman Ford cycle detection: Run relaxation |V|-1 times. An extra relaxation pass checks if weights decrease. If yes, negative cycle exists. Complexity: O(VE) time and O(V) memory.',
    examinerNotes: 'Rigorous proof of relaxation invariant. Full credit awarded for asymptotic analysis.',
    isPublished: true,
    finalScore: 97,
    finalGrade: 'A+'
  },
  {
    id: 'sub-3',
    studentId: 'CS-2024-8849',
    studentName: 'Sophia Miller',
    examCode: 'CS-301',
    submittedAt: 'Today, 11:40 AM',
    objectiveScore: 78,
    objectiveTotal: 100,
    descriptiveScore: undefined,
    descriptiveMax: 15,
    descriptiveGraded: false,
    descriptiveAnswerText:
      'Shortest path can be computed with Dijkstra if no negative weights, but for negative cycles we must use Bellman Ford. If dist decreases in the V-th step, a cycle exists. Complexity is O(V*E).',
    isPublished: false
  }
];

interface StudentAccount {
  id: string;
  name: string;
  email: string;
  department: string;
  enrollmentYear: number;
  status: 'active' | 'suspended';
}

const INITIAL_STUDENTS: StudentAccount[] = [
  { id: 'CS-2024-8841', name: 'Elena Vance', email: 'e.vance@oxford.edu', department: 'Computer Science', enrollmentYear: 2024, status: 'active' },
  { id: 'CS-2024-8842', name: 'Marcus Thorne', email: 'm.thorne@oxford.edu', department: 'Computer Science', enrollmentYear: 2024, status: 'active' },
  { id: 'CS-2024-8843', name: 'Aisha Al-Mansoor', email: 'a.almansoor@oxford.edu', department: 'Computer Science', enrollmentYear: 2024, status: 'active' },
  { id: 'CS-2024-8844', name: 'David Zhang', email: 'd.zhang@oxford.edu', department: 'Computer Science', enrollmentYear: 2023, status: 'active' },
  { id: 'CS-2024-8849', name: 'Sophia Miller', email: 's.miller@oxford.edu', department: 'Computer Science', enrollmentYear: 2024, status: 'active' }
];

interface FacultyAccount {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  specialization: string;
}

const INITIAL_FACULTY: FacultyAccount[] = [
  { id: 'FAC-101', name: 'Prof. Arthur Vance', email: 'a.vance@oxford.edu', department: 'Computer Science', role: 'Chair of TCS', specialization: 'Algorithms & Complexity' },
  { id: 'FAC-102', name: 'Prof. Helena Rostova', email: 'h.rostova@oxford.edu', department: 'Mathematics', role: 'Professor of Pure Maths', specialization: 'Linear Algebra & Topology' },
  { id: 'FAC-103', name: 'Dr. Julian Sterling', email: 'j.sterling@oxford.edu', department: 'Electrical Engineering', role: 'Associate Professor', specialization: 'Signals & Systems' }
];

interface SystemActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'auth' | 'submission' | 'grading' | 'security';
  details: string;
}

const INITIAL_LOGS: SystemActivityLog[] = [
  { id: 'log-1', timestamp: '11:42:15', actor: 'Sophia Miller (CS-2024-8849)', action: 'Final Submission Recorded', category: 'submission', details: 'Validated submission, 15 MCQs + 1 Descriptive response' },
  { id: 'log-2', timestamp: '11:38:00', actor: 'System Auto-Save', action: 'Draft Answers Synchronized', category: 'submission', details: 'Continuous auto-save synced 16 questions to cloud Firestore' },
  { id: 'log-3', timestamp: '11:22:10', actor: 'Prof. Arthur Vance', action: 'Descriptive Graded & Published', category: 'grading', details: 'Awarded 13/15 marks to David Zhang for CS-301 Descriptive Proof' },
  { id: 'log-4', timestamp: '10:48:30', actor: 'Administrator (admin@123)', action: 'Admin Authorized', category: 'auth', details: 'Privileged admin session verified for question authoring & performance audits' },
  { id: 'log-5', timestamp: '10:14:02', actor: 'Marcus Thorne (CS-2024-8842)', action: 'Invigilation Warning Logged', category: 'security', details: 'Window diverted briefly; invigilator flag cleared after webcam confirmation' }
];

interface FacultyProctorViewProps {
  onOpenAddQuestionModal?: () => void;
}

export const FacultyProctorView: React.FC<FacultyProctorViewProps> = ({
  onOpenAddQuestionModal
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'proctor' | 'submissions' | 'admin'>('proctor');

  // Proctor state
  const [sessions, setSessions] = useState<ProctorStudentSession[]>(MOCK_PROCTOR_SESSIONS);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ProctorStudentSession | null>(null);

  // Submissions & Descriptive evaluation state
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(INITIAL_SUBMISSIONS);
  const [gradingSubmission, setGradingSubmission] = useState<SubmissionRecord | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(14);
  const [examinerNotesInput, setExaminerNotesInput] = useState<string>('Strong mathematical justification of the relaxation invariant.');

  // Admin Management state
  const [adminSubTab, setAdminSubTab] = useState<'students' | 'faculty' | 'roles' | 'activities' | 'statistics'>('students');
  const [students, setStudents] = useState<StudentAccount[]>(INITIAL_STUDENTS);
  const [faculty, setFaculty] = useState<FacultyAccount[]>(INITIAL_FACULTY);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);

  // New Student form state
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science');

  // New Faculty form state
  const [newFacultyId, setNewFacultyId] = useState('');
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyDept, setNewFacultyDept] = useState('Computer Science');
  const [newFacultyRole, setNewFacultyRole] = useState('Assistant Professor');

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementSent(false);
      setAnnouncementText('');
    }, 3000);
  };

  const handleExtendStudentTime = (studentId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, timeRemainingMinutes: s.timeRemainingMinutes + 10 }
          : s
      )
    );
  };

  // Activity Diagram: Review and Grade Descriptive Answers -> Calculate Final Marks -> Publish Results
  const handleSaveDescriptiveGrade = () => {
    if (!gradingSubmission) return;

    const awarded = Math.min(gradingSubmission.descriptiveMax, Math.max(0, gradeInput));
    const totalScore = gradingSubmission.objectiveScore + awarded;
    const maxScore = gradingSubmission.objectiveTotal + gradingSubmission.descriptiveMax;
    const percent = Math.round((totalScore / maxScore) * 100);
    const grade = percent >= 90 ? 'A+' : percent >= 80 ? 'A' : percent >= 70 ? 'B' : 'C';

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === gradingSubmission.id
          ? {
              ...sub,
              descriptiveScore: awarded,
              descriptiveGraded: true,
              examinerNotes: examinerNotesInput,
              finalScore: totalScore,
              finalGrade: grade
            }
          : sub
      )
    );

    setGradingSubmission(null);
  };

  const handlePublishResults = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? { ...sub, isPublished: true }
          : sub
      )
    );
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId || !newStudentName) return;
    const added: StudentAccount = {
      id: newStudentId.toUpperCase(),
      name: newStudentName,
      email: newStudentEmail || `${newStudentId.toLowerCase()}@oxford.edu`,
      department: newStudentDept,
      enrollmentYear: 2024,
      status: 'active'
    };
    setStudents((prev) => [added, ...prev]);
    setIsAddStudentOpen(false);
    setNewStudentId('');
    setNewStudentName('');
    setNewStudentEmail('');
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyId || !newFacultyName) return;
    const added: FacultyAccount = {
      id: newFacultyId.toUpperCase(),
      name: newFacultyName,
      email: newFacultyEmail || `${newFacultyName.toLowerCase().replace(/\s+/g, '.')}@oxford.edu`,
      department: newFacultyDept,
      role: newFacultyRole,
      specialization: 'Core Curriculum & Examination Authoring'
    };
    setFaculty((prev) => [added, ...prev]);
    setIsAddFacultyOpen(false);
    setNewFacultyId('');
    setNewFacultyName('');
    setNewFacultyEmail('');
  };

  const activeCandidates = sessions.filter((s) => s.status === 'active').length;
  const flaggedCandidates = sessions.filter((s) => s.status === 'warning').length;
  const submittedCandidates = sessions.filter((s) => s.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
            <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              FACULTY & ADMIN
            </span>
            <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Faculty & Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor live exams, grade written answers, and manage users.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenAddQuestionModal && (
            <button
              onClick={onOpenAddQuestionModal}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Add Question</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Main Feature Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-medium">
        <button
          onClick={() => setActiveConsoleTab('proctor')}
          className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            activeConsoleTab === 'proctor'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-blue-600" />
          <span>Live Proctoring</span>
          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
            {activeCandidates} Active
          </span>
        </button>

        <button
          onClick={() => setActiveConsoleTab('submissions')}
          className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            activeConsoleTab === 'submissions'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>Grading & Results</span>
          <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
            {submissions.filter((s) => !s.descriptiveGraded).length} Pending
          </span>
        </button>

        <button
          onClick={() => setActiveConsoleTab('admin')}
          className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            activeConsoleTab === 'admin'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Admin Management</span>
        </button>
      </div>

      {/* TAB 1: LIVE PROCTORING */}
      {activeConsoleTab === 'proctor' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Proctor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500">Active Students</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {activeCandidates}
                </span>
                <span className="text-xs text-slate-500">In Exam</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500">Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                  {flaggedCandidates}
                </span>
                <span className="text-xs text-amber-700 font-medium">Needs Review</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500">Submitted</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                  {submittedCandidates}
                </span>
                <span className="text-xs text-emerald-700 font-medium">Completed</span>
              </div>
            </div>
          </div>

          {/* Broadcast Message */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>Send Notice to All Active Students</span>
              </span>
              {announcementSent && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Sent</span>
                </span>
              )}
            </div>
            <form onSubmit={handleSendAnnouncement} className="flex gap-2">
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Type an announcement for active students..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Candidate Sessions Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Sessions ({sessions.length})
              </h3>
              <span className="text-xs text-slate-500">Live Status</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">ID</th>
                    <th className="py-3 px-4 font-semibold">Progress</th>
                    <th className="py-3 px-4 font-semibold">Time Left</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Last Activity</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {st.studentName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {st.studentId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono tabular-nums text-slate-800">
                            {st.answeredCount}/{st.totalQuestions}
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${(st.answeredCount / st.totalQuestions) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        {st.status === 'submitted' ? (
                          <span className="text-slate-400">Completed</span>
                        ) : (
                          `${st.timeRemainingMinutes} mins`
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {st.status === 'active' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                        {st.status === 'warning' && (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            Tab Switch
                          </span>
                        )}
                        {st.status === 'submitted' && (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                            Submitted
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {st.lastActivity}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {st.status !== 'submitted' && (
                          <button
                            onClick={() => handleExtendStudentTime(st.studentId)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            +10m
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS & GRADING */}
      {activeConsoleTab === 'submissions' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Submissions & Grading ({submissions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  MCQs are auto-graded. Review written answers below to grade and publish results.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Exam</th>
                    <th className="py-3 px-4 font-semibold">Submitted</th>
                    <th className="py-3 px-4 font-semibold">MCQ Score</th>
                    <th className="py-3 px-4 font-semibold">Written Answer</th>
                    <th className="py-3 px-4 font-semibold">Final Score</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{sub.studentName}</span>
                        <span className="text-[11px] font-mono text-slate-500">{sub.studentId}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                        {sub.examCode}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {sub.submittedAt}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-slate-900">
                          {sub.objectiveScore} / {sub.objectiveTotal}
                        </span>
                        <span className="text-[10px] text-emerald-600 block">Auto-graded</span>
                      </td>
                      <td className="py-3 px-4">
                        {sub.descriptiveGraded ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {sub.descriptiveScore} / {sub.descriptiveMax} pts
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Needs Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {sub.isPublished ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-blue-700">
                              {sub.finalScore} pts ({sub.finalGrade})
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Published
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeInput(sub.descriptiveScore ?? 14);
                            setExaminerNotesInput(sub.examinerNotes || 'Well-argued proof.');
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          {sub.descriptiveGraded ? 'Edit Grade' : 'Grade'}
                        </button>

                        {sub.descriptiveGraded && !sub.isPublished && (
                          <button
                            onClick={() => handlePublishResults(sub.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] shadow-xs transition-colors cursor-pointer"
                          >
                            Publish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ADMINISTRATOR MANAGEMENT CONSOLE (admin@123) */}
      {/* (Use Case Actor 3: Manage Students, Manage Faculty, User Roles, Activities, Statistics) */}
      {/* ======================================================== */}
      {activeConsoleTab === 'admin' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Admin Subtabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-semibold">
            <button
              onClick={() => setAdminSubTab('students')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students ({students.length})</span>
            </button>

            <button
              onClick={() => setAdminSubTab('faculty')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'faculty'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Faculty ({faculty.length})</span>
            </button>

            <button
              onClick={() => setAdminSubTab('roles')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'roles'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Roles</span>
            </button>

            <button
              onClick={() => setAdminSubTab('activities')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'activities'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Activity Log</span>
            </button>

            <button
              onClick={() => setAdminSubTab('statistics')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'statistics'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Stats</span>
            </button>
          </div>

          {/* SUBTAB: MANAGE STUDENTS */}
          {adminSubTab === 'students' && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Students ({students.length})
                </h4>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Student</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">ID</th>
                      <th className="py-3 px-4 font-semibold">Name</th>
                      <th className="py-3 px-4 font-semibold">Email</th>
                      <th className="py-3 px-4 font-semibold">Department</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-blue-700">{st.id}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{st.name}</td>
                        <td className="py-3 px-4 text-slate-600">{st.email}</td>
                        <td className="py-3 px-4 text-slate-600">{st.department}</td>
                        <td className="py-3 px-4">
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                            {st.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB: MANAGE FACULTY */}
          {adminSubTab === 'faculty' && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Faculty ({faculty.length})
                </h4>
                <button
                  onClick={() => setIsAddFacultyOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Faculty</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">ID</th>
                      <th className="py-3 px-4 font-semibold">Name</th>
                      <th className="py-3 px-4 font-semibold">Email</th>
                      <th className="py-3 px-4 font-semibold">Department & Role</th>
                      <th className="py-3 px-4 font-semibold">Subject</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {faculty.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{f.id}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{f.name}</td>
                        <td className="py-3 px-4 text-slate-600">{f.email}</td>
                        <td className="py-3 px-4 text-slate-600">{f.department} · {f.role}</td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{f.specialization}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB: USER ROLES */}
          {adminSubTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                  <Users className="w-4 h-4" />
                  <span>Student</span>
                </div>
                <p className="text-xs text-slate-600">
                  Take exams, auto-save answers, submit, and view published results.
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  {students.length} Students
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
                  <UserCheck className="w-4 h-4" />
                  <span>Faculty / Examiner</span>
                </div>
                <p className="text-xs text-slate-600">
                  Create exams, add questions, grade written answers, and publish results.
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  {faculty.length} Faculty
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrator</span>
                </div>
                <p className="text-xs text-slate-600">
                  Full access (<code>admin@123</code>) to add questions, manage users, and view performance.
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-mono font-semibold">
                  Verified
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: ACTIVITIES LOG */}
          {adminSubTab === 'activities' && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Activity
                </h4>
              </div>
              <div className="divide-y divide-slate-100">
                {INITIAL_LOGS.map((log) => (
                  <div key={log.id} className="p-3.5 flex items-start justify-between text-xs hover:bg-slate-50/70 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-slate-900">{log.action}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-blue-700 font-mono text-[11px]">{log.actor}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{log.details}</p>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] shrink-0 ml-4">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB: SYSTEM STATISTICS */}
          {adminSubTab === 'statistics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Enrolled Students</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  1,480
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">4 Departments</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Faculty</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  48
                </div>
                <span className="text-[11px] text-blue-600 mt-1 block">12 Examiners</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Pass Rate</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  94.2%
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">+2.1% vs last term</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Database</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-emerald-600" />
                  Synced
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Firestore Active</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: EVALUATE WRITTEN ANSWERS */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0B132B] text-white flex items-start justify-between shrink-0">
              <div>
                <span className="text-[11px] font-mono text-blue-300">{gradingSubmission.examCode}</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Grade Answer · {gradingSubmission.studentName}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {gradingSubmission.studentId} · MCQ Score: <strong className="text-white">{gradingSubmission.objectiveScore} / {gradingSubmission.objectiveTotal}</strong>
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-700">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  Question & Rubric
                </span>
                <p className="text-slate-800 font-medium">
                  Design an algorithm to detect a negative cycle in a weighted directed graph and state its time and space complexity.
                </p>
                <p className="text-[11px] text-blue-800">
                  <strong>Key points:</strong> Bellman-Ford relaxation, |V|-th pass check, O(V·E) time, O(V) space.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Student Answer
                </label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs leading-relaxed text-slate-900 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {gradingSubmission.descriptiveAnswerText}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Marks (Max {gradingSubmission.descriptiveMax})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={gradingSubmission.descriptiveMax}
                    value={gradeInput}
                    onChange={(e) => setGradeInput(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-800 mb-1">
                    Feedback
                  </label>
                  <input
                    type="text"
                    value={examinerNotesInput}
                    onChange={(e) => setExaminerNotesInput(e.target.value)}
                    placeholder="Add brief feedback..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 md:px-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
              <button
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveDescriptiveGrade}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Add Student
              </h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-2024-8850"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Montgomery"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="e.g. l.montgomery@oxford.edu"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={newStudentDept}
                  onChange={(e) => setNewStudentDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Data Systems">Data Systems</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FACULTY */}
      {isAddFacultyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Add Faculty
              </h3>
              <button onClick={() => setIsAddFacultyOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFaculty} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FAC-104"
                  value={newFacultyId}
                  onChange={(e) => setNewFacultyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Claire Underwood"
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={newFacultyDept}
                  onChange={(e) => setNewFacultyDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Data Systems">Data Systems</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Lecturer"
                  value={newFacultyRole}
                  onChange={(e) => setNewFacultyRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFacultyOpen(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Live Feed · {selectedStudent.studentName}
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl h-44 flex items-center justify-center text-slate-400 font-mono text-xs relative overflow-hidden">
              <div className="text-center p-4">
                <Video className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span>Webcam Preview</span>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500/80 text-white text-[10px] font-mono">
                LIVE
              </div>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                <strong>ID:</strong> {selectedStudent.studentId}
              </p>
              <p>
                <strong>Progress:</strong> {selectedStudent.answeredCount} / {selectedStudent.totalQuestions} answered
              </p>
              <p>
                <strong>Last Activity:</strong> {selectedStudent.lastActivity}
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
