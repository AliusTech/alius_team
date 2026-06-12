import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const RunningGear: React.FC = () => {
  const frame = useCurrentFrame();

  const rotation = interpolate(frame, [0, 60], [0, 360], {
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
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <AliusLogo size={32} />
      </div>
    </AbsoluteFill>
  );
};
