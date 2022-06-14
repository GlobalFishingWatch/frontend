import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@globalfishingwatch/ui-components'
import useRisk from 'features/risk/risk.hook'
import styles from './risk-title.module.css'

export function RiskTitle() {
  const { t } = useTranslation()
  const { countByRiskLevel } = useRisk()

  console.log(countByRiskLevel)
  return (
    <div className={styles['container']}>
      {t('common.riskSummary', 'Risk Summary').toLocaleUpperCase()}
      {countByRiskLevel.high > 0 && (
        <Fragment>
          <span className={styles.high}>
            <Icon icon="warning" />
          </span>
          <span className={styles.count}>{countByRiskLevel.high}</span>
        </Fragment>
      )}
      {countByRiskLevel.medium > 0 && (
        <Fragment>
          <span className={styles.medium}>
            <Icon icon="visibility-on" />
          </span>
          <span className={styles.count}>{countByRiskLevel.medium}</span>
        </Fragment>
      )}
    </div>
  )
}

export default RiskTitle
