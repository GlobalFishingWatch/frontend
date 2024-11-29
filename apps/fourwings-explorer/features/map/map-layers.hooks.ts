import { useMemo } from 'react'
import type {
  AnyGeneratorConfig,
  ExtendedLayer,
  HeatmapAnimatedGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
  PolygonsGeneratorConfig,
  StyleTransformation} from '@globalfishingwatch/layer-composer';
import {
  GeneratorType,
  getInteractiveLayerIds,
  Group,
  HeatmapAnimatedMode
} from '@globalfishingwatch/layer-composer'
import { useLayerComposer } from '@globalfishingwatch/layer-composer'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import type { DatasetLayer, FourwingsLayerConfig} from 'features/layers/layers.hooks';
import { useDatasetLayers } from 'features/layers/layers.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { useTimerange } from 'features/timebar/timebar.hooks'
import type { ContextAPIDataset, FourwingsAPIDataset } from 'features/datasets/datasets.types'
import { API_URL } from 'data/config'

/**
 * It takes a layer and returns a generator config
 * @param {DatasetLayer} layer - DatasetLayer
 * @returns A generator config object
 */
export function getLayerGeneratorConfig(layer: DatasetLayer) {
  switch (layer.dataset?.type) {
    case '4wings': {
      const config = layer.config as FourwingsLayerConfig
      const dataset = layer.dataset as FourwingsAPIDataset
      const sublayers: HeatmapAnimatedGeneratorSublayer[] = [
        {
          id: layer.id,
          colorRamp: config?.colorRamp || 'teal',
          visible: config?.visible ?? true,
          breaks: config?.breaks || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          datasets: [dataset.id],
          legend: {
            label: dataset?.name,
            unit: dataset?.unit,
            color: config.color,
          },
        },
      ]

      const visible = layer.config?.visible !== false
      const generator: HeatmapAnimatedGeneratorConfig = {
        id: layer.id,
        type: GeneratorType.HeatmapAnimated,
        sublayers,
        maxZoom: config.maxZoom || 8,
        mode: HeatmapAnimatedMode.Single,
        dynamicBreaks: config?.dynamicBreaks || true,
        minVisibleValue: config?.minVisibleValue,
        maxVisibleValue: config?.maxVisibleValue,
        interactive: true,
        aggregationOperation:
          dataset?.configuration?.aggregationOperation || AggregationOperation.Avg,
        availableIntervals: dataset?.configuration?.intervals,
        visible,
        // debug: true,
        // debugLabels: true,
        tilesAPI: `${API_URL}/4wings/tile/heatmap/{{z}}/{{x}}/{{y}}`,
        ...(dataset.startDate && { datasetsStart: dataset.startDate }),
        ...(dataset.endDate && { datasetsEnd: dataset.endDate }),
      }
      return generator
    }
    case 'context': {
      const dataset = layer.dataset as ContextAPIDataset
      const generator: PolygonsGeneratorConfig = {
        id: layer.id,
        visible: layer.config.visible,
        color: layer.config.color,
        type: GeneratorType.Polygons,
        url: `${API_URL}/datasets/${dataset.id}/data`,
        attribution: dataset.source,
        metadata: {
          interactive: true,
        },
      }
      return generator
    }
    default: {
      return { id: layer.id, ...layer.config } as AnyGeneratorConfig
    }
  }
}

const getLayersGeneratorConfig = (layers: DatasetLayer[]): AnyGeneratorConfig[] => {
  return layers.flatMap((layer) => {
    const visible = layer.config?.visible
    return visible ? getLayerGeneratorConfig(layer) : []
  })
}

const useGlobalGeneratorConfig = () => {
  const { viewport } = useViewport()
  const [timerange] = useTimerange()
  const globalGeneratorConfig = useMemo(
    () => ({
      start: timerange.start,
      end: timerange.end,
      zoom: viewport.zoom,
    }),
    [timerange, viewport.zoom]
  )
  return globalGeneratorConfig
}

const GROUP_ORDER = [
  Group.Background,
  Group.Basemap,
  Group.BasemapForeground,
  Group.BasemapFill,
  Group.OutlinePolygonsBackground,
  Group.Heatmap,
  Group.OutlinePolygonsFill,
  Group.OutlinePolygons,
  Group.Default,
  Group.OutlinePolygonsHighlighted,
]
export const sort: StyleTransformation = (style, order = GROUP_ORDER) => {
  const layers = style.layers ? [...style.layers] : []
  const orderedLayers = layers.sort((a: ExtendedLayer, b: ExtendedLayer) => {
    const aGroup = a.metadata?.group || Group.Default
    const bGroup = b.metadata?.group || Group.Default
    const aPos = order.indexOf(aGroup)
    const bPos = order.indexOf(bGroup)
    return aPos - bPos
  })
  return { ...style, layers: orderedLayers }
}

const styleTransformations = [sort, getInteractiveLayerIds]
export const useMapLayers = () => {
  const layers = useDatasetLayers()
  const globalGeneratorConfig = useGlobalGeneratorConfig()
  const generators = useMemo(() => {
    const layersReady = layers.filter((l) =>
      l.dataset?.status ? l.dataset.status === 'COMPLETED' : true
    )
    return getLayersGeneratorConfig(layersReady)
  }, [layers])
  return useLayerComposer(generators, globalGeneratorConfig, styleTransformations)
}
