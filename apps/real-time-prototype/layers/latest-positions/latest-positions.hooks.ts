import { useCallback, useEffect } from 'react'
import { atom, useAtom, useAtomValue } from 'jotai'
import { LatestPositions } from 'layers/latest-positions/LatestPositions'

type LatestPositionsAtom = {
  loaded: boolean
  instance?: LatestPositions
}

export const latestPositionsAtom = atom<LatestPositionsAtom>({
  loaded: false,
})

export function useLatestPositionsLayer({ token, lastUpdate, vessels, showLatestPositions }) {
  const [{ instance }, updateAtom] = useAtom(latestPositionsAtom)

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  useEffect(() => {
    if (lastUpdate) {
      const latestPositions = new LatestPositions({
        onDataLoad: onDataLoad,
        token,
        lastUpdate,
        vessels,
        showLatestPositions,
      })
      setAtomProperty({ instance: latestPositions })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [updateAtom, onDataLoad, setAtomProperty, token, lastUpdate, vessels, showLatestPositions])

  return instance
}

export function useLatestPositionsLayerInstance() {
  const instance = useAtomValue(latestPositionsAtom).instance
  return instance
}
