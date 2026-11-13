import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  X,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { Exam, StudentExamSession } from '../types/exam';

interface ExamResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  session?: StudentExamSession;
}

export const ExamResultsModal: React.FC<ExamResultsModalProps> = ({
  isOpen,
  onClose,
  exam,
  session
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  if (!isOpen) return null;

  // Calculate score if fresh session exists, otherwise use exam.studentScore
  let calculatedScore = exam.studentScore || 0;
  let correctCount = 0;
  let totalScorePossible = exam.totalMarks;

  if (session && session.answers) {
    let earned = 0;
    exam.questions.forEach((q) => {
      const studentAns = (session.answers[q.id] || []).sort();
      const correctAns = (q.correctOptionIndices || []).sort();
      const isCorrect =
        studentAns.length === correctAns.length &&
        studentAns.every((val, idx) => val === correctAns[idx]);

      if (isCorrect) {
        earned += q.marks;
        correctCount += 1;
      }
    });
    calculatedScore = earned;
  } else {
    correctCount = Math.round((calculatedScore / totalScorePossible) * exam.questions.length);
  }

  const percentage = Math.round((calculatedScore / totalScorePossible) * 100);
  const letterGrade =
    percentage >= 90
      ? 'A'
      : percentage >= 80
      ? 'B'
      : percentage >= 70
      ? 'C'
      : percentage >= 60
      ? 'D'
      : 'F';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
              <span className="font-mono bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                OFFICIAL REPORT
              </span>
              <span>Oxford Collegiate Board</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {exam.code}: Examination Performance Evaluation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate: <strong>Elena Vance</strong> (CS-2024-8841) · Instructor: {exam.instructor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Score Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Verified Result
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
                    {calculatedScore} / {totalScorePossible}
                  </span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    ({percentage}%) · Grade {letterGrade}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-300 font-mono border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              <div>
                <span className="text-slate-400 block text-[10px]">CORRECT</span>
                <span className="text-sm font-bold text-white">
                  {correctCount} / {exam.questions.length}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PASS CRITERIA</span>
                <span className="text-sm font-bold text-emerald-400">
                  {exam.passingScore}% Pass
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">STATUS</span>
                <span className="text-sm font-bold text-blue-400">Registered</span>
              </div>
            </div>
          </div>

          {/* Question-by-Question Detailed Review */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
              Question-by-Question Item Analysis
            </h4>

            {exam.questions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No questions stored for this archive.</p>
            ) : (
              <div className="space-y-3">
                {exam.questions.map((q) => {
                  const studentAns = (session?.answers?.[q.id] || []).sort();
                  const correctAns = (q.correctOptionIndices || []).sort();
                  const isCorrect =
                    studentAns.length === correctAns.length &&
                    studentAns.every((v, i) => v === correctAns[i]);
                  const isExpanded = expandedQuestion === q.id;

                  return (
                    <div
                      key={q.id}
                      className={`rounded-xl border transition-all ${
                        isCorrect
                          ? 'border-slate-200 bg-white'
                          : 'border-rose-200/90 bg-rose-50/20'
                      }`}
                    >
                      {/* Accordion Bar */}
                      <button
                        onClick={() =>
                          setExpandedQuestion(isExpanded ? null : q.id)
                        }
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-mono font-semibold text-slate-600 mr-2">
                              Q{q.id}.
                            </span>
                            <span className="text-xs font-medium text-slate-900 line-clamp-1">
                              {q.prompt}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono text-slate-500">
                            {isCorrect ? `+${q.marks}` : '0'} / {q.marks} pts
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Review Details */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3 text-xs">
                          <p className="font-semibold text-slate-800 leading-relaxed">{q.prompt}</p>

                          {q.codeSnippet && (
                            <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                              {q.codeSnippet}
                            </pre>
                          )}

                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt, oIdx) => {
                              const isStudentSelected = studentAns.includes(oIdx);
                              const isCorrectOpt = correctAns.includes(oIdx);

                              let optStyle = 'border-slate-200 bg-slate-50 text-slate-700';
                              if (isCorrectOpt) {
                                optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium';
                              } else if (isStudentSelected && !isCorrectOpt) {
                                optStyle = 'border-rose-300 bg-rose-50 text-rose-900';
                              }

                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${optStyle}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold w-4">
                                      {String.fromCharCode(65 + oIdx)}.
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                  <div className="shrink-0 font-mono text-[11px]">
                                    {isCorrectOpt && (
                                      <span className="text-emerald-700 font-semibold">
                                        ✓ Correct Answer
                                      </span>
                                    )}
                                    {isStudentSelected && !isCorrectOpt && (
                                      <span className="text-rose-700 font-semibold">
                                        ✗ Your Selection
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Instructor Explanation */}
                          <div className="mt-3 p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-950">
                            <span className="font-semibold block mb-0.5 text-blue-900">
                              Faculty Explanation:
                            </span>
                            <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Oxford Registry Ref: OX-EXAM-2026-CS301-8841
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Dismiss Report
          </button>
        </div>
      </div>
    </div>
  );
};
