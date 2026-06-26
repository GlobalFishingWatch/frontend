import { useEffect, useRef } from 'react'

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>) {
  if (Object.is(a, b)) return true
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((key) => Object.is(a[key], b[key]))
}

/**
 * Returns a referentially-stable object while its shallow contents are unchanged, so a
 * fresh object literal built every render only changes identity when a value actually changes.
 * Lets us build context values once (no hand-maintained dependency array).
 */
export function useShallowMemo<T extends Record<string, unknown>>(value: T): T {
  const ref = useRef(value)
  // eslint-disable-next-line react-hooks/refs -- compare against the previous committed value
  const previous = ref.current
  const equal = shallowEqual(previous, value)
  useEffect(() => {
    if (!equal) ref.current = value
  })
  return equal ? previous : value
}
