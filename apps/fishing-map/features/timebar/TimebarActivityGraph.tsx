import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { HighlighterCallbackFn, HighlighterCallbackFnArgs } from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'

import { t } from 'features/i18n/i18n'
import { selectActiveActivityDataviewsByVisualisation } from 'features/timebar/timebar.selectors'
import { useHeatmapActivityGraph } from 'features/timebar/TimebarActivityGraph.hooks'
import { TimebarVisualisations } from 'types'
import { formatNumber } from 'utils/info'

import styles from './Timebar.module.css'

const TimebarActivityGraph = ({ visualisation }: { visualisation: TimebarVisualisations }) => {
  const activeDataviews = useSelector(selectActiveActivityDataviewsByVisualisation(visualisation))
  const { loading, heatmapActivity } = useHeatmapActivityGraph()

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value, item }: HighlighterCallbackFnArgs) => {
      if (!value || !value.value) return ''
      const maxHighlighterFractionDigits =
        visualisation === TimebarVisualisations.Environment ? 2 : undefined
      const labels = [
        formatNumber(value.value, maxHighlighterFractionDigits),
        item?.props.unit || '',
        t('common.onScreen', 'on screen'),
      ]
      if (visualisation === TimebarVisualisations.Environment) {
        labels.push(t('common.averageAbbreviated', 'avg.'))
      }

      return labels.join(' ')
    },
    // [loading, mapLegends, visualisation]
    [visualisation]
  )

  // if (error) {
  //   return (
  //     <div className={styles.error}>
  //       {t(
  //         'analysis.error',
  //         'There was a problem loading the data, please try refreshing the page'
  //       )}
  //     </div>
  //   )
  // }
  if (!heatmapActivity || !heatmapActivity.length || !activeDataviews?.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={heatmapActivity}
        dataviews={activeDataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="heatmap"
      />
    </div>
  )
}

export default TimebarActivityGraph
