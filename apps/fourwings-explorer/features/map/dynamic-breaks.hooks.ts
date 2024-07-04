import { useCallback, useEffect } from 'react'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { ChunkFeature, aggregateFeatures } from '@globalfishingwatch/features-aggregate'
import {
  FourwingsLayerConfig,
  useGeoTemporalLayers,
  useLayersConfig,
} from 'features/layers/layers.hooks'
import { useMapBounds } from 'features/map/map-bounds.hooks'
import {
  areLayersFeatureLoaded,
  LayerFeature,
  useMapLayerFeatures,
} from 'features/map/map-sources.hooks'

export const useDynamicBreaksUpdate = () => {
  const layers = useGeoTemporalLayers()
  const bounds = useMapBounds()
  const { updateLayer } = useLayersConfig()
  const layerFeatures = useMapLayerFeatures(layers)
  const sourcesLoaded = areLayersFeatureLoaded(layerFeatures)
  const layersFilterHash = layers
    .flatMap(({ config }) => `${config.minVisibleValue}-${config.maxVisibleValue}`)
    .join(',')

  const updateBreaksByViewportValues = useCallback(
    (layerFeatures: LayerFeature[], bounds: MiniglobeBounds) => {
      const layersConfig = layerFeatures?.flatMap(({ chunksFeatures, layerId, metadata }) => {
        const { features } = chunksFeatures?.[0] || ({} as ChunkFeature)
        if (features && features.length) {
          const config = layers.find(({ id }) => id === layerId)?.config as FourwingsLayerConfig
          const filteredFeatures = filterFeaturesByBounds(features, bounds) as any
          const rawData = aggregateFeatures(filteredFeatures, metadata)
          const data = rawData.filter((d) => {
            const matchesMin =
              config?.minVisibleValue !== undefined ? d >= config?.minVisibleValue : true
            const matchesMax =
              config?.maxVisibleValue !== undefined ? d <= config?.maxVisibleValue : true
            return matchesMin && matchesMax
          })

          if (data && data.length) {
            const dataSampled = data.length > 1000 ? sample(data, 1000, Math.random) : data
            // filter data to 2 standard deviations from mean to remove outliers
            const meanValue = mean(dataSampled)
            const standardDeviationValue = standardDeviation(dataSampled)
            const upperCut = meanValue + standardDeviationValue * 2
            const lowerCut = meanValue - standardDeviationValue * 2
            const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
            const steps = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS - 1)
            // using ckmeans as jenks
            const ck = ckmeans(dataFiltered, steps).map(([clusterFirst]) =>
              parseFloat(clusterFirst.toFixed(3))
            )

            let cleanBreaks = []
            ck.forEach((k, i) => {
              if (i > 1) {
                const cleanBreak =
                  k === 0 || k <= cleanBreaks?.[i - 1] ? cleanBreaks[i - 1] + 0.01 : k
                cleanBreaks.push(cleanBreak)
              } else {
                cleanBreaks.push(k)
              }
            })
            return {
              id: layerId,
              config: {
                breaks: cleanBreaks,
              },
            }
          }
          return []
        }
        return []
      })
      if (layersConfig) {
        updateLayer(layersConfig)
      }
    },
    [updateLayer, layers]
  )

  useEffect(() => {
    if (sourcesLoaded) {
      updateBreaksByViewportValues(layerFeatures, bounds)
    }
  }, [sourcesLoaded, layersFilterHash])
}
