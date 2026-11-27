import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Heart, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const USE_CASES = [
  {
    icon: Briefcase,
    category: 'Business ideas',
    glow: '#A855F7',
    title: 'Validate before burning months',
    prompt: '“Should I launch a B2B SaaS or productized service first with $15k?”',
    outcome: 'Pricing tiers, ICP wedge & 14-day validation sprint.',
  },
  {
    icon: GraduationCap,
    category: 'Career challenges',
    glow: '#5EEAD4',
    title: 'Navigate high-stakes pivots',
    prompt: '“Series B staff role vs staying tech lead—what am I missing?”',
    outcome: 'Equity risk breakdown, negotiation script & 12-month plan.',
  },
  {
    icon: Heart,
    category: 'Personal problems',
    glow: '#F472B6',
    title: 'Untangle overwhelming choices',
    prompt: '“Burned out, relocating cities, and stuck in analysis paralysis.”',
    outcome: 'Calm decision matrix separating reversible vs irreversible bets.',
  },
  {
    icon: HelpCircle,
    category: 'Questions',
    glow: '#FACC15',
    title: 'Get unbiased second opinions',
    prompt: '“Co-founder wants VC funding, I want to bootstrap—how do we align?”',
    outcome: 'Objective trade-off brief and structured alignment agenda.',
  },
];

export default function UseCases({ isMobile = false, reducedMotion = false }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const highlightCard = (idx) => {
    setActiveIdx(idx);
  };

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || isMobile || reducedMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 180);

      if (getScrollAmount() > 0) {
        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                USE_CASES.length - 1,
                Math.floor(self.progress * USE_CASES.length)
              );
              setActiveIdx(idx);
            },
          },
        });
      }

      gsap.utils.toArray('.usecase-parallax-inner').forEach((el, idx) => {
        gsap.fromTo(
          el,
          { x: idx % 2 === 0 ? -14 : 14 },
          {
            x: idx % 2 === 0 ? 14 : -14,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${getScrollAmount()}`,
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, reducedMotion]);

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="relative overflow-hidden py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto mb-8 max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F3FF] sm:text-5xl">
              Bring Any Unfinished Thought
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A9A4C8]">
            From startup validation to career leaps and personal clarity—explore
            real scenarios solved cleanly.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`flex gap-4 sm:gap-6 px-5 sm:px-8 lg:px-12 ${
          isMobile || reducedMotion
            ? 'overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            : 'w-max'
        }`}
      >
        {USE_CASES.map((item, idx) => {
          const Icon = item.icon;
          const isCurrent = idx === activeIdx;
          return (
            <article
              key={item.category}
              onMouseEnter={() => highlightCard(idx)}
              onClick={() => highlightCard(idx)}
              style={{
                boxShadow: isCurrent ? `0 0 42px ${item.glow}26` : undefined,
                borderColor: isCurrent ? `${item.glow}88` : undefined,
              }}
              className="snap-center flex-shrink-0 w-[84vw] sm:w-[400px] lg:w-[440px] rounded-3xl border border-[#4C4585]/50 bg-[#15122B]/70 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="usecase-parallax-inner flex h-full flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4C4585]/60 bg-[#0A0816]/70"
                      style={{ color: item.glow }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A9A4C8]">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#F5F3FF]">
                    {item.title}
                  </h3>

                  <div className="rounded-2xl border border-[#4C4585]/40 bg-[#0A0816]/75 p-4 text-sm italic text-[#F5F3FF]/90">
                    {item.prompt}
                  </div>
                </div>

                <div className="border-t border-[#4C4585]/40 pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5EEAD4]">
                    24h Solution Output
                  </div>
                  <p className="mt-1 text-sm text-[#A9A4C8]">{item.outcome}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
