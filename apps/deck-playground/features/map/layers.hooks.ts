import { VesselLayer } from 'layers/vessel/VesselLayer'
import { atom, useRecoilState } from 'recoil'

export type MapLayerType = 'vessel' | 'fourwings'

export type MapLayer = {
  id: MapLayerType
  visible?: boolean
  instances?: VesselLayer[]
}

export const mapLayersAtom = atom<MapLayer[]>({
  key: 'mapLayers',
  dangerouslyAllowMutability: true,
  default: [
    { id: 'fourwings', visible: false, instances: [] },
    { id: 'vessel', visible: true, instances: [] },
  ],
  // effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

export const useMapLayers = () => {
  return useRecoilState(mapLayersAtom)
}
