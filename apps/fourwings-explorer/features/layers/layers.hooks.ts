import { atom, useRecoilState } from 'recoil'
import { useCallback } from 'react'
import { urlSyncEffect } from 'recoil-sync'
import { mixed } from '@recoiljs/refine'
import {
  BasemapGeneratorConfig,
  BasemapType,
  GeneratorType,
} from '@globalfishingwatch/layer-composer'
import libraryDatasets, { LibraryDataset, DatasetCategory } from 'features/datasets/data/library'

export type LayerConfig = {
  type?: GeneratorType
  basemap?: BasemapType
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

const defaultLayers: DatasetLayerConfig[] = [
  {
    id: 'basemap',
    config: {
      type: GeneratorType.Basemap,
      basemap: BasemapType.Default,
    } as BasemapGeneratorConfig,
  },
]

export const layersConfigAtom = atom<DatasetLayerConfig[]>({
  key: 'layersConfig',
  default: defaultLayers,
  effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

export const useLayersConfig = () => {
  const [layersConfig, setMapLayerConfig] = useRecoilState(layersConfigAtom)

  const addLayer = useCallback(
    (layer: DatasetLayerConfig) => {
      setMapLayerConfig((layers) => [...layers, layer])
    },
    [setMapLayerConfig]
  )

  const updateLayer = useCallback(
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

  const removeLayer = useCallback(
    (id: DatasetLayerConfig['id']) => {
      setMapLayerConfig((layers) => layers.filter((l) => l.id !== id))
    },
    [setMapLayerConfig]
  )

  const setLayers = useCallback(
    (layers: DatasetLayerConfig[]) => {
      setMapLayerConfig(layers)
    },
    [setMapLayerConfig]
  )

  return { layersConfig, addLayer, updateLayer, removeLayer, setLayers }
}

export const useDatasetLayers = () => {
  const { layersConfig } = useLayersConfig()
  return layersConfig.flatMap((layerConfig) => {
    const dataset = libraryDatasets.find((dataset) => dataset.id === layerConfig.id)
    return dataset ? { ...dataset, ...layerConfig } : []
  })
}

export const useGeoTemporalLayers = () => {
  const layers = useDatasetLayers()
  return layers.filter(
    (l) => l.category === DatasetCategory.gee || l.category === DatasetCategory.gfw
  )
}

export const useContexLayers = () => {
  const layers = useDatasetLayers()
  return layers.filter((l) => l.category === DatasetCategory.context)
}
