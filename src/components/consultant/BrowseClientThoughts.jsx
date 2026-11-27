import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import StatusBadge from '../common/StatusBadge';
import VerifiedBadge from '../common/VerifiedBadge';
import { isConsultantThought } from '../../utils/thoughtFilters';
import { timeAgo, formatDate } from '../../utils/formatters';
import {
  FileSearch,
  CheckCircle,
  Search,
  FileText,
  MessageSquare,
  Lock
} from 'lucide-react';

export default function BrowseClientThoughts() {
  const {
    thinks,
    thoughts,
    acceptThink,
    activeUser,
    setSelectedThoughtId,
    setActiveTab,
    openChatWithThought
  } = useApp();

  const allThinks = thinks || thoughts || [];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    'All',
    'Career & Jobs',
    'Technology & IT',
    'Business & Startups',
    'Product & Innovation',
    'Marketing & Growth'
  ];

  const filtered = allThinks.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;

    if (filterStatus === 'Pending') {
      if (t.status !== 'pending' && t.status !== 'pending_human') return false;
    } else if (filterStatus === 'Accepted') {
      if (t.status !== 'accepted') return false;
    } else if (filterStatus === 'In Progress') {
      if (t.status !== 'in_progress') return false;
    } else if (filterStatus === 'Resolved') {
      if (t.status !== 'resolved') return false;
    } else if (filterStatus === 'Closed') {
      if (t.status !== 'closed') return false;
    } else if (filterStatus === 'My Accepted') {
      if (!isConsultantThought(t, activeUser)) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id?.toLowerCase().includes(q);
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      const matchClient = t.clientName?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc && !matchCat && !matchClient) return false;
    }
    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime() || 0;
    const timeB = new Date(b.createdAt || 0).getTime() || 0;
    if (sortBy === 'oldest') return timeA - timeB;
    if (sortBy === 'urgent') {
      const isUrgent = (val) => {
        const str = String(val || '').toLowerCase();
        return str.includes('urgent') || str.includes('high') ? 1 : 0;
      };
      const diff = isUrgent(b.urgency) - isUrgent(a.urgency);
      if (diff !== 0) return diff;
    }
    return timeB - timeA;
  });

  const handleAccept = (thought) => {
    acceptThink(thought.id);
  };

  const handleOpenChat = (thought) => {
    openChatWithThought(thought.id);
  };

  const availableCount = allThinks.filter(t => t.status === 'pending' || t.status === 'pending_human').length;

  return (
    <div className="space-y-6 w-full pb-16">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ecfeff] text-[#020617] flex-shrink-0">
            <FileSearch className="w-5 h-5 text-[#0891b2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Available OverThinks & Client Submissions
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review client questions, claim ownership by clicking Accept OverThink, and enter direct 1-on-1 consultation chat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Available to Accept</span>
            <span className="text-base font-black text-amber-900">{availableCount}</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Submissions</span>
            <span className="text-base font-black text-slate-900">{allThinks.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by OverThink ID, keyword, client name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] bg-slate-50/50 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#020617] cursor-pointer flex-1 md:flex-initial"
            >
              <option value="Pending">Available OverThinks (Pending)</option>
              <option value="All">All Submissions</option>
              <option value="Accepted">Accepted OverThinks</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="My Accepted">My Accepted OverThinks</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#020617] cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="urgent">Sort: Urgent First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' ? allThinks.length : allThinks.filter(t => t.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#020617] text-white shadow-xs'
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
            <span>Showing <strong>{filtered.length}</strong> client submissions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <FileSearch className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No client submissions available</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {filterStatus === 'Pending'
                  ? 'All submitted OverThinks have been accepted, or no OverThinks have been submitted yet. Switch to Demo Client in the profile menu to submit a new OverThink, and it will appear here instantly!'
                  : 'No OverThinks match your search keywords or filter.'}
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setFilterStatus('All'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#020617] text-white text-xs font-bold hover:bg-[#091528] cursor-pointer"
              >
                View All Submissions
              </button>
            </div>
          ) : (
            filtered.map((thought) => {
              const assignedConsId = thought.consultantId || thought.assignedConsultantId;
              const isClaimedByMe = activeUser?.id && assignedConsId === activeUser.id;
              const isPending = thought.status === 'pending' || thought.status === 'pending_human';

              return (
                <div
                  key={thought.id}
                  className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 hover:shadow-md flex flex-col justify-between gap-4 ${
                    isClaimedByMe
                      ? 'border-[#0891b2] ring-1 ring-[#0891b2]/20'
                      : isPending
                      ? 'border-slate-200 hover:border-[#020617]'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                          #{thought.id}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ecfeff] text-[#020617]">
                          {thought.category}
                        </span>
                      </div>

                      <div>
                        <StatusBadge status={thought.status} variant="card" pendingLabel="Pending (Available)" />
                      </div>
                    </div>

                    <h2
                      onClick={() => setSelectedThoughtId(thought.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#020617] cursor-pointer transition-colors leading-snug"
                    >
                      {thought.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {thought.description}
                    </p>

                    {thought.attachments && thought.attachments.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-500">Client Attachments:</span>
                        {thought.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                            <span className="truncate max-w-[150px] font-medium">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        src={thought.clientAvatar}
                        name={thought.clientName}
                        role="client"
                        size="sm"
                        className="ring-1 ring-slate-200"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">{thought.clientName}</span>
                        <span className="text-[10px] text-slate-400">
                          Submitted {formatDate(thought.createdAt)} ({timeAgo(thought.createdAt)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => setSelectedThoughtId(thought.id)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        Inspect Details
                      </button>

                      {isPending ? (
                        <button
                          onClick={() => handleAccept(thought)}
                          className="px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-md shadow-[#020617]/25 flex items-center gap-1.5 transition-all cursor-pointer transform active:scale-98"
                          title="Accept this OverThink and start direct consultation"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#0891b2]" />
                          <span>Accept OverThink</span>
                        </button>
                      ) : isClaimedByMe ? (
                        <button
                          onClick={() => handleOpenChat(thought)}
                          className="px-4 py-2 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold shadow-md shadow-[#0891b2]/25 flex items-center gap-1.5 transition-all cursor-pointer transform active:scale-98"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Open Consultation Chat</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 italic">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Claimed by {thought.assignedConsultantName || 'Another Consultant'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <UserAvatar
                src={activeUser?.profileImage || activeUser?.avatar}
                name={activeUser?.name || 'Consultant'}
                role="consultant"
                size="lg"
                rounded="2xl"
                className="ring-2 ring-slate-100"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span className="truncate">{activeUser?.name || 'Consultant'}</span>
                  <VerifiedBadge size="xs" />
                </h4>
                <p className="text-[10px] text-slate-400">{activeUser?.label || 'Consultant'}</p>
                <span className="text-xs font-black text-slate-800">${activeUser?.hourlyRate || 150}/hr</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Client Rating:</span>
                <span className="font-bold text-amber-600">★ {activeUser?.rating || '4.98'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>My Active Consultations:</span>
                <span className="font-bold text-[#0891b2]">
                  {allThinks.filter(t => activeUser?.id && (t.consultantId === activeUser.id || t.assignedConsultantId === activeUser.id)).length}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('my_consultations')}
                className="w-full py-2 px-3 rounded-xl bg-[#ecfeff] text-[#020617] hover:bg-[#d5eae8] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>My Active Consultations</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
