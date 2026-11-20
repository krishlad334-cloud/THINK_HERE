import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  MessageSquare,
  Bookmark,
  Briefcase,
  Users,
  Settings,
  Shield,
  FileSearch,
  FolderKanban,
  ListTodo,
  BarChart3,
  CheckCircle2,
  Clock,
  Sparkles,
  LayoutDashboard,
  X,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
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

  const handleNewChat = () => {
    startNewChat();
    if (onClose) onClose();
  };

  const handleSelectThought = (thoughtId) => {
    openChatWithThought(thoughtId);
    if (onClose) onClose();
  };

  const myRecentThoughts = thoughts.filter(t => t.clientId === currentUser.id || !t.clientId);
  const openThoughtsCount = thoughts.filter(t => t.status === 'pending_human').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar - Pinned directly to the left, full height below navbar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col h-[calc(100vh-4rem)] transition-transform duration-200 lg:static lg:h-full lg:translate-x-0 flex-shrink-0 shadow-[1px_0_2px_rgba(0,0,0,0.02)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: New Chat Button (Iconic ChatGPT Style) */}
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
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-[#16a34a]" />
                <span>Browse Client Thoughts</span>
              </div>
              <span className="text-[10px] bg-[#16a34a] px-2 py-0.5 rounded-full text-white font-black">
                {openThoughtsCount}
              </span>
            </button>
          )}
        </div>

        {/* Scrollable Center: Recent Chats & Platform Routes */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Section 1: Recent Conversations / Thoughts (ChatGPT style) */}
          {role === 'client' && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                Recent Thoughts & Chats
              </span>
              <div className="space-y-0.5">
                {myRecentThoughts.map((t) => {
                  const isSelected = activeTab === 'chat' && activeChatThoughtId === t.id;
                  const hasSolution = t.solutions && t.solutions.length > 0;

                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectThought(t.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
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
                })}
              </div>
            </div>
          )}

          {/* Section 2: Main Workspace Routes */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
              {role === 'client' ? 'Workspace Routes' : 'Consultant Workflow'}
            </span>
            <div className="space-y-0.5">
              {role === 'client' ? (
                <>
                  <button
                    onClick={() => { setActiveTab('chat'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'chat' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="w-4 h-4 text-[#004845]" />
                      <span>Workspace</span>
                    </div>
                  </button>

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
                    onClick={() => { setActiveTab('browse_thoughts'); if (onClose) onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'browse_thoughts' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileSearch className="w-4 h-4 text-[#004845]" />
                      <span>Browse Problems</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {openThoughtsCount}
                    </span>
                  </button>

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
                      {thoughts.filter(t => t.assignedConsultantId).length}
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

          {/* Section 3: Platform Governance & Admin (For Consultant/Admin role) */}
          {role === 'consultant' && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                Platform Governance & Admin
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => { setActiveTab('admin_dashboard'); if (onClose) onClose(); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'admin_dashboard' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-[#004845]" />
                    <span>Operations Overview</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('admin_users'); if (onClose) onClose(); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'admin_users' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#004845]" />
                    <span>User Verification</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('admin_moderation'); if (onClose) onClose(); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'admin_moderation' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ListTodo className="w-4 h-4 text-[#004845]" />
                    <span>Thought Moderation</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('admin_audit'); if (onClose) onClose(); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'admin_audit' ? 'bg-[#e6f2f1] text-[#004845] font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-[#004845]" />
                    <span>Security & Privacy Logs</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Section 4: Account & Settings (Client Only - Hidden on Consultant side) */}
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

        {/* Bottom User Pill with Dedicated Logout Button */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#16a34a] ring-1 ring-white" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 truncate block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{role === 'consultant' ? 'Admin / Consultant' : 'Client Account'}</span>
            </div>
          </div>

          {/* Proper Logout Button as requested */}
          <button
            type="button"
            onClick={() => {
              logoutUser();
              if (onClose) onClose();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all shadow-xs cursor-pointer group flex-shrink-0"
            title="Log out of account"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
