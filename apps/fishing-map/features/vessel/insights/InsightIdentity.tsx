import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import styles from './Insights.module.css'
import { InsightIdentityResponse } from './insights.types'

const InsightIdentity = ({
  insightData,
  isLoading,
}: {
  insightData: InsightIdentityResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.identity', 'Identity')}</label>
      {isLoading || !insightData ? (
        <Fragment>
          <div style={{ width: '60rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '10rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : (
        <div>
          <p>
            {insightData.vesselIdentity.mouList.tokyo.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.identityMOUTokyoListsCount', {
                  flags: insightData.vesselIdentity.mouList.tokyo.valuesInThePeriod.join(', '),
                  defaultValue: 'Flag present on the Tokyo MOU black or grey list ({{flags}})',
                })}
              </span>
            ) : insightData.vesselIdentity.mouList.paris.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.identityMOUParisListsCount', {
                  flags: insightData.vesselIdentity.mouList.paris.valuesInThePeriod.join(', '),
                  defaultValue: 'Flag present on the Paris MOU black or grey list ({{flags}})',
                })}
              </span>
            ) : (
              <span className={styles.secondary}>
                {t(
                  'vessel.insights.identityMOUListsEmpty',
                  'Flying under a flag/flags not present on the Tokio or Paris MOU black or grey lists'
                )}
              </span>
            )}
          </p>

          {insightData.vesselIdentity.mouList.tokyo.totalTimesListed !== 0 && (
            <p>
              {t(
                'vessel.insights.identityMOUTokyoListsPreviousAppearance',
                'Previously flew under a flag on the Tokyo MOU black or grey list'
              )}
            </p>
          )}

          {insightData.vesselIdentity.mouList.paris.totalTimesListed !== 0 && (
            <p>
              {t(
                'vessel.insights.identityMOUParisListsPreviousAppearance',
                'Previously flew under a flag on the Paris MOU black or grey list'
              )}
            </p>
          )}

          <p>
            {insightData.vesselIdentity.flagsChanges.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.identityFlagChangesEmpty', {
                  count: insightData.vesselIdentity.flagsChanges.valuesInThePeriod.length,
                  defaultValue: '{{count}} flag changes',
                })}
              </span>
            ) : (
              <span className={styles.secondary}>
                {t('vessel.insights.identityFlagChangesEmpty', 'No flag changes')}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default InsightIdentity
