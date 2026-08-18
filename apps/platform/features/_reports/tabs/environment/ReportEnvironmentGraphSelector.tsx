import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { DATASET_COMPARISON_SUFFIX } from 'data/map/config'
import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { useFitAreaInViewport } from 'features/_reports/report-area/area-reports.hooks'
import {
  REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
} from 'features/_reports/reports.config'
import { selectReportActivityGraph } from 'features/_reports/reports.config.selectors'
import { type ReportActivityGraph } from 'features/_reports/reports.types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectUrlDataviewInstances } from 'router/routes.selectors'

import styles from './ReportEnvironment.module.css'

export default function ReportEnvironmentGraphSelector() {
  const selectedReportActivityGraph = useSelector(selectReportActivityGraph)
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const fitAreaInViewport = useFitAreaInViewport()
  const dataviews = useSelector(selectActiveReportDataviews)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)

  const options: ChoiceOption<ReportActivityGraph>[] = [
    {
      id: REPORT_ACTIVITY_GRAPH_EVOLUTION,
      label: t((t) => t.analysis.evolution),
    },
    {
      id: REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
      label: t((t) => t.analysis.datasetComparison),
      tooltip: t((t) => t.analysis.comparisonNotAvailable),
    },
  ]

  const onSelect = (option: ChoiceOption<ReportActivityGraph>) => {
    if (selectedReportActivityGraph !== option.id) {
      fitAreaInViewport()

      const filteredDataviewInstances = (urlDataviewInstances || []).filter(
        (dv) => !dv.id.includes(DATASET_COMPARISON_SUFFIX)
      )
      const reportComparisonDataviewIds =
        option.id === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON
          ? { main: dataviews[0]?.id, compare: '' }
          : undefined

      replaceQueryParams({
        reportComparisonDataviewIds,
        ...(option.id === REPORT_ACTIVITY_GRAPH_EVOLUTION && {
          dataviewInstances: filteredDataviewInstances,
        }),
      })

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click on ${option.id} environmental graph`,
      })
      replaceQueryParams({ reportActivityGraph: option.id })
    }
  }

  const selectedOption = selectedReportActivityGraph
    ? options.find((o) => o.id === selectedReportActivityGraph)
    : options[0]

  return (
    <div className={styles.graphSelectorContainer}>
      <Choice
        size="medium"
        options={options}
        activeOption={selectedOption?.id}
        onSelect={onSelect}
      />
    </div>
  )
}
