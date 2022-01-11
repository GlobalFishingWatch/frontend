import React, { useEffect, useState, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
import { useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { getTimeseriesFromDataviews } from 'features/timebar/TimebarActivityGraph.utils'
import { filterByViewport } from 'features/map/map.utils'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const environmentalDataviews = useSelector(selectActiveEnvironmentalDataviews)
  const temporalGridDataviews = useMemo(
    () => [...activityDataviews, ...environmentalDataviews],
    [activityDataviews, environmentalDataviews]
  )
  const [stackedActivity, setStackedActivity] = useState<any>()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const isSmallScreen = useSmallScreen()

  const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
  const dataviewFeatures = useMapDataviewFeatures(temporalGridDataviews)
  const dataviewFeaturesLoaded = dataviewFeatures.every(({ loaded }) => loaded)

  useEffect(() => {
    if (isSmallScreen) {
      return
    }
    if (dataviewFeaturesLoaded) {
      const filteredFeatures = dataviewFeatures.map((feature) => ({
        ...feature,
        features: filterByViewport(feature.features, debouncedBounds),
      }))
      const stackedActivity = getTimeseriesFromDataviews(filteredFeatures)
      setStackedActivity(stackedActivity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataviewFeaturesLoaded, debouncedBounds])

  const dataviewsColors = temporalGridDataviews?.map((dataview) => dataview.config?.color)

  if (!stackedActivity) return null
  return (
    <div className={cx({ [styles.loading]: !dataviewFeaturesLoaded || boundsChanged })}>
      <TimebarStackedActivity
        key="stackedActivity"
        data={stackedActivity}
        colors={dataviewsColors}
        numSublayers={temporalGridDataviews?.length}
      />
    </div>
  )
}

export default TimebarActivityGraph
