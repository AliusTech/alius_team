import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const DownloadProgress: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = interpolate(frame, [0, 30, 60], [5, -5, 5], {
    extrapolateRight: 'wrap',
  });

  const arrowY = interpolate(frame, [0, 20, 30], [-15, 5, -15], {
    extrapolateRight: 'wrap',
    easing: Easing.inOut(Easing.ease),
  });

  const arrowOpacity = interpolate(frame, [0, 10, 25, 30], [0, 1, 1, 0], {
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
      <div style={{ transform: `translateY(${floatY}px)` }}>
        <AliusLogo size={60} />
      </div>
      <div
        style={{
          position: 'absolute',
          transform: `translateY(${arrowY}px)`,
          opacity: arrowOpacity,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3L10 14M10 14L5 9M10 14L15 9"
            stroke={BRAND_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
