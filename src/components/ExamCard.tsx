import React from 'react';
import { Clock, BookCheck, ShieldAlert, Award, Calendar, ArrowRight, User } from 'lucide-react';
import { Exam } from '../types/exam';

interface ExamCardProps {
  exam: Exam;
  onStartExam: (exam: Exam) => void;
  onViewResults: (exam: Exam) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onStartExam,
  onViewResults
}) => {
  const isAvailable = exam.status === 'available';
  const isCompleted = exam.status === 'completed';
  const isScheduled = exam.status === 'scheduled';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Section */}
      <div className="p-5">
        {/* Kicker Row: Course Code & Status */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-blue-700 bg-blue-50/70 border border-blue-200/60 px-2 py-0.5 rounded">
              {exam.code}
            </span>
            <span className="text-slate-500 font-medium">{exam.department}</span>
          </div>

          {/* Clean status indicator (No candy pill) */}
          <div className="text-xs">
            {isAvailable && (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Room
              </span>
            )}
            {isScheduled && (
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {exam.date}
              </span>
            )}
            {isCompleted && (
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {exam.studentScore} / {exam.totalMarks} ({exam.studentGrade})
              </span>
            )}
          </div>
        </div>

        {/* Exam Title */}
        <h3 className="text-base font-semibold text-slate-900 tracking-tight leading-snug hover:text-blue-600 transition-colors">
          {exam.title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{exam.instructor}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-400">{exam.instructorRole}</span>
        </p>

        {/* Exam Metadata Grid (Duration, Marks, Proctoring) */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono tabular-nums">{exam.durationMinutes} Minutes</span>
          </div>

          <div className="flex items-center gap-2">
            <BookCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {exam.questionCount} Questions <span className="text-slate-400">({exam.totalMarks} pts)</span>
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-2 text-slate-500 text-[11px] pt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Proctoring: {exam.proctoringMode}</span>
          </div>
        </div>
      </div>

      {/* Footer Action Strip */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          {isAvailable && exam.timeWindow}
          {isScheduled && `Unlocks ${exam.timeWindow}`}
          {isCompleted && `Completed on ${exam.studentCompletedDate}`}
        </span>

        {isAvailable && (
          <button
            onClick={() => onStartExam(exam)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <span>Begin Examination</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {isScheduled && (
          <button
            disabled
            className="px-3.5 py-1.5 bg-slate-200/80 text-slate-500 cursor-not-allowed rounded-lg text-xs font-medium flex items-center gap-1"
          >
            <span>Opens Nov 14</span>
          </button>
        )}

        {isCompleted && (
          <button
            onClick={() => onViewResults(exam)}
            className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
          >
            <span>View Performance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
