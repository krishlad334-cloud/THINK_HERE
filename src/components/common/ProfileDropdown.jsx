import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from './UserAvatar';
import VerifiedBadge from './VerifiedBadge';
import {
  User,
  Briefcase,
  LogOut,
  ChevronDown,
  Phone,
  Star,
  FileText,
  MessageSquare,
  Home
} from 'lucide-react';

export default function ProfileDropdown({ onGoToLanding }) {
  const {
    currentUser,
    role,
    setActiveTab,
    logoutUser
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNav = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  const isConsultant = role === 'consultant' || currentUser?.role === 'consultant';
  const isConsultantVerified = Boolean(currentUser?.assessmentPassed || currentUser?.isVerified);
  const roleBadgeLabel = isConsultant
    ? (isConsultantVerified ? 'Consultant' : 'Verification Pending')
    : 'Client Account';

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group select-none py-1 hover:opacity-90 transition-opacity"
        title="Account & Profile Menu"
      >
        <div className="relative cursor-pointer">
          <UserAvatar
            src={currentUser?.profileImage || currentUser?.avatar}
            name={currentUser?.name}
            role={role}
            size="sm"
            showOnline={true}
            className="ring-2 ring-slate-200 group-hover:ring-[#0891b2] transition-all"
          />
        </div>

        <div className="hidden xl:flex flex-col text-left cursor-pointer">
          <span className="text-xs font-bold text-slate-900 group-hover:text-[#020617] transition-colors leading-tight flex items-center gap-1">
            <span>{currentUser?.name || 'My Account'}</span>
            {isConsultant && isConsultantVerified && <VerifiedBadge size="xs" />}
            <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {roleBadgeLabel}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 max-w-sm ml-auto bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50"
        >
          <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <UserAvatar
                  src={currentUser?.profileImage || currentUser?.avatar}
                  name={currentUser?.name}
                  role={role}
                  size="md"
                  showOnline={true}
                  className="ring-2 ring-white shadow-xs"
                />
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name}
                  </h4>
                  {isConsultant && isConsultantVerified && <VerifiedBadge size="xs" />}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {currentUser?.email}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  {roleBadgeLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Account Overview
            </span>

            {currentUser?.title && (
              <div className="text-xs text-slate-700 leading-snug">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specialization</span>
                <span className="font-medium text-slate-800 line-clamp-2">{currentUser.title}</span>
              </div>
            )}

            {currentUser?.mobile && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Mobile</span>
                </span>
                <span className="font-semibold text-slate-800 font-mono text-[11px]">
                  {currentUser.mobile}
                </span>
              </div>
            )}

            {isConsultant && (
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Hourly Rate</span>
                  <span className="text-xs font-bold text-[#020617]">
                    ${currentUser?.hourlyRate || 150}/hr
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Reputation</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{currentUser?.rating || 4.98}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-1.5 border-b border-slate-100 space-y-0.5">
            {isConsultant ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('profile')}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>View Consultant Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('my_consultations')}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>My Consultations</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('chat')}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Consultation Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('my_thoughts')}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>My Thoughts</span>
                </button>
              </>
            )}

            {onGoToLanding && (
              <button
                type="button"
                onClick={() => {
                  onGoToLanding();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>Return to Home Page</span>
              </button>
            )}
          </div>

          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
