import React from 'react';
import { Check, CheckCheck, Copy, FileText, MoreVertical, Trash2 } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import { timeAgo } from '../../utils/formatters';

function isOnlyEmojis(text) {
  if (!text || typeof text !== 'string') return false;
  const clean = text.trim();
  if (!clean) return false;
  try {
    const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\s)+$/u;
    return emojiRegex.test(clean) && Array.from(clean).length <= 4;
  } catch {
    return false;
  }
}

export default function MessageBubble({
  msg,
  isMine,
  activeUser,
  partnerAvatar,
  isMenuOpen,
  copiedMsgId,
  onToggleMenu,
  onCopyText,
  onDeleteMessage,
}) {
  const emojiOnly = isOnlyEmojis(msg.text);
  const avatarSrc = isMine
    ? msg.senderAvatar || activeUser?.profileImage || activeUser?.avatar
    : msg.senderAvatar || partnerAvatar;

  return (
    <div
      className={`flex items-start gap-2.5 sm:gap-3 max-w-md sm:max-w-lg lg:max-w-xl group relative ${
        isMine ? 'ml-auto flex-row-reverse' : 'mr-auto'
      }`}
    >
      <UserAvatar
        src={avatarSrc}
        name={msg.senderName || activeUser?.name}
        role={isMine ? activeUser?.role : msg.senderRole}
        size="sm"
        className="ring-2 ring-white shadow-xs mt-0.5"
      />

      <div
        className={`flex flex-col max-w-[calc(100%-2.5rem)] min-w-0 ${
          isMine ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`flex items-center px-1 mb-1 ${
            isMine ? 'justify-end gap-2' : 'gap-1.5'
          }`}
        >
          {isMine ? (
            <>
              <span className="text-[10px] text-slate-400">{timeAgo(msg.createdAt)}</span>
              <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
              {msg.senderRole === 'consultant' && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Consultant
                </span>
              )}
              <span className="text-[10px] text-slate-400">{timeAgo(msg.createdAt)}</span>
            </>
          )}
        </div>

        <div
          className={`relative group/bubble w-fit max-w-full ${
            isMine ? 'flex flex-col items-end' : ''
          }`}
        >
          <div
            className={`w-fit max-w-full rounded-2xl shadow-xs leading-relaxed ${
              isMine
                ? 'rounded-tr-xs bg-[#020617] text-white text-left'
                : 'rounded-tl-xs bg-white border border-slate-200/90 text-slate-800'
            } ${
              emojiOnly
                ? 'px-3.5 py-2 text-2xl sm:text-3xl'
                : 'px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-[13.5px]'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{msg.text}</p>

            {msg.attachments && msg.attachments.length > 0 && (
              <div
                className={`mt-2.5 pt-2 border-t flex flex-wrap gap-1.5 ${
                  isMine ? 'border-white/20' : 'border-slate-100'
                }`}
              >
                {msg.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${
                      isMine
                        ? 'bg-white/10 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#0891b2]" />
                    <span className="font-semibold truncate max-w-[140px]">{att.name}</span>
                    {!isMine && (
                      <span className="text-[10px] text-slate-400">({att.size || '1 MB'})</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isMine && (
              <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-cyan-200/80">
                <span>{timeAgo(msg.createdAt)}</span>
                <CheckCheck
                  className={`w-3.5 h-3.5 ${msg.isRead ? 'text-[#0891b2]' : 'text-cyan-300'}`}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className={`absolute top-2 ${
              isMine ? '-left-7' : '-right-7'
            } p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 opacity-0 group-hover/bubble:opacity-100 transition-opacity cursor-pointer`}
            title="Message options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute ${
                isMine ? 'right-0' : 'left-0'
              } top-full mt-1 z-30 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1`}
            >
              <button
                type="button"
                onClick={() => onCopyText(msg.id, msg.text)}
                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                {copiedMsgId === msg.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0891b2]" />
                    <span className="text-[#0891b2]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {isMine && (
                <button
                  type="button"
                  onClick={() => onDeleteMessage(msg.id)}
                  className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
