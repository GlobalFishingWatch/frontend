import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import {
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
} from 'features/reports/reports.config'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import type { ReportActivityGraph } from 'features/reports/reports.types'
import { useSetReportTimeComparison } from 'features/reports/tabs/activity/reports-activity-timecomparison.hooks'
import { useLocationConnect } from 'routes/routes.hook'

import styles from './ReportActivity.module.css'

type ReportActivityGraphSelectorProps = {
  loading: boolean
}

export default function ReportActivityGraphSelector({
  loading = false,
}: ReportActivityGraphSelectorProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const { setReportTimecomparison, resetReportTimecomparison } = useSetReportTimeComparison()
  const selectedReportActivityGraph = useSelector(selectReportActivityGraph)
  const { t } = useTranslation()
  const fitAreaInViewport = useFitAreaInViewport()
  const dataviews = useSelector(selectActiveReportDataviews)
  const areAllFiltersEqual = dataviews.every((d) => {
    const filter = d.config?.filter ?? ''
    const firstFilter = dataviews[0].config?.filter ?? ''
    return filter === firstFilter
  })

  const options: SelectOption<ReportActivityGraph>[] = [
    {
      id: REPORT_ACTIVITY_GRAPH_EVOLUTION,
      label: t('analysis.evolution'),
      disabled: loading,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
      label: t('analysis.beforeAfter'),
      tooltip: !areAllFiltersEqual ? t('analysis.noTimeComparisonAllowed') : '',
      tooltipPlacement: 'bottom',
      disabled: loading || !areAllFiltersEqual,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
      label: t('analysis.periodComparison'),
      tooltip: !areAllFiltersEqual ? t('analysis.noTimeComparisonAllowed') : '',
      tooltipPlacement: 'bottom',
      disabled: loading || !areAllFiltersEqual,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
      label: t('analysis.datasetComparison'),
      disabled: loading,
    },
  ]

  const onSelect = (option: SelectOption<ReportActivityGraph>) => {
    if (selectedReportActivityGraph !== option.id) {
      fitAreaInViewport()
      if (
        option.id === REPORT_ACTIVITY_GRAPH_EVOLUTION ||
        option.id === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON
      ) {
        resetReportTimecomparison()
        if (option.id === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON) {
          dispatchQueryParams({
            reportComparisonDataviewIds: { main: dataviews[0]?.id, compare: '' },
          })
        }
      } else {
        setReportTimecomparison(option.id)
      }
      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click on ${option.id} activity graph`,
      })
      dispatchQueryParams({ reportActivityGraph: option.id })
    }
  }

  const selectedOption = selectedReportActivityGraph
    ? options.find((o) => o.id === selectedReportActivityGraph)
    : options[0]

  return (
    <Select
      options={options}
      selectedOption={selectedOption}
      onSelect={onSelect}
      containerClassName={styles.select}
    />
  )
}
