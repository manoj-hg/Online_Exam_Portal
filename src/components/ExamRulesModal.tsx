import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface ExamRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamRulesModal: React.FC<ExamRulesModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
              <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                REGULATIONS §4.2
              </span>
              <span>Oxford Collegiate Board</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Institutional Examination Guidelines & Honor Code
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mandatory protocol for candidates taking online proctored assessments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">1. Continuous Autosave & Cryptographic Signing</strong>
              <span>
                All selected answers are captured instantly upon click. In the event of network disruption, you may reconnect without loss of progress.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">2. Window & Proctoring Compliance</strong>
              <span>
                Switching browser tabs or exiting fullscreen triggers an institutional audit log. Repeated deflections are reported to the presiding invigilator.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">3. Strict Timer Expiry</strong>
              <span>
                When the countdown timer reaches 00:00, the examination portal automatically finalizes and dispatches all recorded responses.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">4. Permitted In-Exam Tools</strong>
              <span>
                Candidates may freely utilize the integrated Scratchpad in the right sidebar. No secondary hardware, unauthorized browser extensions, or communication tools are permitted.
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
