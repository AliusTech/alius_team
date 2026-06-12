import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const StepActive: React.FC = () => {
  const frame = useCurrentFrame();

  const pulseScale = interpolate(frame, [0, 15, 30], [1, 1.15, 1], {
    extrapolateRight: 'wrap',
  });

  const ringScale = interpolate(frame, [0, 30], [1, 1.5], {
    extrapolateRight: 'wrap',
  });

  const ringOpacity = interpolate(frame, [0, 30], [0.5, 0], {
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
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `2px solid ${BRAND_COLOR}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />
      <div style={{ transform: `scale(${pulseScale})` }}>
        <AliusLogo size={28} />
      </div>
    </AbsoluteFill>
  );
};
