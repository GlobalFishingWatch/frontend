import { FourwingsLayer } from 'layers/fourwings/FourwingsLayer'
import { VesselsLayer } from 'layers/vessel/VesselsLayer'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

export type MapLayerType = 'vessel' | 'fourwings'

export type MapLayer<Instance = VesselsLayer | FourwingsLayer> = {
  id: MapLayerType
  visible?: boolean
  instance?: Instance
  loaded?: boolean
}

export const mapLayersAtom = atom<MapLayer[]>({
  key: 'mapLayers',
  dangerouslyAllowMutability: true,
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
    return layers.find((l) => l.id === 'fourwings') as MapLayer<FourwingsLayer>
  },
})

export const useMapLayers = () => {
  return useRecoilState(mapLayersAtom)
}

export const useMapFourwingsLayer = () => {
  return useRecoilValue(mapFourwingsLayer)
}
