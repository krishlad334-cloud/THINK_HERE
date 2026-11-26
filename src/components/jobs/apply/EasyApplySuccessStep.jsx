import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function EasyApplySuccessStep({ job, submittedRecord }) {
  return (
    <div className="py-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-cyan-50 border border-[#0891b2]/30 text-[#0891b2] flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-black text-slate-900">
          Your application was sent to {job.company}!
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          You applied for <strong>{job.title}</strong> using{' '}
          <strong>{submittedRecord?.resumeLabel || 'OverThink Verified Profile'}</strong>.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          Applicant #{submittedRecord?.applicantNumber || job.applicantsCount || 1}
        </span>
        <span className="px-3 py-1 rounded-full bg-[#ecfeff] text-[#0891b2] border border-[#0891b2]/25 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{job.industry}</span>
        </span>
      </div>
    </div>
  );
}
