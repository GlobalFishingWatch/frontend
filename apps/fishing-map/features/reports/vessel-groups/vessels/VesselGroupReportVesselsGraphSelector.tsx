import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVGRStatus } from 'features/reports/vessel-groups/vessel-group-report.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { VGRVesselsSubsection } from 'features/vessel-groups/vessel-groups.types'
import { selectVGRVesselsSubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'

type VesselGroupReportVesselsGraphSelectorProps = {}

function VesselGroupReportVesselsGraphSelector(props: VesselGroupReportVesselsGraphSelectorProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const subsection = useSelector(selectVGRVesselsSubsection)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading
  const options: ChoiceOption<VGRVesselsSubsection>[] = [
    {
      id: 'flag',
      label: t('vessel.flag', 'Flag'),
      disabled: loading,
    },
    {
      id: 'shiptypes',
      label: t('vessel.shiptype', 'Vessel type'),
      disabled: loading,
    },
    {
      id: 'geartypes',
      label: t('vessel.geartype', 'Gear type'),
      disabled: loading,
    },
    {
      id: 'source',
      label: t('common.sources', 'Sources'),
      disabled: loading,
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<VGRVesselsSubsection>) => {
    if (subsection !== option.id) {
      // trackEvent({
      //   category: TrackCategory.Analysis,
      //   action: `Click on ${option.id} activity graph`,
      // })
      dispatchQueryParams({ vGRVesselsSubsection: option.id })
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
