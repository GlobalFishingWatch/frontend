import React, { useMemo, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useMapLegend } from '@globalfishingwatch/react-hooks'
import { TimebarStackedActivity, TimebarChartValue } from '@globalfishingwatch/timebar'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { useStackedActivityDataview } from 'features/timebar/TimebarActivityGraph.hooks'
import { formatNumber } from 'utils/info'
import { useMapStyle } from 'features/map/map-style.hooks'
import { TimebarVisualisations } from 'types'
import { useTimebarEnvironmentConnect } from 'features/timebar/timebar.hooks'
import styles from './Timebar.module.css'

const TimebarActivityGraph = ({ visualisation }: { visualisation: TimebarVisualisations }) => {
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const environmentDataviews = useSelector(selectActiveEnvironmentalDataviews)
  const { timebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const activeDataviews = useMemo(() => {
    if (visualisation === TimebarVisualisations.Heatmap) {
      return activityDataviews
    }
    return environmentDataviews.filter((d) => d.id === timebarSelectedEnvId)
  }, [activityDataviews, environmentDataviews, timebarSelectedEnvId, visualisation])
  const { loading, stackedActivity } = useStackedActivityDataview(activeDataviews)
  const style = useMapStyle()
  const mapLegends = useMapLegend(style, activeDataviews)
  const getActivityHighlighterLabel = useCallback(
    (_: any, value: TimebarChartValue, __: any, itemIndex: number) => {
      const unit = mapLegends[itemIndex]?.unit || ''
      return `${formatNumber(value.value)} ${unit} on screen`
    },
    [mapLegends]
  )

  if (!stackedActivity || !stackedActivity.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={activeDataviews}
        highlighterCallback={getActivityHighlighterLabel}
      />
    </div>
  )
}

export default TimebarActivityGraph
