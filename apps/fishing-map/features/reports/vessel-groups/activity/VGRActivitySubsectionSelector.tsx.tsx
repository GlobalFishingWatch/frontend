import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { VGRActivitySubsection } from 'features/vessel-groups/vessel-groups.types'
import { selectVGRActivitySubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { useReportFeaturesLoading } from 'features/reports/activity/reports-activity-timeseries.hooks'

function VGRActivitySubsectionSelector() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const subsection = useSelector(selectVGRActivitySubsection)
  const loading = useReportFeaturesLoading()
  const options: ChoiceOption<VGRActivitySubsection>[] = [
    {
      id: 'fishing-effort',
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
      // trackEvent({
      //   category: TrackCategory.Analysis,
      //   action: `Click on ${option.id} activity graph`,
      // })
      dispatchQueryParams({ vGRActivitySubsection: option.id })
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

export default VGRActivitySubsectionSelector
