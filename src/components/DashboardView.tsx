import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  ShieldCheck,
  Filter,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Exam } from '../types/exam';
import { ExamCard } from './ExamCard';

interface DashboardViewProps {
  exams: Exam[];
  searchQuery: string;
  onStartExam: (exam: Exam) => void;
  onViewResults: (exam: Exam) => void;
  onOpenRules: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  searchQuery,
  onStartExam,
  onViewResults,
  onOpenRules
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'scheduled' | 'completed'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = ['all', 'Computer Science', 'Mathematics', 'Electrical Engineering', 'Data Systems'];

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesDept = selectedDept === 'all' || exam.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const availableCount = exams.filter((e) => e.status === 'available').length;
  const completedCount = exams.filter((e) => e.status === 'completed').length;
  const scheduledCount = exams.filter((e) => e.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
            <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
              CANDIDATE PORTAL
            </span>
            <span>Oxford Collegiate Examination Board</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Assessment & Examination Session
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered Candidate: <strong className="text-slate-700">Elena Vance</strong> · Candidate No: <span className="font-mono text-slate-700">CS-2024-8841</span> · Faculty of Computing & Pure Sciences
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRules}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Invigilation Rules</span>
          </button>
          <button
            onClick={() => {
              const active = exams.find((e) => e.id === 'exam-cs-301');
              if (active) onStartExam(active);
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-blue-500/30"
          >
            <span>Launch CS-301 Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clean Dashboard Statistics (Zero slop, disciplined tabular metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Available */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Available for Testing</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {availableCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">Ready Now</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Includes CS-301 Algorithms & MATH-240
          </p>
        </div>

        {/* Stat 2: Scheduled */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Upcoming Timetable</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {scheduledCount}
            </span>
            <span className="text-xs text-slate-500">Exams Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Next: DS-405 on Nov 14 (14:00 UTC)
          </p>
        </div>

        {/* Stat 3: Completed & Average Grade */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Completed Assessments</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              91.0%
            </span>
            <span className="text-xs text-blue-700 font-medium">Average Grade A</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {completedCount} evaluated examinations on record
          </p>
        </div>

        {/* Stat 4: Academic Integrity Score */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Academic Standing</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              100%
            </span>
            <span className="text-xs text-emerald-700 font-medium">Full Integrity</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Zero proctor flags or tab violations
          </p>
        </div>
      </div>

      {/* Filter and Search Controls Strip */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Buttons (Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Papers ({exams.length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'available'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available Now ({availableCount})
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'scheduled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({scheduledCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graded ({completedCount})
          </button>
        </div>

        {/* Department Filter Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-3 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Examination Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Curriculum Assessments ({filteredExams.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click on any available paper to open the secure test-taking environment
          </span>
        </div>

        {filteredExams.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">No examinations match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the department or status filter.</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedDept('all');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onStartExam={onStartExam}
                onViewResults={onViewResults}
              />
            ))}
          </div>
        )}
      </div>

      {/* Academic Honor Code Notice */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Honor Pledge & Proctor Compliance:</strong> By commencing an examination on ExamSphere, you solemnly attest that all work submitted is exclusively your own, completed without unauthorized aids or unauthorized collaboration, under Oxford Collegiate Disciplinary Statutes §4.2.
        </div>
      </div>
    </div>
  );
};
