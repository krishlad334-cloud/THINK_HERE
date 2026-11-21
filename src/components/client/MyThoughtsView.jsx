import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import UserAvatar from '../common/UserAvatar';
import { calculateTimeRemaining, timeAgo, formatDate } from '../../utils/formatters';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  PlusCircle,
  Search,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function MyThoughtsView({ filterMode = 'all' }) {
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

  // Filter strictly to only thoughts submitted by the currently logged-in user
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

  // Filter thoughts by category and search
  const filtered = myThinks.filter((t) => {
    if (activeCategory !== 'All' && t.category !== activeCategory) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc && !matchCat) return false;
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-teal-600" />
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
      {/* Header */}
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
            placeholder="Search problems, #think_id..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] font-medium"
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
            onClick={startNewChat}
            className="mt-4 px-4 py-2 rounded-xl bg-[#004845] text-white text-xs font-bold hover:bg-[#003331] cursor-pointer"
          >
            Start a Thought
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((thought) => {
            const timeInfo = calculateTimeRemaining(thought.createdAt, thought.deadlineHours || 24);

            return (
              <div
                key={thought.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 hover:border-[#004845]/40 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{thought.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f2f1] text-[#004845]">
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
                    className="text-base font-bold text-slate-900 hover:text-[#004845] cursor-pointer transition-colors leading-snug"
                  >
                    {thought.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                    {thought.description}
                  </p>

                  {/* Consultant Assigned info */}
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

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {thought.assignedConsultantName && (
                    <button
                      onClick={() => openChatWithThought(thought.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
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
            );
          })}
        </div>
      )}
    </div>
  );
}
