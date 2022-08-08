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
  colorRamp?: string
}
export type DatasetLayerConfig = {
  id: string
  config: LayerConfig
}

export type DatasetLayer = LibraryDataset & {
  config: LayerConfig
}

// const layersChecker = array(
//   object({
//     id: string(),
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
          if (l.id === layer.id) {
            return { ...l, config: { ...l.config, ...layer.config } }
          }
          return l
        })
      )
    },
    [setMapLayerConfig]
  )

  const removeMapLayer = useCallback(
    (id: DatasetLayerConfig['id']) => {
      setMapLayerConfig((layers) => layers.filter((l) => l.id !== id))
    },
    [setMapLayerConfig]
  )

  const setMapLayers = useCallback(
    (layers: DatasetLayerConfig[]) => {
      setMapLayerConfig(layers)
    },
    [setMapLayerConfig]
  )

  return { layersConfig, addMapLayer, updateMapLayer, removeMapLayer, setMapLayers }
}

export const useDatasetLayers = () => {
  const { layersConfig } = useMapLayersConfig()
  return layersConfig.flatMap((layerConfig) => {
    const dataset = libraryDatasets.find((dataset) => dataset.id === layerConfig.id)
    return dataset ? { ...dataset, ...layerConfig } : []
  })
}

export const useMapGeoTemporalLayers = () => {
  const layers = useDatasetLayers()
  return layers.filter(
    (l) => l.category === LibraryDatasetCategory.gee || l.category === LibraryDatasetCategory.gfw
  )
}
