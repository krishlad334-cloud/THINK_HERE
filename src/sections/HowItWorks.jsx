import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY_STEPS } from '../data/landingStorySteps';
import StoryStepCard from './StoryStepCard';

export default function HowItWorks({ reducedMotion = false }) {
  const [routeChoice, setRouteChoice] = useState('human');

  useEffect(() => {
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 240);
    return () => clearTimeout(refreshId);
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto mb-14 sm:mb-20 max-w-3xl text-center space-y-3">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F3FF] sm:text-5xl">
            From Overthinking to{' '}
            <span className="bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] bg-clip-text text-transparent">
              Clear Solution
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#A9A4C8]">
            Six moments inside one human mind—see how chaos transforms into a 24-hour action plan, step by step.
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {STORY_STEPS.map((step, idx) => (
            <StoryStepCard
              key={step.num}
              step={step}
              index={idx}
              isLast={idx === STORY_STEPS.length - 1}
              routeChoice={routeChoice}
              onSelectRoute={setRouteChoice}
              reducedMotion={reducedMotion}
              nextAccent={STORY_STEPS[idx + 1]?.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
