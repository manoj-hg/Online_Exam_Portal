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
      {/* Institutional Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
            <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              FACULTY & ADMINISTRATOR CONSOLE
            </span>
            <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified (admin@123)
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Examination Operations & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin/Examiner: <strong className="text-slate-700">admin@123 (Prof. Arthur Vance)</strong> · Privileges: <span className="font-semibold text-blue-700">Question Authoring</span>, <span className="font-semibold text-indigo-700">Descriptive Grading</span>, & <span className="font-semibold text-slate-700">User Management</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenAddQuestionModal && (
            <button
              onClick={onOpenAddQuestionModal}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Add Question to Exam</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Room Live (30fps)</span>
          </div>
        </div>
      </div>

      {/* Main Feature Navigation (UML Actor Flows: Live Invigilation vs Submissions & Grading vs Admin Management) */}
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
          <span>Live Proctoring & Telemetry</span>
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
          <span>Submissions & Descriptive Grading</span>
          <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
            {submissions.filter((s) => !s.descriptiveGraded).length} Pending Review
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
          <span>Administrator Dashboard</span>
          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
            admin@123
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: LIVE PROCTORING & INVIGILATION TELEMETRY */}
      {/* ======================================================== */}
      {activeConsoleTab === 'proctor' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Proctor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500">Active Test-Takers</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {activeCandidates}
                </span>
                <span className="text-xs text-slate-500">In Examination</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500">Integrity Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                  {flaggedCandidates}
                </span>
                <span className="text-xs text-amber-700 font-medium">Requires Review</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500">Final Submissions</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                  {submittedCandidates}
                </span>
                <span className="text-xs text-emerald-700 font-medium">Verified & Graded</span>
              </div>
            </div>
          </div>

          {/* Broadcast Message to Candidates */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>Broadcast Notice to All Active Candidates</span>
              </span>
              {announcementSent && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Broadcast dispatched to all screens</span>
                </span>
              )}
            </div>
            <form onSubmit={handleSendAnnouncement} className="flex gap-2">
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Please note: Question 4 has a typo in option C; option C denotes index 5..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Notice</span>
              </button>
            </form>
          </div>

          {/* Candidate Sessions Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Connected Candidate Feeds ({sessions.length})
              </h3>
              <span className="text-xs text-slate-500">Live Telemetry Refresh: 5s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Candidate</th>
                    <th className="py-3 px-4 font-semibold">Candidate ID</th>
                    <th className="py-3 px-4 font-semibold">Progress</th>
                    <th className="py-3 px-4 font-semibold">Time Remaining</th>
                    <th className="py-3 px-4 font-semibold">Integrity State</th>
                    <th className="py-3 px-4 font-semibold">Latest Action</th>
                    <th className="py-3 px-4 font-semibold text-right">Invigilator Actions</th>
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
                            Nominal
                          </span>
                        )}
                        {st.status === 'warning' && (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            Tab Diverted
                          </span>
                        )}
                        {st.status === 'submitted' && (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                            Turned In
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
                            +10m Extra
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          Audit Feed
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

      {/* ======================================================== */}
      {/* TAB 2: SUBMISSIONS & DESCRIPTIVE EVALUATION */}
      {/* (Activity Diagram Swimlane 4: Review & Grade Descriptive Answers -> Calculate Final Marks -> Publish Results) */}
      {/* ======================================================== */}
      {activeConsoleTab === 'submissions' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Candidate Submissions & Grading Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Activity Diagram Workflow: Objective questions are automatically evaluated by the system. Descriptive synthesis questions require faculty examiner review, rubric marking, final grade calculation, and official publication.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Submitted Answer Sheets ({submissions.length})
              </h4>
              <span className="text-xs text-slate-500">
                Evaluation Engine: Mixed Objective (System) + Descriptive (Faculty)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Candidate</th>
                    <th className="py-3 px-4 font-semibold">Paper</th>
                    <th className="py-3 px-4 font-semibold">Submitted At</th>
                    <th className="py-3 px-4 font-semibold">MCQ Auto-Score</th>
                    <th className="py-3 px-4 font-semibold">Descriptive Evaluation</th>
                    <th className="py-3 px-4 font-semibold">Final Grade</th>
                    <th className="py-3 px-4 font-semibold text-right">Examiner Action</th>
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
                        <span className="text-[10px] text-emerald-600 block">Auto-Evaluated</span>
                      </td>
                      <td className="py-3 px-4">
                        {sub.descriptiveGraded ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {sub.descriptiveScore} / {sub.descriptiveMax} Pts
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Faculty Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {sub.isPublished ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-blue-700">
                              {sub.finalScore} Pts ({sub.finalGrade})
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Published
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unpublished Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeInput(sub.descriptiveScore ?? 14);
                            setExaminerNotesInput(sub.examinerNotes || 'Well-argued proof with clear invariant derivations.');
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          {sub.descriptiveGraded ? 'Re-Grade' : 'Grade Descriptive'}
                        </button>

                        {sub.descriptiveGraded && !sub.isPublished && (
                          <button
                            onClick={() => handlePublishResults(sub.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] shadow-xs transition-colors cursor-pointer"
                          >
                            Publish Results
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
          <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-semibold">
            <button
              onClick={() => setAdminSubTab('students')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Students ({students.length})</span>
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
              <span>Manage Faculty ({faculty.length})</span>
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
              <span>User Roles & RBAC</span>
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
              <span>Examination Activities Log</span>
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
              <span>System Statistics</span>
            </button>
          </div>

          {/* SUBTAB: MANAGE STUDENTS */}
          {adminSubTab === 'students' && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Enrolled Student Roster
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Administrator privilege: Provision credentials, assign cohorts, and monitor candidate status.
                  </p>
                </div>
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
                      <th className="py-3 px-4 font-semibold">Student ID</th>
                      <th className="py-3 px-4 font-semibold">Full Name</th>
                      <th className="py-3 px-4 font-semibold">University Email</th>
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
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Academic Faculty & Examiner Registry
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Author examination papers, establish correct keys, and conduct descriptive appraisals.
                  </p>
                </div>
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
                      <th className="py-3 px-4 font-semibold">Faculty ID</th>
                      <th className="py-3 px-4 font-semibold">Examiner Name</th>
                      <th className="py-3 px-4 font-semibold">Official Email</th>
                      <th className="py-3 px-4 font-semibold">Department & Role</th>
                      <th className="py-3 px-4 font-semibold">Specialization</th>
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
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                  <Users className="w-4 h-4" />
                  <span>Role: Candidate / Student</span>
                </div>
                <p className="text-xs text-slate-600">
                  Access examination papers, read instructions, answer MCQs & descriptive questions, view draft autosave status, submit, and inspect published transcripts.
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  Assigned Users: {students.length} Enrolled
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
                  <UserCheck className="w-4 h-4" />
                  <span>Role: Faculty / Examiner</span>
                </div>
                <p className="text-xs text-slate-600">
                  Create and schedule examinations, configure date and duration, add MCQ & descriptive questions, view candidate submissions, evaluate descriptive answers, and publish results.
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  Assigned Users: {faculty.length} Active Staff
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Role: System Administrator</span>
                </div>
                <p className="text-xs text-slate-600">
                  Full superuser governance restricted to <code>admin@123</code> / pass: <code>admin@123</code>. Manage students, manage faculty, manage user roles, audit activity, and inspect system telemetry.
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-mono font-semibold">
                  Active Verified Super Admin
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: ACTIVITIES LOG */}
          {adminSubTab === 'activities' && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-Time Examination Activity Stream
                </h4>
                <span className="text-xs text-slate-500">Live Audit Trail</span>
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
                <span className="text-xs text-slate-500">Total Enrolled Students</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  1,480
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">Active across 4 Departments</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Active Faculty Members</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  48
                </div>
                <span className="text-[11px] text-blue-600 mt-1 block">12 Authorized Examiners</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Exam Pass Rate</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  94.2%
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">+2.1% from Trinity Term</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <span className="text-xs text-slate-500">Cloud Firestore DB Status</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-emerald-600" />
                  Synced
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Auto-save Latency: ~140ms</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EVALUATE DESCRIPTIVE ANSWERS (Activity Diagram Swimlane 4) */}
      {/* ======================================================== */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-[#0B132B] text-white flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
                  <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                    EXAMINER EVALUATION CONSOLE
                  </span>
                  <span>Paper: {gradingSubmission.examCode}</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Review & Grade Descriptive Response: {gradingSubmission.studentName}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Candidate ID: <span className="font-mono">{gradingSubmission.studentId}</span> · MCQ Auto-Score: <strong className="text-white">{gradingSubmission.objectiveScore} / {gradingSubmission.objectiveTotal}</strong>
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-700">
              {/* Question Context & Rubric */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  Question Prompt (Descriptive Algorithmic Proof):
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  Design an efficient algorithm to detect whether a directed, weighted graph contains an arbitrary negative cycle. Explain your algorithm's invariant, edge-relaxation steps, and state both asymptotic time and space complexity.
                </p>
                <div className="pt-2 border-t border-blue-200/60 text-[11px] text-blue-800">
                  <strong>Examiner Rubric:</strong> Full 15 marks require: (1) Bellman-Ford/SPFA formulation, (2) Correct relaxation invariant for k passes, (3) |V|-th pass detection condition, (4) O(V·E) time & O(V) space.
                </div>
              </div>

              {/* Student's Written Response */}
              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Candidate Submitted Solution:
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs leading-relaxed text-slate-900 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {gradingSubmission.descriptiveAnswerText}
                </div>
              </div>

              {/* Grading Input & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Award Marks (Max {gradingSubmission.descriptiveMax}):
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
                    Examiner Feedback / Audit Notes:
                  </label>
                  <input
                    type="text"
                    value={examinerNotesInput}
                    onChange={(e) => setExaminerNotesInput(e.target.value)}
                    placeholder="e.g. Invariant well stated. Deducted 1 pt for omitted predecessor array details."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
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
                Save Evaluation & Calculate Final Marks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD STUDENT (admin@123) */}
      {/* ======================================================== */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Enroll New Candidate (Administrator)
              </h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Candidate ID:</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name:</label>
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
                <label className="block font-semibold text-slate-700 mb-1">University Email:</label>
                <input
                  type="email"
                  placeholder="e.g. l.montgomery@oxford.edu"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department:</label>
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

      {/* ======================================================== */}
      {/* MODAL: ADD FACULTY (admin@123) */}
      {/* ======================================================== */}
      {isAddFacultyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Register Academic Faculty (Administrator)
              </h3>
              <button onClick={() => setIsAddFacultyOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFaculty} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty ID:</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Faculty Name:</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Department:</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Academic Role:</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Lecturer, Associate Professor"
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
                  Register Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Audit Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Candidate Invigilation Stream: {selectedStudent.studentName}
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl h-48 flex items-center justify-center text-slate-400 font-mono text-xs relative overflow-hidden">
              <div className="text-center p-4">
                <Video className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span>Simulated Secure Video Feed</span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Oxford Proctor AI: Continuous Gaze & Audio Tracking · 1080p
                </p>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500/80 text-white text-[10px] font-mono">
                LIVE
              </div>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                <strong>Candidate ID:</strong> {selectedStudent.studentId}
              </p>
              <p>
                <strong>Progress:</strong> {selectedStudent.answeredCount} of {selectedStudent.totalQuestions} questions answered
              </p>
              <p>
                <strong>Last Heartbeat:</strong> {selectedStudent.lastActivity}
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
