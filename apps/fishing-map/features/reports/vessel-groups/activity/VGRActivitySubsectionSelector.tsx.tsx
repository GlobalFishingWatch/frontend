import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useFitAreaInViewport } from 'features/reports/areas/area-reports.hooks'
import { resetReportData } from 'features/reports/shared/activity/reports-activity.slice'
import { useReportFeaturesLoading } from 'features/reports/shared/activity/reports-activity-timeseries.hooks'
import { selectVGRActivitySubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import type { VGRActivitySubsection } from 'features/vessel-groups/vessel-groups.types'
import { useLocationConnect } from 'routes/routes.hook'

function VGRActivitySubsectionSelector() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const subsection = useSelector(selectVGRActivitySubsection)
  const loading = useReportFeaturesLoading()
  const fitAreaInViewport = useFitAreaInViewport()
  const options: ChoiceOption<VGRActivitySubsection>[] = [
    {
      id: 'fishing',
      label: t('common.apparentFishing', 'Apparent fishing effort'),
      disabled: loading,
    },
    {
      id: 'presence',
      label: t('common.vesselPresence', 'Vessel presence'),
      disabled: loading,
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VGRActivitySubsection>) => {
    if (subsection !== option.id) {
      dispatchQueryParams({ vGRActivitySubsection: option.id })
      fitAreaInViewport()
      dispatch(resetReportData())
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `vessel_group_profile_activity_tab_toggle_${option.id}`,
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

export default VGRActivitySubsectionSelector
