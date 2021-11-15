import React, { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { redirect } from 'redux-first-router'
import { EventVessel } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { PROFILE } from 'routes/routes'
import { useSearchConnect } from 'features/search/search.hooks'
import ActivityModalContentField from './ActivityModalContentField'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContentDetailsEncounter: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const relatedVessel = event.encounter?.vessel as EventVessel
  const { t } = useTranslation()
  const { findVessel } = useSearchConnect()
  const dispatch = useDispatch()
  const [profileLoading, setProfileLoading] = useState(false)

  const openVesselProfile = useCallback(
    async (vessel) => {
      setProfileLoading(true)
      let dataset = 'public-global-fishing-vessels:v20201001'
      let vesselMatchId = null
      const vesselFound = await findVessel(vessel.id, vessel.name, vessel.flag, vessel.ssvid)
      if (vesselFound) {
        dataset = vesselFound.dataset
        vesselMatchId = vesselFound.vesselMatchId
      } else {
        if (vessel.type === 'carrier') {
          dataset = 'public-global-carrier-vessels:v20201001'
        } else if (vessel.type === 'support') {
          dataset = 'public-global-support-vessels:v20201001'
        } else if (vessel.type === 'other') {
          dataset = 'private-global-other-vessels:v20201001'
        }
      }
      setProfileLoading(false)
      dispatch(
        redirect({
          type: PROFILE,
          payload: {
            dataset: dataset,
            vesselID: vessel.id ?? 'NA',
            tmtID: vesselMatchId ?? 'NA',
          },
        })
      )
    },
    [dispatch, findVessel]
  )

  const onEncounterClick = useCallback(() => {
    openVesselProfile(event.encounter?.vessel)
  }, [openVesselProfile, event])

  return (
    <Fragment>
      {relatedVessel && (
        <div className={styles.row}>
          <ActivityModalContentField
            label={t('vessel.encounteredVessel', 'Encountered Vessel')}
            value={
              <span>
                {relatedVessel.name}{' '}
                {profileLoading && <Spinner size="tiny" className={styles.profileLoader}></Spinner>}
              </span>
            }
            onValueClick={() => onEncounterClick()}
          />
          <ActivityModalContentField label={t('vessel.flag', 'Flag')} value={relatedVessel.flag} />
          <ActivityModalContentField label={t('vessel.mmsi', 'Mmsi')} value={relatedVessel.ssvid} />
          <ActivityModalContentField
            label={t('vessel.type', 'Vessel Type')}
            value={relatedVessel.type}
          />
        </div>
      )}

      <ActivityModalContentDetails event={event} />

      {event.encounter && (
        <ActivityModalContentField
          label={t('event.medianSpeed', 'Median Speed')}
          value={
            event.encounter.medianSpeedKnots
              ? t('event.formatSpeedKnots', '{{value}} knots', {
                  value: event.encounter.medianSpeedKnots.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
      )}
    </Fragment>
  )
}

export default ActivityModalContentDetailsEncounter
