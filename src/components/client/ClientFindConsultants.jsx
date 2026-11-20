import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  ShieldCheck,
  Clock,
  MessageSquare,
  Search,
  CheckCircle,
  Briefcase,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ClientFindConsultants() {
  const { consultants, setActiveTab, setSelectedThoughtId, thoughts } = useApp();
  const [filterSkill, setFilterSkill] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const skillsList = ['All', 'System Architecture', 'Career Transition', 'Go-To-Market', 'UI/UX Design', 'Resume ATS Overhaul'];

  const filtered = consultants.filter(c => {
    if (filterSkill !== 'All' && !c.skills?.includes(filterSkill)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSkill = c.skills?.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchSkill) return false;
    }
    return true;
  });

  const handleStartConsultationWith = (consultant) => {
    // If there is an existing thought, link to it; otherwise go to messages or open new thought
    const matchingThought = thoughts.find(t => t.assignedConsultantId === consultant.id);
    if (matchingThought) {
      setSelectedThoughtId(matchingThought.id);
      setActiveTab('messages');
    } else {
      setActiveTab('messages');
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-[#004845]" />
          <span>Find Verified Human Consultants</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Connect 1-on-1 with industry veterans, ex-FAANG leaders, and certified architects
        </p>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setFilterSkill(skill)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterSkill === skill
                  ? 'bg-[#004845] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search consultants by skill or name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#004845]"
          />
        </div>
      </div>

      {/* Consultants Grid - Wide 3-column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#004845]/40 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  {c.isVerified && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#16a34a] text-white" title="Verified Consultant">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {c.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>{c.rating}</span>
                      <span className="text-slate-400 font-normal">({c.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#004845] font-semibold line-clamp-1 mt-0.5">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{c.location}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {c.bio}
              </p>

              {/* Skills Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.skills?.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-sm font-extrabold text-slate-900">${c.hourlyRate}</span>
                <span className="text-[10px] text-slate-400">/hr • {c.responseTime}</span>
              </div>

              <button
                onClick={() => handleStartConsultationWith(c)}
                className="px-3.5 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Book / Consult</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
