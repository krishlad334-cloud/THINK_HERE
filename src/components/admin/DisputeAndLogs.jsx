import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { timeAgo } from '../../utils/formatters';
import { Shield, Search } from 'lucide-react';

export default function DisputeAndLogs() {
  const { auditLogs } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter(log => {
    if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.type.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
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
              <Shield className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Contact Privacy & Platform Audit Logs
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Requirement 10 & 15 Compliance Guard: Off-platform contact masking, 24h AI fallback triggers, and security logs.
              </p>
            </div>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto whitespace-nowrap max-w-full scrollbar-none">
          {['all', 'info', 'warning', 'success'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filterSeverity === sev
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by actor, event type, or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
          />
        </div>
      </div>

      {/* Full-Width Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Event Type</th>
                <th className="py-3.5 px-4">Actor / System</th>
                <th className="py-3.5 px-4">Audit Details</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-mono text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {log.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-bold">
                    {log.actor}
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-lg leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : log.severity === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right text-slate-400 font-mono text-[11px]">
                    {timeAgo(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
