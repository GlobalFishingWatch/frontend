import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { InsightErrorResponse, InsightFishingResponse } from '@globalfishingwatch/api-types'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import styles from './Insights.module.css'

const InsightFishing = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightFishingResponse
  isLoading: boolean
  error: InsightErrorResponse
}) => {
  const { t } = useTranslation()
  const { eventsInNoTakeMpas, eventsInRfmoWithoutKnownAuthorization } =
    insightData?.apparentFishing || {}
  return (
    <div className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.fishing', 'Fishing Events')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.fishing', 'Fishing Events')}
          terminologyKey="insightsFishing"
        />
      </div>
      {isLoading ? (
        <Fragment>
          <div style={{ width: '30rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          {eventsInNoTakeMpas?.length !== 0 ? (
            <p>
              {t('vessel.insights.fishingEventsInNoTakeMpas', {
                count: eventsInNoTakeMpas?.length,
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
          {eventsInRfmoWithoutKnownAuthorization?.length !== 0 ? (
            <p>
              {t('vessel.insights.fishingEventsInRfmoWithoutKnownAuthorization', {
                count: eventsInRfmoWithoutKnownAuthorization?.length,
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
