import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const SCAN_STAGES = [
  'Reading resume file structure and text content',
  'Scanning technical and industry-specific skills',
  'Extracting degrees, licenses, and work experience',
  'Matching career interests against all industry roles',
];

export default function ResumeScanningStep({ scanStageIndex }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#020617] text-white flex items-center justify-center flex-shrink-0">
          <Loader2 className="w-5 h-5 text-[#22d3ee] animate-spin" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Scanning & Analyzing Your Resume...
          </h3>
          <p className="text-xs text-slate-500">
            Extracting your skills, qualifications, experience, and multi-sector matches.
          </p>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        {SCAN_STAGES.map((stageLabel, idx) => {
          const isDone = scanStageIndex > idx;
          const isCurrent = scanStageIndex === idx;
          return (
            <div
              key={stageLabel}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                isDone
                  ? 'bg-white border-cyan-200 text-slate-900'
                  : isCurrent
                    ? 'bg-[#ecfeff] border-[#0891b2]/40 text-[#020617]'
                    : 'bg-white/60 border-slate-200/70 text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#0891b2] flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-[#0891b2] animate-spin flex-shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
              )}
              <span>{stageLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
