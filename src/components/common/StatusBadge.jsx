import React from 'react';
import { CheckCircle, Clock, Lock } from 'lucide-react';

const SIZE_CLASSES = {
  compact: {
    badge: 'px-2 py-0.5 rounded-md text-[10px] font-bold',
    icon: 'w-3 h-3',
    dot: 'w-1.5 h-1.5',
    showIcon: false,
  },
  pill: {
    badge: 'px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1',
    icon: 'w-3 h-3',
    dot: 'w-2 h-2',
    showIcon: true,
  },
  card: {
    badge: 'px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5',
    icon: 'w-3.5 h-3.5',
    dot: 'w-2 h-2',
    showIcon: true,
  },
};

export default function StatusBadge({
  status,
  variant = 'pill',
  pendingLabel = 'Pending Review',
  resolvedLabel = 'Resolved',
}) {
  const layout = SIZE_CLASSES[variant] || SIZE_CLASSES.pill;

  switch (status) {
    case 'pending':
    case 'pending_human':
      return (
        <span className={`${layout.badge} bg-amber-50 text-amber-800 border border-amber-200`}>
          {layout.showIcon && <span className={`${layout.dot} rounded-full bg-amber-500 animate-pulse`} />}
          <span>{pendingLabel}</span>
        </span>
      );
    case 'accepted':
      return (
        <span className={`${layout.badge} bg-cyan-50 text-cyan-800 border border-cyan-200`}>
          {layout.showIcon && <CheckCircle className={`${layout.icon} text-cyan-600`} />}
          <span>Accepted</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className={`${layout.badge} bg-blue-50 text-blue-800 border border-blue-200`}>
          {layout.showIcon && <Clock className={`${layout.icon} text-blue-600`} />}
          <span>In Progress</span>
        </span>
      );
    case 'answered':
      return (
        <span className={`${layout.badge} bg-emerald-50 text-emerald-800 border border-emerald-200`}>
          {layout.showIcon && <CheckCircle className={`${layout.icon} text-emerald-600`} />}
          <span>Answered</span>
        </span>
      );
    case 'ai_fallback':
      return (
        <span className={`${layout.badge} bg-violet-50 text-violet-800 border border-violet-200`}>
          {layout.showIcon && <CheckCircle className={`${layout.icon} text-violet-600`} />}
          <span>AI Fallback</span>
        </span>
      );
    case 'resolved':
      return (
        <span className={`${layout.badge} bg-sky-50 text-sky-800 border border-sky-200`}>
          {layout.showIcon && <CheckCircle className={`${layout.icon} text-sky-600`} />}
          <span>{resolvedLabel}</span>
        </span>
      );
    case 'closed':
      return (
        <span className={`${layout.badge} bg-slate-100 text-slate-700 border border-slate-300`}>
          {layout.showIcon && <Lock className={`${layout.icon} text-slate-500`} />}
          <span>Closed</span>
        </span>
      );
    default:
      return (
        <span className={`${layout.badge} bg-slate-100 text-slate-700`}>
          <span>{status}</span>
        </span>
      );
  }
}
