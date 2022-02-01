import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

function useDebounce<T>(
  value: T,
  delay: number,
  options?: { leading?: boolean; maxWait?: number; trailing?: boolean }
): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const debounced = debounce(
      () => {
        setDebouncedValue(value)
      },
      delay,
      options
    )
    debounced()

    // Return a cleanup function that will be called every time ...
    // ... useEffect is re-called. useEffect will only be re-called ...
    // ... if value changes (see the inputs array below).
    // This is how we prevent debouncedValue from changing if value is ...
    // ... changed within the delay period. Timeout gets cleared and restarted.
    // To put it in context, if the user is typing within our app's ...
    // ... search box, we don't want the debouncedValue to update until ...
    // ... they've stopped typing for more than 500ms.
    return () => {
      debounced.cancel()
    }
  }, [delay, options, value]) // ... need to be able to change that dynamically. // You could also add the "delay" var to inputs array if you ... // Only re-call effect if value changes

  return debouncedValue
}

export default useDebounce
