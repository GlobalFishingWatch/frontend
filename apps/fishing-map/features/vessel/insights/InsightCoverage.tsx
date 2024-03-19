import { useTranslation } from 'react-i18next'
import styles from './Insights.module.css'

export type InsightCoverageResponse = {
  period: {
    startDate: string
    endDate: string
  }
  coverage: {
    blocks: number
    blocksWithPositions: number
    percentage: number
    historicalCoverage: {
      blocks: number
      blocksWithPositions: number
      percentage: number
    }
  }
}

const InsightCoverage = ({ insightData }: { insightData: InsightCoverageResponse }) => {
  const { t } = useTranslation()
  if (!insightData) return null
  const percentage = insightData.coverage.percentage * 100
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.coverage', 'AIS Coverage')}</label>
      <div className={styles.coverageBar}>
        <div className={styles.coverageIndicator} style={{ left: `${percentage}%` }}>
          <span className={styles.coverageLabel}>{percentage.toFixed()}%</span>
          <span className={styles.coverageDot} />
        </div>
      </div>
    </div>
  )
}

export default InsightCoverage
