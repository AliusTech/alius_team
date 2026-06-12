/** Device form-factor categories derived from viewport width. */
export type DeviceType = 'phone' | 'tablet' | 'desktop';

/** Resolved breakpoint state with device type flags and sidebar/inspector visibility. */
export interface BreakpointInfo {
  deviceType: DeviceType;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showSidebar: boolean;
  showInspector: boolean;
}

/** Minimum viewport widths (px) for each device type. */
export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1200,
} as const;