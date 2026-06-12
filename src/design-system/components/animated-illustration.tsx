import { cn } from '@/shared/utils/cn';
import { LottiePlayer } from '@/design-system/primitives/lottie-player';
import { getAnimationData, type AnimationName } from '@/assets/animations';

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-28 h-28',
  lg: 'w-44 h-44',
} as const;

interface AnimatedIllustrationProps {
  name: AnimationName;
  loop?: boolean;
  autoplay?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onComplete?: () => void;
}

export function AnimatedIllustration({
  name,
  loop = true,
  autoplay = true,
  size = 'md',
  className,
  onComplete,
}: AnimatedIllustrationProps) {
  const data = getAnimationData(name);

  return (
    <LottiePlayer
      data={data}
      loop={loop}
      autoplay={autoplay}
      className={cn(sizeMap[size], className)}
      onComplete={onComplete}
    />
  );
}
