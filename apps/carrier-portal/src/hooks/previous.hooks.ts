import { useRef, useEffect } from 'react'

export default function usePrevious(value: any, initial = true) {
  const ref = useRef(initial ? value : null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
