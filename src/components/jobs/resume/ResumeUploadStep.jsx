import React, { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { SAMPLE_RESUMES } from '../../../data/resumeTaxonomy';

export default function ResumeUploadStep({
  initialDraftText,
  showPasteBox,
  selectedSampleId,
  onTogglePasteBox,
  onCancelPasteBox,
  onFileSelected,
  onPasteSubmit,
  onSampleSelect,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draftText, setDraftText] = useState(initialDraftText || '');

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!draftText.trim()) return;
    onPasteSubmit(draftText);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md,.csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
          event.target.value = '';
        }}
        className="hidden"
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#0891b2] bg-[#ecfeff]/70'
            : 'border-slate-200 bg-slate-50/80 hover:border-[#020617]/40 hover:bg-slate-50'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mx-auto mb-3.5">
          <Upload className="w-6 h-6 text-[#0891b2]" />
        </div>
        <p className="text-sm sm:text-base font-bold text-slate-900">
          Drop your resume here or click to browse
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports PDF (text-based), DOCX, TXT, and Markdown resumes
        </p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          Choose Resume File
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (!showPasteBox) {
              setDraftText(initialDraftText || '');
            }
            onTogglePasteBox();
          }}
          className="text-xs font-bold text-[#0891b2] hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showPasteBox ? 'Hide paste box' : 'Or paste resume text manually'}</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <label
            className="text-xs font-semibold text-slate-500 flex-shrink-0"
            htmlFor="sample-resume-select"
          >
            Quick test profile:
          </label>
          <select
            id="sample-resume-select"
            value={selectedSampleId}
            onChange={(event) => onSampleSelect(event.target.value)}
            className="w-full sm:w-auto max-w-full px-3 py-2 sm:py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 cursor-pointer"
          >
            <option value="">Select sample resume...</option>
            {SAMPLE_RESUMES.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showPasteBox && (
        <form
          onSubmit={handleFormSubmit}
          className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
        >
          <textarea
            rows={5}
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            placeholder="Paste your skills, qualifications, work experience, and career interests..."
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancelPasteBox}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!draftText.trim()}
              className="px-4 py-2 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              Scan Text & Continue
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
