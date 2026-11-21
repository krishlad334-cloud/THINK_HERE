import React from 'react';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import {
  Search,
  Menu
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { role, activeTab, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex-shrink-0">
      <div className="w-full px-3 sm:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile hamburger + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab(role === 'consultant' ? 'browse_thoughts' : 'chat')}
            className="cursor-pointer"
          >
            <Logo size="md" showTagline={false} />
          </div>
        </div>

        {/* Center: Search / Context Input */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder={role === 'consultant' ? 'Search all client problems & skills...' : 'Search your thoughts, roadmaps & jobs...'}
              onClick={() => {
                if (role === 'consultant' && activeTab !== 'browse_thoughts') {
                  setActiveTab('browse_thoughts');
                } else if (role === 'client' && activeTab !== 'my_thoughts') {
                  setActiveTab('my_thoughts');
                }
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845] transition-all cursor-text"
            />
          </div>
        </div>

        {/* Right Section: Notifications (always visible) & Profile (desktop only) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Desktop Profile Dropdown (Hidden on mobile; on mobile, profile is in the sidebar) */}
          <div className="hidden lg:block">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
