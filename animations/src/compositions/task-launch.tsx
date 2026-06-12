import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const TaskLaunch: React.FC = () => {
  const frame = useCurrentFrame();

  const launchY = interpolate(frame, [0, 10, 30, 60], [30, 20, -20, -80], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const logoScale = interpolate(frame, [0, 10], [1, 0.9], {
    extrapolateRight: 'clamp',
  });

  const trailOpacity = interpolate(frame, [10, 30, 50], [0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const successScale = interpolate(frame, [45, 55, 60], [0, 1.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const successOpacity = interpolate(frame, [40, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {frame < 45 && (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: BRAND_COLOR,
                opacity: trailOpacity * (1 - i * 0.2),
                left: `calc(50% + ${(i - 1) * 12}px)`,
                top: `calc(50% + ${launchY + 30 + i * 8}px)`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              transform: `translateY(${launchY}px) scale(${logoScale})`,
            }}
          >
            <AliusLogo size={60} />
          </div>
        </>
      )}
      {frame >= 40 && (
        <div
          style={{
            opacity: successOpacity,
            transform: `scale(${successScale})`,
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
