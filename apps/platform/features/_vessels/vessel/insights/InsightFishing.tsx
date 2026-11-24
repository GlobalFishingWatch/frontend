import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { EventTypes, type InsightResponse } from '@globalfishingwatch/api-types'

import { useVisibleVesselEvents } from 'features/_map/workspace/vessels/vessel-events.hooks'
import InsightError from 'features/_vessels/vessel/insights/InsightErrorMessage'
import InsightEventDetails from 'features/_vessels/vessel/insights/InsightEventsDetails'
import { removeNonTunaRFMO } from 'features/_vessels/vessel/insights/insights.utils'
import { selectLonglineSetsOnMap } from 'features/_vessels/vessel/vessel.config.selectors'
import DataTerminology from 'features/cms/data-terminology/DataTerminology'
import { useReplaceQueryParams } from 'router/routes.hook'

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
  const longlineSetsOnMap = useSelector(selectLonglineSetsOnMap)
  const { replaceQueryParams } = useReplaceQueryParams()

  const { setVesselEventVisibility } = useVisibleVesselEvents()
  const { eventsInNoTakeMpas, eventsInRfmoWithoutKnownAuthorization } =
    insightData?.apparentFishing || {}

  // Event details and longline sets on map are mutually exclusive
  const [eventsInNoTakeMpasDetailsVisibility, setEventsInNoTakeMpasDetailsVisibility] =
    useState(false)
  const [eventsInRfmoDetailsVisibility, setEventsInRfmoDetailsVisibility] = useState(false)
  const [prevLonglineSetsOnMap, setPrevLonglineSetsOnMap] = useState(longlineSetsOnMap)
  if (prevLonglineSetsOnMap !== longlineSetsOnMap) {
    setPrevLonglineSetsOnMap(longlineSetsOnMap)
    if (longlineSetsOnMap) {
      setEventsInNoTakeMpasDetailsVisibility(false)
      setEventsInRfmoDetailsVisibility(false)
    }
  }

  const toggleDetails = (visible: boolean, setVisible: (visible: boolean) => void) => {
    setVesselEventVisibility({ event: EventTypes.Fishing, visible: true })
    if (!visible && longlineSetsOnMap) {
      replaceQueryParams({ longlineSetsOnMap: undefined })
    }
    setVisible(!visible)
  }

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
        <label>{t((t) => t.vessel.insights.fishing)}</label>
        <DataTerminology terminologyKey="insightsFishing" />
      </div>
      {isLoading ? (
        <Fragment>
          <div style={{ width: '30rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div className={styles.content}>
          {eventsInNoTakeMpas?.length !== 0 ? (
            <span>
              {t((t) => t.vessel.insights.fishingEventsInNoTakeMpas, {
                count: eventsInNoTakeMpas?.length ?? 0,
              })}
              <InsightEventDetails
                events={eventsInNoTakeMpasDetails}
                visible={eventsInNoTakeMpasDetailsVisibility}
                toggleVisibility={() =>
                  toggleDetails(
                    eventsInNoTakeMpasDetailsVisibility,
                    setEventsInNoTakeMpasDetailsVisibility
                  )
                }
              />
            </span>
          ) : (
            <p className={styles.secondary}>
              {t((t) => t.vessel.insights.fishingEventsInNoTakeMpasEmpty)}
            </p>
          )}
          {eventsInRfmoWithoutKnownAuthorization?.length !== 0 ? (
            <span>
              {t((t) => t.vessel.insights.fishingEventsInRfmoWithoutKnownAuthorization, {
                count: eventsInRfmoWithoutKnownAuthorization?.length ?? 0,
              })}
              <InsightEventDetails
                events={eventsInRfmoWithoutKnownAuthorizationDetails}
                visible={eventsInRfmoDetailsVisibility}
                toggleVisibility={() =>
                  toggleDetails(eventsInRfmoDetailsVisibility, setEventsInRfmoDetailsVisibility)
                }
              />
            </span>
          ) : (
            <p className={styles.secondary}>
              {t((t) => t.vessel.insights.fishingEventsInRfmoWithoutKnownAuthorizationEmpty)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default InsightFishing
