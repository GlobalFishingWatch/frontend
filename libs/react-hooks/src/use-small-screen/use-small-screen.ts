import { useState, useEffect, useCallback } from 'react'

const DEFAULT_BREAKPOINT = 768

export function useSmallScreen(width = DEFAULT_BREAKPOINT) {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(true)

  useEffect(() => {
    setIsSmallScreen(window.innerWidth <= width)
  }, [width])

  const onWindowResize = useCallback(() => {
    setIsSmallScreen(window.innerWidth <= width)
  }, [width])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onWindowResize, { passive: true })
      return () => {
        window.removeEventListener('resize', onWindowResize)
      }
    }
    return
  }, [onWindowResize])

  return isSmallScreen
}
