import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const LogoHover: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 10, 20], [1, 1.08, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const glowOpacity = interpolate(frame, [0, 10, 20], [0, 0.3, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND_COLOR}30 0%, transparent 70%)`,
          opacity: glowOpacity,
          transform: 'scale(2)',
        }}
      />
      <div style={{ transform: `scale(${scale})` }}>
        <AliusLogo size={28} />
      </div>
    </AbsoluteFill>
  );
};
