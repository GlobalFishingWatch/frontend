import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { selectReportVesselGraph } from 'features/app/selectors/app.reports.selector'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import type { ReportVesselGraph } from 'features/reports/areas/area-reports.types'
import { ReportCategory } from 'features/reports/areas/area-reports.types'

export default function ReportVesselsGraphSelector() {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const reportCategory = useSelector(selectReportCategory)
  const { t } = useTranslation()

  const options: ChoiceOption[] = [
    {
      id: REPORT_VESSELS_GRAPH_FLAG,
      label: t('analysis.groupByFlag', 'by flag'),
    },
    ...(reportCategory !== ReportCategory.Fishing
      ? [
          {
            id: REPORT_VESSELS_GRAPH_VESSELTYPE,
            label: t('analysis.groupByVesseltype', 'by vessel type'),
          },
        ]
      : []),
    {
      id: REPORT_VESSELS_GRAPH_GEARTYPE,
      label: t('analysis.groupByGeartype', 'by gear type'),
    },
  ]

  const onSelect = (option: ChoiceOption<ReportVesselGraph>) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on ${option.id} distribution`,
    })
    dispatchQueryParams({ reportVesselGraph: option.id })
  }

  const selectedOption = selectedReportVesselGraph
    ? (options.find((o) => o.id === selectedReportVesselGraph) as ChoiceOption)
    : options[0]

  return (
    <Choice size="small" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}
