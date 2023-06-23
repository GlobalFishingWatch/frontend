import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  getEventRegionDescription,
  RenderedEvent,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import ActivityModalContentField from './ActivityModalContentField'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContentDetailsGap: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const eezs = useSelector(selectEEZs)
  const rfmos = useSelector(selectRFMOs)
  const mpas = useSelector(selectMPAs)

  const { onRegions, offRegions } = useMemo(() => {
    return {
      onRegions: getEventRegionDescription(event.gap.onPosition, eezs, rfmos, mpas),
      offRegions: getEventRegionDescription(event.gap.offPosition, eezs, rfmos, mpas),
    }
  }, [event, eezs, rfmos, mpas])

  return (
    <Fragment>
      <ActivityModalContentDetails
        event={event}
        startLabel={t('event.gapStart', 'Start of “off” event') as string}
        endLabel={t('event.gapEnd', 'End of “off” event') as string}
      />
      <div className={styles.row}>
        <ActivityModalContentField
          label={t('event.disabledDistance', 'Distance between transmissions')}
          value={t('event.formatDistanceKm', '{{value}} km', {
            value: event.gap.distanceKm?.toFixed(2),
          })}
        />
        <ActivityModalContentField
          label={t('event.avgEstSpeed', 'Avg est speed')}
          value={t('event.formatSpeedKnots', '{{value}} knots', {
            value: event.gap.impliedSpeedKnots?.toFixed(2),
          })}
        />
      </div>
      <ActivityModalContentField
        label={t('event.regionsTransmissionOffInvolved', 'location of “off” event')}
        value={offRegions && offRegions !== '' ? offRegions : t('common.unknown')}
      />
      <ActivityModalContentField
        label={t('event.regionsTransmissionOnInvolved', 'location of "on" event')}
        value={onRegions && onRegions !== '' ? onRegions : t('common.unknown')}
      />
    </Fragment>
  )
}

export default ActivityModalContentDetailsGap
