import { useTranslation } from 'react-i18next'
import styles from './Insights.module.css'
import { InsightGapsResponse } from './insights.types'

const InsightGaps = ({
  insightData,
  isLoading,
}: {
  insightData: InsightGapsResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.gaps', 'AIS Off Events')}</label>
      {isLoading || !insightData ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : (
        <div>
          {insightData.gap.aisOff.length !== 0 ? (
            <p>
              {t('vessel.insights.gapsEvents', {
                count: insightData.gap.aisOff.length,
                defaultValue: '{{count}} AIS Off events detected',
              })}
            </p>
          ) : (
            <p className={styles.secondary}>
              {t('vessel.insights.gapsEventsEmpty', 'No AIS Off events detected')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default InsightGaps
