import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Check,
  X,
  Search,
  Star,
  Award
} from 'lucide-react';

export default function UserManagement() {
  const { consultants, setConsultantVerification, clientUser } = useApp();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'verified' | 'pending' | 'clients'
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingUser, setInspectingUser] = useState(null);

  const filteredConsultants = consultants.filter(c => {
    if (activeFilter === 'verified' && !c.isVerified) return false;
    if (activeFilter === 'pending' && c.isVerified) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSkill = c.skills?.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Top Banner (Freelancer.com Admin Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#ecfeff] text-[#020617] flex-shrink-0">
              <Users className="w-5 h-5 text-[#0891b2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                User Verification & Credentials Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review degrees, past employer history, certifications, and approve verified badges for consultants.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto whitespace-nowrap max-w-full scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Experts ({consultants.length})
          </button>
          <button
            onClick={() => setActiveFilter('verified')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'verified' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified ({consultants.filter(c => c.isVerified).length})
          </button>
          <button
            onClick={() => setActiveFilter('clients')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'clients' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clients
          </button>
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
            placeholder="Search by consultant name, title, or skills..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
        </div>
      </div>

      {/* User Verification Table / Grid */}
      {activeFilter === 'clients' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Registered Platform Clients</h3>
          <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={clientUser.avatar}
                alt={clientUser.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{clientUser.name}</h4>
                <p className="text-xs text-slate-500">{clientUser.email} • {clientUser.location}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{clientUser.title}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900">
              Active Client
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConsultants.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:border-[#020617] transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      {c.isVerified && (
                        <span className="absolute -bottom-1 -right-1 p-0.5 bg-[#0891b2] rounded-full text-white ring-2 ring-white" title="Verified">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                        {c.isVerified ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfeff] text-[#0891b2] border border-[#0891b2]/30">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">{c.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.location} • ${c.hourlyRate}/hr</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Performance Rating:</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {c.rating} ({c.reviewsCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed Consultations:</span>
                    <span className="font-bold text-slate-900">{c.completedConsultations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SLA Response Speed:</span>
                    <span className="font-bold text-[#0891b2]">{c.responseTime}</span>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.skills?.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setInspectingUser(c)}
                  className="text-xs font-bold text-[#020617] hover:underline"
                >
                  Inspect Full Credentials
                </button>

                <div className="flex items-center gap-2">
                  {c.isVerified ? (
                    <button
                      onClick={() => setConsultantVerification(c.id, 'unverified')}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      onClick={() => setConsultantVerification(c.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Credentials</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Credentials Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-4 sm:p-6 max-h-[90dvh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0891b2]" />
                <span>Consultant Credentials & Verification File</span>
              </h3>
              <button
                onClick={() => setInspectingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={inspectingUser.avatar}
                alt={inspectingUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <div>
                <h4 className="text-lg font-bold text-slate-900">{inspectingUser.name}</h4>
                <p className="text-xs text-slate-600">{inspectingUser.title}</p>
                <p className="text-xs text-slate-400">{inspectingUser.location} • ${inspectingUser.hourlyRate}/hr</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Education & Degrees
              </h4>
              {inspectingUser.education?.map((edu) => (
                <div key={edu.id} className="p-3 bg-slate-50 rounded-xl text-xs">
                  <p className="font-bold text-slate-900">{edu.school}</p>
                  <p className="text-slate-600">{edu.degree} ({edu.year})</p>
                </div>
              ))}

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Certifications & Achievements
              </h4>
              <div className="space-y-1 text-xs text-slate-700">
                {inspectingUser.certifications?.map((cert, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0891b2]" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setConsultantVerification(inspectingUser.id, 'approved');
                  setInspectingUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold"
              >
                Approve Verified Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
