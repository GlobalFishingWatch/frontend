// Duplicated from react-hooks to avoid a circular dependency
// TODO think a way of share it

import { useState, useEffect, useCallback } from 'react'

const DEFAULT_BREAKPOINT = 768

function useSmallScreen(width = DEFAULT_BREAKPOINT) {
  const windowWidth = typeof window !== undefined ? window.innerWidth : undefined
  const [isSmallScreen, setIsSmallScreen] = useState<boolean | undefined>(
    windowWidth !== undefined ? windowWidth <= width : windowWidth
  )

  const onWindowResize = useCallback(() => {
    setIsSmallScreen(window.innerWidth <= width)
  }, [width])

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('resize', onWindowResize, { passive: true })
      return () => {
        window.removeEventListener('resize', onWindowResize)
      }
    }
  }, [onWindowResize])

  return isSmallScreen
}

export default useSmallScreen
