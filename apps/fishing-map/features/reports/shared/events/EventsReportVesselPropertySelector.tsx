import { useTranslation } from 'react-i18next'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type {
  VesselGroupReportState,
  VGREventsVesselsProperty,
} from 'features/vessel-groups/vessel-groups.types'
import { useLocationConnect } from 'routes/routes.hook'

import type { PortsReportState } from '../../ports/ports-report.types'

function EventsReportVesselPropertySelector({
  property,
  propertyQueryParam,
}: {
  property: string
  propertyQueryParam:
    | keyof Pick<VesselGroupReportState, 'vGREventsVesselsProperty'>
    | keyof Pick<PortsReportState, 'portsReportVesselsProperty'>
}) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const options: ChoiceOption<VGREventsVesselsProperty>[] = [
    {
      id: 'flag',
      label: t('analysis.groupByFlag', 'by flag'),
    },
    {
      id: 'shiptype',
      label: t('analysis.groupByVesseltype', 'by vessel type'),
    },
    {
      id: 'geartype',
      label: t('analysis.groupByGeartype', 'by gear type'),
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VGREventsVesselsProperty>) => {
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
