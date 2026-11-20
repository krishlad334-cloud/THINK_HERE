import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle,
  ExternalLink,
  Sparkles,
  UserCheck,
  Send,
  Building
} from 'lucide-react';

export default function ClientJobHub() {
  const { jobs, toggleSaveJob, applyJob, consultants, setSelectedThoughtId, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [appliedNotification, setAppliedNotification] = useState(null);

  const jobTypes = ['All', 'Remote', 'Full-time', 'Hybrid'];

  const filteredJobs = jobs.filter(j => {
    if (selectedType !== 'All') {
      if (selectedType === 'Remote' && !j.location.toLowerCase().includes('remote')) return false;
      if (selectedType === 'Full-time' && !j.type.toLowerCase().includes('full-time')) return false;
      if (selectedType === 'Hybrid' && !j.location.toLowerCase().includes('hybrid')) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchComp = j.company.toLowerCase().includes(q);
      const matchSkill = j.skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkill) return false;
    }
    return true;
  });

  const handleApply = (job) => {
    applyJob(job.id);
    setAppliedNotification(`Application successfully submitted to ${job.company} via your verified THINK profile!`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  const careerConsultant = consultants.find(c => c.skills?.some(s => s.includes('Career') || s.includes('Resume')));

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Toast alert */}
      {appliedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-[#004845]" />
            <span>Job & Career Opportunities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized opportunities matched to your skill profile, with direct access to career mentors
          </p>
        </div>

        {careerConsultant && (
          <div className="flex items-center gap-3 p-3 bg-[#e6f2f1] rounded-2xl border border-[#004845]/20">
            <img
              src={careerConsultant.avatar}
              alt={careerConsultant.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#16a34a]"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">{careerConsultant.name}</p>
              <p className="text-[10px] text-[#004845] font-medium">Career Advisor Available</p>
            </div>
            <button
              onClick={() => setActiveTab('find_consultants')}
              className="px-2.5 py-1 rounded-lg bg-[#004845] hover:bg-[#003331] text-white text-[11px] font-bold cursor-pointer"
            >
              Consult
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedType === type
                  ? 'bg-[#004845] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, skill or company..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#004845]"
          />
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#004845]/40 hover:shadow-md transition-all flex flex-col sm:flex-row items-start justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-4">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {job.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {job.matchPercentage} Match
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="text-slate-400">• {job.type}</span>
                    <span className="text-slate-400">• Posted {job.postedAgo}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {job.description}
              </p>

              {/* Skills required */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Career Consultant recommendation */}
              {job.recommendedConsultant && (
                <div className="text-[11px] text-[#004845] bg-[#e6f2f1] p-2.5 rounded-xl border border-[#004845]/20 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0" />
                  <span>
                    Suggested Coach: <strong>{job.recommendedConsultant}</strong> can review your resume before applying.
                  </span>
                </div>
              )}
            </div>

            {/* Right Action column */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 self-stretch sm:self-center flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="text-sm font-extrabold text-slate-900 block">{job.salary}</span>
                <span className="text-[10px] text-slate-400">{job.applicantsCount || 0} applicants</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    job.isSaved
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={job.isSaved ? 'Job Saved' : 'Save Job'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={() => handleApply(job)}
                  disabled={job.isApplied}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                    job.isApplied
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-[#004845] hover:bg-[#003331] text-white'
                  }`}
                >
                  {job.isApplied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Easy Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
