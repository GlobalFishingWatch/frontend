import { useCallback, useEffect } from 'react'
import { LatestPositions } from 'layers/latest-positions/LatestPositions'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

type LatestPositionsAtom = {
  loaded: boolean
  instance?: LatestPositions
}

export const latestPositionsAtom = atom<LatestPositionsAtom>({
  key: 'latestPositions',
  dangerouslyAllowMutability: true,
  default: {
    loaded: false,
  },
})

export function useLatestPositionsLayer({ token, lastUpdate, vessels, showLatestPositions }) {
  const [{ instance }, updateAtom] = useRecoilState(latestPositionsAtom)

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

const latestPositionsInstanceAtomSelector = selector({
  key: 'latestPositionsInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(latestPositionsAtom)?.instance
  },
})

export function useLatestPositionsLayerInstance() {
  const instance = useRecoilValue(latestPositionsInstanceAtomSelector)
  return instance
}
