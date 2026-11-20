import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Briefcase } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, switchRole } = useApp();

  return (
    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
      {/* Client Panel Button */}
      <button
        onClick={() => switchRole('client')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
          role === 'client'
            ? 'bg-white text-[#004845] shadow-xs border border-slate-200/80 ring-1 ring-[#004845]/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="Switch to Client Panel (ChatGPT Style Workspace)"
      >
        <User className={`w-3.5 h-3.5 ${role === 'client' ? 'text-[#16a34a]' : 'text-slate-400'}`} />
        <span>Client Panel</span>
      </button>

      {/* Admin / Consultant Panel Button */}
      <button
        onClick={() => switchRole('consultant')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
          role === 'consultant'
            ? 'bg-white text-[#004845] shadow-xs border border-slate-200/80 ring-1 ring-[#004845]/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="Switch to Admin & Consultant Panel (Freelancer.com Style Marketplace)"
      >
        <Briefcase className={`w-3.5 h-3.5 ${role === 'consultant' ? 'text-[#16a34a]' : 'text-slate-400'}`} />
        <span className="hidden sm:inline">Admin / Consultant Panel</span>
        <span className="sm:hidden">Consultant</span>
      </button>
    </div>
  );
}
