import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Timeseries } from '@globalfishingwatch/timebar'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { getTimeseriesFromFeatures } from '@globalfishingwatch/features-aggregate'
import { checkEqualBounds, useMapBounds } from 'features/map/map-bounds.hooks'
import {
  areLayersFeatureLoaded,
  haslayersFeatureError,
  useMapLayerFeatures,
} from 'features/map/map-sources.hooks'
import { DatasetLayer } from 'features/layers/layers.hooks'

export const useStackedActivity = (layers: DatasetLayer | DatasetLayer[]) => {
  const [generatingStackedActivity, setGeneratingStackedActivity] = useState(false)
  const [stackedActivity, setStackedActivity] = useState<Timeseries>()
  const isSmallScreen = useSmallScreen()
  const bounds = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const layerFeatures = useMapLayerFeatures(layers)
  const error = haslayersFeatureError(layerFeatures)
  const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
  const loading =
    boundsChanged || !areLayersFeatureLoaded(layerFeatures) || generatingStackedActivity

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetStackedActivity = useCallback(
    debounce((layerFeatures, bounds) => {
      const layerFeaturesFiltered = layerFeatures.map((dataview) => {
        return {
          ...dataview,
          chunksFeatures: dataview.chunksFeatures?.map((chunk) => {
            return {
              ...chunk,
              features: chunk.features
                ? filterFeaturesByBounds({ features: chunk.features, bounds })
                : [],
            }
          }),
        }
      })
      const stackedActivity = getTimeseriesFromFeatures(layerFeaturesFiltered).sort(
        (a, b) => a.date - b.date
      )
      setStackedActivity(stackedActivity)
      setGeneratingStackedActivity(false)
    }, 400),
    [setStackedActivity]
  )

  useEffect(() => {
    const layerFeaturesLoaded = areLayersFeatureLoaded(layerFeatures)
    if (!isSmallScreen && layerFeaturesLoaded && !error) {
      setGeneratingStackedActivity(true)
      debouncedSetStackedActivity(layerFeatures, debouncedBounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerFeatures, debouncedBounds, debouncedSetStackedActivity, isSmallScreen])

  return { loading, error, stackedActivity }
}
