import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Timeseries } from '@globalfishingwatch/timebar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import { areDataviewsFeatureLoaded, useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import { getTimeseriesFromDataviews } from 'features/timebar/TimebarActivityGraph.utils'
import { filterByViewport } from 'features/map/map.utils'

export const useStackedActivityDataview = (dataviews: UrlDataviewInstance[]) => {
  const [stackedActivity, setStackedActivity] = useState<Timeseries>()
  const isSmallScreen = useSmallScreen()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
  const loading = boundsChanged || !areDataviewsFeatureLoaded(dataviewFeatures)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetStackedActivity = useCallback(
    debounce((dataviewFeatures, bounds) => {
      const dataviewFeaturesFiltered = dataviewFeatures.map((dataview) => {
        return {
          ...dataview,
          chunksFeatures: dataview.chunksFeatures?.map((chunk) => {
            return {
              ...chunk,
              features: chunk.features ? filterByViewport(chunk.features, bounds) : [],
            }
          }),
        }
      })
      const stackedActivity = getTimeseriesFromDataviews(dataviewFeaturesFiltered)
      setStackedActivity(stackedActivity as Timeseries)
    }, 400),
    []
  )

  useEffect(() => {
    const dataviewFeaturesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
    if (isSmallScreen || !dataviewFeaturesLoaded) {
      return
    }
    debouncedSetStackedActivity(dataviewFeatures, debouncedBounds)
  }, [dataviewFeatures, debouncedBounds, debouncedSetStackedActivity, isSmallScreen])

  return { loading, stackedActivity }
}
