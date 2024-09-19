import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVGRStatus } from 'features/vessel-group-report/vessel-group-report.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { VGREventsSubsection } from 'features/vessel-groups/vessel-groups.types'
import { selectVGREventsSubsection } from '../vessel-group.config.selectors'

function VesselGroupReportEventsSubsectionSelector() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const subsection = useSelector(selectVGREventsSubsection)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading
  const options: ChoiceOption<VGREventsSubsection>[] = [
    {
      id: 'encounter-events',
      label: t('event.encounter_other', 'Encounters'),
      disabled: loading,
    },
    {
      id: 'loitering',
      label: t('event.loitering_other', 'Loitering events'),
      disabled: true,
      tooltip: t('common.comingSoon', 'Coming Soon!'),
      tooltipPlacement: 'top',
    },
    {
      id: 'gaps',
      label: t('event.gap_other', 'AIS off events'),
      disabled: true,
      tooltip: t('common.comingSoon', 'Coming Soon!'),
      tooltipPlacement: 'top',
    },
    {
      id: 'port_visits',
      label: t('event.port_visit_other', 'Port visits'),
      disabled: true,
      tooltip: t('common.comingSoon', 'Coming Soon!'),
      tooltipPlacement: 'top',
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VGREventsSubsection>) => {
    if (subsection !== option.id) {
      // trackEvent({
      //   category: TrackCategory.Analysis,
      //   action: `Click on ${option.id} activity graph`,
      // })
      dispatchQueryParams({ vGREventsSubsection: option.id })
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

export default VesselGroupReportEventsSubsectionSelector
