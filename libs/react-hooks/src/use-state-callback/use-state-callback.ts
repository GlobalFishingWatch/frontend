import { useEffect, useRef, useState } from 'react'

type OnUpdateCallback<T> = (s: T) => void
type SetStateUpdaterCallback<T> = (s: T) => T
type SetStateAction<T> = (
  newState: T | SetStateUpdaterCallback<T>,
  callback?: OnUpdateCallback<T>
) => void

export function useStateCallback<T>(init: T): [T, SetStateAction<T>]
export function useStateCallback<T = undefined>(
  init?: T
): [T | undefined, SetStateAction<T | undefined>]
export function useStateCallback<T>(init: T): [T, SetStateAction<T>] {
  const [state, setState] = useState<T>(init)
  const cbRef = useRef<OnUpdateCallback<T>>(undefined)

  const setCustomState: SetStateAction<T> = (newState, callback?): void => {
    cbRef.current = callback
    setState(newState)
  }

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state)
    }
    cbRef.current = undefined
  }, [state])

  return [state, setCustomState]
}
