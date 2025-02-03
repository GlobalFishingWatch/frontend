import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRStatus } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { selectReportVesselsSubCategory } from 'features/reports/reports.config.selectors'
import type { ReportVesselsSubCategory } from 'features/reports/reports.types'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './ReportVesselsGraph.module.css'

type VesselGroupReportVesselsGraphSelectorProps = Record<string, any>

function VesselGroupReportVesselsGraphSelector(props: VesselGroupReportVesselsGraphSelectorProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const subsection = useSelector(selectReportVesselsSubCategory)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading
  const options: ChoiceOption<ReportVesselsSubCategory>[] = [
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
      label: (
        <span>
          {t('common.sources', 'Sources')}
          {subsection === 'source' && (
            <DataTerminology
              title={t('vesselGroupReport.sources', 'Vessel group report sources')}
              terminologyKey="sources"
              className={styles.dataTerminology}
            />
          )}
        </span>
      ),
      disabled: loading,
    },
  ]

  const onSelectSubsection = (option: ChoiceOption<ReportVesselsSubCategory>) => {
    if (subsection !== option.id) {
      dispatchQueryParams({ vGRVesselsSubsection: option.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `vessel_group_profile_filter_${option.id}`,
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

export default VesselGroupReportVesselsGraphSelector
