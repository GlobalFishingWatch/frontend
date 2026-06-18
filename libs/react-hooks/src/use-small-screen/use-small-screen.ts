import { useCallback, useEffect, useSyncExternalStore } from 'react'

export const SMALL_PHONE_BREAKPOINT = 360
export const DEFAULT_BREAKPOINT = 800

interface UseSmallScreenOptions {
  initialScreenWidth?: number
  onScreenWidthChange?: (screenWidth: number) => void
}

export function useSmallScreen(width = DEFAULT_BREAKPOINT, options: UseSmallScreenOptions = {}) {
  const { initialScreenWidth, onScreenWidthChange } = options

  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(`(max-width: ${width}px)`)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    [width]
  )

  const getServerSnapshot = useCallback(
    () => (initialScreenWidth != null ? initialScreenWidth <= width : false),
    [initialScreenWidth, width]
  )

  const isSmallScreen = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(`(max-width: ${width}px)`).matches,
    getServerSnapshot
  )

  useEffect(() => {
    if (!onScreenWidthChange) return
    const report = () => onScreenWidthChange(window.innerWidth)
    report()
    window.addEventListener('resize', report, { passive: true })
    return () => window.removeEventListener('resize', report)
  }, [onScreenWidthChange])

  return isSmallScreen
}
