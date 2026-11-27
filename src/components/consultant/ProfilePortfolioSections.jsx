import React from 'react';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

export default function ProfilePortfolioSections({ consultantUser, hourlyRate, isVerified }) {
  if (!consultantUser) return null;

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#020617]" />
          <span>Consultation Services & Offerings</span>
        </h2>

        {consultantUser.services?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultantUser.services.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{srv.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{srv.duration}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">${srv.price}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#020617] border border-slate-200">
                    Fixed Scope
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Standard 1-on-1 OverThink consultation rate: ${hourlyRate}/hr.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#020617]" />
            <span>Work Experience</span>
          </h2>
          {consultantUser.experience?.length > 0 ? (
            <div className="space-y-4">
              {consultantUser.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-6 pb-4 border-l-2 border-[#020617]/20 last:border-0 last:pb-0"
                >
                  <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#020617] ring-4 ring-white" />
                  <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                  <p className="text-[11px] font-semibold text-[#020617]">
                    {exp.company} • {exp.period}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No work experience entries added yet.</p>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#0891b2]" />
            <span>Education & Certifications</span>
          </h2>

          {consultantUser.education?.length > 0 ? (
            <div className="space-y-3">
              {consultantUser.education.map((edu) => (
                <div key={edu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">{edu.school}</h4>
                  <p className="text-xs text-slate-600">
                    {edu.degree} ({edu.year})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No education history added yet.</p>
          )}

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Certifications
            </h3>
            {consultantUser.certifications?.length > 0 ? (
              <div className="space-y-1.5">
                {consultantUser.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {isVerified
                  ? 'OverThink Verified Consultant Certification'
                  : 'Pass the Consultant Qualification Exam to earn your Verified status.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#020617]" />
          <span>Featured Portfolio Projects & Case Studies</span>
        </h2>

        {consultantUser.portfolio?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {consultantUser.portfolio.map((port) => (
              <div key={port.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ecfeff] text-[#0891b2] border border-[#0891b2]/30">
                  {port.tag}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{port.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{port.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No portfolio case studies published yet.</p>
        )}
      </div>
    </>
  );
}
