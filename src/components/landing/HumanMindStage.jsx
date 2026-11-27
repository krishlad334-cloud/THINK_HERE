import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TYPED_THOUGHT } from '../../data/landingStorySteps';
import MindThoughtsOverlay, { MindConnections } from './MindThoughtsOverlay';

const POSE_MOTION = {
  stressed: {
    y: [0, 3],
    scale: [1, 1.014],
    rotate: [-0.4, 0.4],
    duration: 3.0,
  },
  searching: {
    x: [-3, 3],
    rotate: [-0.7, 0.7],
    duration: 4.0,
  },
  typing: {
    y: [0, -3],
    scale: [1, 1.01],
    duration: 3.4,
  },
  choosing: {
    y: [0, -4],
    rotate: [-0.45, 0.45],
    duration: 4.2,
  },
  refining: {
    y: [0, -5],
    rotate: [-0.6, 0.7],
    duration: 3.8,
  },
  relieved: {
    y: [0, -6],
    scale: [1, 1.022],
    duration: 3.9,
  },
};

export default function HumanMindStage({
  step,
  index,
  routeChoice = 'human',
  onSelectRoute,
  reducedMotion = false,
}) {
  const stageRef = useRef(null);
  const isInView = useInView(stageRef, { once: true, amount: 0.25 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [typedCount, setTypedCount] = useState(reducedMotion ? TYPED_THOUGHT.length : 14);

  useEffect(() => {
    if (reducedMotion || !step.isTyping || !isInView) return undefined;
    const id = setInterval(() => {
      setTypedCount((c) => (c >= TYPED_THOUGHT.length ? 16 : c + 2));
    }, 50);
    return () => clearInterval(id);
  }, [step.isTyping, isInView, reducedMotion]);

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
    setTilt({ x: ny, y: nx });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const { duration: poseDuration, ...poseKeyframes } = POSE_MOTION[step.pose] || POSE_MOTION.stressed;
  const typedText =
    reducedMotion || !step.isTyping
      ? TYPED_THOUGHT
      : TYPED_THOUGHT.slice(0, typedCount);

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto h-[340px] w-full max-w-[760px] sm:h-[440px] lg:h-[500px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[20%] h-52 w-52 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-full blur-3xl"
          style={{ background: step.accent }}
        />

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.82 }}
          animate={
            !isInView
              ? { opacity: 0, scale: 0.82 }
              : reducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, rotate: 360 }
          }
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 48, repeat: Infinity, ease: 'linear' },
          }}
          style={{ borderColor: `${step.accent}32` }}
          className="will-change-transform absolute top-[12%] h-[230px] w-[230px] sm:h-[320px] sm:w-[320px] lg:h-[395px] lg:w-[395px] rounded-full border border-dashed"
        />

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.82 }}
          animate={
            !isInView
              ? { opacity: 0, scale: 0.82 }
              : reducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, rotate: -360 }
          }
          transition={{
            opacity: { duration: 0.6, delay: 0.1 },
            scale: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 64, repeat: Infinity, ease: 'linear' },
          }}
          style={{ borderColor: `${step.secondaryAccent || step.accent}24` }}
          className="will-change-transform absolute top-[18%] h-[180px] w-[180px] sm:h-[250px] sm:w-[250px] lg:h-[310px] lg:w-[310px] rounded-full border"
        />
      </div>

      <MindConnections
        activeStep={index}
        accent={step.accent}
        routeChoice={routeChoice}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center">
        <div
          className="relative w-[240px] sm:w-[320px] lg:w-[380px] transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
          }}
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 28, scale: 0.94 }
            }
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={step.image}
              alt={step.imageAlt}
              loading={index < 2 ? 'eager' : 'lazy'}
              animate={reducedMotion || !isInView ? undefined : poseKeyframes}
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: poseDuration,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }
              }
              className="will-change-transform h-auto w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.68)]"
            />
          </motion.div>
        </div>
      </div>

      <MindThoughtsOverlay
        step={step}
        activeStep={index}
        typedText={typedText}
        routeChoice={routeChoice}
        onSelectRoute={onSelectRoute}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
