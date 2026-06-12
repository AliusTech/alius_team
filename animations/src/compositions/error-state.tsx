import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo } from '../logo';

const ERROR_COLOR = '#dc2626';

export const ErrorState: React.FC = () => {
  const frame = useCurrentFrame();

  const shakeX = interpolate(
    frame,
    [0, 3, 6, 9, 12, 15, 18],
    [0, -8, 6, -4, 3, -1, 0],
    { extrapolateRight: 'clamp' }
  );

  const opacity = interpolate(frame, [0, 10], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const crackOpacity = interpolate(frame, [5, 15], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const alertScale = interpolate(frame, [15, 25, 30], [0, 1.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back),
  });

  const alertOpacity = interpolate(frame, [12, 18], [0, 1], {
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
          position: 'relative',
          opacity,
          transform: `translateX(${shakeX}px)`,
        }}
      >
        <AliusLogo size={80} color={ERROR_COLOR} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, transparent 45%, ${ERROR_COLOR}15 45%, ${ERROR_COLOR}15 46%, transparent 46%)`,
            opacity: crackOpacity,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 55px)',
          right: 'calc(50% - 55px)',
          opacity: alertOpacity,
          transform: `scale(${alertScale})`,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: ERROR_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>!</span>
      </div>
    </AbsoluteFill>
  );
};
