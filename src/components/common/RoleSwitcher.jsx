import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Briefcase } from 'lucide-react';

export default function RoleSwitcher() {
  const { activeUser, switchDemoUser } = useApp();

  return (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
      {/* Demo Client Button */}
      <button
        onClick={() => switchDemoUser('client_001')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
          activeUser.id === 'client_001'
            ? 'bg-white text-[#020617] shadow-xs border border-slate-200/80 ring-1 ring-[#020617]/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="Switch to Demo Client (Alex Morgan)"
      >
        <User className={`w-3.5 h-3.5 ${activeUser.id === 'client_001' ? 'text-[#0891b2]' : 'text-slate-400'}`} />
        <span>Demo Client</span>
      </button>

      {/* Demo Consultant 1 Button */}
      <button
        onClick={() => switchDemoUser('consultant_001')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
          activeUser.id === 'consultant_001'
            ? 'bg-white text-[#020617] shadow-xs border border-slate-200/80 ring-1 ring-[#020617]/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="Switch to Demo Consultant 1 (Dr. Elena Vance)"
      >
        <Briefcase className={`w-3.5 h-3.5 ${activeUser.id === 'consultant_001' ? 'text-[#0891b2]' : 'text-slate-400'}`} />
        <span>Consultant 1</span>
      </button>

      {/* Demo Consultant 2 Button */}
      <button
        onClick={() => switchDemoUser('consultant_002')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
          activeUser.id === 'consultant_002'
            ? 'bg-white text-[#020617] shadow-xs border border-slate-200/80 ring-1 ring-[#020617]/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="Switch to Demo Consultant 2 (Marcus Sterling)"
      >
        <Briefcase className={`w-3.5 h-3.5 ${activeUser.id === 'consultant_002' ? 'text-[#0891b2]' : 'text-slate-400'}`} />
        <span>Consultant 2</span>
      </button>
    </div>
  );
}
