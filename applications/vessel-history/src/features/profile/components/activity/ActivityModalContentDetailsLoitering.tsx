import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EMPTY_DEFAULT_VALUE } from 'data/config'
import { ActivityEvent } from 'types/activity'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsLoitering: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      <p>
        <span>{t('event.distance', 'Distance')}:</span>{' '}
        {event.loitering?.totalDistanceKilometers
          ? t('event.formatDistanceKm', '{{value}} km', {
              value: event.loitering?.totalDistanceKilometers.toFixed(2),
            })
          : EMPTY_DEFAULT_VALUE}
      </p>
      <p>
        <span>{t('event.medianSpeed', 'Median Speed')}:</span>{' '}
        {event.loitering?.medianSpeedKnots
          ? t('event.formatSpeedKnots', '{{value}} knots', {
              value: event.loitering?.medianSpeedKnots.toFixed(2),
            })
          : EMPTY_DEFAULT_VALUE}
      </p>
      <p>
        <span>{t('event.position', 'Position')}:</span>{' '}
        {`${event.position.lat}, ${event.position.lon}`}
      </p>
    </Fragment>
  )
}

export default ActivityModalContentDetailsLoitering
