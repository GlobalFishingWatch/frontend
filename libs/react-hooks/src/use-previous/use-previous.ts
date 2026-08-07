import { useState } from 'react'

export function usePrevious<N = unknown>(value: N) {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState<N | undefined>(undefined)
  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }
  return previous
}
