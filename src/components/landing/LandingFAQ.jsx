import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * LandingFAQ
 * Objection-Buster FAQ accordion before the footer.
 * Builds trust, removes hesitation, and answers critical user questions.
 */
export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(0); // Default open first question

  const faqs = [
    {
      q: 'How does OverThink match me with the right consultant?',
      a: 'When you submit your OverThink, our system analyzes the specific domain, technical complexity, and business stage. Verified consultants with verified track records in that exact niche review your challenge and accept it to begin a private, focused 1-on-1 consultation workspace.'
    },
    {
      q: 'Is my business information and proprietary data confidential?',
      a: '100% confidential. All communications, code snippets, financial metrics, and problem descriptions are encrypted and covered by platform-wide mutual non-disclosure (NDA) protection. Your data is never exposed publicly or used to train third-party AI models.'
    },
    {
      q: 'How are consultants vetted and selected?',
      a: 'We maintain a strict acceptance rate under 4%. Every consultant undergoes thorough credential auditing, proof of past operational leadership (ex-founders, principal engineers, top-tier strategy leads), and peer review before joining the active network.'
    },
    {
      q: "What if the consultant's guidance does not solve my situation?",
      a: 'We back every consultation with a 100% Satisfaction Guarantee. If a session fails to provide actionable clarity or diagnostic direction, our moderation team will review the exchange and immediately provide a complimentary re-match with another specialist or platform credit.'
    },
    {
      q: 'Can I continue working with the consultant after the initial consultation?',
      a: 'Yes! After your consultant delivers your initial action plan, you can seamlessly convert the relationship into ongoing weekly advisory check-ins, milestone-based execution sprints, or direct contract retainers right within OverThink.'
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto py-14 sm:py-20 px-4 sm:px-6">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#004845]" />
          <span>Frequently Asked Questions</span>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Everything You Need To Know
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Clear answers about how we protect your confidentiality, vet our consultants, and guarantee real progress.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-white border-emerald-300/80 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {faq.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-[#004845] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
