import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { ActivityEvent } from 'types/activity'
import useActivityEventConnect from '../event/event.hook'
import ActivityContentDetails from './ActivityContentDetails'
import ActivityContentField from './ActivityContentField'
import styles from './ActivityDetails.module.css'

interface ActivityContentProps {
  event: ActivityEvent
}

const ActivityContentDetailsGap: React.FC<ActivityContentProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const { getEventRegionDescription } = useActivityEventConnect()

  const { onRegions, offRegions } = useMemo(() => {
    return {
      onRegions: event.gap?.onPosition ? getEventRegionDescription(event.gap?.onPosition) : null,
      offRegions: event.gap?.offPosition ? getEventRegionDescription(event.gap.offPosition) : null,
    }
  }, [event])

  return (
    <Fragment>
      <ActivityContentDetails
        event={event}
        startLabel={t('event.gapStart', 'Start of “off” event') as string}
        endLabel={t('event.gapEnd', 'End of “off” event') as string}
      />
      <div className={styles.row}>
        <ActivityContentField
          label={t('event.disabledDistance', 'Distance between transmissions')}
          value={t('event.formatDistanceKm', '{{value}} km', {
            value: event.gap?.distanceKm?.toFixed(2),
          })}
        />
        <ActivityContentField
          label={t('event.avgEstSpeed', 'Avg est speed')}
          value={t('event.formatSpeedKnots', '{{value}} knots', {
            value: event.gap?.impliedSpeedKnots?.toFixed(2),
          })}
        />
      </div>
      <ActivityContentField
        label={t('event.regionsTransmissionOffInvolved', 'location of “off” event')}
        value={offRegions && offRegions !== '' ? offRegions : t('common.unknown')}
      />
      <ActivityContentField
        label={t('event.regionsTransmissionOnInvolved', 'location of "on" event')}
        value={onRegions && onRegions !== '' ? onRegions : t('common.unknown')}
      />
    </Fragment>
  )
}

export default ActivityContentDetailsGap
