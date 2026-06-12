import { useState, useEffect } from 'react';
import { type DeviceType, type BreakpointInfo, BREAKPOINTS } from '@/shared/constants/breakpoints';

/** Reactive hook that returns the current device type and derived sidebar/inspector visibility flags. */
export function useBreakpoint(): BreakpointInfo {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.tablet) {
        setDeviceType('phone');
      } else if (width < BREAKPOINTS.desktop) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial check
    checkDevice();

    // Add event listener
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    deviceType,
    isPhone: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    showSidebar: deviceType !== 'phone',
    showInspector: deviceType !== 'phone',
  };
}