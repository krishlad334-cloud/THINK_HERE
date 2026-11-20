import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Clock, Sparkles } from 'lucide-react';
import { timeAgo } from '../../utils/formatters';

export default function NotificationDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead, setSelectedThoughtId } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.linkThoughtId) {
      setSelectedThoughtId(notif.linkThoughtId);
    }
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'solution_received':
        return <CheckCheck className="w-4 h-4 text-emerald-600" />;
      case 'ai_fallback':
        return <Sparkles className="w-4 h-4 text-[#16a34a]" />;
      case 'thought_matched':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#16a34a] rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-8 sm:right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
              <p className="text-xs text-slate-500">{unreadCount} unread updates</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-[#004845] hover:text-[#16a34a] cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    !notif.isRead ? 'bg-[#f0fdf4]/50' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 flex-shrink-0 h-fit">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] self-center flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              THINK Real-time Notification Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
