import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const EmptyAgents: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = interpolate(frame, [0, 30, 60], [0, -6, 0], {
    extrapolateRight: 'wrap',
  });

  const opacity = interpolate(frame, [0, 15], [0.4, 1], {
    extrapolateRight: 'clamp',
  });

  const waveOffset = interpolate(frame, [0, 60], [0, Math.PI * 2], {
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
          position: 'relative',
          opacity,
          transform: `translateY(${floatY}px)`,
        }}
      >
        <AliusLogo size={80} />
        {[0, 1, 2].map((i) => {
          const angle = waveOffset + (i * Math.PI * 2) / 3;
          const x = Math.cos(angle) * 50;
          const y = Math.sin(angle) * 50;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: `${BRAND_COLOR}40`,
                border: `1.5px solid ${BRAND_COLOR}60`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
