import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Minimize2,
  FileEdit,
  Shield,
  HelpCircle,
  Video,
  Wifi,
  WifiOff,
  Database,
  CloudCheck,
  FileText
} from 'lucide-react';
import { Exam, StudentExamSession } from '../types/exam';

interface ExamActiveViewProps {
  exam: Exam;
  session: StudentExamSession;
  onUpdateAnswer: (questionId: number, optionIndex: number, isMultiSelect?: boolean) => void;
  onUpdateDescriptiveAnswer?: (questionId: number, text: string) => void;
  onClearAnswer: (questionId: number) => void;
  onToggleReview: (questionId: number) => void;
  onUpdateNotes: (notes: string) => void;
  onSubmitExam: () => void;
  onExitExam: () => void;
}

export const ExamActiveView: React.FC<ExamActiveViewProps> = ({
  exam,
  session,
  onUpdateAnswer,
  onUpdateDescriptiveAnswer,
  onClearAnswer,
  onToggleReview,
  onUpdateNotes,
  onSubmitExam,
  onExitExam
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'unanswered' | 'flagged'>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(session.timeRemainingSeconds);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSavedTime, setLastSavedTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline_cached'>('saved');

  // Network monitor for Activity Diagram: Internet Disconnected -> Maintain Saved Answers Locally -> Reconnect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSaveStatus('offline_cached');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmitExam]);

  const questions = exam.questions;
  const currentQuestion = questions[currentQIndex];

  // Helper stats (handling both MCQ and Descriptive questions)
  const isQuestionAnswered = (q: (typeof questions)[0]) => {
    if (q.type === 'descriptive') {
      return ((session.descriptiveAnswers && session.descriptiveAnswers[q.id]) || '').trim().length > 0;
    }
    return (session.answers[q.id] || []).length > 0;
  };

  const answeredCount = questions.filter(isQuestionAnswered).length;
  const flaggedCount = Object.keys(session.markedForReview).filter(
    (k) => session.markedForReview[Number(k)]
  ).length;
  const unansweredCount = questions.length - answeredCount;

  // Format time MM:SS or HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const isLowTime = timeRemaining < 300; // less than 5 mins

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation for options (1,2,3,4 or A,B,C,D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in notes textarea
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' && currentQIndex < questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQIndex > 0) {
        setCurrentQIndex((prev) => prev - 1);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (currentQuestion && optIdx < currentQuestion.options.length) {
          onUpdateAnswer(currentQuestion.id, optIdx, currentQuestion.type === 'multiple_choice');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQIndex, currentQuestion, onUpdateAnswer, questions.length]);

  const currentSelected = session.answers[currentQuestion?.id] || [];
  const isCurrentFlagged = !!session.markedForReview[currentQuestion?.id];

  // Palette filter logic
  const filteredPaletteQuestions = questions.filter((q) => {
    const isAns = isQuestionAnswered(q);
    const isFlag = !!session.markedForReview[q.id];
    if (paletteFilter === 'unanswered') return !isAns;
    if (paletteFilter === 'flagged') return isFlag;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Examination Banner / Deep Navy Bar */}
      <header className="h-16 bg-[#0B132B] text-white px-6 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-30 shadow-xs">
        {/* Left: Exam ID & Subject Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-mono font-bold text-xs text-white">
            {exam.code.split('-')[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-blue-400">
                {exam.code}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">·</span>
              <span className="text-xs font-semibold text-slate-100 truncate max-w-xs md:max-w-md">
                {exam.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Question {currentQIndex + 1} of {questions.length} · {currentQuestion?.marks} Marks
            </p>
          </div>
        </div>

        {/* Center: Clearly Visible Countdown Timer */}
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-[#141E38] border border-slate-700/80 shadow-inner">
          <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`} />
          <div className="text-center">
            <span
              className={`font-mono text-base sm:text-lg font-bold tracking-wider tabular-nums ${
                isLowTime ? 'text-rose-400' : 'text-white'
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-sans">
              Time Remaining
            </span>
          </div>
        </div>

        {/* Right: Auto-Save Status, Proctor Status & Submission */}
        <div className="flex items-center gap-3">
          {/* Continuous Auto-Save Status (Activity Diagram Swimlane 2: Auto-save answers continuously to database) */}
          {saveStatus === 'saved' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#132042] border border-slate-700/60 text-[11px] text-slate-300" title="Auto-saved to Cloud Firestore & Local Cache">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Draft Synced ({lastSavedTime})</span>
            </div>
          )}
          {saveStatus === 'saving' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#132042] border border-blue-500/60 text-[11px] text-blue-300 animate-pulse">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Auto-Saving Draft...</span>
            </div>
          )}
          {saveStatus === 'offline_cached' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-600/60 text-[11px] text-amber-300">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline Draft Maintained</span>
            </div>
          )}

          {/* Proctor Active Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#132042] border border-slate-700/60 text-[11px] text-slate-300">
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Invigilator Synced</span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#141E38] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Submit Exam Royal Blue Button */}
          <button
            onClick={onSubmitExam}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finish & Submit</span>
          </button>
        </div>
      </header>

      {/* Main Examination Viewport Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        {/* Left: Question Presentation Area */}
        <main className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Question Header & Kicker */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Question {currentQuestion?.id}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentQuestion?.section}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                {currentQuestion?.type === 'multiple_choice'
                  ? 'Multiple Choice (Select all that apply)'
                  : currentQuestion?.type === 'descriptive'
                  ? 'Descriptive Synthesis (Subjective / Proof)'
                  : 'Single Choice'}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-700 font-mono">
              +{currentQuestion?.marks} Marks
            </div>
          </div>

          {/* Question Content Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-5">
            {/* Question Text */}
            <h2 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed tracking-tight">
              {currentQuestion?.prompt}
            </h2>

            {/* Code Snippet (If Present) */}
            {currentQuestion?.codeSnippet && (
              <div className="rounded-lg bg-slate-900 text-slate-100 p-4 border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* DESCRIPTIVE QUESTION RESPONSE WORKSPACE (Activity Diagram: Answer Descriptive Questions) */}
            {currentQuestion?.type === 'descriptive' ? (
              <div className="space-y-4 pt-1">
                {/* Rubric and Examiner Guidance Banner */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-700" />
                      <span>Examiner Evaluation Rubric</span>
                    </span>
                    <span className="text-[11px] font-mono text-blue-700 font-medium">
                      Graded by Faculty / Examiner
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Provide a well-structured technical response. State invariants, algorithm steps, and time/space complexities. Your response will be reviewed by the faculty examiner during post-exam grading.
                  </p>
                </div>

                {/* Candidate Essay / Descriptive Text Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <label className="font-semibold text-slate-800">
                      Your Written Solution / Technical Response:
                    </label>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span>
                        Words: <strong className="text-slate-800">
                          {((session.descriptiveAnswers?.[currentQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length)}
                        </strong> / {currentQuestion.maxWords || 350} Max
                      </span>
                      <span>·</span>
                      <span>
                        Chars: {(session.descriptiveAnswers?.[currentQuestion.id] || '').length}
                      </span>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={session.descriptiveAnswers?.[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setSaveStatus('saving');
                      onUpdateDescriptiveAnswer?.(currentQuestion.id, e.target.value);
                      setTimeout(() => {
                        setSaveStatus(isOnline ? 'saved' : 'offline_cached');
                        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                      }, 500);
                    }}
                    placeholder="Type your structured academic response here. Reference mathematical invariants, algorithmic complexities, and design trade-offs where applicable..."
                    className="w-full p-4 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs md:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white leading-relaxed resize-y transition-colors"
                  />
                </div>

                {/* Auto-Save & Sync Assurance Banner */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>Swimlane 2: Draft autosaved continuously to avoid data loss</span>
                  </span>
                  <span className="font-mono text-slate-600">
                    {isOnline ? `Cloud Synced (${lastSavedTime})` : 'Offline Cached Locally'}
                  </span>
                </div>
              </div>
            ) : (
              /* MCQ Options Selection List */
              <div className="space-y-3 pt-2">
                {currentQuestion?.options.map((option, idx) => {
                  const isSelected = currentSelected.includes(idx);
                  const optionLetter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        onUpdateAnswer(
                          currentQuestion.id,
                          idx,
                          currentQuestion.type === 'multiple_choice'
                        )
                      }
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 group cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Letter Key Pill / Check Indicator */}
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        {optionLetter}
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 pt-0.5">
                        <span
                          className={`text-xs md:text-sm leading-relaxed ${
                            isSelected ? 'text-blue-950 font-medium' : 'text-slate-800'
                          }`}
                        >
                          {option}
                        </span>
                      </div>

                      {/* Radio/Checkbox indicator */}
                      <div className="pt-1">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Action Strip: Review, Clear, Prev/Next */}
          <div className="p-4 md:px-6 bg-slate-50/90 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            {/* Left Actions: Review & Clear */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleReview(currentQuestion.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  isCurrentFlagged
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                <span>{isCurrentFlagged ? 'Flagged for Review' : 'Mark for Review'}</span>
              </button>

              {(currentSelected.length > 0 || (currentQuestion?.type === 'descriptive' && !!session.descriptiveAnswers?.[currentQuestion?.id])) && (
                <button
                  onClick={() => {
                    onClearAnswer(currentQuestion.id);
                    if (currentQuestion?.type === 'descriptive') {
                      onUpdateDescriptiveAnswer?.(currentQuestion.id, '');
                    }
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Response</span>
                </button>
              )}
            </div>

            {/* Right Actions: Previous & Next */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1 focus:ring-2 focus:ring-blue-500/30"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onSubmitExam}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right: Question Navigation Palette Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          {/* Palette Container */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Navigation
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {answeredCount}/{questions.length} Solved
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Palette Filter Segmented Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-medium">
              <button
                onClick={() => setPaletteFilter('all')}
                className={`flex-1 py-1 rounded-md transition-colors text-center ${
                  paletteFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setPaletteFilter('unanswered')}
                className={`flex-1 py-1 rounded-md transition-colors text-center ${
                  paletteFilter === 'unanswered'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unanswered ({unansweredCount})
              </button>
              <button
                onClick={() => setPaletteFilter('flagged')}
                className={`flex-1 py-1 rounded-md transition-colors text-center ${
                  paletteFilter === 'flagged'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flagged ({flaggedCount})
              </button>
            </div>

            {/* Interactive Grid of Question Numbers */}
            <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQIndex;
                const isAnswered = isQuestionAnswered(q);
                const isFlagged = !!session.markedForReview[q.id];

                // Styling logic based on state
                let stateClasses = 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                if (isAnswered && !isFlagged) {
                  stateClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
                } else if (isFlagged && !isAnswered) {
                  stateClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
                } else if (isAnswered && isFlagged) {
                  stateClasses = 'bg-emerald-50 text-emerald-900 border-amber-400 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-10 rounded-lg border text-xs font-mono relative transition-all duration-150 flex items-center justify-center cursor-pointer ${stateClasses} ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 border-blue-600 font-bold' : ''
                    }`}
                  >
                    <span>{q.id}</span>
                    {isFlagged && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-300"></span>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border-2 border-blue-600"></span>
                <span>Current Question</span>
              </div>
            </div>
          </div>

          {/* Interactive Scratchpad / Notes Drawer */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-blue-600" />
                <span>Examinee Scratchpad</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Private / Autosaved</span>
            </div>
            <textarea
              rows={4}
              value={session.notes}
              onChange={(e) => onUpdateNotes(e.target.value)}
              placeholder="Use this area for quick rough calculations, algorithm steps, or notes during your exam..."
              className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Emergency Proctor Contact / Assistance */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[11px] text-slate-500">
              Technical issues or test anomalies?
            </p>
            <button
              onClick={() => alert('Invigilator notified. A proctor has received your attention ping.')}
              className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ping Invigilator Support</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
