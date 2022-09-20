import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

export type MapLayerType = 'vessel' | 'fourwings'

export type MapLayer = {
  id: MapLayerType
  visible?: boolean
  loaded?: boolean
}

export const mapLayersAtom = atom<MapLayer[]>({
  key: 'mapLayers',
  default: [
    { id: 'fourwings', visible: true },
    { id: 'vessel', visible: false },
  ],
  // effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

const mapFourwingsLayer = selector({
  key: 'mapFourwingsLayer',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const layers = get(mapLayersAtom)
    return layers.find((l) => l.id === 'fourwings')
  },
})

export const useMapLayers = () => {
  return useRecoilState(mapLayersAtom)
}

export const useMapFourwingsLayer = () => {
  return useRecoilValue(mapFourwingsLayer)
}
