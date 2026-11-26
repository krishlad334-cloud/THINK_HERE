import React from 'react';
import { Play, Camera, FileText, StickyNote, Search } from 'lucide-react';

export default function FloatingWindow({
  variant = 'article',
  title = 'research-tab.html',
  className = '',
  style = {},
}) {
  if (variant === 'sticky') {
    return (
      <div
        style={style}
        className={`w-36 rounded-2xl border border-[#FACC15]/45 bg-[#15122B]/85 p-3 shadow-[0_14px_34px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
      >
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#FACC15]">
          <span className="inline-flex items-center gap-1">
            <StickyNote className="h-3 w-3" />
            Note
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#F472B6]" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-[#FACC15]/55" />
          <div className="h-1.5 w-4/5 rounded-full bg-[#F5F3FF]/30" />
          <div className="h-1.5 w-2/3 rounded-full bg-[#F472B6]/50" />
        </div>
      </div>
    );
  }

  if (variant === 'papers') {
    return (
      <div
        style={style}
        className={`w-36 rounded-xl border border-[#4C4585]/60 bg-[#15122B]/90 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.55)] backdrop-blur-md ${className}`}
      >
        <div className="mb-2 flex items-center justify-between text-[10px] font-medium text-[#A9A4C8]">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3 w-3 text-[#5EEAD4]" />
            Draft_v4.pdf
          </span>
          <span className="text-[9px] text-[#F472B6]">14p</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-[#4C4585]" />
          <div className="h-1.5 w-5/6 rounded bg-[#A9A4C8]/30" />
          <div className="h-1.5 w-3/4 rounded bg-[#5EEAD4]/35" />
        </div>
      </div>
    );
  }

  if (variant === 'camera') {
    return (
      <div
        style={style}
        className={`inline-flex items-center gap-2.5 rounded-2xl border border-[#A855F7]/45 bg-[#15122B]/90 px-3 py-2 shadow-[0_14px_30px_rgba(0,0,0,0.55)] backdrop-blur-md ${className}`}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
          <Camera className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-14 rounded bg-[#F5F3FF]/45" />
          <div className="h-1.5 w-9 rounded bg-[#5EEAD4]/55" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`overflow-hidden rounded-2xl border border-[#4C4585]/70 bg-[#F5F3FF]/95 text-[#0A0816] shadow-[0_20px_48px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="flex items-center justify-between bg-[#4C4585] px-2.5 py-1.5">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#F472B6]" />
          <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
          <span className="h-2 w-2 rounded-full bg-[#5EEAD4]" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-1 rounded bg-[#0A0816]/25 px-1.5 py-0.5">
          <Search className="h-2.5 w-2.5 text-[#A9A4C8]" />
          <span className="truncate text-[8.5px] font-medium text-[#F5F3FF]/90">
            {title}
          </span>
        </div>
      </div>

      {variant === 'video' && (
        <div className="relative flex h-24 items-center justify-center bg-[#15122B] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F3FF] text-[#0A0816] shadow-[0_0_20px_rgba(94,234,212,0.45)]">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 right-2.5 h-1 rounded-full bg-[#4C4585]">
            <div className="h-full w-2/5 rounded-full bg-[#F472B6]" />
          </div>
        </div>
      )}

      {variant === 'grid' && (
        <div className="grid grid-cols-3 gap-1.5 p-2.5">
          <div className="h-8 rounded-md bg-[#4C4585]/25" />
          <div className="h-8 rounded-md bg-[#FACC15]/60" />
          <div className="h-8 rounded-md bg-[#F472B6]/50" />
          <div className="col-span-2 h-5 rounded-md bg-[#A9A4C8]/35" />
          <div className="h-5 rounded-md bg-[#4C4585]/35" />
        </div>
      )}

      {variant === 'analytics' && (
        <div className="space-y-1.5 p-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-7 rounded-md bg-[#FACC15]/80" />
            <div className="h-7 rounded-md bg-[#4C4585]/85" />
          </div>
          <div className="h-1.5 w-full rounded bg-[#A9A4C8]/40" />
          <div className="h-1.5 w-3/4 rounded bg-[#F472B6]/65" />
          <div className="h-1.5 w-1/2 rounded bg-[#4C4585]/30" />
        </div>
      )}

      {variant === 'article' && (
        <div className="space-y-1.5 p-2.5">
          <div className="flex gap-2">
            <div className="h-8 w-9 flex-shrink-0 rounded-md bg-[#F472B6]/60" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-full rounded bg-[#4C4585]/80" />
              <div className="h-1.5 w-4/5 rounded bg-[#A9A4C8]/50" />
            </div>
          </div>
          <div className="h-1.5 w-full rounded bg-[#A9A4C8]/35" />
          <div className="h-1.5 w-2/3 rounded bg-[#FACC15]/75" />
        </div>
      )}
    </div>
  );
}
