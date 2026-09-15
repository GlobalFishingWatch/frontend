import { useCallback, useEffect, useSyncExternalStore } from 'react'

export const SMALL_PHONE_BREAKPOINT = 360
export const DEFAULT_BREAKPOINT = 800

interface UseSmallScreenOptions {
  initialScreenWidth?: number
  onScreenWidthChange?: (screenWidth: number) => void
}

// One MediaQueryList per breakpoint, shared by every caller.
// useSyncExternalStore calls getSnapshot on each render and again while it re-checks after a change
const mediaQueryLists = new Map<number, MediaQueryList>()

function getMediaQueryList(width: number) {
  let mediaQueryList = mediaQueryLists.get(width)
  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia(`(max-width: ${width}px)`)
    mediaQueryLists.set(width, mediaQueryList)
  }
  return mediaQueryList
}

export function useSmallScreen(width = DEFAULT_BREAKPOINT, options: UseSmallScreenOptions = {}) {
  const { initialScreenWidth, onScreenWidthChange } = options

  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = getMediaQueryList(width)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    [width]
  )

  const getSnapshot = useCallback(() => getMediaQueryList(width).matches, [width])

  const getServerSnapshot = useCallback(
    () => (initialScreenWidth != null ? initialScreenWidth <= width : false),
    [initialScreenWidth, width]
  )

  const isSmallScreen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    if (!onScreenWidthChange) return
    const report = () => onScreenWidthChange(window.innerWidth)
    report()
    window.addEventListener('resize', report, { passive: true })
    return () => window.removeEventListener('resize', report)
  }, [onScreenWidthChange])

  return isSmallScreen
}
