import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 104;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * 24-Hour Promise Section:
 * Balanced 2-column layout with the animated SVG ring on the left
 * and count-up stats & narrative on the right (no empty human gap).
 */
export default function TwentyFourHour({ reducedMotion = false }) {
  const sectionRef = useRef(null);
  const ringRef = useRef(null);
  const [hours, setHours] = useState(reducedMotion ? 24 : 0);
  const [solved, setSolved] = useState(reducedMotion ? 12400 : 0);
  const [clarity, setClarity] = useState(reducedMotion ? 98 : 0);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    const counters = { h: 0, s: 0, c: 0 };

    const ctx = gsap.context(() => {
      if (ringRef.current) {
        gsap.fromTo(
          ringRef.current,
          { strokeDashoffset: CIRCUMFERENCE },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'center center',
              scrub: 0.4,
            },
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(counters, {
            h: 24,
            s: 12400,
            c: 98,
            duration: 1.4,
            ease: 'power3.out',
            onUpdate: () => {
              setHours(Math.round(counters.h));
              setSolved(Math.round(counters.s));
              setClarity(Math.round(counters.c));
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="promise-24h" ref={sectionRef} className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        {/* Left: Animated SVG Ring Clock */}
        <div className="flex justify-center lg:col-span-5">
          <div className="relative flex h-64 w-64 sm:h-72 sm:w-72 items-center justify-center rounded-full border border-[#4C4585]/60 bg-[#15122B]/70 shadow-[0_0_80px_rgba(250,204,21,0.16)] backdrop-blur-xl">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 240 240">
              <defs>
                <linearGradient id="promise24Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="55%" stopColor="#5EEAD4" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
              </defs>
              <circle
                cx="120"
                cy="120"
                r={RADIUS}
                stroke="rgba(76, 69, 133, 0.35)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                ref={ringRef}
                cx="120"
                cy="120"
                r={RADIUS}
                stroke="url(#promise24Grad)"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={reducedMotion ? 0 : CIRCUMFERENCE}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Clock className="mb-1.5 h-5 w-5 text-[#FACC15]" />
              <div className="font-display text-5xl font-bold text-[#F5F3FF]">
                {String(hours).padStart(2, '0')}h
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#5EEAD4]">
                Max Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative + Count-Up Numbers */}
        <div className="space-y-6 lg:col-span-7">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F3FF] sm:text-5xl">
            Clarity Before Tomorrow Ends.
          </h2>
          <p className="text-sm leading-relaxed text-[#A9A4C8] sm:text-base">
            No waiting weeks for calendar invites. Submit once and get a
            focused, practical solution within 24 hours.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#4C4585]/50 bg-[#15122B]/65 p-5 backdrop-blur-md">
              <div className="font-display text-3xl font-bold text-[#FACC15]">
                {hours}h
              </div>
              <div className="mt-1 text-xs text-[#A9A4C8]">
                Guaranteed solution turnaround
              </div>
            </div>
            <div className="rounded-2xl border border-[#4C4585]/50 bg-[#15122B]/65 p-5 backdrop-blur-md">
              <div className="font-display text-3xl font-bold text-[#5EEAD4]">
                {solved.toLocaleString()}+
              </div>
              <div className="mt-1 text-xs text-[#A9A4C8]">
                Thoughts solved cleanly
              </div>
            </div>
            <div className="rounded-2xl border border-[#4C4585]/50 bg-[#15122B]/65 p-5 backdrop-blur-md">
              <div className="font-display text-3xl font-bold text-[#A855F7]">
                {clarity}%
              </div>
              <div className="mt-1 text-xs text-[#A9A4C8]">
                Users report immediate clarity
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
