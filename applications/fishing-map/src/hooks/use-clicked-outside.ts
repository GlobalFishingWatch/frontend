import { useCallback, useEffect, useRef } from 'react'

export default function useClickedOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        callback()
      }
    },
    [callback]
  )

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [handleClickOutside])

  return ref
}
