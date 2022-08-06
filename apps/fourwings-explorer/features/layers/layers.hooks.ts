import { atom, useRecoilState } from 'recoil'
import { useCallback } from 'react'
import { urlSyncEffect } from 'recoil-sync'
import { mixed } from '@recoiljs/refine'
import libraryDatasets, {
  LibraryDataset,
  LibraryDatasetCategory,
} from 'features/datasets/data/library'

export type LayerConfig = {
  visible?: boolean
  color?: string
}
export type DatasetLayerConfig = {
  layerId: string
  config: LayerConfig
}

export type DatasetLayer = LibraryDataset & {
  config: LayerConfig
}

// const layersChecker = array(
//   object({
//     layerId: string(),
//     config: object({
//       color: string(),
//     }),
//   })
// )

export const mapLayersConfigAtom = atom<DatasetLayerConfig[]>({
  key: 'layersConfig',
  default: [],
  effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

export const useMapLayersConfig = () => {
  const [layersConfig, setMapLayerConfig] = useRecoilState(mapLayersConfigAtom)

  const addMapLayer = useCallback(
    (layer: DatasetLayerConfig) => {
      setMapLayerConfig((layers) => [...layers, layer])
    },
    [setMapLayerConfig]
  )

  const updateMapLayer = useCallback(
    (layer: Partial<DatasetLayerConfig>) => {
      setMapLayerConfig((layers) =>
        layers.map((l) => {
          if (l.layerId === layer.layerId) {
            return { ...l, config: { ...l.config, ...layer.config } }
          }
          return l
        })
      )
    },
    [setMapLayerConfig]
  )

  const removeMapLayer = useCallback(
    (layerId: DatasetLayerConfig['layerId']) => {
      setMapLayerConfig((layers) => layers.filter((l) => l.layerId !== layerId))
    },
    [setMapLayerConfig]
  )

  return { layersConfig, addMapLayer, updateMapLayer, removeMapLayer }
}

export const useDatasetLayers = () => {
  const { layersConfig } = useMapLayersConfig()
  return libraryDatasets.flatMap((dataset) => {
    const layerConfig = layersConfig.find((layer) => layer.layerId === dataset.id)
    return layerConfig ? { ...dataset, ...layerConfig } : []
  })
}

export const useMapGeoTemporalLayers = () => {
  const layers = useDatasetLayers()
  return layers.filter(
    (l) => l.category === LibraryDatasetCategory.gee || l.category === LibraryDatasetCategory.gfw
  )
}
