import React, { useMemo, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { getLegendId, useMapLegend } from '@globalfishingwatch/react-hooks'
import { TimebarStackedActivity, HighlighterCallbackFn } from '@globalfishingwatch/timebar'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { useStackedActivityDataview } from 'features/timebar/TimebarActivityGraph.hooks'
import { formatNumber } from 'utils/info'
import { useMapStyle } from 'features/map/map-style.hooks'
import { TimebarVisualisations } from 'types'
import { useTimebarEnvironmentConnect } from 'features/timebar/timebar.hooks'
import { t } from 'features/i18n/i18n'
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

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    (chunk, value, item) => {
      const dataviewId = item.props?.dataviewId
      const unit = mapLegends.find((l) => l.id === getLegendId(dataviewId))?.unit || ''
      const maxHighlighterFractionDigits =
        visualisation === TimebarVisualisations.Environment ? 2 : undefined
      const labels = [
        formatNumber(value.value, maxHighlighterFractionDigits),
        unit,
        t('common.onScreen', 'on screen'),
      ]
      if (visualisation === TimebarVisualisations.Environment) {
        labels.push(t('common.averageAbbreviated', 'avg.'))
      }

      return labels.join(' ')
    },
    [mapLegends, visualisation]
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
