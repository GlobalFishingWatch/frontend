import { useCallback, useEffect } from 'react'
import { BaseMap } from 'layers/basemap/BasemapLayer'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

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
