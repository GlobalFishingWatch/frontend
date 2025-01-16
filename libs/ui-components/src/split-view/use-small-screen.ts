// Duplicated from react-hooks to avoid a circular dependency
// TODO think a way of share it

import { useCallback,useEffect, useState } from 'react'

const DEFAULT_BREAKPOINT = 800

function useSmallScreen(width = DEFAULT_BREAKPOINT) {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean | undefined>(false)

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

export default useSmallScreen
