import { useBreakpoint } from '@/shared/hooks/use-breakpoint';
import { useInputMode } from '@/shared/hooks/use-input-mode';

export interface PlatformInput {
  interactionMode: 'mouse' | 'touch';
  isDesktop: boolean;
  isPhone: boolean;
  isTablet: boolean;
}

export function usePlatformInput(): PlatformInput {
  const { isPhone, isTablet, isDesktop } = useBreakpoint();
  const { isTouchPrimary } = useInputMode();

  const interactionMode: 'mouse' | 'touch' = isTouchPrimary || isPhone ? 'touch' : 'mouse';

  return { interactionMode, isDesktop, isPhone, isTablet };
}
