import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { REPORT_VESSELS_GRAPH_GEARTYPE, REPORT_VESSELS_GRAPH_FLAG } from 'data/config'
import { selectReportVesselGraph } from 'routes/routes.selectors'

type ReportVesselsGraphProps = {}

export default function ReportVesselsGraphSelector(props: ReportVesselsGraphProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const { t } = useTranslation()

  const options: SelectOption[] = [
    {
      id: REPORT_VESSELS_GRAPH_GEARTYPE,
      label: t('report.groupByGeartype', 'Gear type distribution'),
    },
    {
      id: REPORT_VESSELS_GRAPH_FLAG,
      label: t('report.groupByFlag', 'Flag distribution'),
    },
  ]

  const onSelect = (option: SelectOption) => {
    dispatchQueryParams({ reportVesselGraph: option.id })
  }

  const selectedOption = selectedReportVesselGraph
    ? options.find((o) => o.id === selectedReportVesselGraph)
    : options[0]

  return (
    <div>
      <Select options={options} selectedOption={selectedOption} onSelect={onSelect} />
    </div>
  )
}
