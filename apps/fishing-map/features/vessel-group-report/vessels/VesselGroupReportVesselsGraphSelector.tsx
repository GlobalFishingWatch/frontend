import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { VesselGroupReportVesselsSubsection } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselGroupReportVesselsSubsection } from '../vessel.config.selectors'

type VesselGroupReportVesselsGraphSelectorProps = {}

function VesselGroupReportVesselsGraphSelector(props: VesselGroupReportVesselsGraphSelectorProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const subsection = useSelector(selectVesselGroupReportVesselsSubsection)
  const options: ChoiceOption<VesselGroupReportVesselsSubsection>[] = [
    {
      id: 'flag',
      label: t('common.flag', 'Flag'),
      // disabled: loading,
    },
    {
      id: 'shiptypes',
      label: t('vessel.type', 'Vessel type'),
      tooltipPlacement: 'bottom',
      // disabled: loading,
    },
    {
      id: 'geartypes',
      label: t('vessel.gearType', 'Gear type'),
      tooltipPlacement: 'bottom',
      // disabled: loading,
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VesselGroupReportVesselsSubsection>) => {
    if (subsection !== option.id) {
      // trackEvent({
      //   category: TrackCategory.Analysis,
      //   action: `Click on ${option.id} activity graph`,
      // })
      dispatchQueryParams({ vesselGroupReportVesselsSubsection: option.id })
    }
  }

  const selectedOption = subsection ? options.find((o) => o.id === subsection) : options[0]

  return (
    <Choice
      size="small"
      options={options}
      activeOption={selectedOption!?.id}
      onSelect={onSelectSubsection}
    />
  )
}

export default VesselGroupReportVesselsGraphSelector
