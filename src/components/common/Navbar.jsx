import React from 'react';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar, onGoToLanding }) {
  const { role, setActiveTab } = useApp();

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
            onClick={onGoToLanding || (() => setActiveTab(role === 'consultant' ? 'browse_thoughts' : 'chat'))}
            className="cursor-pointer"
            title="Return to Home"
          >
            <Logo size="md" showTagline={false} />
          </div>
        </div>

        {/* Right Section: Notifications (always visible) & Profile (desktop only) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Profile Dropdown */}
          <div className="block">
            <ProfileDropdown onGoToLanding={onGoToLanding} />
          </div>
        </div>
      </div>
    </header>
  );
}
