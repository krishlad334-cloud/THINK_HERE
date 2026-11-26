import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Briefcase,
  Compass,
  Eye,
  EyeOff,
  FileText,
  RotateCcw,
  Trash2,
  Wrench,
} from 'lucide-react';

export default function ResumeProfileSummary({
  resumeProfile,
  recommendedCount,
  onOpenPasteBox,
  onUploadAnother,
  onClearResume,
}) {
  const [showScannedPreview, setShowScannedPreview] = useState(false);

  const experienceLabel =
    resumeProfile.experienceYears > 0
      ? `${resumeProfile.experienceYears}+ Years`
      : resumeProfile.hasInternship
        ? 'Internship / Projects'
        : 'Early Career / Fresher';

  return (
    <div className="space-y-5">
      {resumeProfile.warning && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{resumeProfile.warning}</span>
          </div>
          <button
            type="button"
            onClick={onOpenPasteBox}
            className="text-xs font-bold underline flex-shrink-0 cursor-pointer"
          >
            Paste Resume Text
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#ecfeff]/70 border border-[#0891b2]/25 rounded-2xl px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
          <div className="p-2.5 rounded-xl bg-white border border-[#0891b2]/25 text-[#0891b2] flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {resumeProfile.fileName}
            </p>
            <p className="text-[11px] text-slate-600 truncate">
              {resumeProfile.headline} • {resumeProfile.wordCount} words scanned
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white text-[#020617] border border-[#0891b2]/30">
            Primary Field: {resumeProfile.primaryIndustry}
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#020617] text-white">
            {recommendedCount} Recommended Jobs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Wrench className="w-3.5 h-3.5 text-[#0891b2]" />
            <span>Skills ({resumeProfile.skills.length})</span>
          </div>
          {resumeProfile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resumeProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">
              No recognizable skills extracted. Check scanned text or paste content.
            </p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Award className="w-3.5 h-3.5 text-[#0891b2]" />
            <span>Qualifications ({resumeProfile.qualifications.length})</span>
          </div>
          {resumeProfile.qualifications.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resumeProfile.qualifications.map((qual) => (
                <span
                  key={qual}
                  className="px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-[11px] font-semibold text-cyan-900"
                >
                  {qual}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">
              No formal degrees or certifications detected.
            </p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Briefcase className="w-3.5 h-3.5 text-[#0891b2]" />
            <span>Experience</span>
          </div>
          <p className="text-sm font-black text-slate-900">{experienceLabel}</p>
          <span className="inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
            {resumeProfile.seniorityLevel}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Compass className="w-3.5 h-3.5 text-[#0891b2]" />
            <span>Interests & Focus</span>
          </div>
          {resumeProfile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resumeProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">Open across all sectors.</p>
          )}
        </div>
      </div>

      {showScannedPreview && resumeProfile.rawText && (
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
          {resumeProfile.rawText}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onUploadAnother}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Another</span>
          </button>
          <button
            type="button"
            onClick={() => setShowScannedPreview((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {showScannedPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showScannedPreview ? 'Hide Scanned Text' : 'Inspect Scanned Text'}</span>
          </button>
          <button
            type="button"
            onClick={onClearResume}
            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
