// Duplicated from react-hooks to avoid a circular dependency
// TODO think a way of share it

import { useCallback,useEffect, useState } from 'react'

const DEFAULT_BREAKPOINT = 800

interface UseSmallScreenOptions {
  // Last-known viewport width (e.g. from a server-rendered cookie) used to seed the
  // initial state so SSR markup matches the first client render and avoids a hydration mismatch.
  initialScreenWidth?: number
  // Called with the measured viewport width on mount and on resize, so the consumer
  // can persist it (e.g. to a cookie) for the next server render.
  onScreenWidthChange?: (screenWidth: number) => void
}

function useSmallScreen(width = DEFAULT_BREAKPOINT, options: UseSmallScreenOptions = {}) {
  const { initialScreenWidth, onScreenWidthChange } = options
  const [isSmallScreen, setIsSmallScreen] = useState<boolean | undefined>(
    initialScreenWidth != null ? initialScreenWidth <= width : false
  )

  const measure = useCallback(() => {
    const screenWidth = window.innerWidth
    setIsSmallScreen(screenWidth <= width)
    onScreenWidthChange?.(screenWidth)
  }, [width, onScreenWidthChange])

  useEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure, { passive: true })
      return () => {
        window.removeEventListener('resize', measure)
      }
    }
    return
  }, [measure])

  return isSmallScreen
}

export default useSmallScreen
