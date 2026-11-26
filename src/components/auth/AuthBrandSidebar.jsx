import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

const BRAND_HIGHLIGHTS = [
  {
    icon: Clock,
    iconBg: 'bg-[#0891b2]/20 text-[#06b6d4]',
    title: '24-Hour Fallback Guarantee',
    description:
      'Never stay blocked. Intelligent AI synthesizer activates if human specialists are pending.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-cyan-400/20 text-cyan-300',
    title: 'Shielded 1-on-1 Consultation Rooms',
    description:
      'Encrypted private chat, diagnostic file attachments, and integrated live video calls.',
  },
];

export default function AuthBrandSidebar() {
  return (
    <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-[#020617] via-[#020617] to-[#031b2e] text-white overflow-hidden select-none flex-shrink-0">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0891b2]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-[#020617]/40 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-white/20 shadow-lg flex items-center justify-center">
            <img src="/logo.svg" alt="OverThink" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center">
              Over<span className="text-[#22d3ee]">Think</span>
            </span>
            <p className="text-[11px] text-cyan-200/80 font-medium">
              Every Thought Deserves a Solution
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 my-auto py-8 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-cyan-300 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#06b6d4]" />
          <span>24-Hour Verified Consultation Platform</span>
        </div>

        <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.25]">
          Turn complex problems into validated roadmaps.
        </h2>

        <p className="text-sm xl:text-base text-cyan-100/75 leading-relaxed max-w-lg">
          Connect 1-on-1 in dedicated consultation rooms with vetted industry leaders, or receive structured AI fallback blueprints within 24 hours.
        </p>

        <div className="space-y-3 pt-2 max-w-md">
          {BRAND_HIGHLIGHTS.map((item) => {
            const HighlightIcon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-xs"
              >
                <div className={`p-2 rounded-xl ${item.iconBg} flex-shrink-0 mt-0.5`}>
                  <HighlightIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-cyan-100/70 mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <UserAvatar
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
            name="Dr. Elena Vance"
            role="consultant"
            size="md"
            showOnline={true}
            className="ring-2 ring-white/20"
          />
          <div className="min-w-0">
            <p className="text-xs italic text-cyan-100/90 leading-snug">
              "Direct connection between clients and vetted domain specialists with zero middleman friction."
            </p>
            <span className="text-[11px] font-bold text-white block mt-1">
              Dr. Elena Vance • Principal Solutions Architect (ex-AWS)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
