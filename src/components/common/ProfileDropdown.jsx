import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Briefcase,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Check
} from 'lucide-react';

export default function ProfileDropdown({ onToggleSidebar }) {
  const {
    currentUser,
    role,
    switchDemoUser,
    demoUsers,
    setActiveTab,
    logoutUser
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hoverTimerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Desktop hover handlers
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 250);
    }
  };

  const handleTriggerClick = () => {
    // On mobile devices / screens < 1024px, open the sidebar drawer directly as requested
    if (window.innerWidth < 1024) {
      setIsOpen(false);
      if (onToggleSidebar) {
        onToggleSidebar();
      }
      return;
    }

    // On desktop, toggle dropdown
    setIsOpen(prev => !prev);
  };

  const handleNav = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const handleSelectDemoUser = (userId) => {
    switchDemoUser(userId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Trigger Button */}
      <div
        onClick={handleTriggerClick}
        className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group select-none py-1 hover:opacity-90 transition-opacity"
        title="Account & Profile Menu"
      >
        <div className="relative cursor-pointer">
          <img
            src={currentUser.profileImage || currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-[#16a34a] transition-all"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16a34a] ring-2 ring-white" />
        </div>

        <div className="hidden xl:flex flex-col text-left cursor-pointer">
          <span className="text-xs font-bold text-slate-900 group-hover:text-[#004845] transition-colors leading-tight flex items-center gap-1">
            {currentUser.name}
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-transform" />
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {currentUser.label || (role === 'consultant' ? 'Consultant' : 'Client Account')}
          </span>
        </div>
      </div>

      {/* Floating Dropdown - Exclusively for Desktop Screens (hidden on mobile; mobile opens sidebar) */}
      {isOpen && (
        <div
          className="hidden lg:block absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/95 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.profileImage || currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="overflow-hidden min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#004845] text-white">
                  {currentUser.label || (role === 'consultant' ? 'Consultant' : 'Client Account')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo User Switcher */}
          <div className="p-2 border-b border-slate-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Switch Demo Account
            </span>
            <div className="space-y-1">
              {(demoUsers || []).map((u) => {
                const isSelected = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u.id)}
                    className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#e6f2f1] text-[#004845] font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.profileImage || u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200"
                      />
                      <div className="truncate text-left">
                        <span className="font-bold text-slate-900 block truncate leading-tight">{u.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{u.name} • {u.role === 'client' ? 'Client' : 'Consultant'}</span>
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

          {/* Account Settings - Client Only */}
          {role === 'client' && (
            <div className="p-1 border-b border-slate-100">
              <button
                onClick={() => handleNav('settings')}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-[#004845] flex items-center gap-2.5 cursor-pointer font-medium transition-colors rounded-xl"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </button>
            </div>
          )}

          {/* Logout */}
          <div className="pt-1.5 px-1.5">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
