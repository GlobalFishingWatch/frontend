import { mixed } from '@recoiljs/refine'
import { atom, useRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'

export type MapLayerType = 'contexts' | 'basemap' | 'latest-positions'

export type MapLayer = {
  id: MapLayerType
  visible?: boolean
  loaded?: boolean
}

export const mapLayersAtom = atom<MapLayer[]>({
  key: 'mapLayers',
  default: [
    { id: 'contexts', visible: true },
    { id: 'basemap', visible: true },
    { id: 'latest-positions', visible: true },
  ],
  effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

export const useMapLayers = () => {
  return useRecoilState(mapLayersAtom)
}
