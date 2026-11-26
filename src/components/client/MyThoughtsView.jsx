import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import { timeAgo } from '../../utils/formatters';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  PlusCircle,
  Search,
  Lock,
  X
} from 'lucide-react';

export default function MyThoughtsView() {
  const {
    thinks,
    thoughts,
    activeUser,
    currentUser,
    setSelectedThoughtId,
    startNewChat,
    openChatWithThought
  } = useApp();

  const user = activeUser || currentUser;
  const allThinks = thinks || thoughts || [];

  const myThinks = allThinks.filter((t) => {
    if (!user) return false;
    if (t.clientId && user.id && t.clientId === user.id) return true;
    if (user.id === 'client_001' && (t.clientId === 'client_001' || t.clientId === 'user-client-1')) return true;
    if (user.email && t.clientEmail && t.clientEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (t.clientName && user.name && t.clientName.trim().toLowerCase() === user.name.trim().toLowerCase()) return true;
    return false;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Career & Jobs', 'Product & Innovation', 'Business & Startups', 'Technology & IT', 'Marketing & Growth'];

  const filtered = myThinks.filter((t) => {
    if (activeCategory !== 'All' && t.category !== activeCategory) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = t.id?.toLowerCase().includes(q);
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      const matchStatus = t.status?.toLowerCase().includes(q);
      const matchCons = t.assignedConsultantName?.toLowerCase().includes(q);
      const matchUrgency = t.urgency?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc && !matchCat && !matchStatus && !matchCons && !matchUrgency) return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
      case 'pending_human':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-cyan-600" />
            <span>Accepted</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-sky-600" />
            <span>Resolved</span>
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Closed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Thoughts & Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status, review consultant acceptance, and collaborate in 1-on-1 consultations
          </p>
        </div>

        <button
          onClick={startNewChat}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#0891b2]" />
          <span>New Thought</span>
        </button>
      </div>

      <div className="space-y-3.5">
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your thoughts, roadmaps & questions by title, keyword, category, or #ID..."
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#020617] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 font-medium px-1 sm:px-0 flex-shrink-0">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> of {myThinks.length} thoughts
            </span>
            {(searchQuery || activeCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-[#0891b2] hover:text-[#0e7490] font-bold text-xs underline cursor-pointer ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">
            {searchQuery
              ? `No thoughts found matching "${searchQuery}"`
              : 'No thoughts match your current filters'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try using different keywords, searching by #ID, or reset your filters.'
              : 'Try selecting a different category or submit a new thought to start a consultation.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {(searchQuery || activeCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Clear Search & Filters
              </button>
            )}
            <button
              onClick={startNewChat}
              className="px-4 py-2 rounded-xl bg-[#020617] text-white text-xs font-bold hover:bg-[#091528] cursor-pointer"
            >
              Start a Thought
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((thought) => (
            <div
              key={thought.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 hover:border-[#020617]/40 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{thought.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfeff] text-[#020617]">
                      {thought.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {timeAgo(thought.createdAt)}
                    </span>

                    {getStatusBadge(thought.status)}

                    {thought.urgency === 'High (Urgent)' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        Urgent
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="text-base font-bold text-slate-900 hover:text-[#020617] cursor-pointer transition-colors leading-snug"
                  >
                    {thought.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                    {thought.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                    {thought.assignedConsultantName ? (
                      <span className="flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                        <UserAvatar
                          src={thought.assignedConsultantAvatar}
                          name={thought.assignedConsultantName}
                          role="consultant"
                          size="xs"
                        />
                        <span>Accepted by {thought.assignedConsultantName}</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">
                        Waiting for consultant acceptance...
                      </span>
                    )}

                    {thought.attachments && thought.attachments.length > 0 && (
                      <span className="text-slate-400">
                        • {thought.attachments.length} file(s)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {thought.assignedConsultantName && (
                    <button
                      onClick={() => openChatWithThought(thought.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#0891b2]" />
                      <span>Consultation Chat</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
