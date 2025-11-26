import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { HighlighterCallbackFn, HighlighterCallbackFnArgs } from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'

import { selectActiveUserPointsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { t } from 'features/i18n/i18n'
import { formatNumber } from 'utils/info'

import { useTimebarPoints } from './TimebarPointsGraph.hooks'

import styles from './Timebar.module.css'

const TimebarPointsGraph = () => {
  const { loading, points, dataviews } = useTimebarPoints()
  const activeDataviews = useSelector(selectActiveUserPointsDataviews)

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value }: HighlighterCallbackFnArgs) => {
      if (!value || !value.value) return ''
      const labels = [
        formatNumber(value.value),
        t('common.points', { count: value.value }).toLocaleLowerCase(),
        t('common.onScreen'),
      ]

      return labels.join(' ')
    },
    []
  )

  if (!points || points.length === 0 || !activeDataviews?.length) {
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
