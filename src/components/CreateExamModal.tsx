import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, ShieldAlert } from 'lucide-react';
import { Exam } from '../types/exam';

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExam: (newExam: Exam) => void;
}

export const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onSaveExam
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [instructor, setInstructor] = useState('Prof. Arthur Vance');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [questionCount, setQuestionCount] = useState(15);
  const [proctoringMode, setProctoringMode] = useState<'Strict Invigilation' | 'Webcam & Screen Lock' | 'Standard Proctored'>('Strict Invigilation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;

    const newExam: Exam = {
      id: `exam-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      code: code.toUpperCase(),
      title,
      department,
      instructor,
      instructorRole: 'Course Faculty Leader',
      date: 'Available Today',
      timeWindow: 'Flexible Open Session',
      durationMinutes,
      totalMarks,
      questionCount,
      status: 'available',
      proctoringMode,
      passingScore: 60,
      instructions: [
        'Standard university examination rules apply.',
        'Calculators and offline scratchpads within the interface are permitted.'
      ],
      questions: [
        {
          id: 1,
          section: 'Fundamental Principles',
          type: 'single_choice',
          marks: 10,
          prompt: `Initial question for ${code}: Which design pattern guarantees thread-safe single initialization?`,
          options: [
            'Double-Checked Locking with volatile reference',
            'Static initialization in Class Loader',
            'Eager initialization at startup',
            'All of the above'
          ],
          correctOptionIndices: [3],
          explanation: 'All listed options offer thread-safe singleton initialization depending on language semantics.'
        }
      ]
    };

    onSaveExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              New Exam
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create and publish an exam to the student dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS-450"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Data Systems">Data Systems</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exam Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Parallel Computing"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Marks
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Questions
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proctoring Mode
            </label>
            <select
              value={proctoringMode}
              onChange={(e) => setProctoringMode(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="Strict Invigilation">Strict (Webcam + Fullscreen)</option>
              <option value="Webcam & Screen Lock">Webcam & Screen Lock</option>
              <option value="Standard Proctored">Standard</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Publish Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
