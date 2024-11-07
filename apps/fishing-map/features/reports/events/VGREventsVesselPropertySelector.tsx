import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  VesselGroupReportState,
  VGREventsVesselsProperty,
} from 'features/vessel-groups/vessel-groups.types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { PortsReportState } from '../ports/ports-report.types'

function ReportEventsVesselPropertySelector({
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
      label: t('common.flag', 'Flag'),
    },
    {
      id: 'geartype',
      label: t('common.geartype', 'Gear type'),
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
      activeOption={selectedOption!?.id}
      onSelect={onSelectSubsection}
    />
  )
}

export default ReportEventsVesselPropertySelector
