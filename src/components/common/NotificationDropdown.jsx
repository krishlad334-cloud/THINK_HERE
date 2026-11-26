import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import { Bell, Clock, MessageSquare, CheckCircle, X } from 'lucide-react';
import { timeAgo } from '../../utils/formatters';

export default function NotificationDropdown() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openChatWithThought
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    const targetThinkId = notif.thinkId || notif.linkThoughtId;
    if (targetThinkId) {
      openChatWithThought(targetThinkId);
    }
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'consultant_accepted':
      case 'solution_received':
        return <CheckCircle className="w-4 h-4 text-[#0891b2]" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-[#0891b2]" />;
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
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#0891b2] rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-[#020617] hover:text-[#0891b2] cursor-pointer whitespace-nowrap"
                >
                  Mark all as read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer ml-1"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-100 overscroll-contain">
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
                    !notif.isRead ? 'bg-[#ecfeff]/60' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 flex-shrink-0 h-fit">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#0891b2] self-center flex-shrink-0 ml-1" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              OverThink Real-time Notifications
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
