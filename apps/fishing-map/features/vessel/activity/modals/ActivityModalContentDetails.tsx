import React, { Fragment, useCallback, useMemo } from 'react'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import I18nDate from 'features/i18n/i18nDate'
import { ActivityEvent } from 'types/activity'
import useActivityEventConnect from '../event/event.hook'
import ActivityModalContentField from './ActivityModalContentField'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
  startLabel?: string
  endLabel?: string
}

const ActivityModalContentDetails: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const { getEventDurationDescription } = useActivityEventConnect()

  const extractDistances = useCallback(
    (start?: number, end?: number) => {
      const distances: string[] = [start, end]
        .filter((distance) => distance)
        .map((distance) => distance?.toFixed(2) ?? (t('common.unknown', 'Unknown') as string))
      return distances.length > 0 ? distances : undefined
    },
    [t]
  )

  const distanceFromShore = useMemo(
    () =>
      extractDistances(
        event.distances?.startDistanceFromShoreKm,
        event.distances?.endDistanceFromShoreKm
      ),
    [extractDistances, event.distances]
  )

  const distanceFromPort = useMemo(
    () =>
      extractDistances(
        event.distances?.startDistanceFromPortKm,
        event.distances?.endDistanceFromPortKm
      ),
    [extractDistances, event.distances]
  )

  return (
    <Fragment>
      <div className={styles.row}>
        <ActivityModalContentField
          label={props.startLabel ? props.startLabel : t('event.start', 'Start')}
          value={<I18nDate date={event.start} format={DateTime.DATETIME_FULL} />}
        />
        {!!event.end && (
          <ActivityModalContentField
            label={props.endLabel ? props.endLabel : t('event.end', 'End')}
            value={<I18nDate date={event.end} format={DateTime.DATETIME_FULL} />}
          />
        )}
        {getEventDurationDescription(event) && (
          <ActivityModalContentField
            label={t('event.duration', 'Duration')}
            value={getEventDurationDescription(event)}
          />
        )}
      </div>
    </Fragment>
  )
}

export default ActivityModalContentDetails
