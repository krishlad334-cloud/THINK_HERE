import React from 'react';
import {
  BarChart3,
  Bookmark,
  Briefcase,
  CheckCircle2,
  FolderKanban,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';

export default function SidebarNav({
  role,
  activeTab,
  onSelectTab,
  myRecentThoughts,
  savedCount,
  consultationsCount,
  activeChatThoughtId,
  onSelectThought,
}) {
  const clientRoutes = [
    {
      id: 'my_thoughts',
      label: 'All My Thoughts',
      icon: CheckCircle2,
      iconClass: 'text-[#020617]',
      badge: myRecentThoughts.length,
    },
    {
      id: 'messages',
      label: 'Consultation Chat & Call',
      icon: MessageSquare,
      iconClass: 'text-[#020617]',
    },
    {
      id: 'saved_solutions',
      label: 'Saved Solutions',
      icon: Bookmark,
      iconClass: 'text-amber-500',
      badge: savedCount,
    },
    {
      id: 'jobs',
      label: 'Job & Career Hub',
      icon: Briefcase,
      iconClass: 'text-[#020617]',
    },
    {
      id: 'find_consultants',
      label: 'Find Consultants',
      icon: Users,
      iconClass: 'text-[#020617]',
    },
  ];

  const consultantRoutes = [
    {
      id: 'my_consultations',
      label: 'My Consultations',
      icon: FolderKanban,
      iconClass: 'text-[#020617]',
      badge: consultationsCount,
    },
    {
      id: 'messages',
      label: 'Chat & Call Room',
      icon: MessageSquare,
      iconClass: 'text-[#020617]',
    },
    {
      id: 'profile',
      label: 'Profile & Portfolio',
      icon: Users,
      iconClass: 'text-[#020617]',
    },
    {
      id: 'analytics',
      label: 'Earnings & Analytics',
      icon: BarChart3,
      iconClass: 'text-[#020617]',
    },
  ];

  const navItems = role === 'client' ? clientRoutes : consultantRoutes;

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
          {role === 'client' ? 'Client Routes' : 'Consultant Workflow'}
        </span>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const NavIcon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ecfeff] text-[#020617] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <NavIcon className={`w-4 h-4 ${item.iconClass}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {role === 'client' && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            Recent History
          </span>
          <div className="space-y-0.5">
            {myRecentThoughts.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-slate-400 italic">No recent thoughts yet</p>
            ) : (
              myRecentThoughts.map((t) => {
                const isSelected = activeTab === 'messages' && activeChatThoughtId === t.id;
                const hasSolution = t.solutions && t.solutions.length > 0;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectThought(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#ecfeff] text-[#020617] font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                      <MessageSquare
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isSelected ? 'text-[#0891b2]' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{t.title}</span>
                    </div>
                    {hasSolution && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#0891b2] flex-shrink-0 ml-1.5"
                        title="Solution Ready"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {role === 'client' && (
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            Account
          </span>
          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#ecfeff] text-[#020617] font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Settings</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
