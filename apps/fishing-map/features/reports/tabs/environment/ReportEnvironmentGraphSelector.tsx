import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { DATASET_COMPARISON_SUFFIX } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import {
  REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
} from 'features/reports/reports.config'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import { type ReportActivityGraph } from 'features/reports/reports.types'
import { useLocationConnect } from 'routes/routes.hook'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'

export default function ReportEnvironmentGraphSelector() {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportActivityGraph = useSelector(selectReportActivityGraph)
  const { t } = useTranslation()
  const fitAreaInViewport = useFitAreaInViewport()
  const dataviews = useSelector(selectActiveReportDataviews)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)

  const options: ChoiceOption<ReportActivityGraph>[] = [
    {
      id: REPORT_ACTIVITY_GRAPH_EVOLUTION,
      label: t('analysis.evolution'),
    },
    {
      id: REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
      label: t('analysis.datasetComparison'),
      tooltip: t('analysis.comparisonNotAvailable'),
    },
  ]

  const onSelect = (option: ChoiceOption<ReportActivityGraph>) => {
    if (selectedReportActivityGraph !== option.id) {
      fitAreaInViewport()

      const filteredDataviewInstances = urlDataviewInstances.filter(
        (dv) => !dv.id.includes(DATASET_COMPARISON_SUFFIX)
      )
      const reportComparisonDataviewIds =
        option.id === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON
          ? { main: dataviews[0]?.id, compare: '' }
          : undefined

      dispatchQueryParams({
        reportComparisonDataviewIds,
        ...(option.id === REPORT_ACTIVITY_GRAPH_EVOLUTION && {
          dataviewInstances: filteredDataviewInstances,
        }),
      })

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click on ${option.id} environmental graph`,
      })
      dispatchQueryParams({ reportActivityGraph: option.id })
    }
  }

  const selectedOption = selectedReportActivityGraph
    ? options.find((o) => o.id === selectedReportActivityGraph)
    : options[0]

  return (
    <Choice size="small" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}
