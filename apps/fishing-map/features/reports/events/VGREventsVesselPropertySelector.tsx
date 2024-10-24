import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { VGREventsVesselsProperty } from 'features/vessel-groups/vessel-groups.types'
import { selectVGREventsVesselsProperty } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'

function VesselGroupReportEventsVesselPropertySelector() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const property = useSelector(selectVGREventsVesselsProperty)
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
      dispatchQueryParams({ vGREventsVesselsProperty: option.id })
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

export default VesselGroupReportEventsVesselPropertySelector
