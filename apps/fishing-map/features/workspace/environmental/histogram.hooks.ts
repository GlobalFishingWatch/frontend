import { useEffect, useCallback, useState } from 'react'
import { bin, scaleLinear } from 'd3'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { getEnvironmentalDatasetRange } from '@globalfishingwatch/datasets-client'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { useMapBounds } from 'features/map/map-bounds.hooks'

export const useDataviewHistogram = (dataview: UrlDataviewInstance) => {
  const { bounds } = useMapBounds()
  const deboncedBounds = useDebounce(bounds, 1000)
  const environmentalLayer = useGetDeckLayer<FourwingsLayer>(dataview.id)
  const sourcesLoaded = environmentalLayer?.loaded
  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.UserContext
  ) as Dataset
  const [histogram, setHistogram] = useState<any>()

  const updateHistogram = useCallback(
    (features: FourwingsFeature[]) => {
      if (features && features.length) {
        const rawData = features.flatMap((f) => f.aggregatedValues || [])
        const layerRange = getEnvironmentalDatasetRange(dataset)
        const data = rawData.filter((d) => {
          const matchesMin = layerRange.min !== undefined ? d >= layerRange.min : true
          const matchesMax = layerRange.max !== undefined ? d <= layerRange.max : true
          return matchesMin && matchesMax
        })
        const scale = scaleLinear().domain([layerRange.min, layerRange.max]).nice()
        if (data?.length) {
          const histogram = bin()
            .domain(scale.domain() as [number, number])
            .thresholds(50)(data)
          const values = histogram.map((bin) => ({ data: bin.length }))
          setHistogram(values)
        }
      }
    },
    [dataset]
  )
  useEffect(() => {
    if (sourcesLoaded) {
      const features = environmentalLayer.instance?.getViewportData() as FourwingsFeature[]
      updateHistogram(features)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, deboncedBounds])

  return histogram
}
