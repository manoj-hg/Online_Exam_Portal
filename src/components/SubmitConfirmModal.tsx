import React from 'react';
import { AlertTriangle, CheckCircle2, Bookmark, Clock, X } from 'lucide-react';
import { Exam, StudentExamSession } from '../types/exam';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  exam: Exam;
  session: StudentExamSession;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  exam,
  session
}) => {
  if (!isOpen) return null;

  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(session.answers).filter(
    (k) => (session.answers[Number(k)] || []).length > 0
  ).length;
  const flaggedCount = Object.keys(session.markedForReview).filter(
    (k) => session.markedForReview[Number(k)]
  ).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
              <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                FINAL SUBMISSION
              </span>
              <span>{exam.code}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Ready to submit your examination?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please review your response summary before final evaluation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Statistics Summary */}
        <div className="p-6 space-y-5">
          {/* Tally Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums block">
                {answeredCount}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Answered</span>
            </div>

            <div
              className={`rounded-xl p-3.5 text-center border ${
                unansweredCount > 0
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-center text-amber-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold font-mono tabular-nums block">
                {unansweredCount}
              </span>
              <span className="text-[11px] font-medium">Unanswered</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums block">
                {flaggedCount}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Flagged</span>
            </div>
          </div>

          {/* Unanswered Notice Warning */}
          {unansweredCount > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Attention:</strong> You have {unansweredCount} unanswered questions remaining. Once submitted, questions cannot be revisited.
              </div>
            </div>
          )}

          {/* Institutional Integrity Attestation */}
          <p className="text-xs text-slate-500 leading-relaxed">
            By confirming submission, your responses are timestamped and cryptographically signed into the Oxford assessment database.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Return to Examination
          </button>
          <button
            onClick={onConfirmSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-blue-500/30"
          >
            Confirm & Submit Final Responses
          </button>
        </div>
      </div>
    </div>
  );
};
