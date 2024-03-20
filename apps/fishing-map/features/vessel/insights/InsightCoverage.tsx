import { useTranslation } from 'react-i18next'
import styles from './Insights.module.css'
import { InsightCoverageResponse } from './insights.types'

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
      ) : (
        <div className={styles.coverageBar}>
          <div
            className={styles.coverageIndicator}
            style={{ left: `${insightData.coverage.percentage * 100}%` }}
          >
            <span className={styles.coverageLabel}>
              {(insightData.coverage.percentage * 100).toFixed()}%
            </span>
            <span className={styles.coverageDot} />
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightCoverage
