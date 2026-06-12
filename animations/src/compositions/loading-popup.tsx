import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { AliusLogo, BRAND_COLOR } from '../logo';

export const LoadingPopup: React.FC = () => {
  const frame = useCurrentFrame();

  const rotation = interpolate(frame, [0, 60], [0, 360], {
    extrapolateRight: 'wrap',
  });

  const scale = interpolate(
    frame,
    [0, 10, 20, 30, 40, 50, 60],
    [1, 1.1, 0.95, 1.05, 0.98, 1.02, 1],
    { extrapolateRight: 'wrap' }
  );

  const pulseOpacity = interpolate(
    frame,
    [0, 15, 30, 45, 60],
    [0.3, 0.6, 0.3, 0.6, 0.3],
    { extrapolateRight: 'wrap' }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_COLOR}22 0%, transparent 70%)`,
            opacity: pulseOpacity,
            transform: `scale(1.4)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${rotation * 0.3}deg) scale(${scale})`,
          }}
        >
          <AliusLogo size={80} />
        </div>
        {[0, 1, 2].map((i) => {
          const dotAngle = (i * 120 + frame * 6) * (Math.PI / 180);
          const dotX = 55 + Math.cos(dotAngle) * 45;
          const dotY = 55 + Math.sin(dotAngle) * 45;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: dotX,
                top: dotY,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: BRAND_COLOR,
                opacity: 0.7,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
