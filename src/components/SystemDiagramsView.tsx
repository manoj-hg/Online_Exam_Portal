import React, { useState } from 'react';
import { Network, Download, ZoomIn, Eye, Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const SystemDiagramsView: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<'usecase' | 'activity'>('usecase');
  const [modalImage, setModalImage] = useState<string | null>(null);

  const usecaseImg = '/assets/aistudio/a7c7c5b3-5174-419e-b6dc-ef86e4ee2792_382d5737.jpg';
  const activityImg = '/assets/aistudio/f715b9bc-2d63-478b-b26d-d8f0516f6148_c0de2084.jpg';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
            <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              SOFTWARE ARCHITECTURE
            </span>
            <span>UML Specification Documents</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ExamSphere System Use Case & Activity Diagrams
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineering blueprint defining system actors, interaction boundaries, and sequential workflow execution.
          </p>
        </div>

        {/* Diagram Switcher Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveDiagram('usecase')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeDiagram === 'usecase'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Use Case Diagram
          </button>
          <button
            onClick={() => setActiveDiagram('activity')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeDiagram === 'activity'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Activity Diagram
          </button>
        </div>
      </div>

      {/* Main Diagram Presentation */}
      {activeDiagram === 'usecase' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                ExamSphere UML Use Case Diagram
              </h2>
              <p className="text-xs text-slate-500">
                Functional boundary outlining Candidate, Faculty Invigilator, and Automated Proctor actors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={usecaseImg}
                download="ExamSphere_UseCase_Diagram.jpg"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save High-Res Image</span>
              </a>
              <button
                onClick={() => setModalImage(usecaseImg)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </button>
            </div>
          </div>

          {/* High Resolution Image Container */}
          <div
            onClick={() => setModalImage(usecaseImg)}
            className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 cursor-pointer group relative shadow-xs"
          >
            <img
              src={usecaseImg}
              alt="ExamSphere UML Use Case Diagram"
              className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-slate-900/80 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md">
                <Eye className="w-3.5 h-3.5" />
                <span>Click to View Full Size</span>
              </span>
            </div>
          </div>

          {/* Architectural Notes & Actors Grid (Matching Uploaded Use Case Diagram) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Actor 1: Student</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside mt-2">
                <li>Login & Authenticate User</li>
                <li>View Available Exams & Examination Details</li>
                <li>Read Instructions & Start Examination</li>
                <li>Attend Examination & Navigate Questions</li>
                <li>Answer MCQ & Descriptive Questions</li>
                <li>Mark Questions for Review</li>
                <li>Automatic Time Tracking & Continuous Autosave</li>
                <li>Submit Exam (Manual or Time Expired Auto-Submit)</li>
                <li>View Exam History & Published Results</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Actor 2: Faculty / Examiner</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside mt-2">
                <li>Login & Access Faculty Dashboard</li>
                <li>Create & Edit Examinations</li>
                <li>Configure Exam Date, Duration & Instructions</li>
                <li>Add MCQ Questions (Set Correct Answers)</li>
                <li>Add Descriptive Questions & Assign Marks</li>
                <li>View Student Submissions</li>
                <li>Evaluate Descriptive Answers & Calculate Final Marks</li>
                <li>Publish Official Results</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Actor 3: Administrator (admin@123)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside mt-2">
                <li>Login (Protected: admin@123 / pass: admin@123)</li>
                <li>Access Admin Dashboard & System Statistics</li>
                <li>Manage Students (Add & Verify Students)</li>
                <li>Manage Faculty (Add & Assign Faculty)</li>
                <li>Manage User Roles & Access Gates</li>
                <li>Manage & Audit All Examinations</li>
                <li>Monitor Live Examination Activities & Proctor Feeds</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Activity Diagram */}
      {activeDiagram === 'activity' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                ExamSphere UML Activity Diagram (Workflow Execution)
              </h2>
              <p className="text-xs text-slate-500">
                4-Swimlane architecture: Student, Examination System, Cloud Database, and Faculty / Examiner.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={activityImg}
                download="ExamSphere_Activity_Diagram.jpg"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save High-Res Image</span>
              </a>
              <button
                onClick={() => setModalImage(activityImg)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </button>
            </div>
          </div>

          {/* High Resolution Image Container */}
          <div
            onClick={() => setModalImage(activityImg)}
            className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 cursor-pointer group relative shadow-xs"
          >
            <img
              src={activityImg}
              alt="ExamSphere UML Activity Diagram"
              className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-slate-900/80 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md">
                <Eye className="w-3.5 h-3.5" />
                <span>Click to View Full Size</span>
              </span>
            </div>
          </div>

          {/* Execution Swimlanes Walkthrough */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-mono text-[10px] text-blue-700 font-bold block mb-1">
                SWIMLANE 1 · STUDENT
              </span>
              <p className="text-slate-700 font-medium">Login $\rightarrow$ Select Available Exam $\rightarrow$ Read Instructions $\rightarrow$ Answer MCQ & Descriptive questions $\rightarrow$ Review answers $\rightarrow$ Manual or Time-Expired Auto-Submit.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-mono text-[10px] text-indigo-700 font-bold block mb-1">
                SWIMLANE 2 · EXAM SYSTEM
              </span>
              <p className="text-slate-700 font-medium">Authenticates user $\rightarrow$ Displays details & instructions $\rightarrow$ Generates questions $\rightarrow$ Continuous Autosave & local draft resilience $\rightarrow$ Evaluates MCQs automatically $\rightarrow$ Displays results.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-mono text-[10px] text-emerald-700 font-bold block mb-1">
                SWIMLANE 3 · CLOUD DATABASE
              </span>
              <p className="text-slate-700 font-medium">Validates credentials $\rightarrow$ Retrieves exam dates & durations $\rightarrow$ Stores saved answer drafts $\rightarrow$ Saves final submissions $\rightarrow$ Segregates Objective vs Descriptive data.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-mono text-[10px] text-amber-700 font-bold block mb-1">
                SWIMLANE 4 · FACULTY / EXAMINER
              </span>
              <p className="text-slate-700 font-medium">Reviews submitted descriptive answers $\rightarrow$ Grades qualitative responses $\rightarrow$ Computes composite marks $\rightarrow$ Publishes final results to candidate portal.</p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="max-w-6xl w-full max-h-[92vh] overflow-auto bg-white rounded-2xl p-2 border border-slate-700 shadow-2xl">
            <img
              src={modalImage}
              alt="UML Diagram Full Resolution"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
