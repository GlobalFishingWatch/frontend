import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightResponse } from '@globalfishingwatch/api-types'

import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import InsightEventDetails from 'features/vessel/insights/InsightEventsDetails'
import { removeNonTunaRFMO } from 'features/vessel/insights/insights.utils'

import { selectVesselEventsDataWithVoyages } from '../selectors/vessel.resources.selectors'

import styles from './Insights.module.css'

const InsightFishing = ({
  insightData,
  isLoading,
  error,
}: {
  insightData?: InsightResponse
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
      ? (vesselEvents || [])
          .filter((event) => eventsInNoTakeMpas?.includes(event.id))
          .map(removeNonTunaRFMO)
      : []
  }, [eventsInNoTakeMpas, vesselEvents])

  const eventsInRfmoWithoutKnownAuthorizationDetails = useMemo(() => {
    return eventsInRfmoWithoutKnownAuthorization
      ? (vesselEvents || [])
          .filter((event) => eventsInRfmoWithoutKnownAuthorization?.includes(event.id))
          .map(removeNonTunaRFMO)
      : []
  }, [eventsInRfmoWithoutKnownAuthorization, vesselEvents])

  return (
    <div id="fishing" className={styles.insightContainer}>
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
                'vessel.insights.fishingEventsInNoTakeMpasEmpty',
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
