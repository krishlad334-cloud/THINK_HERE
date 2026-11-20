import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Briefcase,
  Settings,
  Bookmark,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronDown,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  UserCheck,
  FileText
} from 'lucide-react';

export default function ProfileDropdown() {
  const {
    currentUser,
    role,
    switchRole,
    setActiveTab,
    openAuthPage,
    logoutUser
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const handleSwitchPanel = (targetRole) => {
    switchRole(targetRole);
    setIsOpen(false);
  };

  const handleOpenAuth = (mode) => {
    openAuthPage(mode);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group select-none py-1 hover:opacity-90 transition-opacity"
        title="Account & Profile Menu"
      >
        <div className="relative cursor-pointer">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-[#16a34a] transition-all"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#16a34a] ring-2 ring-white" />
        </div>

        <div className="hidden xl:flex flex-col text-left cursor-pointer">
          <span className="text-xs font-bold text-slate-900 group-hover:text-[#004845] transition-colors leading-tight flex items-center gap-1">
            {currentUser.name}
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-transform" />
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {role === 'consultant' ? 'Admin / Consultant' : 'Client Account'}
          </span>
        </div>
      </div>

      {/* Hover & Click Dropdown Menu */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-[#e6f2f1] text-[#004845]">
                  {role === 'consultant' ? 'Verified Consultant & Admin' : 'Active Client'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Panel Switcher Inside Menu */}
          <div className="p-2 border-b border-slate-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Active Panel
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => handleSwitchPanel('client')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  role === 'client'
                    ? 'bg-white text-[#004845] shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Client</span>
              </button>
              <button
                onClick={() => handleSwitchPanel('consultant')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  role === 'consultant'
                    ? 'bg-white text-[#004845] shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Consultant</span>
              </button>
            </div>
          </div>

          {/* Navigation Links with Cursor Pointer */}
          <div className="py-1">
            {role === 'consultant' ? (
              <>
                <button
                  onClick={() => handleNav('profile')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>My Consultant Profile & CV</span>
                </button>
                <button
                  onClick={() => handleNav('my_consultations')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>My Active Consultations</span>
                </button>
                <button
                  onClick={() => handleNav('admin_dashboard')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Platform Operations & Admin</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('chat')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-[#004845]" />
                  <span>Workspace</span>
                </button>
                <button
                  onClick={() => handleNav('my_thoughts')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>My Thoughts & Roadmaps</span>
                </button>
                <button
                  onClick={() => handleNav('saved_solutions')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Saved Solutions</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleNav('settings')}
              className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Settings & Privacy</span>
            </button>
          </div>

          {/* Sign Out / Logout */}
          <div className="pt-1.5 border-t border-slate-100 px-2 space-y-1">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out / Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
