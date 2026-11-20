import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTimeRemaining, timeAgo } from '../../utils/formatters';
import {
  FileSearch,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  FileText,
  Star,
  MapPin,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  SlidersHorizontal,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import SolutionProposalModal from './SolutionProposalModal';

export default function BrowseClientThoughts() {
  const { thoughts, claimThought, consultantUser, setSelectedThoughtId, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [draftingThought, setDraftingThought] = useState(null);

  const categories = [
    'All',
    'Career & Jobs',
    'Technology & IT',
    'Business & Startups',
    'Product & Innovation',
    'Marketing & Growth'
  ];

  const filtered = thoughts.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (filterUrgency !== 'All' && t.urgency !== filterUrgency) return false;
    if (filterStatus === 'Open' && t.assignedConsultantId) return false;
    if (filterStatus === 'Claimed' && !t.assignedConsultantId) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchTags = t.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Freelancer.com Top Sub-Header & Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#e6f2f1] text-[#004845]">
              <FileSearch className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Browse Client Thoughts & Problem Feed
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30">
                  Freelancer Marketplace
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review client questions, inspect attached media, and take ownership to deliver solutions within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI stats on right */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Submissions</span>
            <span className="text-lg font-black text-slate-900">{thoughts.length}</span>
          </div>
          <div className="px-4 py-2.5 bg-[#f0fdf4] rounded-xl border border-[#16a34a]/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a] block">24h SLA Guarantee</span>
            <span className="text-lg font-black text-[#16a34a]">99.8%</span>
          </div>
        </div>
      </div>

      {/* Freelancer.com Horizontal Filter & Search Toolbar (No double-sidebar clutter!) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3.5">
        {/* Top search & quick toggles */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by keyword (e.g. Python, AWS, Startup, ATS, Logistics)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] bg-slate-50/50 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Urgency */}
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#004845]"
            >
              <option value="All">All Priorities</option>
              <option value="High (Urgent)">Urgent Expedited</option>
              <option value="Standard">Standard 24h Window</option>
            </select>

            {/* Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#004845]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open for Solutions</option>
              <option value="Claimed">Claimed / In Consultation</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#004845]"
            >
              <option value="latest">Sort: Latest Submissions</option>
              <option value="deadline">Sort: 24h Deadline (Expiring Soon)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' ? thoughts.length : thoughts.filter(t => t.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#004845] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Full-Width Responsive Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Main Feed: 3 Columns on XL, Full width on smaller */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
            <span>Showing <strong>{filtered.length}</strong> problem submissions matching filters</span>
            <span>24h Response SLA Guarantee in effect</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <FileSearch className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No submissions found</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filter parameters or search keywords.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setFilterUrgency('All'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#004845] text-white text-xs font-bold hover:bg-[#003331]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filtered.map((thought) => {
              const timeInfo = calculateTimeRemaining(thought.createdAt, thought.deadlineHours || 24);
              const isClaimedByMe = thought.assignedConsultantId === consultantUser.id;
              const isClaimedByOther = thought.assignedConsultantId && !isClaimedByMe;

              return (
                <div
                  key={thought.id}
                  className={`bg-white rounded-2xl border transition-all p-6 hover:shadow-md flex flex-col justify-between gap-5 ${
                    isClaimedByMe
                      ? 'border-[#16a34a] ring-1 ring-[#16a34a]/20'
                      : 'border-slate-200 hover:border-[#004845]'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header Row: Category, SLA Countdown Badge, Urgency, Price/Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#e6f2f1] text-[#004845]">
                          {thought.category}
                        </span>

                        {/* 24h Countdown Timer Pill */}
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          <span>{timeInfo.isExpired ? '24h Complete' : `${timeInfo.hours}h ${timeInfo.minutes}m remaining`}</span>
                        </span>

                        {thought.urgency === 'High (Urgent)' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Urgent Request
                          </span>
                        )}

                        {isClaimedByMe && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Claimed by You
                          </span>
                        )}
                      </div>

                      {/* Right: Status */}
                      <div>
                        <span className="text-xs font-extrabold text-slate-800">
                          {thought.status === 'in_consultation' ? 'Under Active Review' : 'Open for Solutions'}
                        </span>
                      </div>
                    </div>

                    {/* Problem Title */}
                    <h2
                      onClick={() => setSelectedThoughtId(thought.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#004845] cursor-pointer transition-colors leading-snug"
                    >
                      {thought.title}
                    </h2>

                    {/* Detailed Problem Context */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {thought.description}
                    </p>

                    {/* Tags */}
                    {thought.tags && thought.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {thought.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attached Media / Files */}
                    {thought.attachments && thought.attachments.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-500">Client Media Attachments:</span>
                        {thought.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                          >
                            {att.type === 'image' ? (
                              <ImageIcon className="w-3.5 h-3.5 text-[#16a34a]" />
                            ) : att.type === 'video' ? (
                              <Video className="w-3.5 h-3.5 text-[#16a34a]" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-[#16a34a]" />
                            )}
                            <span className="truncate max-w-[150px] font-medium">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={thought.clientAvatar}
                        alt={thought.clientName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">{thought.clientName}</span>
                        <span className="text-[10px] text-slate-400">Submitted {timeAgo(thought.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => setSelectedThoughtId(thought.id)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                      >
                        Inspect Details
                      </button>

                      {isClaimedByOther ? (
                        <span className="text-xs text-slate-400 italic">
                          Claimed by {thought.assignedConsultantName}
                        </span>
                      ) : isClaimedByMe ? (
                        <button
                          onClick={() => setDraftingThought(thought)}
                          className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-[#16a34a]/25 flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Deliver Solution / Roadmap</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => claimThought(thought.id)}
                          className="px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-md shadow-[#004845]/25 flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#16a34a]" />
                          <span>Claim & Accept Thought</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Freelancer.com Consultant Stats & Quick Tools Widget */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={consultantUser.avatar}
                alt={consultantUser.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {consultantUser.name}
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                </h4>
                <p className="text-[10px] text-slate-400">Verified Consultant & Admin</p>
                <span className="text-xs font-black text-slate-800">${consultantUser.hourlyRate}/hr</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Completed Consultations:</span>
                <span className="font-bold text-slate-900">{consultantUser.completedConsultations}</span>
              </div>
              <div className="flex justify-between">
                <span>Client Rating:</span>
                <span className="font-bold text-amber-600 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" /> {consultantUser.rating} ({consultantUser.reviewsCount})
                </span>
              </div>
              <div className="flex justify-between">
                <span>24h SLA Compliance:</span>
                <span className="font-bold text-[#16a34a]">100% On-Time</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => setActiveTab('my_consultations')}
                className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold text-left px-3 flex items-center justify-between transition-colors"
              >
                <span>My Active Consultations</span>
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold">
                  {thoughts.filter(t => t.assignedConsultantId === consultantUser.id).length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('admin_dashboard')}
                className="w-full py-2 rounded-xl bg-[#e6f2f1] hover:bg-[#d5eae8] text-[#004845] text-xs font-bold text-left px-3 flex items-center justify-between transition-colors"
              >
                <span>Platform Operations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Guaranteed 24-hr Policy Note */}
          <div className="bg-gradient-to-br from-[#004845] to-[#002f2d] text-white rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#16a34a]" />
              <h4 className="text-xs font-bold">24-Hour Solution SLA</h4>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              If an open thought is not claimed by a human consultant within 24 hours, the THINK AI Engine automatically drafts an actionable fallback blueprint.
            </p>
          </div>
        </div>
      </div>

      {/* Solution Proposal Modal */}
      {draftingThought && (
        <SolutionProposalModal
          thought={draftingThought}
          onClose={() => setDraftingThought(null)}
        />
      )}
    </div>
  );
}
