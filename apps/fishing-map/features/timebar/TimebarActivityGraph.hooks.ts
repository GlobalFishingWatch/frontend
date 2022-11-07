import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { DateTime } from 'luxon'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Timeseries } from '@globalfishingwatch/timebar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { getTimeseriesFromFeatures } from '@globalfishingwatch/features-aggregate'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import {
  areDataviewsFeatureLoaded,
  hasDataviewsFeatureError,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'
import { LAST_DATA_UPDATE } from 'data/config'

export const useStackedActivity = (dataviews: UrlDataviewInstance[]) => {
  const [generatingStackedActivity, setGeneratingStackedActivity] = useState(false)
  const [stackedActivity, setStackedActivity] = useState<Timeseries>()
  const isSmallScreen = useSmallScreen()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const error = hasDataviewsFeatureError(dataviewFeatures)
  const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
  const layersFilterHash = dataviewFeatures
    .flatMap(({ metadata }) => `${metadata?.minVisibleValue}-${metadata?.maxVisibleValue}`)
    .join(',')
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
      const stackedActivity = getTimeseriesFromFeatures(dataviewFeaturesFiltered)
      const stackedActivityToLastDate = stackedActivity.map((activity) => ({
        ...activity,
        date:
          DateTime.fromMillis(activity.date, { zone: 'UTC' }).toISO() < LAST_DATA_UPDATE
            ? activity.date
            : DateTime.fromISO(LAST_DATA_UPDATE, { zone: 'UTC' }).toMillis(),
      }))
      setStackedActivity(stackedActivityToLastDate)
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
  }, [
    dataviewFeatures,
    debouncedBounds,
    debouncedSetStackedActivity,
    isSmallScreen,
    layersFilterHash,
  ])

  return { loading, error, stackedActivity }
}
