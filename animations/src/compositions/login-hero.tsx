import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const LoginHero: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(frame, [0, 20, 40], [1, 0.85, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const floatY = interpolate(frame, [0, 30, 60], [0, -8, 0], {
    extrapolateRight: 'wrap',
    easing: Easing.inOut(Easing.sin),
  });

  const glowOpacity = interpolate(frame, [0, 20, 40, 60], [0.1, 0.4, 0.1, 0.4], {
    extrapolateRight: 'wrap',
  });

  const particleCount = 5;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + frame * 0.02;
    const radius = interpolate(frame, [0, 60], [50, 70], { extrapolateRight: 'wrap' });
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 4 + (i % 3) * 2,
      opacity: interpolate(frame, [i * 8, i * 8 + 10, i * 8 + 20], [0, 0.8, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    };
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND_COLOR}15 0%, transparent 70%)`,
          opacity: glowOpacity,
          transform: 'scale(2)',
        }}
      />
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: BRAND_COLOR,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <div
        style={{
          transform: `translateY(${floatY}px) scale(${logoScale})`,
          zIndex: 1,
        }}
      >
        <AliusLogo size={140} />
      </div>
    </AbsoluteFill>
  );
};
