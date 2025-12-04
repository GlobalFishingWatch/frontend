import { useCallback } from 'react'
import cx from 'classnames'

import type { HighlighterCallbackFn, HighlighterCallbackFnArgs } from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'

import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import type { PointsReportGraphStats } from 'features/reports/reports-timeseries.hooks'
import { useTimeseriesStats } from 'features/reports/reports-timeseries.hooks'
import { formatNumber } from 'utils/info'

import { useTimebarPoints } from './TimebarPointsGraph.hooks'

import styles from './Timebar.module.css'

const TimebarPointsGraph = () => {
  const { loading, points, dataviews } = useTimebarPoints()
  const timeseriesStats = useTimeseriesStats()

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value, item }: HighlighterCallbackFnArgs) => {
      const currentDataviewId = item?.props.dataviewId
      const aggregatedPropertyLabel = dataviews?.find((d) => d.id === currentDataviewId)?.config
        ?.aggregateByProperty
      const count =
        (timeseriesStats?.[currentDataviewId] as PointsReportGraphStats)?.count || value?.value

      if (!value || !count) return ''
      const labels = [
        formatNumber(count),
        t('common.points', { count: count }).toLocaleLowerCase(),
        aggregatedPropertyLabel && value?.value
          ? t('common.aggregatedBy', {
              total: formatI18nNumber(value?.value),
              property: aggregatedPropertyLabel,
            })
          : t('common.onScreen'),
      ]

      return labels.join(' ')
    },
    [dataviews, timeseriesStats]
  )

  if (!points || points.length === 0 || !dataviews?.length) {
    return null
  }

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="points"
        timeseries={points}
        dataviews={dataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="dots"
      />
    </div>
  )
}

export default TimebarPointsGraph
