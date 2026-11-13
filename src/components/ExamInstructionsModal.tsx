import React, { useState } from 'react';
import {
  X,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Exam } from '../types/exam';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onConfirmStart: (exam: Exam) => void;
}

export const ExamInstructionsModal: React.FC<ExamInstructionsModalProps> = ({
  isOpen,
  onClose,
  exam,
  onConfirmStart
}) => {
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);

  if (!isOpen || !exam) return null;

  const mcqCount = exam.questions.filter((q) => q.type !== 'descriptive').length;
  const descriptiveCount = exam.questions.filter((q) => q.type === 'descriptive').length;

  const handleStart = () => {
    if (!hasAgreed) return;
    onConfirmStart(exam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#0B132B] text-white flex items-start justify-between shrink-0">
          <div>
            <span className="font-mono text-xs text-blue-400 font-semibold">
              {exam.code} · {exam.department}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {exam.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1">{exam.instructor}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Duration</span>
              <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {exam.durationMinutes} min
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Total Marks</span>
              <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                {exam.totalMarks} pts
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">MCQs</span>
              <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                {mcqCount}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Written</span>
              <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                {descriptiveCount}
              </span>
            </div>
          </div>

          {/* Concise Instructions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Exam Instructions
            </h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed">
              {exam.instructions.slice(0, 2).map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
              <li>Answers auto-save continuously and recover if your connection drops.</li>
              <li>Your exam submits automatically when the timer expires.</li>
            </ul>
          </div>

          {/* Readiness Check */}
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">System ready · {exam.proctoringMode}</span>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700 text-xs leading-relaxed">
              I have read the instructions and agree to complete this exam independently.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={!hasAgreed}
            onClick={handleStart}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
