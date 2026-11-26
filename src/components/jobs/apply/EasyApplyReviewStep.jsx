import React from 'react';
import { Building2, FileText } from 'lucide-react';

export default function EasyApplyReviewStep({
  job,
  fullName,
  email,
  phone,
  city,
  resumeLabel,
  yearsExp,
  meetsQualification,
  matchesWorkMode,
  coverNote,
  followCompany,
  onFollowCompanyChange,
  onEditStep,
}) {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-[#ecfeff]/70 border border-[#0891b2]/25 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#020617] text-white flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-[#22d3ee]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{job.title}</p>
          <p className="text-[11px] text-slate-600 truncate">
            {job.company} • {job.salary}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <div className="p-3.5 flex items-start justify-between gap-3">
          <div className="space-y-0.5 text-xs min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Contact Info
            </span>
            <p className="font-bold text-slate-900">{fullName}</p>
            <p className="text-slate-600 break-all">{email}</p>
            <p className="text-slate-600">
              {phone} {city ? `• ${city}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs font-bold text-[#0891b2] hover:underline cursor-pointer flex-shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="p-3.5 flex items-start justify-between gap-3">
          <div className="space-y-0.5 text-xs min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Resume & Qualifications
            </span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0891b2] flex-shrink-0" />
              <span className="truncate">{resumeLabel}</span>
            </p>
            <p className="text-slate-600">
              {yearsExp} years {job.industry} experience • Qualification met: {meetsQualification} •
              Setup fit: {matchesWorkMode}
            </p>
            {coverNote.trim() && (
              <p className="text-slate-500 italic pt-1">&ldquo;{coverNote.trim()}&rdquo;</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-bold text-[#0891b2] hover:underline cursor-pointer flex-shrink-0"
          >
            Edit
          </button>
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={followCompany}
          onChange={(event) => onFollowCompanyChange(event.target.checked)}
          className="mt-0.5 accent-[#0891b2]"
        />
        <span>
          Follow <strong>{job.company}</strong> to get application status updates and similar role alerts.
        </span>
      </label>
    </div>
  );
}
