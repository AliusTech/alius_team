import { useState, useEffect } from 'react';

export function useInputMode() {
  const [isTouchPrimary, setIsTouchPrimary] = useState(false);

  useEffect(() => {
    const hoverMQ = window.matchMedia('(hover: none)');
    const pointerMQ = window.matchMedia('(pointer: coarse)');

    const check = () => setIsTouchPrimary(hoverMQ.matches && pointerMQ.matches);
    check();

    hoverMQ.addEventListener('change', check);
    pointerMQ.addEventListener('change', check);
    return () => {
      hoverMQ.removeEventListener('change', check);
      pointerMQ.removeEventListener('change', check);
    };
  }, []);

  return { isTouchPrimary };
}
