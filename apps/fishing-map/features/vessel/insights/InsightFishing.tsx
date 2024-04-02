import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { InsightFishingResponse } from '@globalfishingwatch/api-types'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightEventDetails from 'features/vessel/insights/InsightEventsDetails'
import { selectVesselEventsDataWithVoyages } from '../vessel.selectors'
import styles from './Insights.module.css'

const InsightFishing = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightFishingResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  const vesselEvents = useSelector(selectVesselEventsDataWithVoyages)
  const { eventsInNoTakeMpas, eventsInRfmoWithoutKnownAuthorization } =
    insightData?.apparentFishing || {}

  const [eventsInNoTakeMpasDetailsVisibility, setEventsInNoTakeMpasDetailsVisibility] =
    useState(false)
  const toggleEventsInNoTakeMpasDetailsVisibility = useCallback(() => {
    setEventsInNoTakeMpasDetailsVisibility(!eventsInNoTakeMpasDetailsVisibility)
  }, [eventsInNoTakeMpasDetailsVisibility])

  const [eventsInRfmoDetailsVisibility, setEventsInRfmoDetailsVisibility] = useState(false)
  const toggleEventsInRfmoDetailsVisibility = useCallback(() => {
    setEventsInRfmoDetailsVisibility(!eventsInRfmoDetailsVisibility)
  }, [eventsInRfmoDetailsVisibility])

  const eventsInNoTakeMpasDetails = useMemo(() => {
    return eventsInNoTakeMpas
      ? (vesselEvents || []).filter((event) => eventsInNoTakeMpas?.includes(event.id))
      : []
  }, [eventsInNoTakeMpas, vesselEvents])

  const eventsInRfmoWithoutKnownAuthorizationDetails = useMemo(() => {
    return eventsInNoTakeMpas
      ? (vesselEvents || []).filter((event) => eventsInNoTakeMpas?.includes(event.id))
      : []
  }, [eventsInNoTakeMpas, vesselEvents])

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
              <InsightEventDetails
                events={eventsInNoTakeMpasDetails}
                visible={eventsInNoTakeMpasDetailsVisibility}
                toggleVisibility={toggleEventsInNoTakeMpasDetailsVisibility}
              />
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
              <InsightEventDetails
                events={eventsInRfmoWithoutKnownAuthorizationDetails}
                visible={eventsInRfmoDetailsVisibility}
                toggleVisibility={toggleEventsInRfmoDetailsVisibility}
              />
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
