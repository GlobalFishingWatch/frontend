import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { useSelector } from 'react-redux'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectFetchVesselGroupReportCoverageParams } from '../vessel-group-report.selectors'
import styles from './VGRInsights.module.css'
import VesselGroupReportInsightCoverageGraph from './VGRInsightCoverageGraph'

const VesselGroupReportInsightCoveragePlaceholder = () => {
  // TODO graph bar placeholder
  return <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
}

const VesselGroupReportInsightCoverage = () => {
  const { t } = useTranslation()
  const fetchParams = useSelector(selectFetchVesselGroupReportCoverageParams)
  const { data, error, isLoading } = useGetVesselGroupInsightQuery(fetchParams)

  return (
    <div id="vessel-group-coverage" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label className="experimental">{t('vessel.insights.coverage', 'AIS Coverage')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.coverage', 'AIS Coverage')}
          terminologyKey="insightsCoverage"
        />
      </div>
      {isLoading ? (
        <VesselGroupReportInsightCoveragePlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : data?.coverage && data?.coverage?.length > 0 ? (
        <VesselGroupReportInsightCoverageGraph data={data.coverage} />
      ) : null}
    </div>
  )
}

export default VesselGroupReportInsightCoverage
