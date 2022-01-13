import React, { useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import { getDataviewsFeatureLoaded, useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { getTimeseriesFromDataviews } from 'features/timebar/TimebarActivityGraph.utils'
import { filterByViewport } from 'features/map/map.utils'
import styles from './Timebar.module.css'

type StackedActivity = {
  date: number
  [key: string]: number
}

const useStackedActivity = () => {
  const [stackedActivity, setStackedActivity] = useState<StackedActivity[]>()
  const isSmallScreen = useSmallScreen()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const dataviewFeatures = useMapDataviewFeatures(temporalgridDataviews)
  const dataviewFeaturesLoaded = getDataviewsFeatureLoaded(dataviewFeatures)
  const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
  const loading = !dataviewFeaturesLoaded || boundsChanged

  const dataviewFeaturesFiltered = useMemo(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmallScreen, dataviewFeaturesLoaded, debouncedBounds])

  useEffect(() => {
    if (dataviewFeaturesFiltered) {
      // TODO getTimeseries only for the visible dataviews (and merge the activity together)
      const stackedActivity = getTimeseriesFromDataviews(dataviewFeaturesFiltered)
      setStackedActivity(stackedActivity)
    }
  }, [dataviewFeaturesFiltered])

  return { loading, stackedActivity }
}

const TimebarActivityGraph = () => {
  const { loading, stackedActivity } = useStackedActivity()
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const dataviewsColors = temporalgridDataviews?.map((dataview) => dataview.config?.color)

  if (!stackedActivity) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        data={stackedActivity}
        colors={dataviewsColors}
        numSublayers={temporalgridDataviews?.length}
      />
    </div>
  )
}

export default TimebarActivityGraph
