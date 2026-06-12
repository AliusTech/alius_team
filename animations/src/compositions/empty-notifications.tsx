import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const EmptyNotifications: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = interpolate(frame, [0, 30, 60], [0, -5, 0], {
    extrapolateRight: 'wrap',
  });

  const opacity = interpolate(frame, [0, 15], [0.4, 1], {
    extrapolateRight: 'clamp',
  });

  const sway = interpolate(frame, [0, 15, 30, 45, 60], [0, 3, 0, -3, 0], {
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
          transform: `translateY(${floatY}px) rotate(${sway}deg)`,
          transformOrigin: 'top center',
        }}
      >
        <AliusLogo size={70} />
        <div
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            border: `1.5px solid #16a34a`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 8, color: '#16a34a' }}>0</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
