import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import UserAvatar from './UserAvatar';
import {
  Plus,
  MessageSquare,
  Bookmark,
  Briefcase,
  Users,
  Settings,
  FileSearch,
  FolderKanban,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  X,
  LogOut
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
    logoutUser
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

  const myRecentThoughts = thoughts.filter((t) => {
    if (!currentUser) return false;
    if (t.clientId && currentUser.id && t.clientId === currentUser.id) return true;
    if (currentUser.id === 'client_001' && (t.clientId === 'client_001' || t.clientId === 'user-client-1')) return true;
    if (currentUser.email && t.clientEmail && t.clientEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (t.clientName && currentUser.name && t.clientName.trim().toLowerCase() === currentUser.name.trim().toLowerCase()) return true;
    return false;
  });
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
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white border-r border-slate-200/90 flex flex-col h-full h-[100dvh] transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-full lg:w-72 flex-shrink-0 shadow-2xl lg:shadow-[1px_0_2px_rgba(0,0,0,0.02)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header with OverThink Brand & Close Button (Hidden on Desktop) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 lg:hidden bg-slate-50/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="OverThink" className="w-7 h-7 rounded-lg object-contain border border-slate-200/80" />
            <span className="font-black text-sm tracking-tight text-slate-900">
              <span className="text-[#020617]">Over</span>
              <span className="text-[#22d3ee]">Think</span> Menu
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
        <div className="p-3.5 bg-slate-50/95 border-b border-slate-200/80 lg:hidden space-y-2.5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <UserAvatar
                src={currentUser?.profileImage || currentUser?.avatar}
                name={currentUser?.name}
                role={role}
                size="md"
                showOnline={true}
                className="ring-2 ring-[#020617]/20 shadow-xs"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
              <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#020617] text-white">
                {role === 'consultant' ? 'Verified Consultant' : 'Client Account'}
              </span>
            </div>
          </div>
        </div>
        {/* Top Header: Primary Action Button (Client: New Thought / Chat, Consultant: Client Thinks) */}
        <div className="p-3.5 border-b border-slate-100 flex-shrink-0 bg-white">
          {role === 'client' ? (
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs transition-all transform active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0891b2]" />
              <span className="font-semibold text-white">New Thought / Chat</span>
            </button>
          ) : (
            <button
              onClick={() => { setActiveTab('browse_thoughts'); if (onClose) onClose(); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs transition-all transform active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSearch className="w-4 h-4 text-[#0891b2]" />
                <span className="font-semibold text-white">Client OverThinks</span>
              </div>
              <span className="text-[10px] bg-[#0891b2] text-white px-2 py-0.5 rounded-full font-black">
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
                      activeTab === 'my_thoughts' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#020617]" />
                      <span>All My Thoughts</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {myRecentThoughts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('messages'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'messages' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-[#020617]" />
                      <span>Consultation Chat & Call</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('saved_solutions'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'saved_solutions' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
                      activeTab === 'jobs' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#020617]" />
                      <span>Job & Career Hub</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('find_consultants'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'find_consultants' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#020617]" />
                      <span>Find Consultants</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveTab('my_consultations'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'my_consultations' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-[#020617]" />
                      <span>My Consultations</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {thoughts.filter(t => (t.consultantId === currentUser.id || t.assignedConsultantId === currentUser.id)).length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('messages'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'messages' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-[#020617]" />
                      <span>Chat & Call Room</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('assessment'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'assessment' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#020617]" />
                      <span>Skills Assessment</span>
                    </div>
                    {currentUser?.assessmentPassed || currentUser?.isVerified ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold">
                        Passed
                      </span>
                    ) : (
                      <span className="text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.5 rounded-full font-bold">
                        Required
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('profile'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'profile' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#020617]" />
                      <span>Profile & Portfolio</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('analytics'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'analytics' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-[#020617]" />
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
                            ? 'bg-[#ecfeff] text-[#020617] font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#0891b2]' : 'text-slate-400'}`} />
                          <span className="truncate">{t.title}</span>
                        </div>
                        {hasSolution && (
                          <span className="w-2 h-2 rounded-full bg-[#0891b2] flex-shrink-0 ml-1.5" title="Solution Ready" />
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
                  activeTab === 'settings' ? 'bg-[#ecfeff] text-[#020617] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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

        {/* Desktop Bottom User Card with Logout */}
        <div className="hidden lg:block p-3 border-t border-slate-200/80 bg-slate-50/90 relative flex-shrink-0">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <div className="relative flex-shrink-0">
                <UserAvatar
                  src={currentUser?.profileImage || currentUser?.avatar}
                  name={currentUser?.name}
                  role={role}
                  size="sm"
                  showOnline={true}
                  className="ring-1 ring-slate-200"
                />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {role === 'consultant' ? 'Verified Consultant' : 'Client Account'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                if (onClose) onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Developed by Krish Lad Footer Credit */}
          <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-center gap-1 text-[11px] text-slate-400 select-none">
            <span>Developed by</span>
            <span className="font-semibold text-slate-600">Krish Lad</span>
          </div>
        </div>
      </aside>
    </>
  );
}
