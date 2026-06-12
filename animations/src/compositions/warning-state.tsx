import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo } from '../logo';

const WARNING_COLOR = '#d97706';

export const WarningState: React.FC = () => {
  const frame = useCurrentFrame();

  const pulseScale = interpolate(frame, [0, 15, 30], [1, 1.05, 1], {
    extrapolateRight: 'wrap',
  });

  const opacity = interpolate(frame, [0, 10], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const glowPulse = interpolate(frame, [0, 15, 30], [0.1, 0.3, 0.1], {
    extrapolateRight: 'wrap',
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
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${WARNING_COLOR}20 0%, transparent 70%)`,
          opacity: glowPulse,
          transform: 'scale(2)',
        }}
      />
      <div
        style={{
          position: 'relative',
          opacity,
          transform: `scale(${pulseScale})`,
        }}
      >
        <AliusLogo size={80} color={WARNING_COLOR} />
      </div>
    </AbsoluteFill>
  );
};
