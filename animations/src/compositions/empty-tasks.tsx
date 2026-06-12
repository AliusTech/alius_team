import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const EmptyTasks: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = interpolate(frame, [0, 30, 60], [0, -6, 0], {
    extrapolateRight: 'wrap',
  });

  const opacity = interpolate(frame, [0, 15], [0.4, 1], {
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
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 30,
            height: 4,
            borderRadius: 2,
            backgroundColor: BRAND_COLOR,
            opacity: 0.3,
          }}
        />
        <AliusLogo size={80} />
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: -5,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#e0ebff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: BRAND_COLOR }}>✓</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
