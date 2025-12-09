import { useEffect, useMemo, useRef } from 'react'

export const useTrackDependencyChanges = (label: string, dependencies: Record<string, unknown>) => {
  const entries = useMemo(() => Object.entries(dependencies), [dependencies])
  const values = useMemo(() => entries.map(([, value]) => value), [entries])
  const previousValues = useRef<readonly unknown[]>(values)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const changes = entries.reduce<Record<string, { previous: unknown; next: unknown }>>(
      (acc, [name, value], index) => {
        const previous = previousValues.current[index]
        if (!Object.is(previous, value)) {
          acc[name ?? `dep[${index}]`] = { previous, next: value }
        }
        return acc
      },
      {}
    )

    if (Object.keys(changes).length > 0) {
      console.log(`[useTrackDependencyChanges] ${label}`, changes)
    }

    previousValues.current = values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, values)
}
