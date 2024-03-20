import { useTranslation } from 'react-i18next'
import { InsightIdentityResponse } from '@globalfishingwatch/api-types'
import styles from './Insights.module.css'

const InsightIUU = ({
  insightData,
  isLoading,
}: {
  insightData: InsightIdentityResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.IUU', 'RFMO IUU Blacklist')}</label>
      {isLoading || !insightData ? (
        <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
      ) : (
        <div>
          <p>
            {insightData.vesselIdentity.iuuBlacklist.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.IUUBlackListsCount', {
                  // value: insightData.vesselIdentity.iuuBlacklist.valuesInThePeriod.join(', '),
                  // defaultValue: 'The vessel is present on an RFMO IUU blacklist ({{value}})',
                  defaultValue: 'The vessel is present on an RFMO IUU blacklist',
                })}
              </span>
            ) : (
              <span className={styles.secondary}>
                {t(
                  'vessel.insights.IUUBlackListsEmpty',
                  'The vessel is not present on an RFMO IUU blacklist'
                )}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default InsightIUU
