import { atom, useRecoilState } from 'recoil'
import { useCallback, useMemo } from 'react'
import { urlSyncEffect } from 'recoil-sync'
import { mixed } from '@recoiljs/refine'
import {
  BasemapGeneratorConfig,
  BasemapType,
  ColorRampId,
  GeneratorType,
} from '@globalfishingwatch/layer-composer'
import { APIDataset, useAPIDatasets } from 'features/datasets/datasets.hooks'
import { toArray } from 'features/map/map-sources.hooks'

export type BaseLayerConfig = {
  type?: GeneratorType
  visible?: boolean
  color?: string
}

export type FourwingsLayerConfig = BaseLayerConfig & {
  type: GeneratorType.HeatmapAnimated
  colorRamp?: ColorRampId
  breaks?: number[]
  maxZoom?: number
  dynamicBreaks?: boolean
}

export type DatasetLayerConfig = {
  id: string
  config: BaseLayerConfig | BasemapGeneratorConfig | FourwingsLayerConfig
}

export type DatasetLayer = DatasetLayerConfig & {
  dataset: APIDataset
}

// const layersChecker = array(
//   object({
//     id: string(),
//     config: object({
//       type: string(),
//       color: string(),
//     }),
//   })
// )

const BASEMAP_LAYER_ID = 'basemap'
const defaultLayers: DatasetLayerConfig[] = [
  {
    id: BASEMAP_LAYER_ID,
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
  const [layersConfig, setMapLayersConfig] = useRecoilState(layersConfigAtom)

  const addLayer = useCallback(
    (layer: DatasetLayerConfig) => {
      setMapLayersConfig((layers) => [...layers, layer])
    },
    [setMapLayersConfig]
  )

  const updateLayer = useCallback(
    (layer: DatasetLayerConfig | DatasetLayerConfig[]) => {
      const layersToUpdate: DatasetLayerConfig[] = toArray(layer)
      setMapLayersConfig((layers) =>
        layers.map((layer) => {
          const layerToUpdate = layersToUpdate.find((l) => l.id === layer.id)
          if (layerToUpdate) {
            return { ...layer, config: { ...layer.config, ...layerToUpdate.config } }
          }
          return layer
        })
      )
    },
    [setMapLayersConfig]
  )

  const removeLayer = useCallback(
    (id: DatasetLayerConfig['id']) => {
      setMapLayersConfig((layers) => layers.filter((l) => l.id !== id))
    },
    [setMapLayersConfig]
  )

  const setLayers = useCallback(
    (layers: DatasetLayerConfig[]) => {
      setMapLayersConfig(layers)
    },
    [setMapLayersConfig]
  )

  return { layersConfig, addLayer, updateLayer, removeLayer, setLayers }
}

export const useDatasetLayers = (): DatasetLayer[] => {
  const { layersConfig } = useLayersConfig()
  const { data } = useAPIDatasets()

  const datasetLayers = useMemo(() => {
    const l = layersConfig.flatMap((layerConfig) => {
      if (layerConfig.id === BASEMAP_LAYER_ID) {
        return layerConfig
      }
      const dataset = data?.find((dataset) => dataset.id === layerConfig.id)
      return dataset ? { ...layerConfig, dataset } : []
    })
    return l
  }, [data, layersConfig])

  return datasetLayers
}

export const useGeoTemporalLayers = () => {
  const layers = useDatasetLayers()
  return layers.filter((l) => l.dataset?.type === '4wings')
}

export const useContexLayers = () => {
  const layers = useDatasetLayers()
  return layers.filter((l) => l.dataset?.type === 'context')
}
