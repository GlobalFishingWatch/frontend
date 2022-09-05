import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Timeseries } from '@globalfishingwatch/timebar'
import { getDatasetsExtent, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { getTimeseriesFromFeatures } from '@globalfishingwatch/features-aggregate'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import { getActiveActivityDatasetsInDataview } from 'features/datasets/datasets.utils'
import {
  areDataviewsFeatureLoaded,
  DataviewFeature,
  hasDataviewsFeatureError,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'

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
    debounce((dataviewFeatures: DataviewFeature[], bounds) => {
      const dataviewFeaturesFiltered = dataviewFeatures.map((dataviewFeature) => {
        const dataview = dataviews.find((d) => d.id === dataviewFeature.dataviewsId[0])
        const activeDataviewDatasets = getActiveActivityDatasetsInDataview(dataview)
        const { extentStart, extentEnd } = getDatasetsExtent(activeDataviewDatasets, 'timestamp')

        return {
          ...dataviewFeature,
          chunksFeatures: dataviewFeature.chunksFeatures?.map((chunk) => {
            return {
              ...chunk,
              startDataTimestamp: extentStart,
              endDataTimestamp: extentEnd,
              features: chunk.features ? filterFeaturesByBounds(chunk.features, bounds) : [],
            }
          }),
        }
      })
      const stackedActivity = getTimeseriesFromFeatures(dataviewFeaturesFiltered)
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
