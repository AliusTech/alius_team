import * as React from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';
import { cn } from '@/shared/utils/cn';

/** Props for the LottiePlayer component. */
export interface LottiePlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  ariaLabel?: string;
}

/** Lottie animation renderer with reduced-motion support and completion callback. */
const LottiePlayer = React.forwardRef<HTMLDivElement, LottiePlayerProps>(
  ({ data, loop = true, autoplay = true, speed = 1, className, onComplete, ariaLabel }, ref) => {
    const prefersReducedMotion = React.useMemo(
      () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      []
    );

    const dotLottieRef = React.useRef<DotLottie | null>(null);

    const dotLottieRefCallback = React.useCallback(
      (instance: DotLottie | null) => {
        dotLottieRef.current = instance;
        if (instance && onComplete) {
          instance.addEventListener('complete', onComplete);
        }
      },
      [onComplete]
    );

    React.useEffect(() => {
      return () => {
        if (dotLottieRef.current && onComplete) {
          dotLottieRef.current.removeEventListener('complete', onComplete);
        }
      };
    }, [onComplete]);

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        aria-hidden={!ariaLabel}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
      >
        <DotLottieReact
          data={data}
          loop={loop}
          autoplay={autoplay && !prefersReducedMotion}
          speed={speed}
          useFrameInterpolation={false}
          renderConfig={{ devicePixelRatio: 2 }}
          dotLottieRefCallback={dotLottieRefCallback}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }
);
LottiePlayer.displayName = 'LottiePlayer';

export { LottiePlayer };
