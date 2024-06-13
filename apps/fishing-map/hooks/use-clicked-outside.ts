import { useCallback, useEffect, useRef } from 'react'

export default function useClickedOutside(callback?: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (callback && !ref.current?.contains(event.target as Node)) {
        callback()
      }
    },
    [callback]
  )

  useEffect(() => {
    if (callback) {
      document.addEventListener('click', handleClickOutside, true)
    }
    return () => {
      if (callback) {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }
  }, [handleClickOutside, callback])

  return ref
}
