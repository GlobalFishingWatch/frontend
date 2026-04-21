import { useCallback, useSyncExternalStore } from 'react'

export const SMALL_PHONE_BREAKPOINT = 360
export const DEFAULT_BREAKPOINT = 800

export function useSmallScreen(width = DEFAULT_BREAKPOINT) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(`(max-width: ${width}px)`)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    [width]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(`(max-width: ${width}px)`).matches,
    () => false // Server-side rendering fallback, can be set to true if you want to render the small screen version on the server
  )
}
