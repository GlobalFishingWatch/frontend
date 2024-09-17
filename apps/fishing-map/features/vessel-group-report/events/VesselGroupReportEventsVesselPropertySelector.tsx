import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { VesselGroupReportEventsVesselsProperty } from 'features/vessel-groups/vessel-groups.types'
import { selectVesselGroupReportEventsVesselsProperty } from '../vessel-group.config.selectors'

function VesselGroupReportEventsVesselPropertySelector() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const property = useSelector(selectVesselGroupReportEventsVesselsProperty)
  const options: ChoiceOption<VesselGroupReportEventsVesselsProperty>[] = [
    {
      id: 'flag',
      label: t('common.flag', 'Flag'),
    },
    {
      id: 'geartype',
      label: t('common.geartype', 'Gear type'),
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VesselGroupReportEventsVesselsProperty>) => {
    if (property !== option.id) {
      dispatchQueryParams({ vesselGroupReportEventsVesselsProperty: option.id })
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
