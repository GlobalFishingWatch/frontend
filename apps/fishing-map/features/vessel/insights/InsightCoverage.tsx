import { useTranslation } from 'react-i18next'
import { InsightCoverageResponse, InsightErrorResponse } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import styles from './Insights.module.css'

const InsightCoverage = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightCoverageResponse
  isLoading: boolean
  error: InsightErrorResponse
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.coverage', 'AIS Coverage')}</label>
      {isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : insightData?.coverage.percentage ? (
        <div className={styles.coverageBar}>
          <div
            className={styles.coverageIndicator}
            style={{ left: `${Math.round(insightData.coverage.percentage)}%` }}
          >
            <span className={styles.coverageLabel}>
              {Math.round(insightData.coverage.percentage)}%
            </span>
            <span className={styles.coverageDot} />
          </div>
        </div>
      ) : (
        EMPTY_FIELD_PLACEHOLDER
      )}
    </div>
  )
}

export default InsightCoverage
