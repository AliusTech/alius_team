import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const StepComplete: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(frame, [0, 10], [1, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.ease),
  });

  const checkScale = interpolate(frame, [10, 18, 25], [0, 1.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back),
  });

  const checkOpacity = interpolate(frame, [8, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const burstOpacity = interpolate(frame, [10, 20, 35], [0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const burstScale = interpolate(frame, [10, 25], [0.5, 2], {
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
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: BRAND_COLOR,
          opacity: burstOpacity,
          transform: `scale(${burstScale})`,
        }}
      />
      <div style={{ transform: `scale(${logoScale})`, position: 'absolute' }}>
        <AliusLogo size={40} />
      </div>
      <div
        style={{
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: BRAND_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8L6.5 11.5L13 4.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
