import { useCallback, useEffect, useState } from 'react'

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(document.visibilityState === 'visible')
  const [firstTimeVisible, setFirstTimeVisible] = useState(false)
  const onVisibilityChange = useCallback(
    () => setIsVisible(document.visibilityState === 'visible'),
    []
  )

  useEffect(() => {
    if (isVisible && !firstTimeVisible) {
      setFirstTimeVisible(true)
    }
  }, [isVisible, firstTimeVisible])

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange, false)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
     
  }, [])

  return { isVisible, firstTimeVisible }
}
