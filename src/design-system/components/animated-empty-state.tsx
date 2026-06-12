import { cn } from '@/shared/utils/cn';
import { LottiePlayer } from '@/design-system/primitives/lottie-player';
import { getAnimationData, type AnimationName } from '@/assets/animations';

type IllustrationType = 'no-tasks' | 'no-agents' | 'no-notifications' | 'no-logs' | 'error' | 'warning';

const illustrationMap: Record<IllustrationType, AnimationName> = {
  'no-tasks': 'no-tasks',
  'no-agents': 'no-agents',
  'no-notifications': 'no-notifications',
  'no-logs': 'no-logs',
  'error': 'error',
  'warning': 'warning',
};

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-28 h-28',
  lg: 'w-44 h-44',
} as const;

interface AnimatedEmptyStateProps {
  illustration: IllustrationType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AnimatedEmptyState({
  illustration,
  title,
  description,
  action,
  size = 'md',
  className,
}: AnimatedEmptyStateProps) {
  const animationName = illustrationMap[illustration];
  const data = getAnimationData(animationName);

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className={cn(sizeMap[size], 'mb-4')}>
        <LottiePlayer data={data} loop autoplay />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
