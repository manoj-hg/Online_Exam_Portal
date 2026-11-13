import React, { useState } from 'react';
import { Download, ZoomIn, Eye } from 'lucide-react';

export const SystemDiagramsView: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const usecaseImg = '/assets/aistudio/a7c7c5b3-5174-419e-b6dc-ef86e4ee2792_382d5737.jpg';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Use Case Diagram
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Roles and actions for Students, Faculty, and Administrators.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={usecaseImg}
            download="ExamSphere_UseCase_Diagram.jpg"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
          <button
            onClick={() => setModalImage(usecaseImg)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Presentation */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-6">
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
              <span>View Full Size</span>
            </span>
          </div>
        </div>

        {/* Actors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Student</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside mt-2">
              <li>Sign in & view available exams</li>
              <li>Read instructions & start exam</li>
              <li>Answer MCQ & written questions</li>
              <li>Flag questions & auto-save drafts</li>
              <li>Submit & view published results</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Faculty / Examiner</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside mt-2">
              <li>Create & schedule exams</li>
              <li>Add MCQ & written questions</li>
              <li>Monitor live exam sessions</li>
              <li>Grade written answers</li>
              <li>Publish final results</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Administrator (admin@123)</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside mt-2">
              <li>Manage students & faculty</li>
              <li>Manage user roles & access</li>
              <li>Add questions & audit exams</li>
              <li>View activity logs & stats</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="max-w-6xl w-full max-h-[92vh] overflow-auto bg-white rounded-2xl p-2 border border-slate-700 shadow-2xl">
            <img
              src={modalImage}
              alt="Use Case Diagram Full Resolution"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
