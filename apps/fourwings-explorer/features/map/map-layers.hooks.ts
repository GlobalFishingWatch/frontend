import { useMemo } from 'react'
import {
  AnyGeneratorConfig,
  GeneratorType,
  HeatmapAnimatedGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
  HeatmapAnimatedMode,
} from '@globalfishingwatch/layer-composer'
import { useLayerComposer } from '@globalfishingwatch/react-hooks'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { DatasetLayer, FourwingsLayerConfig, useDatasetLayers } from 'features/layers/layers.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

export function getLayerGeneratorConfig(layer: DatasetLayer) {
  switch (layer.config?.type) {
    case GeneratorType.HeatmapAnimated: {
      const config = layer.config as FourwingsLayerConfig
      const sublayers: HeatmapAnimatedGeneratorSublayer[] = [
        {
          id: layer.id,
          colorRamp: config?.colorRamp,
          visible: config?.visible ?? true,
          breaks: config?.breaks || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          datasets: [layer.dataset.id],
          legend: {
            label: layer.dataset?.name,
            unit: layer.dataset?.unit,
            color: config.color,
          },
        },
      ]

      const visible = layer.config?.visible !== false
      const { startDate, endDate } = layer.dataset

      const generator: HeatmapAnimatedGeneratorConfig = {
        id: layer.id,
        ...config,
        sublayers,
        maxZoom: config.maxZoom || 8,
        mode: HeatmapAnimatedMode.Single,
        dynamicBreaks: config?.dynamicBreaks || true,
        interactive: true,
        aggregationOperation:
          layer.dataset?.configuration?.aggregationOperation || AggregationOperation.Avg,
        availableIntervals: layer.dataset?.configuration?.intervals || ['month'],
        visible,
        tilesAPI: '/v1/4wings/tile/heatmap/{{z}}/{{x}}/{{y}}',
        ...(startDate && { datasetsStart: startDate }),
        ...(endDate && { datasetsEnd: endDate }),
      }
      return generator
    }
    // case GeneratorType.Context: {
    //   if (Array.isArray(dataview.config.layers)) {
    //     const tilesUrls = dataview.config.layers?.flatMap(({ id, dataset }) => {
    //       const { dataset: resolvedDataset, url } = resolveDataviewDatasetResource(
    //         dataview,
    //         dataset
    //       )
    //       if (!url || resolvedDataset?.status !== DatasetStatus.Done) return []
    //       return {
    //         id,
    //         tilesUrl: url,
    //         attribution: getDatasetAttribution(resolvedDataset),
    //         datasetId: resolvedDataset.id,
    //       }
    //     })
    //     // Duplicated generators when context dataview have multiple layers
    //     return tilesUrls.map(({ id, tilesUrl, attribution, datasetId }) => ({
    //       ...generator,
    //       id: `${dataview.id}${MULTILAYER_SEPARATOR}${id}`,
    //       layer: id,
    //       attribution,
    //       tilesUrl,
    //       datasetId,
    //     }))
    //   } else {
    //     generator.id = dataview.config.layers
    //       ? `${dataview.id}${MULTILAYER_SEPARATOR}${dataview.config.layers}`
    //       : dataview.id
    //     generator.layer = dataview.config.layers
    //     const { dataset, url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Context)
    //     if (dataset?.status !== DatasetStatus.Done) {
    //       return []
    //     }
    //     generator.datasetId = dataset.id
    //     if (url) {
    //       generator.tilesUrl = url
    //     }
    //     if (dataset?.source) {
    //       generator.attribution = getDatasetAttribution(dataset)
    //     }

    //     const propertyToInclude = (dataset.configuration as EnviromentalDatasetConfiguration)
    //       ?.propertyToInclude
    //     if (dataset.category === DatasetCategory.Environment && propertyToInclude) {
    //       const { min, max } =
    //         (dataset.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange ||
    //         {}
    //       const rampScale = scaleLinear().range([min, max]).domain([0, 1])
    //       const numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS
    //       const steps = [...Array(numSteps)]
    //         .map((_, i) => i / (numSteps - 1))
    //         .map((value) => rampScale(value) as number)
    //       generator.steps = steps
    //     } else if (
    //       dataset.category === DatasetCategory.Context &&
    //       (dataview.config?.type === GeneratorType.UserContext ||
    //         dataview.config?.type === GeneratorType.UserPoints)
    //     ) {
    //       generator.disableInteraction = dataset.configuration?.disableInteraction
    //     }
    //   }
    //   if (!generator.tilesUrl) {
    //     console.warn('Missing tiles url for dataview', dataview)
    //     return []
    //   }
    //   return generator
    // }
    default: {
      return { id: layer.id, ...layer.config }
    }
  }
}

const getLayersGeneratorConfig = (layers: DatasetLayer[]): AnyGeneratorConfig[] => {
  return layers.flatMap((layer) => (layer.config?.type ? getLayerGeneratorConfig(layer) : []))
}

const useGlobalGeneratorConfig = () => {
  const { viewport } = useViewport()
  const { timerange } = useTimerangeConnect()
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

export const useMapLayers = () => {
  const layers = useDatasetLayers()
  const globalGeneratorConfig = useGlobalGeneratorConfig()
  const generators = useMemo(() => {
    return getLayersGeneratorConfig(layers)
  }, [layers])
  return useLayerComposer(generators, globalGeneratorConfig)
}
