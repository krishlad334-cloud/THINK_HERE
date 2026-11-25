import React from 'react';
import { Globe, Mail, MessageCircle, Share2 } from 'lucide-react';
import Logo from '../components/common/Logo';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  return (
    <footer
      id="footer"
      className="relative z-10 border-t border-[#4C4585]/40 bg-[#0A0816]/95 py-10 px-5 sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 md:flex-row">
        <button
          type="button"
          onClick={() => onNavigate?.('#hero')}
          className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
          aria-label="Back to top"
        >
          <Logo size="sm" showTagline={true} dark={true} />
        </button>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A9A4C8]"
        >
          <button type="button" onClick={() => onNavigate?.('#how-it-works')} className="hover:text-[#F5F3FF]">
            How it works
          </button>
          <button type="button" onClick={() => onNavigate?.('#human-vs-ai')} className="hover:text-[#F5F3FF]">
            Human vs AI
          </button>
          <button type="button" onClick={() => onNavigate?.('#use-cases')} className="hover:text-[#F5F3FF]">
            Use cases
          </button>
          <button type="button" onClick={() => onNavigate?.('#promise-24h')} className="hover:text-[#F5F3FF]">
            24h Promise
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {[
            { icon: Globe, label: 'Website', href: 'https://thinkhere.vercel.app/' },
            { icon: Share2, label: 'Share OverThink', href: '#hero' },
            { icon: MessageCircle, label: 'Community', href: '#testimonials' },
            { icon: Mail, label: 'Contact', href: '#final-cta' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#4C4585]/50 bg-[#15122B]/70 text-[#A9A4C8] transition hover:border-[#5EEAD4]/60 hover:text-[#5EEAD4]"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-[1400px] border-t border-[#4C4585]/25 pt-5 flex flex-col items-center justify-between gap-2 text-xs text-[#A9A4C8] sm:flex-row">
        <div>&copy; {CURRENT_YEAR} OverThink Platform. All rights reserved.</div>
        <div className="font-medium text-[#A9A4C8]">
          Developed by <span className="font-bold text-[#F5F3FF]">Krish Lad</span>
        </div>
        <div>Every Thought Deserves a Solution.</div>
      </div>
    </footer>
  );
}
