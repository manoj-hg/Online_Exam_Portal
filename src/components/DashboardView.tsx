import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ShieldCheck,
  Filter,
  AlertCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Exam } from '../types/exam';
import { ExamCard } from './ExamCard';

interface DashboardViewProps {
  exams: Exam[];
  searchQuery: string;
  currentUser?: any;
  onStartExam: (exam: Exam) => void;
  onViewResults: (exam: Exam) => void;
  onOpenRules: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  searchQuery,
  currentUser,
  onStartExam,
  onViewResults,
  onOpenRules
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'scheduled' | 'completed'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = ['all', 'Computer Science', 'Mathematics', 'Electrical Engineering', 'Data Systems'];

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
      {/* Clean Welcome Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Welcome, {currentUser?.displayName || 'Elena Vance'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {currentUser?.candidateId || 'CS-2024-8841'} · {currentUser?.department || 'Computer Science'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRules}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Exam Rules</span>
          </button>
          <button
            onClick={() => {
              const active = exams.find((e) => e.id === 'exam-cs-301');
              if (active) onStartExam(active);
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start CS-301</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Compact Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Available</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {availableCount}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Upcoming</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {scheduledCount}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              91%
            </span>
            <span className="text-xs text-blue-700 font-medium">Grade A</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Completed</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {completedCount}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({exams.length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'available'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'scheduled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({scheduledCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graded ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
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

      {/* Examinations Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-3 px-1">
          Examinations ({filteredExams.length})
        </h2>

        {filteredExams.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <AlertCircle className="w-7 h-7 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">No exams found</h4>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedDept('all');
              }}
              className="mt-3 px-3.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg cursor-pointer"
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
    </div>
  );
};
