import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const EmptyLogs: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = interpolate(frame, [0, 30, 60], [0, -5, 0], {
    extrapolateRight: 'wrap',
  });

  const opacity = interpolate(frame, [0, 15], [0.4, 1], {
    extrapolateRight: 'clamp',
  });

  const lineProgress = interpolate(frame, [10, 40], [0, 1], {
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
          transform: `translateY(${floatY}px)`,
        }}
      >
        <AliusLogo size={70} />
        {[0, 1, 2].map((i) => {
          const lineY = 80 + i * 10;
          const lineWidth = [30, 45, 25][i] * lineProgress;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: lineY,
                left: '50%',
                transform: 'translateX(-50%)',
                width: lineWidth,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: `${BRAND_COLOR}30`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
