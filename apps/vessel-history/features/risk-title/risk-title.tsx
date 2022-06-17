import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@globalfishingwatch/ui-components'
import { RISK_SUMMARY_SETTINGS } from 'data/config'
import useRisk from 'features/risk/risk.hook'
import styles from './risk-title.module.css'

export function RiskTitle() {
  const { t } = useTranslation()
  const { countByRiskLevel } = useRisk()
  const { showIndicatorIconEventCount } = RISK_SUMMARY_SETTINGS
  return (
    <div className={styles['container']}>
      {t('common.riskSummary', 'Risk Summary').toLocaleUpperCase()}
      {countByRiskLevel.high > 0 && (
        <Fragment>
          <span className={styles.high}>
            <Icon icon="warning" />
          </span>
          {showIndicatorIconEventCount && (
            <span className={styles.count}>{countByRiskLevel.high}</span>
          )}
        </Fragment>
      )}
      {countByRiskLevel.medium > 0 && (
        <Fragment>
          <span className={styles.medium}>
            <Icon icon="visibility-on" />
          </span>
          {showIndicatorIconEventCount && (
            <span className={styles.count}>{countByRiskLevel.medium}</span>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default RiskTitle
