export const CHAT_STATUS_OPTIONS = [
  {
    value: 'pending',
    label: 'Pending',
    dotClass: 'bg-amber-500 animate-pulse',
    menuItemClass: 'hover:bg-amber-50 text-amber-800',
    pillClass: 'bg-amber-50 hover:bg-amber-100 text-amber-700',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    value: 'accepted',
    label: 'Accepted',
    dotClass: 'bg-cyan-500',
    menuItemClass: 'hover:bg-cyan-50 text-cyan-800',
    pillClass: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    dotClass: 'bg-blue-500 animate-pulse',
    menuItemClass: 'hover:bg-blue-50 text-blue-800',
    pillClass: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    value: 'answered',
    label: 'Answered',
    dotClass: 'bg-emerald-500',
    menuItemClass: 'hover:bg-emerald-50 text-emerald-800',
    pillClass: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    value: 'resolved',
    label: 'Completed',
    dotClass: 'bg-sky-500',
    menuItemClass: 'hover:bg-sky-50 text-sky-800',
    pillClass: 'bg-sky-50 hover:bg-sky-100 text-sky-700',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  {
    value: 'ai_fallback',
    label: 'AI Fallback',
    dotClass: 'bg-violet-500',
    menuItemClass: 'hover:bg-violet-50 text-violet-800',
    pillClass: 'bg-violet-50 hover:bg-violet-100 text-violet-700',
    badgeClass: 'bg-violet-50 text-violet-800 border-violet-200',
  },
  {
    value: 'closed',
    label: 'Closed',
    dotClass: 'bg-slate-500',
    menuItemClass: 'hover:bg-slate-100 text-slate-700',
    pillClass: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
  },
];

export function getChatStatusConfig(status) {
  if (status === 'pending_human') {
    return CHAT_STATUS_OPTIONS[0];
  }
  return (
    CHAT_STATUS_OPTIONS.find((item) => item.value === status) || {
      value: status,
      label: status,
      dotClass: 'bg-slate-400',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}
