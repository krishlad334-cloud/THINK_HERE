import React from 'react';
import { FileSearch, LogOut, Plus, X } from 'lucide-react';
import { useApp } from '../../context/useApp';
import UserAvatar from './UserAvatar';
import SidebarNav from './SidebarNav';
import { isClientThought, isConsultantThought } from '../../utils/thoughtFilters';

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
  } = useApp();

  const closeOnMobile = () => {
    if (onClose) onClose();
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    closeOnMobile();
  };

  const handleNewChat = () => {
    startNewChat();
    closeOnMobile();
  };

  const handleSelectThought = (thoughtId) => {
    openChatWithThought(thoughtId);
    closeOnMobile();
  };

  const handleLogout = () => {
    logoutUser();
    closeOnMobile();
  };

  const myRecentThoughts = thoughts.filter((t) => isClientThought(t, currentUser));
  const openThoughtsCount = thoughts.filter(
    (t) => t.status === 'pending' || t.status === 'pending_human'
  ).length;
  const savedCount = thoughts.filter((t) => t.isSaved).length;
  const consultationsCount = thoughts.filter((t) => isConsultantThought(t, currentUser)).length;

  const accountRoleLabel =
    role === 'consultant'
      ? currentUser?.assessmentPassed || currentUser?.isVerified
        ? 'Verified Consultant'
        : 'Verification Pending'
      : 'Client Account';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-full lg:w-72 flex-shrink-0 shadow-2xl lg:shadow-[1px_0_2px_rgba(0,0,0,0.02)] ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 lg:hidden bg-slate-50/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="OverThink"
              className="w-7 h-7 rounded-lg object-contain border border-slate-200/80"
            />
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
            <X className="w-4 h-4" />
          </button>
        </div>

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
                {accountRoleLabel}
              </span>
            </div>
          </div>
        </div>

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
              onClick={() => handleSelectTab('browse_thoughts')}
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

        <SidebarNav
          role={role}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          myRecentThoughts={myRecentThoughts}
          savedCount={savedCount}
          consultationsCount={consultationsCount}
          activeChatThoughtId={activeChatThoughtId}
          onSelectThought={handleSelectThought}
          currentUser={currentUser}
        />

        <div className="p-3 border-t border-slate-200/80 bg-slate-50/90 lg:hidden flex-shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

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
                  {accountRoleLabel}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-center gap-1 text-[11px] text-slate-400 select-none">
            <span>Developed by</span>
            <span className="font-semibold text-slate-600">Krish Lad</span>
          </div>
        </div>
      </aside>
    </>
  );
}
