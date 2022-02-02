import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
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

  const dataviewFeaturesFiltered = useMemo(() => {
    const dataviewFeaturesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
    if (isSmallScreen || !dataviewFeaturesLoaded) {
      return
    }
    return dataviewFeatures.map((dataview) => {
      return {
        ...dataview,
        chunksFeatures: dataview.chunksFeatures?.map((chunk) => {
          return {
            ...chunk,
            features: chunk.features ? filterByViewport(chunk.features, debouncedBounds) : [],
          }
        }),
      }
    })
  }, [dataviewFeatures, debouncedBounds, isSmallScreen])

  useEffect(() => {
    if (dataviewFeaturesFiltered) {
      // TODO getTimeseries only for the visible dataviews (and merge the activity together)
      const stackedActivity = getTimeseriesFromDataviews(dataviewFeaturesFiltered)
      setStackedActivity(stackedActivity)
    }
  }, [dataviewFeaturesFiltered])

  return { loading, stackedActivity }
}
