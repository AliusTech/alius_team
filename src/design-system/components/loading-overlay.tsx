import { LottiePlayer } from '@/design-system/primitives/lottie-player';
import { getAnimationData } from '@/assets/animations';

/** Props for the LoadingOverlay component. */
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/** Full-screen modal overlay with a Lottie spinner and optional status message. */
export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative flex flex-col items-center gap-4 rounded-2xl bg-card px-10 py-8 shadow-2xl border border-border">
        <LottiePlayer
          data={getAnimationData('loading')}
          loop
          autoplay
          className="w-20 h-20"
        />
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}
