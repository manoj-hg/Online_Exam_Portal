import React, { useState, useEffect } from 'react';
import { MOCK_EXAMS } from './data/mockExams';
import { Exam, StudentExamSession } from './types/exam';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { ExamActiveView } from './components/ExamActiveView';
import { SubmitConfirmModal } from './components/SubmitConfirmModal';
import { ExamResultsModal } from './components/ExamResultsModal';
import { FacultyProctorView } from './components/FacultyProctorView';
import { CreateExamModal } from './components/CreateExamModal';
import { ExamRulesModal } from './components/ExamRulesModal';
import { SystemDiagramsView } from './components/SystemDiagramsView';
import { AuthDatabaseDashboardView } from './components/AuthDatabaseDashboardView';
import { LoginModal } from './components/LoginModal';
import { LoginPortalView, AuthenticatedPortalUser } from './components/LoginPortalView';
import { auth, onAuthStateChanged, logoutUser, fetchAllExamsFromDb, saveExamToDb, saveSubmissionToDb } from './lib/firebase';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AddQuestionModal } from './components/AddQuestionModal';
import { ExamInstructionsModal } from './components/ExamInstructionsModal';
import { ExamQuestion } from './types/exam';
import { Calendar, Clock, BookOpen, Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [cachedFirebaseUser, setCachedFirebaseUser] = useState<any>(null);

  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'student' | 'faculty'>('student');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Pre-examination details & instructions modal (Activity Diagram: Select Available Exam -> Display Exam Details & Instructions -> Start Exam)
  const [pendingExamForInstructions, setPendingExamForInstructions] = useState<Exam | null>(null);

  // Admin access verification state for admin@123 / admin@123
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState<boolean>(false);

  // Active examination state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [activeSession, setActiveSession] = useState<StudentExamSession | null>(null);

  // Modals state
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState<boolean>(false);
  const [selectedResultExam, setSelectedResultExam] = useState<Exam | null>(null);
  const [submittedSessionCache, setSubmittedSessionCache] = useState<StudentExamSession | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Handle full portal login before entering website
  const handlePortalLogin = (user: AuthenticatedPortalUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setIsAuthenticated(true);
    sessionStorage.setItem('examsphere_authenticated', 'true');
    sessionStorage.setItem('examsphere_user', JSON.stringify(user));

    if (user.isAdmin) {
      setIsAdminVerified(true);
      localStorage.setItem('examsphere_admin_verified', 'true');
    } else {
      setIsAdminVerified(false);
      localStorage.removeItem('examsphere_admin_verified');
    }

    setIsRulesModalOpen(true);
  };

  // Handle sign out back to pre-entry login module
  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore if session was local credential-based
    }
    sessionStorage.removeItem('examsphere_authenticated');
    sessionStorage.removeItem('examsphere_user');
    localStorage.removeItem('examsphere_admin_verified');
    setIsAuthenticated(false);
    setIsAdminVerified(false);
    setCurrentUser(null);
    setUserRole('student');
    setCurrentTab('dashboard');
    setActiveExam(null);
    setActiveSession(null);
  };

  // Handle successful Admin login
  const handleAdminVerificationSuccess = () => {
    setIsAdminVerified(true);
    localStorage.setItem('examsphere_admin_verified', 'true');
    setUserRole('faculty');
    const adminUser = {
      uid: 'admin-123',
      displayName: 'Administrator (admin@123)',
      email: 'admin@123',
      candidateId: 'FAC-0491',
      department: 'Computer Science',
      role: 'faculty' as const,
      isAdmin: true
    };
    setCurrentUser(adminUser);
    sessionStorage.setItem('examsphere_authenticated', 'true');
    sessionStorage.setItem('examsphere_user', JSON.stringify(adminUser));
    setIsAuthenticated(true);
  };

  // Add question to target exam paper and persist to Cloud Firestore
  const handleAddQuestion = (examId: string, newQuestion: ExamQuestion) => {
    setExams((prev) => {
      const updatedList = prev.map((exam) => {
        if (exam.id === examId) {
          const updatedQuestions = [...(exam.questions || []), newQuestion];
          const updatedExam: Exam = {
            ...exam,
            questions: updatedQuestions,
            questionCount: updatedQuestions.length,
            totalMarks: (exam.totalMarks || 0) + newQuestion.marks
          };
          saveExamToDb(updatedExam);
          return updatedExam;
        }
        return exam;
      });
      return updatedList;
    });
  };

  // Connect Firebase Auth and load cloud Firestore exams on boot
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCachedFirebaseUser(user || null);
    });

    fetchAllExamsFromDb()
      .then((dbExams) => {
        if (dbExams && dbExams.length > 0) {
          setExams(dbExams);
        }
      })
      .catch((err) => console.warn('Could not load exams from db:', err));

    return () => unsubscribe();
  }, []);

  // Step 1: Request starting an examination -> Show details & instructions first (Activity & Use Case diagrams)
  const handleStartExam = (exam: Exam) => {
    setPendingExamForInstructions(exam);
  };

  // Step 2: Candidate confirms reading instructions -> Start active examination & countdown
  const handleConfirmStartExam = (exam: Exam) => {
    const newSession: StudentExamSession = {
      examId: exam.id,
      answers: {},
      descriptiveAnswers: {},
      markedForReview: {},
      visitedQuestions: { 1: true },
      notes: '',
      startedAt: Date.now(),
      timeRemainingSeconds: exam.durationMinutes * 60,
      isSubmitted: false
    };

    setActiveExam(exam);
    setActiveSession(newSession);
    setPendingExamForInstructions(null);
  };

  // Update descriptive text response (Activity Diagram: Answer Descriptive Questions)
  const handleUpdateDescriptiveAnswer = (questionId: number, text: string) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        descriptiveAnswers: {
          ...(prev.descriptiveAnswers || {}),
          [questionId]: text
        }
      };
    });
  };

  // Update answer in active exam
  const handleUpdateAnswer = (questionId: number, optionIndex: number, isMultiSelect = false) => {
    if (!activeSession) return;

    setActiveSession((prev) => {
      if (!prev) return prev;
      const current = prev.answers[questionId] || [];
      let updated: number[];

      if (isMultiSelect) {
        if (current.includes(optionIndex)) {
          updated = current.filter((i) => i !== optionIndex);
        } else {
          updated = [...current, optionIndex];
        }
      } else {
        updated = [optionIndex];
      }

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: updated
        }
      };
    });
  };

  // Clear answer
  const handleClearAnswer = (questionId: number) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return prev;
      const nextAnswers = { ...prev.answers };
      delete nextAnswers[questionId];
      return {
        ...prev,
        answers: nextAnswers
      };
    });
  };

  // Toggle review flag
  const handleToggleReview = (questionId: number) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return prev;
      const currentFlag = !!prev.markedForReview[questionId];
      return {
        ...prev,
        markedForReview: {
          ...prev.markedForReview,
          [questionId]: !currentFlag
        }
      };
    });
  };

  // Update notes scratchpad
  const handleUpdateNotes = (notes: string) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes
      };
    });
  };

  // Final submit handler
  const handleFinalSubmit = () => {
    if (!activeExam || !activeSession) return;

    // Calculate score
    let earnedMarks = 0;
    activeExam.questions.forEach((q) => {
      const studentAns = (activeSession.answers[q.id] || []).sort();
      const correctAns = (q.correctOptionIndices || []).sort();
      const isCorrect =
        studentAns.length === correctAns.length &&
        studentAns.every((val, idx) => val === correctAns[idx]);

      if (isCorrect) {
        earnedMarks += q.marks;
      }
    });

    const percent = Math.round((earnedMarks / activeExam.totalMarks) * 100);
    const grade =
      percent >= 90
        ? 'A'
        : percent >= 80
        ? 'B'
        : percent >= 70
        ? 'C'
        : percent >= 60
        ? 'D'
        : 'F';

    const updatedExam: Exam = {
      ...activeExam,
      status: 'completed',
      studentScore: earnedMarks,
      studentGrade: grade,
      studentPercentile: Math.min(99, Math.max(50, percent + 2)),
      studentCompletedDate: 'Just now'
    };

    // Update exams list
    setExams((prev) =>
      prev.map((e) => (e.id === activeExam.id ? updatedExam : e))
    );

    const completedSession: StudentExamSession = {
      ...activeSession,
      isSubmitted: true,
      score: earnedMarks,
      submittedAt: new Date().toLocaleTimeString()
    };

    // Persist submission into Firestore cloud database
    saveSubmissionToDb(updatedExam, completedSession, currentUser);

    setSubmittedSessionCache(completedSession);
    setSelectedResultExam(updatedExam);

    // Close active examination and modal
    setIsSubmitConfirmOpen(false);
    setActiveExam(null);
    setActiveSession(null);
  };

  // Add new exam paper created by faculty and persist to Firestore
  const handleSaveNewExam = (newExam: Exam) => {
    saveExamToDb(newExam);
    setExams((prev) => [newExam, ...prev]);
  };

  // PRE-ENTRY AUTHENTICATION GATE: Show Login Page before getting into the main page
  if (!isAuthenticated) {
    return (
      <LoginPortalView
        onLoginSuccess={handlePortalLogin}
        cachedFirebaseUser={cachedFirebaseUser}
      />
    );
  }

  // IF ACTIVE EXAMINATION IS RUNNING -> RENDER DISTRACTION-FREE EXAM SCREEN
  if (activeExam && activeSession) {
    return (
      <>
        <ExamActiveView
          exam={activeExam}
          session={activeSession}
          onUpdateAnswer={handleUpdateAnswer}
          onUpdateDescriptiveAnswer={handleUpdateDescriptiveAnswer}
          onClearAnswer={handleClearAnswer}
          onToggleReview={handleToggleReview}
          onUpdateNotes={handleUpdateNotes}
          onSubmitExam={() => setIsSubmitConfirmOpen(true)}
          onExitExam={() => {
            if (confirm('Are you sure you want to exit? Your progress will remain saved.')) {
              setActiveExam(null);
            }
          }}
        />

        {/* Confirmation Modal */}
        <SubmitConfirmModal
          isOpen={isSubmitConfirmOpen}
          onClose={() => setIsSubmitConfirmOpen(false)}
          onConfirmSubmit={handleFinalSubmit}
          exam={activeExam}
          session={activeSession}
        />
      </>
    );
  }

  // STANDARD WORKSPACE (SIDEBAR + TOPNAV + MAIN CONTENT)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-row font-sans">
      {/* Deep Navy Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenRules={() => setIsRulesModalOpen(true)}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onSignOut={handleSignOut}
        isAdminVerified={isAdminVerified}
        onRequireAdminAuth={() => setIsAdminAuthModalOpen(true)}
        onOpenAddQuestionModal={() => {
          if (!isAdminVerified) {
            setIsAdminAuthModalOpen(true);
          } else {
            setIsAddQuestionModalOpen(true);
          }
        }}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopNav
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          onOpenQuickDemo={() => {
            const demo = exams.find((e) => e.id === 'exam-cs-301');
            if (demo) handleStartExam(demo);
          }}
          onOpenNewExamModal={() => {
            if (!isAdminVerified) {
              setIsAdminAuthModalOpen(true);
            } else {
              setIsCreateExamModalOpen(true);
            }
          }}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          isAdminVerified={isAdminVerified}
          onRequireAdminAuth={() => setIsAdminAuthModalOpen(true)}
          onOpenAddQuestionModal={() => {
            if (!isAdminVerified) {
              setIsAdminAuthModalOpen(true);
            } else {
              setIsAddQuestionModalOpen(true);
            }
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB: DASHBOARD & ACTIVE EXAMS */}
          {(currentTab === 'dashboard' || currentTab === 'active_exams') && (
            <DashboardView
              exams={exams}
              searchQuery={searchQuery}
              currentUser={currentUser}
              onStartExam={handleStartExam}
              onViewResults={(exam) => setSelectedResultExam(exam)}
              onOpenRules={() => setIsRulesModalOpen(true)}
            />
          )}

          {/* TAB: RESULTS & GRADEBOOK */}
          {currentTab === 'results' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Results
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Completed exams and grades.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Overall</span>
                  <span className="text-lg font-bold text-blue-700 font-mono">
                    Grade A (91.0%)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {exams
                  .filter((e) => e.status === 'completed')
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {exam.code}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {exam.department}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Evaluated: {exam.studentCompletedDate} · Instructor: {exam.instructor}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block font-mono">
                            SCORE
                          </span>
                          <span className="text-lg font-bold font-mono text-slate-900">
                            {exam.studentScore} / {exam.totalMarks}
                          </span>
                        </div>

                        <div className="text-center px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                          <span className="text-xs font-bold text-emerald-800 font-mono block">
                            Grade {exam.studentGrade}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-mono">
                            Top {100 - (exam.studentPercentile || 90)}%
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedResultExam(exam)}
                          className="px-3.5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <span>Item Analysis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: TIMETABLE & SCHEDULE */}
          {currentTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Exam Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upcoming and completed exam dates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {exam.code}
                        </span>
                        <span className="font-medium text-slate-500">{exam.date}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">{exam.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Invigilator: {exam.instructor} ({exam.department})
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="font-mono">{exam.durationMinutes} Minutes Session</span>
                      <span className="font-medium text-slate-700">
                        {exam.status === 'available'
                          ? 'Room Open Now'
                          : exam.status === 'completed'
                          ? 'Completed'
                          : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FACULTY PROCTOR / INVIGILATION */}
          {(currentTab === 'proctor' || currentTab === 'students') && (
            <FacultyProctorView
              onOpenAddQuestionModal={() => {
                if (!isAdminVerified) {
                  setIsAdminAuthModalOpen(true);
                } else {
                  setIsAddQuestionModalOpen(true);
                }
              }}
            />
          )}

          {/* TAB: UML SYSTEM ARCHITECTURE DIAGRAMS */}
          {currentTab === 'diagrams' && <SystemDiagramsView />}

          {/* TAB: CLOUD AUTH & DATABASE OPERATIONS */}
          {currentTab === 'auth_db' && (
            <AuthDatabaseDashboardView
              currentUser={currentUser}
              userRole={userRole}
              setUserRole={setUserRole}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              exams={exams}
              onRefreshExams={async () => {
                const refreshed = await fetchAllExamsFromDb();
                setExams(refreshed);
              }}
              isAdminVerified={isAdminVerified}
              onRequireAdminAuth={() => setIsAdminAuthModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* Admin Authorization Verification Modal (admin@123 / admin@123) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminVerificationSuccess}
      />

      {/* Admin Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        exams={exams}
        onAddQuestion={handleAddQuestion}
      />

      {/* SSO & Candidate Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onDemoLogin={(role) => {
          if (role === 'faculty' && !isAdminVerified) {
            setIsAdminAuthModalOpen(true);
          } else {
            setUserRole(role);
            setCurrentUser(null);
          }
        }}
        onSuccessLogin={(user) => {
          setCurrentUser(user);
          if (user.email?.includes('faculty')) {
            setUserRole('faculty');
            setIsAdminVerified(true);
          }
        }}
        onAdminVerified={handleAdminVerificationSuccess}
      />

      {/* Exam Results & Detailed Breakdown Modal */}
      {selectedResultExam && (
        <ExamResultsModal
          isOpen={!!selectedResultExam}
          onClose={() => setSelectedResultExam(null)}
          exam={selectedResultExam}
          session={
            submittedSessionCache && submittedSessionCache.examId === selectedResultExam.id
              ? submittedSessionCache
              : undefined
          }
        />
      )}

      {/* Examination Regulations / Rules Modal */}
      <ExamRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Faculty Create Exam Paper Modal */}
      <CreateExamModal
        isOpen={isCreateExamModalOpen}
        onClose={() => setIsCreateExamModalOpen(false)}
        onSaveExam={handleSaveNewExam}
      />

      {/* Pre-Exam Instructions & Specifications Modal (Activity Diagram & Use Case) */}
      <ExamInstructionsModal
        isOpen={!!pendingExamForInstructions}
        onClose={() => setPendingExamForInstructions(null)}
        exam={pendingExamForInstructions}
        onConfirmStart={handleConfirmStartExam}
      />
    </div>
  );
}
