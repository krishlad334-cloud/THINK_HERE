import React, { useRef } from 'react';
import { FileText, Loader2, ShieldCheck, Upload } from 'lucide-react';

function YesNoButtons({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {['Yes', 'No'].map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
            value === option
              ? 'bg-[#020617] text-white border-[#020617]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function EasyApplyQuestionsStep({
  job,
  resumeProfile,
  useScannedResume,
  onToggleResumeMode,
  isScanningUpload,
  onUploadFile,
  yearsExp,
  onYearsExpChange,
  meetsQualification,
  onMeetsQualificationChange,
  matchesWorkMode,
  onMatchesWorkModeChange,
  coverNote,
  onCoverNoteChange,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black text-slate-900">Resume / CV</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={(event) => {
              const picked = event.target.files?.[0];
              if (picked) onUploadFile(picked);
              event.target.value = '';
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanningUpload}
            className="text-xs font-bold text-[#0891b2] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isScanningUpload ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>
              {resumeProfile ? 'Upload another resume' : 'Upload resume (PDF, DOCX, TXT)'}
            </span>
          </button>
        </div>

        {resumeProfile && (
          <label
            className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
              useScannedResume
                ? 'border-[#0891b2] bg-[#ecfeff]/60'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="resumeChoice"
              checked={useScannedResume}
              onChange={() => onToggleResumeMode(true)}
              className="mt-1 accent-[#0891b2]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 text-[#0891b2] flex-shrink-0" />
                <span className="truncate">{resumeProfile.fileName}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Scanned {resumeProfile.skills.length} skills • {resumeProfile.primaryIndustry}
              </p>
            </div>
          </label>
        )}

        <label
          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
            !useScannedResume || !resumeProfile
              ? 'border-[#020617] bg-slate-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="resumeChoice"
            checked={!useScannedResume || !resumeProfile}
            onChange={() => onToggleResumeMode(false)}
            className="mt-1 accent-[#020617]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0891b2] flex-shrink-0" />
              <span>Use OverThink Verified Profile</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Includes your verified contact info, role headline, and experience details.
            </p>
          </div>
        </label>
      </div>

      <div className="space-y-3.5 pt-2 border-t border-slate-100">
        <span className="text-xs font-black text-slate-900 block">
          Additional Screening Questions
        </span>

        <div className="space-y-1.5">
          <label
            htmlFor="apply-exp-years"
            className="block text-xs font-semibold text-slate-700"
          >
            How many years of experience do you have in {job.industry}?{' '}
            <span className="text-rose-500">*</span>
          </label>
          <input
            id="apply-exp-years"
            type="number"
            min="0"
            max="50"
            value={yearsExp}
            onChange={(event) => onYearsExpChange(event.target.value)}
            className="w-full sm:w-40 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>

        <div className="space-y-1.5">
          <span className="block text-xs font-semibold text-slate-700">
            Do you hold the core qualification (
            {job.qualifications?.[0] || `${job.industry} background`})?
          </span>
          <YesNoButtons value={meetsQualification} onChange={onMeetsQualificationChange} />
        </div>

        <div className="space-y-1.5">
          <span className="block text-xs font-semibold text-slate-700">
            Are you comfortable with this work setup ({job.location} • {job.type})?
          </span>
          <YesNoButtons value={matchesWorkMode} onChange={onMatchesWorkModeChange} />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="apply-cover-note"
            className="block text-xs font-semibold text-slate-700"
          >
            Note for Hiring Manager (optional)
          </label>
          <textarea
            id="apply-cover-note"
            rows={2}
            value={coverNote}
            onChange={(event) => onCoverNoteChange(event.target.value)}
            placeholder="Briefly highlight why you are a great fit for this role..."
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>
      </div>
    </div>
  );
}
