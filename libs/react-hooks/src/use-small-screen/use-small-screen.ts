import { useCallback,useEffect, useState } from 'react'

export const SMALL_PHONE_BREAKPOINT = 360
export const DEFAULT_BREAKPOINT = 800

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
