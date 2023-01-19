import { mixed } from '@recoiljs/refine'
import { FourwingsLayerResolution } from 'layers/fourwings/FourwingsHeatmapTileLayer'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'

export type MapLayerType = 'vessel' | 'fourwings' | 'contexts'

export type MapLayer = {
  id: MapLayerType
  visible?: boolean
  resolution?: FourwingsLayerResolution
  loaded?: boolean
}

export const mapLayersAtom = atom<MapLayer[]>({
  key: 'mapLayers',
  default: [
    { id: 'fourwings', visible: true, resolution: 'default' },
    { id: 'vessel', visible: true },
    { id: 'contexts', visible: true },
  ],
  effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

const mapFourwingsLayer = selector({
  key: 'mapFourwingsLayer',
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
