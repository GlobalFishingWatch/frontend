import { useTranslation } from 'react-i18next'
import { InsightCoverageResponse } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import styles from './Insights.module.css'

const InsightCoverage = ({
  insightData,
  isLoading,
}: {
  insightData: InsightCoverageResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.coverage', 'AIS Coverage')}</label>
      {isLoading || !insightData ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : insightData.coverage.percentage ? (
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
