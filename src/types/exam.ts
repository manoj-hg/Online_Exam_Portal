export type QuestionType = 'single_choice' | 'multiple_choice' | 'code_snippet' | 'descriptive';

export interface ExamQuestion {
  id: number;
  section: string;
  type: QuestionType;
  marks: number;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndices: number[];
  explanation: string;
  modelAnswer?: string;
  maxWords?: number;
}

export type ExamStatus = 'available' | 'scheduled' | 'completed';

export interface Exam {
  id: string;
  code: string;
  title: string;
  department: string;
  instructor: string;
  instructorRole: string;
  date: string;
  timeWindow: string;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  status: ExamStatus;
  proctoringMode: 'Strict Invigilation' | 'Webcam & Screen Lock' | 'Standard Proctored';
  passingScore: number;
  studentScore?: number;
  studentGrade?: string;
  studentPercentile?: number;
  studentCompletedDate?: string;
  instructions: string[];
  questions: ExamQuestion[];
  details?: string;
  isPublished?: boolean;
}

export interface StudentExamSession {
  examId: string;
  answers: Record<number, number[]>; // questionId -> option indices for MCQ
  descriptiveAnswers: Record<number, string>; // questionId -> text for descriptive questions
  markedForReview: Record<number, boolean>;
  visitedQuestions: Record<number, boolean>;
  notes: string;
  startedAt: number; // timestamp ms
  timeRemainingSeconds: number;
  isSubmitted: boolean;
  score?: number;
  submittedAt?: string;
  lastSavedAt?: string;
  isDraftSavedLocally?: boolean;
}

export interface ProctorStudentSession {
  id: string;
  studentName: string;
  studentId: string;
  examCode: string;
  answeredCount: number;
  totalQuestions: number;
  timeRemainingMinutes: number;
  status: 'active' | 'warning' | 'submitted';
  webcamStatus: 'connected' | 'disconnected' | 'flagged';
  lastActivity: string;
  descriptiveGraded?: boolean;
}

