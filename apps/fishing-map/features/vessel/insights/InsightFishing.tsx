import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import styles from './Insights.module.css'
import { InsightFishingResponse } from './insights.types'

const InsightFishing = ({
  insightData,
  isLoading,
}: {
  insightData: InsightFishingResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.fishing', 'Fishing Events')}</label>
      {isLoading || !insightData ? (
        <Fragment>
          <div style={{ width: '30rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : (
        <div>
          {insightData.apparentFishing.eventsInNoTakeMpas.length !== 0 ? (
            <p>
              {t('vessel.insights.fishingEventsInNoTakeMpas', {
                count: insightData.apparentFishing.eventsInNoTakeMpas.length,
                defaultValue: '{{count}} fishing events detected in no-take MPAs',
              })}
            </p>
          ) : (
            <p className={styles.secondary}>
              {t(
                'vessel.insights.noFishingEventsInNoTakeMpasEmpty',
                'No fishing events detected in no-take MPAs'
              )}
            </p>
          )}
          {insightData.apparentFishing.eventsInRfmoWithoutKnownAuthorization.length !== 0 ? (
            <p>
              {t('vessel.insights.fishingEventsInRfmoWithoutKnownAuthorization', {
                count: insightData.apparentFishing.eventsInRfmoWithoutKnownAuthorization.length,
                defaultValue:
                  '{{count}} fishing events detected outside known RFMO authorized areas',
              })}
            </p>
          ) : (
            <p className={styles.secondary}>
              {t(
                'vessel.insights.fishingEventsInRfmoWithoutKnownAuthorizationEmpty',
                'No fishing events detected outside known RFMO authorized areas'
              )}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default InsightFishing
