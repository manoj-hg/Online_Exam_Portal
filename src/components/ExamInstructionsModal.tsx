import React, { useState } from 'react';
import {
  X,
  Clock,
  BookOpen,
  Award,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Video,
  FileText,
  ArrowRight,
  Database
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
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Deep Navy Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0B132B] text-white flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
              <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                {exam.code}
              </span>
              <span>{exam.department}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {exam.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Course Examiner: <strong className="text-slate-100">{exam.instructor}</strong> ({exam.instructorRole})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
          {/* Examination Details (Retrieved from Database) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Examination Specifications & Parameters</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Session Duration</span>
                <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {exam.durationMinutes} Minutes
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Total Marks</span>
                <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  {exam.totalMarks} Points
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Objective Questions</span>
                <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  {mcqCount} MCQs
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Descriptive Section</span>
                <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  {descriptiveCount} Written
                </span>
              </div>
            </div>
          </div>

          {/* Official Instructions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Mandatory Examination Instructions
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              {exam.instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span>{inst}</span>
                </div>
              ))}
              <div className="flex items-start gap-2 text-slate-700 leading-relaxed">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {exam.instructions.length + 1}
                </div>
                <span>
                  <strong>Continuous Auto-Save:</strong> Your answers are saved automatically into the database. If connectivity drops, answers remain safe locally and synchronize once restored.
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-700 leading-relaxed">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {exam.instructions.length + 2}
                </div>
                <span>
                  <strong>Timed Automatic Submission:</strong> When the countdown reaches 0:00, all current answers are automatically validated and submitted to the examiner.
                </span>
              </div>
            </div>
          </div>

          {/* Pre-Flight System Verification Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              System Pre-Flight Readiness Check
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-950 block">Cloud Database</span>
                  <span className="text-[11px] text-emerald-700">Firestore Connected</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-950 block">Local Storage</span>
                  <span className="text-[11px] text-emerald-700">Offline Fallback Ready</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-950 block">Invigilation Feed</span>
                  <span className="text-[11px] text-emerald-700">{exam.proctoringMode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Honor Code Pledge */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-800 text-xs leading-relaxed">
                I solemnly confirm that I am the authorized candidate, that I have read and understood all examination rules, and that I agree to abide by the university disciplinary code.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:px-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel & Return
          </button>

          <button
            disabled={!hasAgreed}
            onClick={handleStart}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <span>Start Examination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
