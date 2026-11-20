import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTimeRemaining } from '../../utils/formatters';
import {
  ListTodo,
  Search,
  Sparkles,
  Clock
} from 'lucide-react';

export default function ThoughtFeedModeration() {
  const { thoughts, triggerAIFallback, setSelectedThoughtId } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = thoughts.filter((t) => {
    if (filterStatus === 'pending' && t.status !== 'pending_human') return false;
    if (filterStatus === 'consultation' && t.status !== 'in_consultation') return false;
    if (filterStatus === 'ai_fallback' && t.status !== 'ai_fallback') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Top Banner (Freelancer.com Admin Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#e6f2f1] text-[#004845] flex-shrink-0">
              <ListTodo className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Platform Thought Queue & Moderation
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit client submissions, assign consultants to orphaned tasks, and trigger 24h AI fallbacks.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto whitespace-nowrap max-w-full scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Queue ({thoughts.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Bids ({thoughts.filter(t => t.status === 'pending_human').length})
          </button>
          <button
            onClick={() => setFilterStatus('consultation')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'consultation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Consultation ({thoughts.filter(t => t.status === 'in_consultation').length})
          </button>
          <button
            onClick={() => setFilterStatus('ai_fallback')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'ai_fallback' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Fallback
          </button>
        </div>
      </div>

      {/* Moderation Search & Quick Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queue by thought title, client, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
          />
        </div>
      </div>

      {/* Full-Width Moderation Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Submission</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">24h SLA Countdown</th>
                <th className="py-3.5 px-4">Assigned Consultant</th>
                <th className="py-3.5 px-5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((t) => {
                const timeInfo = calculateTimeRemaining(t.createdAt, t.deadlineHours || 24);

                return (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400">#{t.id}</span>
                          {t.urgency === 'High (Urgent)' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700">
                              Urgent
                            </span>
                          )}
                        </div>
                        <h4
                          onClick={() => setSelectedThoughtId(t.id)}
                          className="font-bold text-slate-900 hover:text-[#004845] cursor-pointer line-clamp-1 text-xs"
                        >
                          {t.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{t.description}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <div className="flex items-center gap-2">
                        <img
                          src={t.clientAvatar}
                          alt={t.clientName}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span>{t.clientName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {t.category.split(' ')[0]}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 w-fit">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {timeInfo.isExpired ? '24h Complete' : `${timeInfo.hours}h ${timeInfo.minutes}m left`}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      {t.assignedConsultantName ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={t.assignedConsultantAvatar}
                            alt={t.assignedConsultantName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-800">{t.assignedConsultantName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None (Open to pool)</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => triggerAIFallback(t.id)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-all text-xs inline-flex items-center gap-1"
                        title="Force 24h AI Fallback Solution"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Force AI</span>
                      </button>

                      <button
                        onClick={() => setSelectedThoughtId(t.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#004845] text-white font-bold transition-all text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
