import { useTranslation } from 'react-i18next'

import { Tooltip } from '@globalfishingwatch/ui-components'

import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import { useInsightCoverage } from './useInsightCoverage'

import styles from './Insights.module.css'

const InsightCoverage = () => {
  const { t } = useTranslation()
  const { coverage, isLoading, hasError, portEventsActive } = useInsightCoverage()

  return (
    <div id="coverage" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <Tooltip content={t((t) => t.common.experimentalTooltip)}>
          <label className="experimental">{t((t) => t.vessel.insights.coverage)}</label>
        </Tooltip>
        <DataTerminology
          title={t((t) => t.vessel.insights.coverage)}
          terminologyKey="insightsCoverage"
        />
      </div>

      {!portEventsActive ? (
        <div className={styles.noData}>{t((t) => t.vessel.noPortVisitsVisible)}</div>
      ) : isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : hasError ? (
        <InsightError error={{ name: 'Error', message: t((t) => t.errors.vesselLoading) } as any} />
      ) : coverage !== undefined ? (
        <div className={styles.coverageBar}>
          <div className={styles.coverageIndicator} style={{ left: `${Math.round(coverage)}%` }}>
            <span className={styles.coverageLabel}>{Math.round(coverage)}%</span>
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
