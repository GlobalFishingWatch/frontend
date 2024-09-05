import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightCoverageGraph from './VesselGroupReportInsightCoverageGraph'

const VesselGroupReportInsightCoveragePlaceholder = () => {
  // TODO graph bar placeholder
  return <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
}

const VesselGroupReportInsightCoverage = ({
  vesselGroupId,
  start,
  end,
}: {
  vesselGroupId: string
  start: string
  end: string
}) => {
  const { t } = useTranslation()
  const { data, error, isLoading } = useGetVesselGroupInsightQuery({
    vesselGroupId: vesselGroupId,
    insight: 'COVERAGE',
    start,
    end,
  })

  return (
    <div id="coverage" className={styles.insightContainer}>
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
