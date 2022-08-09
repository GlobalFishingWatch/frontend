import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Timeseries } from '@globalfishingwatch/timebar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import {
  areDataviewsFeatureLoaded,
  hasDataviewsFeatureError,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'
import { getTimeseriesFromDataviews } from 'features/timebar/TimebarActivityGraph.utils'

export const useStackedActivity = (dataviews: UrlDataviewInstance[]) => {
  const [generatingStackedActivity, setGeneratingStackedActivity] = useState(false)
  const [stackedActivity, setStackedActivity] = useState<Timeseries>()
  const isSmallScreen = useSmallScreen()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const error = hasDataviewsFeatureError(dataviewFeatures)
  const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
  const loading =
    boundsChanged || !areDataviewsFeatureLoaded(dataviewFeatures) || generatingStackedActivity

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetStackedActivity = useCallback(
    debounce((dataviewFeatures, bounds) => {
      const dataviewFeaturesFiltered = dataviewFeatures.map((dataview) => {
        return {
          ...dataview,
          chunksFeatures: dataview.chunksFeatures?.map((chunk) => {
            return {
              ...chunk,
              features: chunk.features ? filterFeaturesByBounds(chunk.features, bounds) : [],
            }
          }),
        }
      })
      const stackedActivity = getTimeseriesFromDataviews(dataviewFeaturesFiltered)
      setStackedActivity(stackedActivity)
      setGeneratingStackedActivity(false)
    }, 400),
    [setStackedActivity]
  )

  useEffect(() => {
    const dataviewFeaturesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
    if (!isSmallScreen && dataviewFeaturesLoaded && !error) {
      setGeneratingStackedActivity(true)
      debouncedSetStackedActivity(dataviewFeatures, debouncedBounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataviewFeatures, debouncedBounds, debouncedSetStackedActivity, isSmallScreen])

  return { loading, error, stackedActivity }
}
