import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { getTimeseriesFromDataviews } from 'features/timebar/TimebarActivityGraph.utils'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const environmentalDataviews = useSelector(selectActiveEnvironmentalDataviews)
  const temporalGridDataviews = [...activityDataviews, ...environmentalDataviews]
  const [stackedActivity, setStackedActivity] = useState<any>()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const isSmallScreen = useSmallScreen()

  const dataviewFeatures = useMapDataviewFeatures(temporalGridDataviews, debouncedBounds)
  const dataviewFeaturesLoaded = dataviewFeatures.every(({ loaded }) => loaded)

  useEffect(() => {
    if (dataviewFeaturesLoaded && !isSmallScreen) {
      const stackedActivity = getTimeseriesFromDataviews(dataviewFeatures)
      setStackedActivity(stackedActivity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataviewFeaturesLoaded, debouncedBounds])

  const dataviewsColors = temporalGridDataviews?.map((dataview) => dataview.config?.color)

  if (!stackedActivity) return null
  return (
    <div className={cx({ [styles.loading]: !dataviewFeaturesLoaded })}>
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
