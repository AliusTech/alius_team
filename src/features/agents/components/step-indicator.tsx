import { cn } from '@/shared/utils/cn';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 bg-muted rounded-[7px] px-4 py-2">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  'w-6 h-[1.5px]',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0',
                  isActive && 'bg-primary text-primary-foreground',
                  isCompleted && 'bg-primary text-primary-foreground',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {stepNum}
              </div>
              <span
                className={cn(
                  'text-xs whitespace-nowrap',
                  isActive && 'text-foreground font-medium',
                  isCompleted && 'text-primary font-medium',
                  !isActive && !isCompleted && 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
