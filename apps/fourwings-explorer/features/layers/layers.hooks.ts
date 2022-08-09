import { atom, selector, useRecoilState } from 'recoil'
import { useCallback, useMemo } from 'react'
import { urlSyncEffect } from 'recoil-sync'
import { mixed } from '@recoiljs/refine'
import {
  BasemapGeneratorConfig,
  BasemapType,
  GeneratorType,
} from '@globalfishingwatch/layer-composer'
import { APIDataset, useAPIDatasets } from 'features/datasets/datasets.hooks'

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
  const [layersConfig, setMapLayerConfig] = useRecoilState(layersConfigAtom)
  console.log(layersConfig)

  const addLayer = useCallback(
    (layer: DatasetLayerConfig) => {
      setMapLayerConfig((layers) => [...layers, layer])
    },
    [setMapLayerConfig]
  )

  const updateLayer = useCallback(
    (layer: DatasetLayerConfig) => {
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
