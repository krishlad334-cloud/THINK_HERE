import React, { Component, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import RealHuman3D from './RealHuman3D';
import { POSE_IMAGES, useHumanStore } from './useHumanStore';

class StageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

function LocalFallback({ reducedMotion = false }) {
  const webglReady = useHumanStore((s) => s.webglReady);
  const pose = useHumanStore((s) => s.pose);
  const glowColor = useHumanStore((s) => s.glowColor);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 9;
      const ny = (e.clientY / window.innerHeight - 0.5) * -6;
      setTilt({ x: ny, y: nx });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  if (webglReady) return null;

  const entry = POSE_IMAGES[pose] || POSE_IMAGES.stressed;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="relative w-72 sm:w-88 lg:w-[390px] transition-transform duration-200"
        style={{
          transform: `perspective(950px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div
          className="absolute inset-6 rounded-full blur-3xl opacity-40 transition-colors duration-500"
          style={{ background: glowColor }}
        />
        <img
          src={entry.color}
          alt={entry.alt}
          className="relative z-10 h-auto w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
        />
      </div>
    </div>
  );
}

/**
 * Unframed, local 2.5D Real Human Canvas dedicated solely to the HowItWorks section.
 * Zero round border, zero fixed global positioning conflicts.
 */
export default function RealHumanStage({
  isMobile = false,
  reducedMotion = false,
}) {
  return (
    <div className="relative h-[310px] w-full sm:h-[400px] lg:h-[460px] xl:h-[520px]">
      <LocalFallback reducedMotion={reducedMotion} />
      <StageErrorBoundary fallback={<LocalFallback reducedMotion={reducedMotion} />}>
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 42, near: 0.1, far: 25 }}
          dpr={isMobile ? [1, 1.25] : [1, 1.75]}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <ambientLight intensity={1.0} color="#F5F3FF" />
          <Suspense fallback={null}>
            <RealHuman3D isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </StageErrorBoundary>
    </div>
  );
}
