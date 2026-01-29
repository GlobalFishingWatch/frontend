import { useCallback } from 'react'
import cx from 'classnames'

import type { HighlighterCallbackFn, HighlighterCallbackFnArgs } from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'

import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { formatNumber } from 'utils/info'

import { useTimebarPoints } from './timebar-points.hooks'

import styles from './Timebar.module.css'

const TimebarPointsGraph = () => {
  const { loading, points, dataviews } = useTimebarPoints()

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value, item }: HighlighterCallbackFnArgs) => {
      const currentDataviewId = item?.props.dataviewId
      const aggregatedPropertyLabel = dataviews?.find((d) => d.id === currentDataviewId)?.config
        ?.aggregateByProperty

      if (!value?.value || !value?.count) return ''
      const labels = [
        formatNumber(value?.count),
        t((t) => t.common.points, { count: value?.count }).toLocaleLowerCase(),
        aggregatedPropertyLabel && value?.value
          ? t((t) => t.common.aggregatedBy, {
              total: formatI18nNumber(value?.value),
              property: aggregatedPropertyLabel,
            })
          : t((t) => t.common.onScreen),
      ]

      return labels.join(' ')
    },
    [dataviews]
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
