import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  PlusCircle,
  MessageSquare,
  Bookmark,
  Briefcase,
  Users,
  Settings,
  FileSearch,
  FolderKanban,
  BarChart3,
  CheckCircle2,
  X,
  LayoutGrid,
  LogOut,
  ChevronsUpDown,
  Check
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const {
    role,
    activeTab,
    setActiveTab,
    thoughts,
    activeChatThoughtId,
    startNewChat,
    openChatWithThought,
    currentUser,
    logoutUser,
    switchDemoUser,
    demoUsers,
    setIsNewThoughtModalOpen
  } = useApp();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Close account menu on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    }
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAccountMenuOpen]);

  const handleNewChat = () => {
    startNewChat();
    if (onClose) onClose();
  };

  const handleSelectThought = (thoughtId) => {
    openChatWithThought(thoughtId);
    if (onClose) onClose();
  };

  const handleSelectDemoUser = (userId) => {
    switchDemoUser(userId);
    setIsAccountMenuOpen(false);
    if (onClose) onClose();
  };

  const myRecentThoughts = thoughts.filter(t => t.clientId === currentUser.id || !t.clientId);
  const openThoughtsCount = thoughts.filter(t => t.status === 'pending' || t.status === 'pending_human').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar - Full height drawer on mobile, static flush on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white border-r border-slate-200/90 flex flex-col h-full h-[100dvh] transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-full lg:w-72 lg:translate-x-0 flex-shrink-0 shadow-2xl lg:shadow-[1px_0_2px_rgba(0,0,0,0.02)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with THINK Brand & Close Button (Hidden on Desktop) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 lg:hidden bg-slate-50/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="THINK" className="w-7 h-7 rounded-lg object-contain border border-slate-200/80" />
            <span className="font-black text-sm tracking-tight text-slate-900">
              <span className="text-[#004845]">TH</span>
              <span className="text-[#16a34a]">INK</span> Menu
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Dedicated Account Section: Visible at the top of the mobile drawer */}
        <div className="p-3.5 bg-slate-50/95 border-b border-slate-200/80 lg:hidden space-y-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.profileImage || currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#004845]/20 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16a34a] ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#004845] text-white">
                {currentUser.label || (role === 'consultant' ? 'Consultant' : 'Client Account')}
              </span>
            </div>
          </div>

          {/* Switch Demo Account (Touch-Friendly for Mobile) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
              Switch Demo Account
            </span>
            <div className="space-y-1">
              {(demoUsers || []).map((u) => {
                const isSelected = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectDemoUser(u.id)}
                    className={`w-full py-2 px-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#e6f2f1] border-[#004845] text-[#004845] font-bold shadow-xs'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.profileImage || u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0 truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                          {u.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {u.name} • {u.role === 'client' ? 'Client' : 'Consultant'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-[#16a34a] text-white flex-shrink-0 ml-1.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Top Header: Primary Action Button (Client: New Thought / Chat, Consultant: Client Thinks) */}
        <div className="p-3.5 border-b border-slate-100 flex-shrink-0 bg-white">
          {role === 'client' ? (
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all transform active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#16a34a]" />
              <span className="font-semibold text-white">New Thought / Chat</span>
            </button>
          ) : (
            <button
              onClick={() => { setActiveTab('browse_thoughts'); if (onClose) onClose(); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold shadow-xs transition-all transform active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSearch className="w-4 h-4 text-[#16a34a]" />
                <span className="font-semibold text-white">Client Thinks</span>
              </div>
              <span className="text-[10px] bg-[#16a34a] text-white px-2 py-0.5 rounded-full font-black">
                {openThoughtsCount}
              </span>
            </button>
          )}
        </div>

        {/* Scrollable Center: Recent Chats & Platform Routes */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Section 1: Main Navigation Routes */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
              {role === 'client' ? 'Client Routes' : 'Consultant Workflow'}
            </span>
            <div className="space-y-0.5">
              {role === 'client' ? (
                <>
                  <button
                    onClick={() => { setActiveTab('my_thoughts'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'my_thoughts' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#004845]" />
                      <span>All My Thoughts</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {thoughts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('messages'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'messages' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-[#004845]" />
                      <span>Consultation Chat & Call</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('saved_solutions'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'saved_solutions' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-amber-500" />
                      <span>Saved Solutions</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {thoughts.filter(t => t.isSaved).length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('jobs'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'jobs' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#004845]" />
                      <span>Job & Career Hub</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('find_consultants'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'find_consultants' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#004845]" />
                      <span>Find Consultants</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveTab('my_consultations'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'my_consultations' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-[#004845]" />
                      <span>My Consultations</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {thoughts.filter(t => (t.consultantId === currentUser.id || t.assignedConsultantId === currentUser.id)).length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('messages'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'messages' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-[#004845]" />
                      <span>Chat & Call Room</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('profile'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'profile' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#004845]" />
                      <span>Profile & Portfolio</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('analytics'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'analytics' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-[#004845]" />
                      <span>Earnings & Analytics</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Recent History (Placed after Client Routes as requested) */}
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
                        onClick={() => handleSelectThought(t.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-[#e6f2f1] text-[#004845] font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#16a34a]' : 'text-slate-400'}`} />
                          <span className="truncate">{t.title}</span>
                        </div>
                        {hasSolution && (
                          <span className="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0 ml-1.5" title="Solution Ready" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Section 3: Account & Settings (Client Only) */}
          {role === 'client' && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                Account
              </span>
              <button
                onClick={() => { setActiveTab('settings'); if (onClose) onClose(); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'settings' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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

        {/* Mobile Bottom Actions: Logout */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/90 lg:hidden flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              logoutUser();
              if (onClose) onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Desktop Bottom User Card & Demo Switcher in Sidebar (hidden on mobile, which has top switcher) */}
        <div className="hidden lg:block p-3 border-t border-slate-200/80 bg-slate-50/90 relative flex-shrink-0" ref={accountMenuRef}>
          {/* Popover Menu Anchored Above the User Card */}
          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-2">
              <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-slate-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Switch Demo Account
                </span>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                {(demoUsers || []).map((u) => {
                  const isSelected = currentUser.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectDemoUser(u.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#e6f2f1] border-[#004845] text-[#004845] font-bold shadow-xs'
                          : 'bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={u.profileImage || u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                            {u.label}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {u.name} • {u.role === 'client' ? 'Client' : 'Consultant'}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="p-1 rounded-full bg-[#16a34a] text-white flex-shrink-0 ml-1.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setIsAccountMenuOpen(false);
                    if (onClose) onClose();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* User Trigger Card */}
          <div
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition-all shadow-xs group select-none"
            title="Click to switch demo account"
          >
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser.profileImage || currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-[#16a34a] transition-all"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#16a34a] ring-1 ring-white" />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 truncate block group-hover:text-[#004845] transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {currentUser.label || (role === 'consultant' ? 'Consultant' : 'Client Account')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-[#e6f2f1] group-hover:text-[#004845] transition-colors">
                Switch
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
