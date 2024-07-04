import { useEffect, useCallback, useState } from 'react'
import { bin, scaleLinear } from 'd3'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { ChunkFeature, aggregateFeatures } from '@globalfishingwatch/features-aggregate'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { DatasetLayer, FourwingsLayerConfig } from 'features/layers/layers.hooks'
import { useMapBounds } from 'features/map/map-bounds.hooks'
import {
  areLayersFeatureLoaded,
  LayerFeature,
  useMapLayerFeatures,
} from 'features/map/map-sources.hooks'
import { FourwingsAPIDataset } from 'features/datasets/datasets.types'
import { getLayerDatasetRange } from 'features/layers/HistogramRangeFilter'

export const useLayerHistogram = (
  layer: DatasetLayer<FourwingsAPIDataset, FourwingsLayerConfig>
) => {
  const bounds = useMapBounds()
  const deboncedBounds = useDebounce(bounds, 1000)
  const layerFeature = useMapLayerFeatures(layer)?.[0]
  const sourcesLoaded = areLayersFeatureLoaded(layerFeature)
  const [histogram, setHistogram] = useState<any>()

  const updateHistogram = useCallback(
    (layerFeature: LayerFeature, bounds: MiniglobeBounds) => {
      const { features } = layerFeature.chunksFeatures?.[0] || ({} as ChunkFeature)
      if (features && features.length) {
        const filteredFeatures = filterFeaturesByBounds(features, bounds) as any
        const rawData = aggregateFeatures(filteredFeatures, layerFeature.metadata)
        const layerRange = getLayerDatasetRange(layer)
        const data = rawData.filter((d) => {
          const matchesMin = layerRange.min !== undefined ? d >= layerRange.min : true
          const matchesMax = layerRange.max !== undefined ? d <= layerRange.max : true
          return matchesMin && matchesMax
        })
        const scale = scaleLinear().domain([layerRange.min, layerRange.max]).nice()
        const histogram = bin()
          .domain(scale.domain() as [number, number])
          .thresholds(50)(data)
        const values = histogram.map((bin) => ({ data: bin.length }))
        setHistogram(values)
      }
    },
    [layer]
  )
  useEffect(() => {
    if (sourcesLoaded) {
      updateHistogram(layerFeature, bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, deboncedBounds])

  return histogram
}
