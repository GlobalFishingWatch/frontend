import { createContext, useContext } from 'react'

/**
 * Creates a context whose hook throws a clear error when used outside its provider,
 * instead of silently returning an empty/undefined value.
 */
export function createGuardedContext<T>(hookName: string, provider = 'a <Timebar>') {
  const Context = createContext<T | null>(null)
  const useGuardedContext = () => {
    const context = useContext(Context)
    if (context === null) {
      throw new Error(`${hookName} must be used within ${provider}`)
    }
    return context
  }
  return [Context, useGuardedContext] as const
}
