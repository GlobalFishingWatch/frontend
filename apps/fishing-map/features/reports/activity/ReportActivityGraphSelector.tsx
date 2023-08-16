import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
} from 'data/config'
import { selectActiveReportDataviews, selectReportActivityGraph } from 'features/app/app.selectors'
import { useFitAreaInViewport } from 'features/reports/reports.hooks'
import { ReportActivityGraph } from 'types'
import { useSetReportTimeComparison } from 'features/reports/reports-timecomparison.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'

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

  const options: ChoiceOption[] = [
    {
      id: REPORT_ACTIVITY_GRAPH_EVOLUTION,
      label: t('analysis.evolution', 'Evolution') as string,
      disabled: loading,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
      label: t('analysis.beforeAfter', 'Before/after') as string,
      tooltip: !areAllFiltersEqual
        ? (t(
            'analysis.noTimeComparisonAllowed',
            'Time comparison modes are not available when layers have different filters'
          ) as string)
        : '',
      tooltipPlacement: 'bottom',
      disabled: loading || !areAllFiltersEqual,
    },
    {
      id: REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
      label: t('analysis.periodComparison', 'Period comparison') as string,
      tooltip: !areAllFiltersEqual
        ? (t(
            'analysis.noTimeComparisonAllowed',
            'Time comparison modes are not available when layers have different filters'
          ) as string)
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
    <Choice size="small" options={options} activeOption={selectedOption!?.id} onSelect={onSelect} />
  )
}
