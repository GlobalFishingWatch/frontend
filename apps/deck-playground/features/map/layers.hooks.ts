import { VesselsLayer } from 'layers/vessel/VesselsLayer'
import { atom, useRecoilState } from 'recoil'

export type MapLayerType = 'vessel' | 'fourwings'

export type MapLayer = {
  id: MapLayerType
  visible?: boolean
  instance?: VesselsLayer
}

export const mapLayersAtom = atom<MapLayer[]>({
  key: 'mapLayers',
  dangerouslyAllowMutability: true,
  default: [
    { id: 'fourwings', visible: false },
    { id: 'vessel', visible: true },
  ],
  // effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

export const useMapLayers = () => {
  return useRecoilState(mapLayersAtom)
}
