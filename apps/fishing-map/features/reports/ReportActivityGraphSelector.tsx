import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
} from 'data/config'
import { selectReportActivityGraph } from 'features/app/app.selectors'

type ReportActivityGraphSelectorProps = {}

export default function ReportActivityGraphSelector(props: ReportActivityGraphSelectorProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportActivityGraph = useSelector(selectReportActivityGraph)
  const { t } = useTranslation()

  const options: SelectOption[] = [
    {
      id: REPORT_ACTIVITY_GRAPH_EVOLUTION,
      label: t('analysis.evolution', 'Evolution'),
    },
    {
      id: REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
      label: t('analysis.beforeAfter', 'Before/after'),
    },
    {
      id: REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
      label: t('analysis.periodComparison', 'Period comparison'),
    },
  ]

  const onSelect = (option: SelectOption) => {
    dispatchQueryParams({ reportActivityGraph: option.id })
  }

  const selectedOption = selectedReportActivityGraph
    ? options.find((o) => o.id === selectedReportActivityGraph)
    : options[0]

  return (
    <Select
      type="secondary"
      options={options}
      selectedOption={selectedOption}
      onSelect={onSelect}
    />
  )
}
