import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { debounce } from 'lodash'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import { areDataviewsFeatureLoaded, useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { getTimeseriesFromDataviews } from 'features/timebar/TimebarActivityGraph.utils'
import { filterByViewport } from 'features/map/map.utils'

type StackedActivity = {
  date: number
  [key: string]: number
}

export const useStackedActivity = () => {
  const [stackedActivity, setStackedActivity] = useState<StackedActivity[]>()
  const isSmallScreen = useSmallScreen()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const dataviewFeatures = useMapDataviewFeatures(temporalgridDataviews)
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
      setStackedActivity(stackedActivity)
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
