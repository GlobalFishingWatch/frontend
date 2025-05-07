import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'
import type { HighlighterCallbackFn, HighlighterCallbackFnArgs } from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'

import { t } from 'features/i18n/i18n'
import { selectActiveActivityDataviewsByVisualisation } from 'features/timebar/timebar.selectors'
import { useClusterEventsGraph } from 'features/timebar/TimebarClusterEventsGraph.hooks'
import { TimebarVisualisations } from 'types'
import { formatNumber } from 'utils/info'

import styles from './Timebar.module.css'

const TimebarClusterEventsGraph = ({ visualisation }: { visualisation: TimebarVisualisations }) => {
  const activeDataviews = useSelector(selectActiveActivityDataviewsByVisualisation(visualisation))
  const { loading, eventsActivity } = useClusterEventsGraph()

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value }: HighlighterCallbackFnArgs) => {
      if (!value || !value.value) return ''
      const maxHighlighterFractionDigits =
        visualisation === TimebarVisualisations.Environment ? 2 : undefined
      const labels = [
        formatNumber(value.value, maxHighlighterFractionDigits),
        t('common.event', { defaultValue: 'event', count: value.value }).toLocaleLowerCase(),
        t('common.onScreen', 'on screen'),
      ]
      if (visualisation === TimebarVisualisations.Environment) {
        labels.push(t('common.averageAbbreviated', 'avg.'))
      }

      return labels.join(' ')
    },
    [visualisation]
  )

  if (!eventsActivity || !eventsActivity.length || !activeDataviews?.length) return null

  const eventType = activeDataviews[0]?.datasets?.[0]?.subcategory

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={eventsActivity}
        dataviews={activeDataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback={`event-${eventType as EventType}`}
      />
    </div>
  )
}

export default TimebarClusterEventsGraph
