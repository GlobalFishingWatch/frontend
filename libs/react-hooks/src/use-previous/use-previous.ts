import { useEffect, useRef } from 'react'

export function usePrevious<N = unknown>(value: N) {
  const ref = useRef<N | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  // Returning the prior render's value is the purpose of this hook.
  // eslint-disable-next-line react-hooks/refs
  return ref.current
}
