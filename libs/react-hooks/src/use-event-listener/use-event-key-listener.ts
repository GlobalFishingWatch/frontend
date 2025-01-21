import { useEffect,useRef } from 'react'

export function useEventKeyListener(keys: string[], callback?: (e: KeyboardEvent) => void) {
  const parentNode = useRef<HTMLDivElement>(undefined)

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      const isEventInParent = parentNode.current?.contains(event.target as Node)
      if (isEventInParent && keys.includes(event.key) && callback) {
        callback(event)
      }
    }
    document.addEventListener('keydown', eventHandler)
    return () => document.removeEventListener('keydown', eventHandler)
  }, [callback])

  return parentNode as React.MutableRefObject<HTMLDivElement>
}
