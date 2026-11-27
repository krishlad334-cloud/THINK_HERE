import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Info,
  MoreVertical,
  PhoneCall,
  Video,
} from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import StatusBadge from '../common/StatusBadge';
import VerifiedBadge from '../common/VerifiedBadge';
import { CHAT_STATUS_OPTIONS, getChatStatusConfig } from '../../data/chatConstants';

export default function ChatHeader({
  partnerName,
  partnerAvatar,
  partnerRoleLabel,
  activeThought,
  currentStatus,
  thinkId,
  showContextDrawer,
  onToggleContextDrawer,
  onCloseContextDrawer,
  showStatusMenu,
  onToggleStatusMenu,
  showMoreMenu,
  onToggleMoreMenu,
  onCloseMenus,
  statusMenuRef,
  moreMenuRef,
  onBackToList,
  onStartCall,
  onStatusChange,
  canChangeStatus = true,
}) {
  const [copiedThinkId, setCopiedThinkId] = useState(false);
  const statusConfig = getChatStatusConfig(currentStatus);

  const handleCopyThinkId = () => {
    navigator.clipboard?.writeText(`#${thinkId}`).catch(() => {});
    setCopiedThinkId(true);
    setTimeout(() => {
      setCopiedThinkId(false);
      onCloseMenus();
    }, 1200);
  };

  return (
    <>
      <div className="px-2.5 sm:px-4 py-2 sm:py-2.5 border-b border-slate-200/90 flex items-center justify-between bg-white z-20 flex-shrink-0 shadow-2xs gap-1 sm:gap-3 h-14 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBackToList}
            className="p-1.5 -ml-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer transition-colors flex-shrink-0"
            title="Back to conversations"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div
            className="relative flex-shrink-0 cursor-pointer"
            onClick={onToggleContextDrawer}
          >
            <UserAvatar
              src={partnerAvatar}
              name={partnerName}
              role={partnerRoleLabel?.toLowerCase().includes('consultant') ? 'consultant' : 'client'}
              size="md"
              showOnline={true}
            />
          </div>

          <div className="min-w-0 flex-1 cursor-pointer" onClick={onToggleContextDrawer}>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-tight">
                {partnerName}
              </h3>
              {partnerRoleLabel?.toLowerCase().includes('consultant') && (
                <VerifiedBadge size="md" />
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-600 font-semibold leading-none">Online</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onStartCall('video')}
            className="p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-xl text-slate-700 hover:text-[#020617] hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Start Live Video Call"
            aria-label="Start Live Video Call"
          >
            <Video className="w-5 h-5 text-slate-700 hover:text-[#020617]" />
            <span className="hidden lg:inline text-xs font-semibold text-slate-700">Video</span>
          </button>

          <button
            type="button"
            onClick={() => onStartCall('audio')}
            className="p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-xl text-slate-700 hover:text-[#020617] hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Start Voice Call"
            aria-label="Start Voice Call"
          >
            <PhoneCall className="w-4.5 h-4.5 text-slate-700 hover:text-[#020617]" />
            <span className="hidden lg:inline text-xs font-semibold text-slate-700">Call</span>
          </button>

          <div className="relative hidden md:block" ref={statusMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (canChangeStatus) onToggleStatusMenu();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                canChangeStatus ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
              } ${statusConfig.badgeClass}`}
              title={
                canChangeStatus
                  ? 'Change Status (Pending, Accepted, In Progress, Answered, Completed, Closed)'
                  : 'Current Consultation Status'
              }
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
              <span>{statusConfig.label}</span>
              {canChangeStatus && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
            </button>

            {showStatusMenu && canChangeStatus && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Change Status
                </div>
                {CHAT_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onStatusChange(option.value)}
                    className={`w-full px-3 py-2 text-xs font-semibold text-left flex items-center gap-2 cursor-pointer ${option.menuItemClass}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.dotClass}`} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMoreMenu();
              }}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
              title="More Options"
              aria-label="More Options"
            >
              <MoreVertical className="w-5 h-5 text-slate-700" />
            </button>

            {showMoreMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 z-50 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Consultation Status
                  </span>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600 font-medium">Current:</span>
                    <StatusBadge
                      status={currentStatus}
                      variant="compact"
                      pendingLabel="Pending"
                      resolvedLabel="Completed"
                    />
                  </div>
                  {canChangeStatus && (
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {CHAT_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onStatusChange(option.value);
                            onCloseMenus();
                          }}
                          className={`py-1 px-2 rounded-lg text-[11px] font-semibold text-center transition-colors ${option.pillClass}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-1.5 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleContextDrawer();
                      onCloseMenus();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Info className="w-4 h-4 text-[#020617]" />
                    <span>
                      {showContextDrawer ? 'Hide OverThink Details' : 'View OverThink Details'}
                    </span>
                  </button>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={handleCopyThinkId}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="truncate font-mono text-[11px]">#{thinkId}</span>
                    <span className="text-[10px] text-[#020617] font-bold flex items-center gap-1">
                      {copiedThinkId ? (
                        <Check className="w-3 h-3 text-[#0891b2]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedThinkId ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showContextDrawer && activeThought && (
        <div className="bg-white border-b border-slate-200 p-4 sm:p-5 animate-in slide-in-from-top-2 duration-150 space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#020617]">
                  Original OverThink #{activeThought.id}
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#ecfeff] text-[#020617]">
                  {activeThought.category}
                </span>
                <StatusBadge
                  status={currentStatus}
                  variant="compact"
                  pendingLabel="Pending"
                  resolvedLabel="Completed"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{activeThought.title}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap max-w-4xl">
                {activeThought.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseContextDrawer}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer flex-shrink-0"
            >
              ✕ Close
            </button>
          </div>

          {activeThought.attachments && activeThought.attachments.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">Attachments:</span>
              {activeThought.attachments.map((att, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-[#020617]" />
                  <span>{att.name}</span>
                  <span className="text-[10px] text-slate-400">({att.size || '1.2 MB'})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
