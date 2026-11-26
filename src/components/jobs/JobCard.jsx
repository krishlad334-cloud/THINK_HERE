import React from 'react';
import {
  Bookmark,
  Briefcase,
  CheckCircle,
  Clock,
  GraduationCap,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { INDUSTRY_META } from '../../data/jobsCatalog';

export default function JobCard({ job, hasResume, onToggleSave, onApply }) {
  const industryTheme = INDUSTRY_META[job.industry] || {
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    accentBg: 'bg-[#020617]',
  };

  const matchedSkillsSet = new Set((job.matchedSkills || []).map((s) => s.toLowerCase()));
  const companyInitials = (job.company || 'OT')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase();

  return (
    <article
      className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border transition-all space-y-3.5 ${
        hasResume && job.isRecommended
          ? 'border-[#0891b2]/45 shadow-sm hover:border-[#0891b2] hover:shadow-md'
          : 'border-slate-200/90 hover:border-[#020617]/35 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`w-11 h-11 rounded-2xl ${industryTheme.accentBg} text-white flex items-center justify-center font-black text-xs sm:text-sm tracking-tight flex-shrink-0 shadow-xs`}
          >
            {companyInitials}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {job.title}
            </h3>
            <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate">
              {job.company}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
              hasResume && job.isRecommended
                ? 'bg-[#ecfeff] text-[#0891b2] border-[#0891b2]/35'
                : 'bg-cyan-50 text-cyan-700 border-cyan-200'
            }`}
          >
            {job.matchPercentage} {hasResume ? 'Resume Match' : 'Match'}
          </span>
          <span
            className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${industryTheme.badgeClass}`}
          >
            {job.industry}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-slate-500">
        <span
          className={`sm:hidden text-[10px] font-bold px-2 py-0.5 rounded-full border ${industryTheme.badgeClass}`}
        >
          {job.industry}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{job.location}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{job.experience}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>
            {job.type} • {job.postedAgo}
          </span>
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

      {hasResume && job.matchReasons?.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50/70 border border-cyan-200/70 text-[11px] text-cyan-950">
          <Sparkles className="w-3.5 h-3.5 text-[#0891b2] flex-shrink-0" />
          <span className="font-bold">Why it fits:</span>
          <span>{job.matchReasons.join(' • ')}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {(job.skills || []).map((skill) => {
          const isMatched = matchedSkillsSet.has(skill.toLowerCase());
          return (
            <span
              key={skill}
              className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                isMatched
                  ? 'bg-[#ecfeff] text-[#020617] border-[#0891b2]/40 font-semibold'
                  : 'bg-slate-100/90 text-slate-700 border-transparent font-medium'
              }`}
            >
              {isMatched ? `✓ ${skill}` : skill}
            </span>
          );
        })}
      </div>

      {job.qualifications?.length > 0 && (
        <p className="text-[11px] text-slate-500 flex items-start gap-1.5 leading-snug">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{job.qualifications.join(' • ')}</span>
        </p>
      )}

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-4">
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate">
            {job.salary}
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 block">
            {job.applicantsCount || 0} applicants
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              job.isSaved
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={job.isSaved ? 'Job Saved' : 'Save Job'}
            aria-label={job.isSaved ? 'Remove bookmark' : 'Save job'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => onApply(job)}
            disabled={job.isApplied}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap ${
              job.isApplied
                ? 'bg-cyan-100 text-cyan-900 cursor-default'
                : 'bg-[#020617] hover:bg-[#091528] text-white cursor-pointer'
            }`}
          >
            {job.isApplied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-[#0891b2]" />
                <span>Applied</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-[#0891b2]" />
                <span>Easy Apply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
