import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { REPORT_VESSELS_GRAPH_GEARTYPE, REPORT_VESSELS_GRAPH_FLAG } from 'data/config'
import { selectReportVesselGraph } from 'features/app/app.selectors'
import { ReportVesselGraph } from 'types'

export default function ReportVesselsGraphSelector() {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const { t } = useTranslation()

  const options: ChoiceOption[] = [
    {
      id: REPORT_VESSELS_GRAPH_FLAG,
      label: t('analysis.groupByFlag', 'Flag distribution'),
    },
    {
      id: REPORT_VESSELS_GRAPH_GEARTYPE,
      label: t('analysis.groupByGeartype', 'Gear type distribution'),
    },
  ]

  const onSelect = (option: ChoiceOption<ReportVesselGraph>) => {
    dispatchQueryParams({ reportVesselGraph: option.id })
  }

  const selectedOption = selectedReportVesselGraph
    ? options.find((o) => o.id === selectedReportVesselGraph)
    : options[0]

  return (
    <Choice size="tiny" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}
