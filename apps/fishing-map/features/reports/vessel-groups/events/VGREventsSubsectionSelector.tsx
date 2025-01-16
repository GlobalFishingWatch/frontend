import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGREventsSubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectVGRStatus } from 'features/reports/vessel-groups/vessel-group-report.slice'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import type { VGREventsSubsection } from 'features/vessel-groups/vessel-groups.types'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

function VesselGroupReportEventsSubsectionSelector() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const subsection = useSelector(selectVGREventsSubsection)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading
  const gfwUser = useSelector(selectIsGFWUser)
  const jacUser = useSelector(selectIsJACUser)
  const hasAccessToAllSubsections = gfwUser || jacUser
  const options: ChoiceOption<VGREventsSubsection>[] = [
    {
      id: 'encounter',
      label: t('event.encountersShort', 'Encounters'),
      disabled: loading,
    },
    {
      id: 'loitering',
      label: t('event.loitering_other', 'Loitering events'),
      disabled: !hasAccessToAllSubsections,
      tooltip: !hasAccessToAllSubsections ? t('common.comingSoon', 'Coming Soon!') : '',
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
      disabled: !hasAccessToAllSubsections,
      tooltip: !hasAccessToAllSubsections ? t('common.comingSoon', 'Coming Soon!') : '',
      tooltipPlacement: 'top',
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VGREventsSubsection>) => {
    if (subsection !== option.id) {
      dispatchQueryParams({ vGREventsSubsection: option.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `vessel_group_profile_events_tab_${option.id}_graph`,
      })
    }
  }

  const selectedOption = subsection ? options.find((o) => o.id === subsection) : options[0]

  return (
    <Choice
      size="small"
      options={options}
      activeOption={selectedOption?.id}
      onSelect={onSelectSubsection}
    />
  )
}

export default VesselGroupReportEventsSubsectionSelector
