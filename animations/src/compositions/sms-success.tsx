import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const SmsSuccess: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 8], [1, 0], {
    extrapolateRight: 'clamp',
  });

  const checkScale = interpolate(frame, [8, 16, 22], [0, 1.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back),
  });

  const checkOpacity = interpolate(frame, [6, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringScale = interpolate(frame, [8, 25], [0.3, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringOpacity = interpolate(frame, [8, 25], [0.6, 0], {
    extrapolateLeft: 'clamp',
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
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: `2px solid ${BRAND_COLOR}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />
      <div style={{ opacity: logoOpacity, position: 'absolute' }}>
        <AliusLogo size={50} />
      </div>
      <div
        style={{
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: BRAND_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
