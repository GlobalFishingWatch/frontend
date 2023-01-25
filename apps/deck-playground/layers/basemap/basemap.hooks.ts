import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { BaseMap } from 'layers/basemap/BasemapLayer'
import { useMapLayers } from 'features/map/layers.hooks'

type BasemapAtom = {
  loaded: boolean
  instance?: BaseMap
}

export const basemapLayerAtom = atom<BasemapAtom>({
  key: 'basemapLayer',
  dangerouslyAllowMutability: true,
  default: {
    loaded: false,
  },
})

export function useBasemapLayer() {
  const [{ instance }, updateAtom] = useRecoilState(basemapLayerAtom)
  const [mapLayers] = useMapLayers()
  console.log('MAP LAYERS', mapLayers)
  const layer = mapLayers.find((l) => l.id === 'basemap')
  const layerVisible = layer?.visible

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  useEffect(() => {
    console.log('LAYER VISIBLE', layerVisible)
    if (layerVisible) {
      const basemapLayer = new BaseMap({
        onDataLoad: onDataLoad,
      })
      setAtomProperty({ instance: basemapLayer })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [layerVisible, updateAtom, onDataLoad, setAtomProperty])
  console.log('instance', instance)
  return instance
}

const basemapInstanceAtomSelector = selector({
  key: 'basemapInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(basemapLayerAtom)?.instance
  },
})

export function useBasemapLayerInstance() {
  const instance = useRecoilValue(basemapInstanceAtomSelector)
  return instance
}
