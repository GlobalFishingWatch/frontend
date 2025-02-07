import { useTranslation } from 'react-i18next'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import {
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { ReportState, ReportVesselGraph } from 'features/reports/reports.types'
import { useLocationConnect } from 'routes/routes.hook'

function EventsReportVesselPropertySelector({
  property,
  propertyQueryParam = 'reportVesselGraph',
}: {
  property: string
  propertyQueryParam?: keyof Pick<ReportState, 'reportVesselGraph'>
}) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const options: ChoiceOption<ReportVesselGraph>[] = [
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

  const onSelectSubsection = (option: ChoiceOption<ReportVesselGraph>) => {
    if (property !== option.id) {
      dispatchQueryParams({ [propertyQueryParam]: option.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `vessel_group_profile_events_tab_${option.id}_filter`,
      })
    }
  }

  const selectedOption = property ? options.find((o) => o.id === property) : options[0]

  return (
    <Choice
      size="small"
      options={options}
      activeOption={selectedOption?.id}
      onSelect={onSelectSubsection}
    />
  )
}

export default EventsReportVesselPropertySelector
