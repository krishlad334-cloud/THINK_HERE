import React from 'react';
import { Star } from 'lucide-react';

const ROW_1 = [
  {
    name: 'Aarav Mehta',
    role: 'Founder, PulseLedger',
    quote:
      'I spun on SaaS pricing tiers for three weeks. One 24h OverThink brief gave me a 3-tier anchor that doubled trial conversions.',
  },
  {
    name: 'Sophia Chen',
    role: 'Staff Engineer',
    quote:
      'Used the Human + AI flow before negotiating my equity offer. Paid for itself a hundred times over in one afternoon.',
  },
  {
    name: 'Marcus Vance',
    role: 'Product Lead',
    quote:
      'Unlike chatbots that agree with everything, my OverThink consultant challenged my core assumption and saved a 4-month rebuild.',
  },
  {
    name: 'Elena Rostova',
    role: 'Independent Designer',
    quote:
      'Dumped a messy midnight thought. Woke up to an organized roadmap and clarity that unlocked the entire project.',
  },
];

const ROW_2 = [
  {
    name: 'Devon Brooks',
    role: 'Seed Stage CTO',
    quote:
      'Having a principal systems architect audit our scaling bottleneck inside 24 hours felt like a superpower.',
  },
  {
    name: 'Priya Nair',
    role: 'Career Switcher',
    quote:
      'Stopped doom-scrolling 30 tabs of conflicting advice. One conversation mapped my exact 90-day transition.',
  },
  {
    name: 'Lucas Meyer',
    role: 'SaaS Operator',
    quote:
      'Confidentiality gave me peace of mind to share real churn numbers. The action plan was surgical.',
  },
  {
    name: 'Hannah Park',
    role: 'Bootstrapped Founder',
    quote:
      'Every thought really does deserve a solution. OverThink turned 2 a.m. stress into Monday morning execution.',
  },
];

function Card({ item }) {
  return (
    <div className="w-80 sm:w-96 flex-shrink-0 rounded-3xl border border-[#4C4585]/50 bg-[#15122B]/65 p-6 backdrop-blur-xl transition-colors hover:border-[#5EEAD4]/60">
      <div className="mb-3 flex items-center gap-1 text-[#FACC15]">
        {[0, 1, 2, 3, 4].map((star) => (
          <Star key={star} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[#F5F3FF]">“{item.quote}”</p>
      <div className="mt-4 border-t border-[#4C4585]/40 pt-3">
        <div className="text-sm font-bold text-[#F5F3FF]">{item.name}</div>
        <div className="text-xs text-[#5EEAD4]">{item.role}</div>
      </div>
    </div>
  );
}

/**
 * Testimonials Section:
 * Auto-drifting marquee of glass cards with pause-on-hover and soft edge fade.
 */
export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto mb-8 sm:mb-10 max-w-4xl px-5 text-center sm:px-8 space-y-3">
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F3FF] sm:text-5xl">
          Real Breakthroughs From Thinkers
        </h2>
        <p className="mx-auto max-w-xl text-sm text-[#A9A4C8] sm:text-base">
          Founders, engineers, and career builders who turned late-night
          overthinking into clear next moves.
        </p>
      </div>

      <div className="relative space-y-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-[#0A0816] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-[#0A0816] to-transparent" />

        <div className="flex overflow-hidden">
          <div className="flex gap-6 animate-marquee-left hover:[animation-play-state:paused]">
            {[...ROW_1, ...ROW_1].map((item, idx) => (
              <Card key={`${item.name}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden opacity-90">
          <div className="flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
            {[...ROW_2, ...ROW_2].map((item, idx) => (
              <Card key={`${item.name}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
