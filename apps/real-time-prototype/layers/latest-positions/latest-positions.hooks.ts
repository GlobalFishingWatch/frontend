import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { LatestPositions } from 'layers/latest-positions/LatestPositions'
import { useMapLayers } from 'features/map/layers.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'

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

export function useLatestPositionsLayer() {
  const [{ instance }, updateAtom] = useRecoilState(latestPositionsAtom)
  const { viewState } = useViewport()
  const [mapLayers] = useMapLayers()
  const layer = mapLayers.find((l) => l.id === 'latest-positions')
  const layerVisible = layer?.visible
  const roundedZoom = Math.floor(viewState.zoom)
  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  useEffect(() => {
    if (layerVisible) {
      const latestPositions = new LatestPositions({
        onDataLoad: onDataLoad,
        zoom: roundedZoom,
      })
      setAtomProperty({ instance: latestPositions })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [layerVisible, updateAtom, onDataLoad, setAtomProperty, roundedZoom])
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
