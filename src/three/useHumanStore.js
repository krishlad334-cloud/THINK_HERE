import { useSyncExternalStore } from 'react';

export const POSE_IMAGES = {
  stressed: {
    color: '/images/man-stressed.png',
    depth: '/images/man-stressed-depth.png',
    alt: 'Overwhelmed man holding his head behind his laptop',
  },
  searching: {
    color: '/images/man-searching.png',
    depth: '/images/man-searching-depth.png',
    alt: 'Frustrated man searching endlessly across tabs on his laptop',
  },
  typing: {
    color: '/images/man-typing.png',
    depth: '/images/man-typing-depth.png',
    alt: 'Man focused and typing his thought onto OverThink',
  },
  choosing: {
    color: '/images/man-choosing.png',
    depth: '/images/man-choosing-depth.png',
    alt: 'Man attentively engaging with consultant and AI guidance',
  },
  relieved: {
    color: '/images/man-relieved.png',
    depth: '/images/man-relieved-depth.png',
    alt: 'Relieved and smiling man after receiving a clear 24-hour solution',
  },
};

export const STEP_PRESETS = [
  {
    key: 'step-1',
    pose: 'stressed',
    position: [0, -0.08, 0],
    scale: 1.48,
    rotationY: 0,
    glowColor: '#F472B6',
    intensity: 1.0,
  },
  {
    key: 'step-2',
    pose: 'searching',
    position: [0, -0.08, 0],
    scale: 1.5,
    rotationY: 0,
    glowColor: '#A855F7',
    intensity: 1.05,
  },
  {
    key: 'step-3',
    pose: 'typing',
    position: [0, -0.08, 0],
    scale: 1.5,
    rotationY: 0,
    glowColor: '#5EEAD4',
    intensity: 1.1,
  },
  {
    key: 'step-4',
    pose: 'choosing',
    position: [0, -0.08, 0],
    scale: 1.5,
    rotationY: 0,
    glowColor: '#5EEAD4',
    intensity: 1.15,
  },
  {
    key: 'step-5',
    pose: 'relieved',
    position: [0, -0.06, 0],
    scale: 1.54,
    rotationY: 0,
    glowColor: '#FACC15',
    intensity: 1.3,
  },
];

const humanState = {
  visible: true,
  ...STEP_PRESETS[0],
  leanBias: 0,
  bloom: 0,
  webglReady: false,
};

const listeners = new Set();

function notify() {
  listeners.forEach((cb) => cb());
}

export function getHumanState() {
  return humanState;
}

export function setHumanState(patch) {
  Object.assign(humanState, patch);
  notify();
}

export function setHumanStepIndex(index) {
  const preset = STEP_PRESETS[index] || STEP_PRESETS[0];
  if (humanState.key === preset.key && humanState.visible) return;
  Object.assign(humanState, {
    visible: true,
    ...preset,
  });
  notify();
}

export function useHumanStore(selector = (s) => s) {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(humanState),
    () => selector(humanState)
  );
}
