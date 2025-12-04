import { useCallback } from 'react'
import cx from 'classnames'

import type { HighlighterCallbackFn, HighlighterCallbackFnArgs } from '@globalfishingwatch/timebar'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'

import { t } from 'features/i18n/i18n'
import { useHeatmapActivityGraph } from 'features/timebar/TimebarActivityGraph.hooks'
import { TimebarVisualisations } from 'types'
import { formatNumber } from 'utils/info'

import styles from './Timebar.module.css'

const TimebarActivityGraph = ({ visualisation }: { visualisation: TimebarVisualisations }) => {
  const { loading, heatmapActivity, dataviews } = useHeatmapActivityGraph()

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ value, item }: HighlighterCallbackFnArgs) => {
      if (!value || !value.value) return ''
      const maxHighlighterFractionDigits =
        visualisation === TimebarVisualisations.Environment ? 2 : undefined
      const labels = [
        formatNumber(value.value, maxHighlighterFractionDigits),
        item?.props.unit || '',
        t('common.onScreen'),
      ]
      if (visualisation === TimebarVisualisations.Environment) {
        labels.push(t('common.averageAbbreviated'))
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
  if (!heatmapActivity || !heatmapActivity.length || !dataviews?.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={heatmapActivity}
        dataviews={dataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="heatmap"
      />
    </div>
  )
}

export default TimebarActivityGraph
