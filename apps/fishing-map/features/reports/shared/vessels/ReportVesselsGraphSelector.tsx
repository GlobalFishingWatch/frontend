import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'features/reports/reports.config'
import {
  selectReportCategory,
  selectReportSubCategory,
  selectReportVesselGraph,
} from 'features/reports/reports.selectors'
import type { ReportVesselGraph, ReportVesselsSubCategory } from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { useLocationConnect } from 'routes/routes.hook'

import styles from './ReportVesselsGraph.module.css'

function ReportVesselsGraphSelector({ loading }: { loading?: boolean }) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const { dispatchQueryParams } = useLocationConnect()
  const selectedOptionId = useSelector(selectReportVesselGraph)
  const options: ChoiceOption<ReportVesselGraph | ReportVesselsSubCategory>[] = [
    {
      id: REPORT_VESSELS_GRAPH_FLAG,
      label: t('analysis.groupByFlag'),
      disabled: loading,
    },
    ...(reportSubCategory !== 'fishing'
      ? [
          {
            id: REPORT_VESSELS_GRAPH_VESSELTYPE,
            label: t('analysis.groupByVesseltype'),
            disabled: loading,
          },
        ]
      : []),
    ...(reportCategory !== ReportCategory.Events
      ? [
          {
            id: REPORT_VESSELS_GRAPH_GEARTYPE,
            label: t('analysis.groupByGeartype'),
            disabled: loading,
          },
        ]
      : []),
    ...(reportCategory === ReportCategory.VesselGroup
      ? [
          {
            id: 'source' as ReportVesselsSubCategory,
            label: (
              <span>
                {t('analysis.groupBySource')}
                {selectedOptionId === 'source' && (
                  <DataTerminology
                    size="tiny"
                    type="default"
                    title={t('vesselGroupReport.sources')}
                    terminologyKey="sources"
                    className={styles.dataTerminology}
                  />
                )}
              </span>
            ),
            disabled: loading,
          },
          {
            id: 'coverage' as ReportVesselsSubCategory,
            label: (
              <span>
                {t('analysis.groupByCoverage')}
                {selectedOptionId === 'coverage' && (
                  <DataTerminology
                    size="tiny"
                    type="default"
                    title={
                      <span>
                        {t('vessel.insights.coverage')}
                        <span className={styles.experimental}>(Experimental)</span>
                      </span>
                    }
                    terminologyKey="insightsCoverage"
                    tooltip={t('common.experimental')}
                    className={cx(styles.dataTerminology, styles.experimental)}
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

export default ReportVesselsGraphSelector
