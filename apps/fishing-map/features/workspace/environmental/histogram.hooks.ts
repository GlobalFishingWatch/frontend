import { useEffect, useCallback, useState } from 'react'
import { bin, scaleLinear } from 'd3'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import {
  ChunkFeature,
  aggregateFeatures,
  LayerFeature,
} from '@globalfishingwatch/features-aggregate'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { getLayerDatasetRange } from 'features/workspace/environmental/HistogramRangeFilter'
import { areDataviewsFeatureLoaded, useMapDataviewFeatures } from 'features/map/map-sources.hooks'

export const useDataviewHistogram = (dataview: UrlDataviewInstance) => {
  const { bounds } = useMapBounds()
  const deboncedBounds = useDebounce(bounds, 1000)
  const layerFeature = useMapDataviewFeatures(dataview)?.[0]
  const sourcesLoaded = areDataviewsFeatureLoaded(layerFeature)
  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.Context
  )
  const [histogram, setHistogram] = useState<any>()

  const updateHistogram = useCallback(
    (layerFeature: LayerFeature, bounds: MiniglobeBounds) => {
      const { features } = layerFeature.chunksFeatures?.[0] || ({} as ChunkFeature)
      if (features && features.length) {
        const filteredFeatures = filterFeaturesByBounds(features, bounds)
        const rawData = aggregateFeatures(filteredFeatures, layerFeature.metadata)
        const layerRange = getLayerDatasetRange(dataset)
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
    [dataset]
  )
  useEffect(() => {
    if (sourcesLoaded) {
      updateHistogram(layerFeature, bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, deboncedBounds])

  return histogram
}
