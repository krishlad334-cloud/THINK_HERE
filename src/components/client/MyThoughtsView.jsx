import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTimeRemaining, timeAgo } from '../../utils/formatters';
import {
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle,
  PlusCircle,
  Search,
  ArrowRight
} from 'lucide-react';

export default function MyThoughtsView({ filterMode = 'all' }) {
  const { thoughts, setSelectedThoughtId, setIsNewThoughtModalOpen, triggerAIFallback } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Career & Jobs', 'Product & Innovation', 'Business & Startups', 'Technology & IT', 'Marketing & Growth'];

  // Filter thoughts
  const filtered = thoughts.filter((t) => {
    // Check mode filter (e.g., if navigated from "Consultant Responses" or "AI Responses")
    if (filterMode === 'consultant_responses') {
      const hasHuman = t.solutions?.some(s => !s.isAIGenerated);
      if (!hasHuman) return false;
    }
    if (filterMode === 'ai_responses') {
      const hasAI = t.solutions?.some(s => s.isAIGenerated) || t.status === 'ai_fallback';
      if (!hasAI) return false;
    }

    if (activeCategory !== 'All' && t.category !== activeCategory) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {filterMode === 'consultant_responses'
              ? 'Human Consultant Solutions'
              : filterMode === 'ai_responses'
              ? 'AI-Generated Fallback Solutions'
              : 'My Thoughts & Questions'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, track 24h countdowns, and explore solutions provided by verified experts and AI
          </p>
        </div>

        <button
          onClick={() => setIsNewThoughtModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#16a34a]" />
          <span>New Thought</span>
        </button>
      </div>

      {/* Search & Category Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#004845] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
          />
        </div>
      </div>

      {/* Thoughts Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No thoughts match your current filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or submit a new thought to start a 24-hour consultation.
          </p>
          <button
            onClick={() => setIsNewThoughtModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#004845] text-white text-xs font-bold hover:bg-[#003331] cursor-pointer"
          >
            Start a Thought
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((thought) => {
            const timeInfo = calculateTimeRemaining(thought.createdAt, thought.deadlineHours || 24);
            const humanSols = thought.solutions?.filter(s => !s.isAIGenerated) || [];
            const aiSols = thought.solutions?.filter(s => s.isAIGenerated) || [];

            return (
              <div
                key={thought.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 hover:border-[#004845]/40 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f2f1] text-[#004845]">
                      {thought.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {timeAgo(thought.createdAt)}
                    </span>

                    {/* Status Pill */}
                    {humanSols.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Human Solution Provided
                      </span>
                    ) : aiSols.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 24h AI Fallback Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" /> In Consultant Review
                      </span>
                    )}

                    {thought.urgency === 'High (Urgent)' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        Urgent
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="text-base font-bold text-slate-900 hover:text-[#004845] cursor-pointer transition-colors leading-snug"
                  >
                    {thought.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {thought.description}
                  </p>

                  {/* Consultant / AI Assigned info */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                    {thought.assignedConsultantName && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <img
                          src={thought.assignedConsultantAvatar}
                          alt={thought.assignedConsultantName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>Handled by {thought.assignedConsultantName}</span>
                      </span>
                    )}

                    {thought.attachments && thought.attachments.length > 0 && (
                      <span className="text-slate-400">
                        • {thought.attachments.length} attachment(s)
                      </span>
                    )}

                    {/* Timer */}
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {timeInfo.isExpired ? '24h Timer Finished' : `${timeInfo.hours}h ${timeInfo.minutes}m remaining`}
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {aiSols.length === 0 && (
                    <button
                      onClick={() => triggerAIFallback(thought.id)}
                      className="px-3 py-2 rounded-xl bg-[#e6f2f1] hover:bg-[#d4ecea] text-[#004845] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Trigger 24h AI Fallback Blueprint"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>AI Fallback</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="px-4 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#16a34a]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
