import React, { useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity, TimebarChartValue } from '@globalfishingwatch/timebar'
import { useMapLegend } from '@globalfishingwatch/react-hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { useStackedActivity } from 'features/timebar/TimebarActivityGraph.hooks'
import { formatNumber } from 'utils/info'
import { useMapStyle } from 'features/map/map-style.hooks'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  const { loading, stackedActivity } = useStackedActivity()
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const style = useMapStyle()
  const mapLegends = useMapLegend(style, temporalgridDataviews)
  const getActivityHighlighterLabel = useCallback(
    (_: any, value: TimebarChartValue, __: any, itemIndex: number) => {
      const unit = mapLegends[itemIndex]?.unit || ''
      return `${formatNumber(value.value)} ${unit} on screen`
    },
    [mapLegends]
  )

  if (!stackedActivity) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={temporalgridDataviews}
        highlighterCallback={getActivityHighlighterLabel}
      />
    </div>
  )
}

export default TimebarActivityGraph
