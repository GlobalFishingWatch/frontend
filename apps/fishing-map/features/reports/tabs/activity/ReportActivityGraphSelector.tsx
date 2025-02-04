import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import {
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
} from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import type { ReportActivityGraph } from 'features/reports/reports.types'
import { useSetReportTimeComparison } from 'features/reports/tabs/activity/reports-activity-timecomparison.hooks'
import { useLocationConnect } from 'routes/routes.hook'

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
  const areAllFiltersEqual = dataviews.every(
    (d) => d.config?.filter === dataviews[0].config?.filter
  )

  const options: ChoiceOption<ReportActivityGraph>[] = [
    {
      id: REPORT_ACTIVITY_GRAPH_EVOLUTION,
      label: t('analysis.evolution', 'Evolution'),
      disabled: loading,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
      label: t('analysis.beforeAfter', 'Before/after'),
      tooltip: !areAllFiltersEqual
        ? t(
            'analysis.noTimeComparisonAllowed',
            'Time comparison modes are not available when layers have different filters'
          )
        : '',
      tooltipPlacement: 'bottom',
      disabled: loading || !areAllFiltersEqual,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
      label: t('analysis.periodComparison', 'Period comparison'),
      tooltip: !areAllFiltersEqual
        ? t(
            'analysis.noTimeComparisonAllowed',
            'Time comparison modes are not available when layers have different filters'
          )
        : '',
      tooltipPlacement: 'bottom',
      disabled: loading || !areAllFiltersEqual,
    },
  ]

  const onSelect = (option: ChoiceOption<ReportActivityGraph>) => {
    if (selectedReportActivityGraph !== option.id) {
      fitAreaInViewport()
      if (option.id === 'evolution') {
        resetReportTimecomparison()
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
    <Choice size="small" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}
