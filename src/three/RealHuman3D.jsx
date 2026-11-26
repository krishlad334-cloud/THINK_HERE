import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POSE_IMAGES, getHumanState, setHumanState, useHumanStore } from './useHumanStore';

const VERTEX_SHADER = `
  uniform sampler2D uDepthA;
  uniform sampler2D uDepthB;
  uniform float uMix;
  uniform float uDepthScale;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    float dA = texture2D(uDepthA, uv).r;
    float dB = texture2D(uDepthB, uv).r;
    float d = mix(dA, dB, uMix);
    vec3 displaced = position + vec3(0.0, 0.0, d * uDepthScale);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  varying vec2 vUv;

  void main() {
    vec4 colA = texture2D(uTexA, vUv);
    vec4 colB = texture2D(uTexB, vUv);
    vec4 col = mix(colA, colB, uMix);

    if (col.a < 0.004) discard;

    gl_FragColor = vec4(col.rgb, col.a);
    #include <colorspace_fragment>
  }
`;

function createSoftAuraTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.26)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createPlaceholderTex(rgba = [0, 0, 0, 0]) {
  const tex = new THREE.DataTexture(new Uint8Array(rgba), 1, 1, THREE.RGBAFormat);
  tex.needsUpdate = true;
  return tex;
}

export default function RealHuman3D({
  isMobile = false,
  reducedMotion = false,
}) {
  const pose = useHumanStore((s) => s.pose);
  const glowColor = useHumanStore((s) => s.glowColor);

  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const auraRef = useRef(null);

  const emptyColor = useMemo(() => createPlaceholderTex([0, 0, 0, 0]), []);
  const emptyDepth = useMemo(() => createPlaceholderTex([0, 0, 0, 255]), []);
  const auraTex = useMemo(() => createSoftAuraTexture(), []);
  const planeGeo = useMemo(() => new THREE.PlaneGeometry(2.5, 2.5, 64, 64), []);

  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const loadedMapRef = useRef({});
  const fadeRef = useRef({
    fromPose: 'stressed',
    toPose: 'stressed',
    progress: 1,
    pulse: 0,
    ready: false,
  });

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTexA: { value: emptyColor },
          uDepthA: { value: emptyDepth },
          uTexB: { value: emptyColor },
          uDepthB: { value: emptyDepth },
          uMix: { value: 1 },
          uDepthScale: { value: 0.24 },
        },
      }),
    [emptyColor, emptyDepth]
  );

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (e) => {
      const nx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2));
      const ny = Math.max(-1, Math.min(1, -(e.clientY / window.innerHeight - 0.5) * 2));
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const order = ['stressed', 'searching', 'typing', 'choosing', 'refining', 'relieved'];
    const createdTextures = [];

    order.forEach((key) => {
      const entry = POSE_IMAGES[key];
      if (!entry) return;
      loader.load(entry.color, (colorTex) => {
        if (cancelled) {
          colorTex.dispose();
          return;
        }
        colorTex.colorSpace = THREE.SRGBColorSpace;
        colorTex.minFilter = THREE.LinearFilter;
        colorTex.magFilter = THREE.LinearFilter;
        colorTex.needsUpdate = true;
        createdTextures.push(colorTex);

        loader.load(entry.depth, (depthTex) => {
          if (cancelled) {
            depthTex.dispose();
            return;
          }
          depthTex.colorSpace = THREE.NoColorSpace;
          depthTex.minFilter = THREE.LinearFilter;
          depthTex.magFilter = THREE.LinearFilter;
          depthTex.needsUpdate = true;
          createdTextures.push(depthTex);

          loadedMapRef.current[key] = { color: colorTex, depth: depthTex };

          if (key === 'stressed') {
            fadeRef.current.ready = true;
            shaderMaterial.uniforms.uTexA.value = colorTex;
            shaderMaterial.uniforms.uDepthA.value = depthTex;
            shaderMaterial.uniforms.uTexB.value = colorTex;
            shaderMaterial.uniforms.uDepthB.value = depthTex;
            setHumanState({ webglReady: true });
          }
        });
      });
    });

    return () => {
      cancelled = true;
      setHumanState({ webglReady: false });
      createdTextures.forEach((t) => t.dispose());
    };
  }, [shaderMaterial]);

  useEffect(() => {
    return () => {
      planeGeo.dispose();
      shaderMaterial.dispose();
      auraTex.dispose();
      emptyColor.dispose();
      emptyDepth.dispose();
    };
  }, [planeGeo, shaderMaterial, auraTex, emptyColor, emptyDepth]);

  useEffect(() => {
    const f = fadeRef.current;
    if (pose !== f.toPose) {
      f.fromPose = f.toPose;
      f.toPose = pose;
      f.progress = reducedMotion ? 1 : 0;
      f.pulse = reducedMotion ? 0 : 1;
    }
  }, [pose, reducedMotion]);

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetGlow = useMemo(() => new THREE.Color('#F472B6'), []);
  const currentGlow = useMemo(() => new THREE.Color('#F472B6'), []);

  useEffect(() => {
    targetGlow.set(glowColor || '#A855F7');
  }, [glowColor, targetGlow]);

  useFrame((state, delta) => {
    if (!groupRef.current || !fadeRef.current.ready) return;
    const dt = Math.min(delta, 0.05);
    const damp = (cur, tgt, lambda) => THREE.MathUtils.lerp(cur, tgt, 1 - Math.exp(-lambda * dt));

    const s = getHumanState();
    const t = state.clock.getElapsedTime();

    smoothMouseRef.current.x = damp(smoothMouseRef.current.x, mouseRef.current.x, 7.5);
    smoothMouseRef.current.y = damp(smoothMouseRef.current.y, mouseRef.current.y, 7.5);
    const pointerX = smoothMouseRef.current.x;
    const pointerY = smoothMouseRef.current.y;

    const f = fadeRef.current;
    const targetLoaded = loadedMapRef.current[f.toPose];

    if (f.progress < 1 && targetLoaded) {
      f.progress = Math.min(1, f.progress + dt / 0.72);
    }
    if (f.pulse > 0) {
      f.pulse = Math.max(0, f.pulse - dt * 1.75);
    }

    const p = f.progress;
    const eased = p * p * p * (p * (p * 6 - 15) + 10);
    const stepLift = Math.sin(f.pulse * Math.PI) * 0.036;
    const floatY = reducedMotion ? 0 : Math.sin(t * 1.35) * 0.028 + stepLift;

    targetPos.set(s.position[0], s.position[1] + floatY, s.position[2]);
    groupRef.current.position.x = damp(groupRef.current.position.x, targetPos.x, 7);
    groupRef.current.position.y = damp(groupRef.current.position.y, targetPos.y, 7);
    groupRef.current.position.z = damp(groupRef.current.position.z, targetPos.z, 7);

    const breatheScale = reducedMotion ? 1 : 1 + Math.sin(t * 1.45) * 0.008;
    const pulseScale = 1 + Math.sin(f.pulse * Math.PI) * 0.028;
    const sc = (isMobile ? (s.scale || 1.48) * 0.92 : s.scale || 1.48) * pulseScale * breatheScale;
    groupRef.current.scale.x = damp(groupRef.current.scale.x, sc, 7);
    groupRef.current.scale.y = damp(groupRef.current.scale.y, sc, 7);
    groupRef.current.scale.z = damp(groupRef.current.scale.z, sc, 7);

    const mouseRotY = reducedMotion ? 0 : pointerX * 0.13;
    const mouseRotX = reducedMotion ? 0 : -pointerY * 0.075;

    groupRef.current.rotation.y = damp(groupRef.current.rotation.y, mouseRotY, 6.5);
    groupRef.current.rotation.x = damp(groupRef.current.rotation.x, mouseRotX, 6.5);

    const fallback = loadedMapRef.current.stressed;
    const fromSet = loadedMapRef.current[f.fromPose] || fallback;
    const toSet = targetLoaded || fallback;
    const mat = meshRef.current?.material;

    if (mat && fromSet && toSet) {
      mat.uniforms.uTexA.value = fromSet.color;
      mat.uniforms.uDepthA.value = fromSet.depth;
      mat.uniforms.uTexB.value = toSet.color;
      mat.uniforms.uDepthB.value = toSet.depth;
      mat.uniforms.uMix.value = targetLoaded ? eased : 0;
    }

    currentGlow.lerp(targetGlow, 1 - Math.exp(-5.5 * dt));
    if (auraRef.current) {
      auraRef.current.material.color.copy(currentGlow);
      const auraScale = (3.15 + f.pulse * 0.28) * (1 + (reducedMotion ? 0 : Math.sin(t * 1.5) * 0.035));
      auraRef.current.scale.set(auraScale, auraScale, 1);
      auraRef.current.material.opacity = damp(auraRef.current.material.opacity, 0.34 * (s.intensity || 1), 6);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.08, 0]} scale={[1.48, 1.48, 1.48]}>
      <mesh ref={auraRef} position={[0, 0.08, -0.35]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={auraTex}
          color="#F472B6"
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={meshRef} geometry={planeGeo} material={shaderMaterial} position={[0, 0, 0.02]} />
    </group>
  );
}
