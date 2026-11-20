import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  CheckCircle,
  Users,
  Calendar,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function ConsultantAnalytics() {
  const { consultantUser } = useApp();

  const monthlyData = [
    { month: 'Jun', earnings: 4200, count: 12 },
    { month: 'Jul', earnings: 5100, count: 14 },
    { month: 'Aug', earnings: 4800, count: 13 },
    { month: 'Sep', earnings: 6200, count: 18 },
    { month: 'Oct', earnings: 7100, count: 20 },
    { month: 'Nov', earnings: 7100, count: 22 }
  ];

  const domainBreakdown = [
    { name: 'Career & Tech Jobs', percentage: 38, revenue: '$13,110', count: 34, color: 'bg-[#004845]' },
    { name: 'Cloud & System Architecture', percentage: 32, revenue: '$11,040', count: 28, color: 'bg-[#16a34a]' },
    { name: 'Startup Strategy & MVP Planning', percentage: 20, revenue: '$6,900', count: 18, color: 'bg-emerald-500' },
    { name: 'Product Growth & Marketing', percentage: 10, revenue: '$3,450', count: 9, color: 'bg-teal-500' },
  ];

  const recentPayouts = [
    { id: 'tx-1', client: 'Alex Morgan', title: 'Python Backend & ATS Career Optimization', domain: 'Career & Jobs', amount: 280, date: 'Nov 19, 2026', timeToSolve: '1h 45m', status: 'Completed & Paid' },
    { id: 'tx-2', client: 'Sarah Lin', title: 'Smart Insulated Water Bottle IoT Architecture', domain: 'Product & Tech', amount: 350, date: 'Nov 18, 2026', timeToSolve: '2h 10m', status: 'Completed & Paid' },
    { id: 'tx-3', client: 'Devon Vance', title: 'B2B Farm Logistics Corridor MVP Model', domain: 'Startups & Business', amount: 420, date: 'Nov 16, 2026', timeToSolve: '3h 30m', status: 'Completed & Paid' },
    { id: 'tx-4', client: 'Marcus Chen', title: 'PostgreSQL High-Concurrency Sharding Plan', domain: 'Cloud Architecture', amount: 300, date: 'Nov 14, 2026', timeToSolve: '1h 15m', status: 'Completed & Paid' },
  ];

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#004845]" />
            <span>Consultant Analytics & Performance</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time consultation earnings, 24h SLA compliance metrics, client satisfaction ratings, and payout history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#f0fdf4] border border-[#16a34a]/30 text-xs font-bold text-[#16a34a] flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
            Live Analytics Feed
          </span>
        </div>
      </div>

      {/* Top 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Revenue</span>
          <p className="text-3xl font-black text-slate-900 mt-1.5">${(consultantUser.earningsTotal || 34500).toLocaleString()}</p>
          <span className="text-xs text-[#16a34a] font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last quarter
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">24h SLA Compliance</span>
          <p className="text-3xl font-black text-[#004845] mt-1.5">99.8%</p>
          <span className="text-xs text-slate-600 font-semibold mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Average turnaround: 1.8 hrs
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Client Satisfaction</span>
          <p className="text-3xl font-black text-slate-900 mt-1.5">{consultantUser.rating || 4.98} <span className="text-base text-slate-400 font-semibold">/ 5.0</span></p>
          <span className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {consultantUser.reviewsCount || 142} verified reviews
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Repeat Client Rate</span>
          <p className="text-3xl font-black text-[#16a34a] mt-1.5">42%</p>
          <span className="text-xs text-slate-600 font-semibold mt-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#004845]" /> Long-term advisory retainers
          </span>
        </div>
      </div>

      {/* Main Charts & Breakdown Section (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Monthly Earnings Velocity Bar Chart (Col span 2) */}
        <div className="lg:col-span-2 p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Earnings Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Verified payouts for delivered thought roadmaps</p>
            </div>
            <span className="text-xs font-bold text-[#004845] bg-[#e6f2f1] px-3 py-1.5 rounded-full border border-[#004845]/20 self-start sm:self-auto">
              Average: $5,750 / month
            </span>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 sm:gap-6 h-56">
              {monthlyData.map((d, i) => {
                const maxEarnings = 8000;
                const heightPct = Math.round((d.earnings / maxEarnings) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2.5 group">
                    <span className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${d.earnings.toLocaleString()}
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-2xl h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-[#004845] to-[#16a34a] rounded-t-2xl transition-all duration-500 group-hover:opacity-90"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Domain & Problem Category Breakdown (Col span 1) */}
        <div className="lg:col-span-1 p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Consultations by Domain</h3>
            <p className="text-xs text-slate-400 mt-0.5">Where your solutions are requested</p>
          </div>

          <div className="space-y-4">
            {domainBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="font-mono text-slate-500 font-semibold">{item.percentage}% ({item.revenue})</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 mt-4">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Top Performing Skill</span>
            <p className="text-xs font-bold text-slate-800">
              Senior Tech Career & Cloud Architecture advisory converts at 94% 5-star satisfaction rate.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Consultation Payouts Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Completed Engagements & Payouts</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated payouts processed directly to your linked account</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Showing last 4 transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Thought / Consultation Topic</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">Payout</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPayouts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.client}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">{row.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {row.domain}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{row.timeToSolve}</td>
                  <td className="py-3.5 px-4 font-bold text-[#004845] font-mono text-sm">${row.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30">
                      <CheckCircle className="w-3 h-3" />
                      {row.status}
                    </span>
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
