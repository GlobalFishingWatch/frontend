import { useTranslation } from 'react-i18next'
import { InsightErrorResponse, InsightGapsResponse } from '@globalfishingwatch/api-types'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import styles from './Insights.module.css'

const InsightGaps = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightGapsResponse
  isLoading: boolean
  error: InsightErrorResponse
}) => {
  const { t } = useTranslation()
  const { aisOff } = insightData?.gap || {}
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.gaps', 'AIS Off Events')}</label>
      {isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          {aisOff?.length !== 0 ? (
            <p>
              {t('vessel.insights.gapsEvents', {
                count: aisOff?.length,
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
