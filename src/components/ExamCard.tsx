import React from 'react';
import { Clock, BookCheck, Award, Calendar, ArrowRight, User } from 'lucide-react';
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
      <div className="p-5">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-mono font-semibold text-blue-700">
            {exam.code}
          </span>

          <div className="text-xs">
            {isAvailable && (
              <span className="text-emerald-700 font-medium">Available</span>
            )}
            {isScheduled && (
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {exam.date}
              </span>
            )}
            {isCompleted && (
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {exam.studentScore}/{exam.totalMarks} ({exam.studentGrade})
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-900 tracking-tight leading-snug">
          {exam.title}
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{exam.instructor}</span>
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono tabular-nums">{exam.durationMinutes} min</span>
          </div>

          <div className="flex items-center gap-1.5">
            <BookCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {exam.questionCount} Qs · {exam.totalMarks} pts
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          {exam.department}
        </span>

        {isAvailable && (
          <button
            onClick={() => onStartExam(exam)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Exam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {isScheduled && (
          <button
            disabled
            className="px-3.5 py-1.5 bg-slate-200/80 text-slate-500 cursor-not-allowed rounded-lg text-xs font-medium"
          >
            Scheduled
          </button>
        )}

        {isCompleted && (
          <button
            onClick={() => onViewResults(exam)}
            className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
};
