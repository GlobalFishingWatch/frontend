import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useLocationConnect } from 'routes/routes.hook'
import { REPORT_VESSELS_GRAPH_GEARTYPE, REPORT_VESSELS_GRAPH_FLAG } from 'data/config'
import { selectReportCategory, selectReportVesselGraph } from 'features/app/app.selectors'

type ReportVesselsGraphProps = {}

export default function ReportVesselsGraphSelector(props: ReportVesselsGraphProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const reportCategory = useSelector(selectReportCategory)
  const { t } = useTranslation()

  const options: SelectOption[] = [
    {
      id: REPORT_VESSELS_GRAPH_FLAG,
      label: t('analysis.groupByFlag', 'Flag distribution'),
    },
    ...(reportCategory !== DataviewCategory.Detections
      ? [
          {
            id: REPORT_VESSELS_GRAPH_GEARTYPE,
            label: t('analysis.groupByGeartype', 'Gear type distribution'),
          },
        ]
      : []),
  ]

  const onSelect = (option: SelectOption) => {
    dispatchQueryParams({ reportVesselGraph: option.id })
  }

  const selectedOption = selectedReportVesselGraph
    ? options.find((o) => o.id === selectedReportVesselGraph)
    : options[0]

  if (options.length === 1) return <label>{options[0].label}</label>

  return (
    <Select
      type="secondary"
      align="right"
      options={options}
      selectedOption={selectedOption}
      onSelect={onSelect}
    />
  )
}
