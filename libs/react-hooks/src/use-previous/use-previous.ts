import { useEffect, useRef } from 'react'

export function usePrevious<N = unknown>(value: N) {
  const ref = useRef<N>(undefined)
  useEffect(() => {
    ref.current = value //assign the value of ref to the argument
  }, [value]) //this code will run when the value of 'value' changes
  return ref.current //in the end, return the current ref value.
}
