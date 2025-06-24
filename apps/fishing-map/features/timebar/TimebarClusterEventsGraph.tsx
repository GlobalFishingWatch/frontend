import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'
import type {
  HighlighterCallbackFn,
  HighlighterCallbackFnArgs,
  HighlighterIconCallback,
} from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import type { IconType } from '@globalfishingwatch/ui-components'

import { t } from 'features/i18n/i18n'
import { selectActiveActivityDataviewsByVisualisation } from 'features/timebar/timebar.selectors'
import { useClusterEventsGraph } from 'features/timebar/TimebarClusterEventsGraph.hooks'
import { TimebarVisualisations } from 'types'
import { formatNumber } from 'utils/info'

import styles from './Timebar.module.css'

const TimebarClusterEventsGraph = () => {
  const activeDataviews = useSelector(
    selectActiveActivityDataviewsByVisualisation(TimebarVisualisations.Events)
  )
  const { loading, eventsActivity } = useClusterEventsGraph()

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value }: HighlighterCallbackFnArgs) => {
      if (!value || !value.value) return ''
      const labels = [
        formatNumber(value.value),
        t('common.event', { defaultValue: 'event', count: value.value }).toLocaleLowerCase(),
        t('common.onScreen'),
      ]

      return labels.join(' ')
    },
    []
  )

  const getActivityHighlighterIconLabel: HighlighterIconCallback = useCallback(
    ({ item }: HighlighterCallbackFnArgs) => {
      const eventType = activeDataviews?.find((d) => d.id === item?.props.dataviewId)?.datasets?.[0]
        ?.subcategory as EventType
      return `event-${eventType}` as IconType
    },
    [activeDataviews]
  )

  if (!eventsActivity || !eventsActivity.length || !activeDataviews?.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={eventsActivity}
        dataviews={activeDataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback={getActivityHighlighterIconLabel}
      />
    </div>
  )
}

export default TimebarClusterEventsGraph
