import { useCallback, useEffect, useRef, useState } from 'react'

export default function useClickedOutside(callback?: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [clickStartCoords, setClickStartCoords] = useState<[number, number] | null>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        callback &&
        !ref.current?.contains(event.target as Node) &&
        event.clientX === clickStartCoords?.[0] &&
        event.clientY === clickStartCoords?.[1]
      ) {
        callback()
        setClickStartCoords(null)
      }
    },
    [callback, clickStartCoords]
  )
  const handleMouseDown = useCallback((event: MouseEvent) => {
    setClickStartCoords([event.clientX, event.clientY])
  }, [])

  useEffect(() => {
    if (callback) {
      document.addEventListener('mousedown', handleMouseDown, true)
      document.addEventListener('click', handleClickOutside, true)
    }
    return () => {
      if (callback) {
        document.removeEventListener('mousedown', handleMouseDown, true)
        document.removeEventListener('click', handleClickOutside, true)
      }
    }
  }, [handleClickOutside, callback, handleMouseDown])

  return ref
}
