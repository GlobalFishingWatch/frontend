// Duplicated from react-hooks to avoid a circular dependency
// TODO think a way of share it

import { useState, useEffect, useCallback } from 'react';

const DEFAULT_BREAKPOINT = 768;

function useSmallScreen(width = DEFAULT_BREAKPOINT) {
  let windowWidth;
  if (typeof window !== 'undefined') {
    windowWidth = window.innerWidth;
  }
  const [isSmallScreen, setIsSmallScreen] = useState<boolean | undefined>(
    windowWidth !== undefined ? windowWidth <= width : windowWidth
  );

  const onWindowResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsSmallScreen(window.innerWidth <= width);
    }
  }, [width]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener('resize', onWindowResize, { passive: true });
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener('resize', onWindowResize);
        }
      };
    }
    return;
  }, [onWindowResize]);

  return isSmallScreen;
}

export default useSmallScreen;
