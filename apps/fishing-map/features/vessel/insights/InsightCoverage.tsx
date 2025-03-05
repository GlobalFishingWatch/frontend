import { useTranslation } from 'react-i18next'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightResponse } from '@globalfishingwatch/api-types'

import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import styles from './Insights.module.css'

const InsightCoverage = ({
  insightData,
  isLoading,
  error,
}: {
  insightData?: InsightResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  return (
    <div id="coverage" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label className="experimental">{t('vessel.insights.coverage', 'AIS Coverage')}</label>
        <DataTerminology
          title={t('vessel.insights.coverage', 'AIS Coverage')}
          terminologyKey="insightsCoverage"
        />
      </div>
      {isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : insightData?.coverage?.percentage ? (
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
