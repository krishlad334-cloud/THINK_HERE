import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Globe, Mail, MessageCircle, Share2 } from 'lucide-react';
import Logo from '../components/common/Logo';
import { subscribeNewsletter } from '../utils/thinkStorage';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || isSubmitting) return;

    setIsSubmitting(true);
    setStatus(null);
    try {
      const res = await subscribeNewsletter(cleanEmail, 'landing_footer');
      setStatus({
        type: 'success',
        text: res.alreadySubscribed
          ? 'You are already subscribed to OverThink updates.'
          : res.message || 'Subscribed to OverThink clarity dispatches!',
      });
      if (!res.alreadySubscribed) {
        setEmail('');
      }
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.message || 'Please enter a valid email address.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="mx-auto mt-6 max-w-[1400px] border-t border-[#4C4585]/25 pt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-xs text-[#A9A4C8]">
          &copy; {CURRENT_YEAR} OverThink Platform. Developed by{' '}
          <span className="font-bold text-[#F5F3FF]">Krish Lad</span>.
        </div>

        <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status) setStatus(null);
              }}
              placeholder="Subscribe for clarity updates..."
              aria-label="Newsletter email address"
              className="w-full sm:w-64 rounded-xl border border-[#4C4585]/60 bg-[#15122B]/80 px-3.5 py-2 text-xs text-[#F5F3FF] placeholder:text-[#A9A4C8]/70 focus:border-[#5EEAD4] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] px-3.5 py-2 text-xs font-bold text-[#0A0816] transition hover:opacity-95 disabled:opacity-60 cursor-pointer flex-shrink-0"
            >
              <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {status && (
            <p
              className={`text-[11px] flex items-center gap-1 ${
                status.type === 'error' ? 'text-rose-300' : 'text-[#5EEAD4]'
              }`}
            >
              {status.type === 'success' && <CheckCircle2 className="h-3 w-3" />}
              <span>{status.text}</span>
            </p>
          )}
        </form>
      </div>
    </footer>
  );
}
