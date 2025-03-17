import { useCallback, useEffect } from 'react'
import { atom, useAtom, useAtomValue } from 'jotai'
import { BaseMap } from 'layers/basemap/BasemapLayer'

type BasemapAtom = {
  loaded: boolean
  instance?: BaseMap
}

export const basemapLayerAtom = atom<BasemapAtom>({
  loaded: false,
})

export function useBasemapLayer() {
  const [{ instance }, updateAtom] = useAtom(basemapLayerAtom)

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  useEffect(() => {
    const basemapLayer = new BaseMap({
      onDataLoad: onDataLoad,
    })
    setAtomProperty({ instance: basemapLayer })
  }, [updateAtom, onDataLoad, setAtomProperty])
  return instance
}

export function useBasemapLayerInstance() {
  const instance = useAtomValue(basemapLayerAtom).instance
  return instance
}
