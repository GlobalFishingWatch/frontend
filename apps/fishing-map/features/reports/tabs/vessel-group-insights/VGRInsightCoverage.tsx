import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'

import { ReportBarGraphPlaceholder } from 'features/reports/shared/placeholders/ReportBarGraphPlaceholder'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'

import { selectFetchVesselGroupReportCoverageParams } from '../../report-vessel-group/vessel-group-report.selectors'

import VesselGroupReportInsightCoverageGraph from './VGRInsightCoverageGraph'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsightCoverage = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const fetchParams = useSelector(selectFetchVesselGroupReportCoverageParams)
  const { data, error, isLoading } = useGetVesselGroupInsightQuery(fetchParams, { skip })

  return (
    <div id="vessel-group-coverage" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label className="experimental">{t('vessel.insights.coverage', 'AIS Coverage')}</label>
        <DataTerminology
          title={t('vessel.insights.coverage', 'AIS Coverage')}
          terminologyKey="insightsCoverage"
        />
      </div>
      {skip || isLoading ? (
        <ReportBarGraphPlaceholder numberOfElements={5} />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : data?.coverage && data?.coverage?.length > 0 ? (
        <VesselGroupReportInsightCoverageGraph data={data.coverage} />
      ) : null}
    </div>
  )
}

export default VesselGroupReportInsightCoverage
