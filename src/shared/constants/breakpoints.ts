export type DeviceType = 'phone' | 'tablet' | 'desktop';

export interface BreakpointInfo {
  deviceType: DeviceType;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showSidebar: boolean;
  showInspector: boolean;
}

export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1200,
} as const;