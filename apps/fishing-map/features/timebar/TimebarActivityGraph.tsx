import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { useStackedActivity } from 'features/timebar/TimebarActivityGraph.hooks'
import styles from './Timebar.module.css'

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
