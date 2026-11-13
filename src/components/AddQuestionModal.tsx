import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Code2, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';
import { Exam, ExamQuestion } from '../types/exam';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: Exam[];
  onAddQuestion: (examId: string, question: ExamQuestion) => void;
  defaultExamId?: string;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  exams,
  onAddQuestion,
  defaultExamId
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(
    defaultExamId || (exams.length > 0 ? exams[0].id : '')
  );
  const [section, setSection] = useState('Core Algorithms');
  const [questionType, setQuestionType] = useState<'single_choice' | 'multiple_choice' | 'code_snippet' | 'descriptive'>('single_choice');
  const [marks, setMarks] = useState<number>(6);
  const [prompt, setPrompt] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [maxWords, setMaxWords] = useState<number>(350);
  const [options, setOptions] = useState<string[]>([
    'Option A',
    'Option B',
    'Option C',
    'Option D'
  ]);
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMsg('Please enter a question prompt.');
      return;
    }

    if (questionType !== 'descriptive') {
      if (options.some((opt) => !opt.trim())) {
        setErrorMsg('Please fill in all 4 options.');
        return;
      }
    } else {
      if (!modelAnswer.trim()) {
        setErrorMsg('Please provide a model answer or grading rubric for examiner evaluation.');
        return;
      }
    }

    const currentExam = exams.find((e) => e.id === selectedExamId);
    const nextId = (currentExam?.questions?.length || 0) + 1;

    const newQuestion: ExamQuestion = {
      id: nextId,
      section: section.trim() || 'General Section',
      type: questionType,
      marks: Number(marks) || 5,
      prompt: prompt.trim(),
      codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
      options: questionType === 'descriptive' ? [] : options.map((o) => o.trim()),
      correctOptionIndices: questionType === 'descriptive' ? [] : [correctOptionIdx],
      explanation: explanation.trim() || 'Official answer verified by academic board.',
      modelAnswer: questionType === 'descriptive' ? modelAnswer.trim() : undefined,
      maxWords: questionType === 'descriptive' ? Number(maxWords) || 350 : undefined
    };

    onAddQuestion(selectedExamId, newQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-[#0B132B] text-white flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
              <span className="font-mono bg-blue-500/30 px-2 py-0.5 rounded border border-blue-400/30">
                ADMIN
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Add Question
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Add a new MCQ or written question to an exam.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Exam Target & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Exam
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.code}: {ex.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Topic / Section
              </label>
              <input
                type="text"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. Dynamic Programming"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Question Type & Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="single_choice">Single Choice (MCQ)</option>
                <option value="code_snippet">Code Analysis (MCQ)</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="descriptive">Written / Descriptive</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Marks
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Question
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the question..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
            />
          </div>

          {/* Optional Code Snippet */}
          {questionType === 'code_snippet' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Code Snippet:
              </label>
              <textarea
                rows={4}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="int algorithm(int n) { ... }"
                className="w-full p-2.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg border border-slate-800 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* DESCRIPTIVE SPECIFIC FIELDS (Model Answer Rubric & Max Words) */}
          {questionType === 'descriptive' ? (
            <div className="space-y-3 p-4 bg-blue-50/60 border border-blue-200/70 rounded-xl">
              <div>
                <label className="block font-semibold text-blue-950 mb-1">
                  Model Answer & Grading Rubric
                </label>
                <textarea
                  rows={4}
                  required
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  placeholder="Key points required for full marks..."
                  className="w-full p-3 bg-white border border-blue-200 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-blue-950 mb-1">
                  Word Limit
                </label>
                <input
                  type="number"
                  min={50}
                  max={1500}
                  value={maxWords}
                  onChange={(e) => setMaxWords(Number(e.target.value))}
                  className="w-36 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          ) : (
            /* Options & Radio for Correct Answer */
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">
                  Options (pick the correct answer)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Correct: {String.fromCharCode(65 + correctOptionIdx)}
                </span>
              </div>

              {options.map((opt, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border flex items-center gap-3 transition-colors ${
                    correctOptionIdx === i
                      ? 'border-emerald-300 bg-emerald-50/60'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOptionIdx === i}
                    onChange={() => setCorrectOptionIdx(i)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-slate-600 w-5">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 bg-transparent border-0 focus:outline-none text-slate-900 font-medium text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Answer Explanation (optional)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Brief explanation shown after grading..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Save Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
