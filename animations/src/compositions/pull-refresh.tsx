import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const PullRefresh: React.FC = () => {
  const frame = useCurrentFrame();

  const pullProgress = interpolate(frame, [0, 15, 30, 45, 60], [0, 1, 0.3, 0.8, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bounce,
  });

  const scaleY = interpolate(pullProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const scaleX = interpolate(pullProgress, [0, 0.5, 1], [1, 0.8, 1.2]);
  const rotation = interpolate(frame, [15, 45], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dropY = interpolate(
    frame,
    [0, 5, 15, 25, 35, 45, 60],
    [20, 15, 0, -5, 0, -3, 20],
    { extrapolateRight: 'clamp' }
  );

  const splashOpacity = interpolate(frame, [10, 20, 35], [0, 1, 0], {
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
      <div
        style={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND_COLOR}20 0%, transparent 70%)`,
          opacity: splashOpacity,
          transform: 'scale(2.5)',
        }}
      />
      <div
        style={{
          transform: `translateY(${dropY}px) scaleX(${scaleX}) scaleY(${scaleY}) rotate(${rotation}deg)`,
        }}
      >
        <AliusLogo size={60} />
      </div>
    </AbsoluteFill>
  );
};
