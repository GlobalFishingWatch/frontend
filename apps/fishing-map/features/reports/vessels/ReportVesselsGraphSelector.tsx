import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { selectReportVesselGraph } from 'features/app/app.selectors'
import { ReportVesselGraph } from 'types'

export default function ReportVesselsGraphSelector() {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const { t } = useTranslation()

  const options: ChoiceOption[] = [
    {
      id: REPORT_VESSELS_GRAPH_FLAG,
      label: t('analysis.groupByFlag', 'by flag'),
    },
    {
      id: REPORT_VESSELS_GRAPH_VESSELTYPE,
      label: t('analysis.groupByVesseltype', 'by vessel type'),
    },
    {
      id: REPORT_VESSELS_GRAPH_GEARTYPE,
      label: t('analysis.groupByGeartype', 'by gear type'),
    },
  ]

  const onSelect = (option: ChoiceOption<ReportVesselGraph>) => {
    dispatchQueryParams({ reportVesselGraph: option.id })
  }

  const selectedOption = selectedReportVesselGraph
    ? options.find((o) => o.id === selectedReportVesselGraph)
    : options[0]

  return (
    <Choice size="small" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}
