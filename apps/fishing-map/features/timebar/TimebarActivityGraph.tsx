import { useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { getLegendId, useMapLegend } from '@globalfishingwatch/react-hooks'
import {
  TimebarStackedActivity,
  HighlighterCallbackFn,
  HighlighterCallbackFnArgs,
} from '@globalfishingwatch/timebar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectActiveActivityDataviewsByVisualisation } from 'features/dataviews/selectors/dataviews.selectors'
import { useStackedActivity } from 'features/timebar/TimebarActivityGraph.hooks'
import { formatNumber } from 'utils/info'
import { useMapStyle } from 'features/map/map-style.hooks'
import { TimebarVisualisations } from 'types'
import { t } from 'features/i18n/i18n'
import styles from './Timebar.module.css'

const TimebarActivityGraph = ({ visualisation }: { visualisation: TimebarVisualisations }) => {
  const activeDataviews = useSelector(selectActiveActivityDataviewsByVisualisation(visualisation))

  const { loading, stackedActivity, error } = useStackedActivity(
    activeDataviews as UrlDataviewInstance[]
  )
  const style = useMapStyle()
  const mapLegends = useMapLegend(style, activeDataviews)

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ chunk, value, item }: HighlighterCallbackFnArgs) => {
      if (loading) return t('map.loading', 'Loading')
      if (!value || !value.value) return ''
      const dataviewId = item?.props?.dataviewId
      const unit = mapLegends?.find((l) => l.id === getLegendId(dataviewId))?.unit || ''
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
    [loading, mapLegends, visualisation]
  )

  if (error) {
    return (
      <div className={styles.error}>
        {t(
          'analysis.error',
          'There was a problem loading the data, please try refreshing the page'
        )}
      </div>
    )
  }
  if (!stackedActivity || !stackedActivity.length || !activeDataviews?.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={activeDataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="heatmap"
      />
    </div>
  )
}

export default TimebarActivityGraph
