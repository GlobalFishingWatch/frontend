import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRStatus } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import {
  selectReportCategory,
  selectReportSubCategory,
  selectReportVesselGraph,
} from 'features/reports/reports.selectors'
import type { ReportVesselGraph, ReportVesselsSubCategory } from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './ReportVesselsGraph.module.css'

type VesselGroupReportVesselsGraphSelectorProps = Record<string, any>

function VesselGroupReportVesselsGraphSelector(props: VesselGroupReportVesselsGraphSelectorProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const selectedOptionId = useSelector(selectReportVesselGraph)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading
  // TODO:CVP generate this list based on location
  // TODO:CVP use by `analysis.groupByFlag` or this translations?
  const options: ChoiceOption<ReportVesselGraph | ReportVesselsSubCategory>[] = [
    {
      id: 'flag',
      label: t('vessel.flag', 'Flag'),
      disabled: loading,
    },
    ...(reportSubCategory !== 'fishing'
      ? [
          {
            id: 'vesselType' as ReportVesselsSubCategory,
            label: t('vessel.shiptype', 'Vessel type'),
            disabled: loading,
          },
        ]
      : []),
    {
      id: 'geartype',
      label: t('vessel.geartype', 'Gear type'),
      disabled: loading,
    },
    ...(reportCategory === ReportCategory.VesselGroup
      ? [
          {
            id: 'source' as ReportVesselsSubCategory,
            label: (
              <span>
                {t('common.sources', 'Sources')}
                {selectedOptionId === 'source' && (
                  <DataTerminology
                    size="tiny"
                    type="default"
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
      : []),
  ]

  const onSelectSubsection = (
    option: ChoiceOption<ReportVesselGraph | ReportVesselsSubCategory>
  ) => {
    if (selectedOptionId !== option.id) {
      dispatchQueryParams(
        reportCategory === ReportCategory.VesselGroup
          ? { reportVesselsSubCategory: option.id as ReportVesselsSubCategory }
          : { reportVesselGraph: option.id as ReportVesselGraph }
      )
      trackEvent({
        category: TrackCategory.Analysis,
        action: `vessel_report_group_by_${option.id}`,
      })
    }
  }

  const selectedOption = selectedOptionId
    ? options.find((o) => o.id === selectedOptionId)
    : options[0]

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
