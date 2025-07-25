import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import { selectIsGlobalReport } from 'features/reports/report-area/area-reports.selectors'
import {
  REPORT_EVENTS_GRAPH_EVOLUTION,
  REPORT_EVENTS_GRAPH_GROUP_BY_EEZ,
  REPORT_EVENTS_GRAPH_GROUP_BY_FAO,
  REPORT_EVENTS_GRAPH_GROUP_BY_FLAG,
  REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
} from 'features/reports/reports.config'
import { selectReportEventsGraph } from 'features/reports/reports.config.selectors'
import type { ReportEventsGraph } from 'features/reports/reports.types'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsPortReportLocation } from 'routes/routes.selectors'

type EventsReportGraphSelectorProps = {
  disabled: boolean
}

function EventsReportGraphSelector({ disabled = false }: EventsReportGraphSelectorProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const reportEventsGraph = useSelector(selectReportEventsGraph)
  const isGlobalReport = useSelector(selectIsGlobalReport)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const { t } = useTranslation()
  const fitAreaInViewport = useFitAreaInViewport()

  const options: ChoiceOption<ReportEventsGraph>[] = [
    {
      id: REPORT_EVENTS_GRAPH_EVOLUTION,
      label: t('analysis.evolution'),
      disabled,
    },
    {
      id: REPORT_EVENTS_GRAPH_GROUP_BY_FLAG,
      label: t('analysis.groupByFlag'),
      disabled,
    },
    ...(isGlobalReport && !isPortReportLocation
      ? [
          {
            id: REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
            label: t('analysis.groupByRFMO'),
            disabled,
          },
          {
            id: REPORT_EVENTS_GRAPH_GROUP_BY_FAO,
            label: t('analysis.groupByFAO'),
            disabled,
          },
          {
            id: REPORT_EVENTS_GRAPH_GROUP_BY_EEZ,
            label: t('analysis.groupByEEZ'),
            disabled,
          },
        ]
      : []),
  ]

  const onSelect = (option: ChoiceOption<ReportEventsGraph>) => {
    if (reportEventsGraph !== option.id) {
      fitAreaInViewport()
      dispatchQueryParams({ reportEventsGraph: option.id })
      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click on ${option.id} activity graph`,
      })
    }
  }

  const selectedOption = reportEventsGraph
    ? options.find((o) => o.id === reportEventsGraph)
    : options[0]

  return (
    <Choice size="small" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}

export default EventsReportGraphSelector
