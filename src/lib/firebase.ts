import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export { onAuthStateChanged, type User };
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Exam, StudentExamSession } from '../types/exam';
import { MOCK_EXAMS } from '../data/mockExams';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling protocol mandated by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore on startup
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Authentication helpers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync user profile into /users/{uid}
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Oxford Scholar',
          role: result.user.email?.includes('faculty') ? 'faculty' : 'student',
          candidateId: `CS-2024-${result.user.uid.substring(0, 4).toUpperCase()}`,
          department: 'Computer Science',
          lastLogin: new Date().toISOString()
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error('Authentication failure:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Database Operations: Exams
export async function fetchAllExamsFromDb(): Promise<Exam[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'exams'));
    if (querySnapshot.empty) {
      // Seed default curriculum exams if database is currently empty
      await seedDefaultExams();
      return MOCK_EXAMS;
    }
    const exams: Exam[] = [];
    querySnapshot.forEach((docSnap) => {
      exams.push(docSnap.data() as Exam);
    });
    return exams;
  } catch (error) {
    console.warn('Fallback to local exams due to Firestore connection:', error);
    return MOCK_EXAMS;
  }
}

export async function seedDefaultExams(): Promise<void> {
  try {
    for (const exam of MOCK_EXAMS) {
      const examRef = doc(db, 'exams', exam.id);
      await setDoc(examRef, exam);
    }
  } catch (error) {
    console.warn('Could not seed initial exams:', error);
  }
}

export async function saveExamToDb(exam: Exam): Promise<void> {
  try {
    const examRef = doc(db, 'exams', exam.id);
    await setDoc(examRef, exam);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `exams/${exam.id}`);
  }
}

// Database Operations: Submissions & Results
export async function saveSubmissionToDb(
  exam: Exam,
  session: StudentExamSession,
  user: User | null
): Promise<void> {
  const submissionId = `sub-${exam.id}-${Date.now()}`;
  const submissionData = {
    id: submissionId,
    examId: exam.id,
    examCode: exam.code,
    examTitle: exam.title,
    studentUid: user ? user.uid : 'anon-student-8841',
    studentName: user ? user.displayName || 'Elena Vance' : 'Elena Vance',
    studentId: user ? `CS-2024-${user.uid.substring(0, 4).toUpperCase()}` : 'CS-2024-8841',
    score: exam.studentScore || 0,
    totalPossible: exam.totalMarks,
    grade: exam.studentGrade || 'A',
    percentage: exam.totalMarks > 0 ? Math.round(((exam.studentScore || 0) / exam.totalMarks) * 100) : 0,
    answers: session.answers,
    notes: session.notes,
    submittedAt: new Date().toISOString()
  };

  try {
    const subRef = doc(db, 'submissions', submissionId);
    await setDoc(subRef, submissionData);
  } catch (error) {
    console.warn('Could not persist submission to Firestore, saved to local state:', error);
  }
}

export async function fetchUserSubmissions(uid: string): Promise<any[]> {
  try {
    const q = query(collection(db, 'submissions'), where('studentUid', '==', uid));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach((d) => results.push(d.data()));
    return results;
  } catch (error) {
    console.warn('Could not load remote submissions:', error);
    return [];
  }
}
