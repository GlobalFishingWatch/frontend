import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useLocationConnect } from 'routes/routes.hook'
import { REPORT_VESSELS_GRAPH_GEARTYPE, REPORT_VESSELS_GRAPH_FLAG } from 'data/config'
import { selectReportCategory, selectReportVesselGraph } from 'features/app/app.selectors'
import { ReportVesselGraph } from 'types'

type ReportVesselsGraphProps = {}

export default function ReportVesselsGraphSelector(props: ReportVesselsGraphProps) {
  const { dispatchQueryParams } = useLocationConnect()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const reportCategory = useSelector(selectReportCategory)
  const { t } = useTranslation()

  const options: ChoiceOption[] = [
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

  const onSelect = (option: ChoiceOption<ReportVesselGraph>) => {
    dispatchQueryParams({ reportVesselGraph: option.id })
  }

  const selectedOption = selectedReportVesselGraph
    ? options.find((o) => o.id === selectedReportVesselGraph)
    : options[0]

  if (options.length === 1) return <label>{options[0].label}</label>

  return (
    <Choice size="tiny" options={options} activeOption={selectedOption?.id} onSelect={onSelect} />
  )
}
