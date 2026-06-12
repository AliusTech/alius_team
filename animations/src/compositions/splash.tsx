import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const Splash: React.FC = () => {
  const frame = useCurrentFrame();
  const durationInFrames = 90;

  const scale = interpolate(frame, [0, 15, 45, 75, 90], [0.8, 1.05, 1.0, 1.05, 1.0], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const textOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textY = interpolate(frame, [30, 50], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ transform: `scale(${scale})`, opacity }}>
        <AliusLogo size={120} />
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 24,
          fontWeight: 600,
          color: BRAND_COLOR,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          letterSpacing: 2,
        }}
      >
        Alius
      </div>
    </AbsoluteFill>
  );
};
