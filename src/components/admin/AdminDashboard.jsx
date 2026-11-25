import React from 'react';
import { useApp } from '../../context/useApp';
import {
  Shield,
  Users,
  Cpu,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    thoughts,
    consultants,
    setActiveTab,
    triggerAIFallback,
    setSelectedThoughtId
  } = useApp();

  const totalThoughts = thoughts.length;
  const activeConsultations = thoughts.filter(t => t.status === 'in_consultation').length;
  const aiFallbackCount = thoughts.filter(t => t.status === 'ai_fallback').length;
  const pendingHuman = thoughts.filter(t => t.status === 'pending_human').length;
  const verifiedConsultants = consultants.filter(c => c.isVerified).length;

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Admin Operations Top Bar (Freelancer.com Admin Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#ecfeff] text-[#020617] flex-shrink-0">
              <Shield className="w-5 h-5 text-[#0891b2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                Platform Operations & Governance
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin & Consultant Mode
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Freelancer enterprise dashboard: Supervise 24-hour response SLAs, consultant credentials, thought moderation, and contact privacy safeguards.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('admin_users')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#020617]" />
            <span>User Approvals ({consultants.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('admin_audit')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0891b2]" />
            <span>Privacy & Security Logs</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalThoughts}</p>
          <span className="text-[10px] text-[#020617] font-bold">{pendingHuman} in 24h Review Queue</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Consultations</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeConsultations}</p>
          <span className="text-[10px] text-[#0891b2] font-bold">In-Platform Engagements</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">24h AI Fallback Rate</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {totalThoughts > 0 ? Math.round((aiFallbackCount / totalThoughts) * 100) : 0}%
          </p>
          <span className="text-[10px] text-purple-700 font-bold">{aiFallbackCount} Fallback Blueprints</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Consultants</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{verifiedConsultants} / {consultants.length}</p>
          <span className="text-[10px] text-[#0891b2] font-bold">100% KYC Approved</span>
        </div>
      </div>

      {/* 24-Hour Fallback Guarantee Engine Daemon Monitor */}
      <div className="bg-gradient-to-r from-[#020617] via-[#082f49] to-[#031b2e] text-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#0891b2]" />
              <h3 className="text-base font-bold text-white">
                OverThink 24-Hour Guarantee Engine Controls
              </h3>
            </div>
            <p className="text-xs text-slate-200 max-w-xl">
              Automatic Fallback Policy: If no human consultant accepts a client submission within 24 hours, the AI Engine synthesizes a structured roadmap so no thought remains unsolved.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#0891b2]/20 text-[#0891b2] font-bold border border-[#0891b2]/30">
              Engine Daemon: ACTIVE
            </span>
          </div>
        </div>

        {/* Quick Fallback Trigger Buttons */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2.5 text-xs">
          <span className="text-slate-300 font-semibold">Test Fallback Trigger on Open Thoughts:</span>
          {thoughts.filter(t => t.status === 'pending_human').map((t) => (
            <button
              key={t.id}
              onClick={() => triggerAIFallback(t.id)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Cpu className="w-3 h-3 text-[#0891b2]" />
              <span className="truncate max-w-[130px]">Trigger #{t.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Queue Table (Freelancer.com Admin Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Platform Submissions Queue</h3>
            <p className="text-xs text-slate-400">Live monitoring of all incoming questions and consultations</p>
          </div>
          <button
            onClick={() => setActiveTab('admin_moderation')}
            className="text-xs font-bold text-[#020617] hover:underline"
          >
            Moderate all ({thoughts.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Thought / Title</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Consultant</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {thoughts.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {t.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{t.clientName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {t.category.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        t.status === 'in_consultation'
                          ? 'bg-cyan-100 text-cyan-900'
                          : t.status === 'ai_fallback'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {t.assignedConsultantName || '— (Open for bids)'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedThoughtId(t.id)}
                      className="text-[#020617] font-bold hover:underline"
                    >
                      Inspect
                    </button>
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
