import { useEffect, useRef } from 'react'
import isEqual from 'lodash/isEqual'

// https://usehooks.com/useMemoCompare/
export function useMemoCompare<N = unknown>(next: N, compare = isEqual): N {
  // Ref for storing previous value
  const previousRef = useRef<N>(next)
  const previous = previousRef.current
  // Pass previous and next value to compare function
  // to determine whether to consider them equal.
  const equal = compare(previous, next)
  // If not equal update previousRef to next value.
  // We only update if not equal so that this hook continues to return
  // the same old value if compare keeps returning true.
  useEffect(() => {
    if (!equal) {
      previousRef.current = next
    }
  })
  // Finally, if equal then return the previous value
  return equal ? previous : next
}
