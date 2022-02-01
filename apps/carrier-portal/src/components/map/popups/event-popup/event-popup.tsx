import React, { useCallback, useEffect } from 'react'
import { event as uaEvent } from 'react-ga'
import { CountryFlag } from '@globalfishingwatch/ui-components'
import { formatUTCDate } from 'utils'
import { getAuthorizationsByVesselType } from 'utils/events'
import { Event } from 'types/api/models'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import styles from '../popups.module.css'
import AuthorizationsList from './authorizations-list/authorizations-list'

interface EventPopupProps {
  event: Event | undefined
  onClick: (type: 'carrier' | 'vessel' | 'event') => void
  goToVesselDetail: typeof updateQueryParams
}

const EventPopup: React.FC<EventPopupProps> = (props) => {
  const { event, onClick, goToVesselDetail } = props

  useEffect(() => {
    if (event) {
      uaEvent({
        category: event.type === 'encounter' ? 'CVP - Encounters' : 'CVP - Loitering',
        action:
          event.type === 'encounter' ? 'Click in one encounter' : 'Click in one loitering event',
        label:
          event.type === 'encounter' ? event.encounter?.authorizationStatus : event.vessel.flag,
      })
    }
  }, [event])

  const handleClick = useCallback(
    (type: 'carrier' | 'vessel' | 'event') => {
      if (event) {
        if (type === 'carrier' || type === 'event') {
          goToVesselDetail({
            vessel: event.vessel.id,
            ...(type === 'event' && { timestamp: event.start }),
          })
        } else if (type === 'vessel' && event.encounter) {
          goToVesselDetail({
            vessel: event.encounter.vessel.id,
          })
        }
        uaEvent({
          category: event.type === 'encounter' ? 'CVP - Encounters' : 'CVP - Loitering',
          action:
            event.type === 'encounter'
              ? 'Click in MORE INFO in one encounter'
              : 'Click in MORE INFO in one loitering event',
          label:
            event.type === 'encounter' ? event.encounter?.authorizationStatus : event.vessel.flag,
        })
      }
      onClick(type)
    },
    [event, goToVesselDetail, onClick]
  )

  if (!event) return null

  const carrierAuthorizations = getAuthorizationsByVesselType(event, 'carrier')
  const encounterAuthorizations = getAuthorizationsByVesselType(event, 'fishing')
  const carrierLabel = event.vessel.name || event.vessel.ssvid || null
  const encounterLabel = event.encounter?.vessel.name || event.encounter?.vessel.ssvid || null

  return (
    <div className={styles.popup}>
      <div className={styles.infoFieldContainer}>
        <div className={styles.infoField}>
          <label>Carrier</label>
          <button className={styles.infoFieldButton} onClick={() => handleClick('carrier')}>
            {event.vessel.flag && event.vessel.flag !== 'null' && (
              <CountryFlag iso={event.vessel.flag} />
            )}
            {carrierLabel}
          </button>
        </div>
        {event.type === 'encounter' && carrierAuthorizations && (
          <div className={styles.infoField}>
            <label>Authorization</label>
            <AuthorizationsList authorizationsList={carrierAuthorizations} />
          </div>
        )}
      </div>

      {event.encounter && encounterLabel && encounterLabel !== 'null' && (
        <div className={styles.infoFieldContainer}>
          <div className={styles.infoField}>
            <label>Donor Vessel</label>
            <button className={styles.infoFieldButton} onClick={() => handleClick('vessel')}>
              {event.encounter.vessel.flag && event.encounter.vessel.flag !== 'null' && (
                <CountryFlag iso={event.encounter.vessel.flag} />
              )}
              {encounterLabel}
            </button>
          </div>
          {event.type === 'encounter' && encounterAuthorizations && (
            <div className={styles.infoField}>
              <label>Authorization</label>
              {encounterAuthorizations.length ? (
                <AuthorizationsList authorizationsList={encounterAuthorizations} />
              ) : (
                '-'
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.infoFieldContainer}>
        <div className={styles.infoField}>
          <label>Date</label>
          <span>{formatUTCDate(event.start)}</span>
        </div>
      </div>
      <button className={styles.button} onClick={() => handleClick('event')}>
        More info
      </button>
    </div>
  )
}

export default EventPopup
