import React, { Fragment, useMemo } from 'react'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { EventTypes } from '@globalfishingwatch/api-types'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import I18nDate from 'features/i18n/i18nDate'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import ActivityModalContentDetailsFishing from './ActivityModalContentDetailsFishing'
import ActivityModalContentDetailsLoitering from './ActivityModalContentDetailsLoitering'
import styles from './ActivityModalDetails.module.css'
import ActivityModalContentDetailsEncounter from './ActivityModalContentDetailsEncounter'
import ActivityModalContentField from './ActivityModalContentField'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  const detailsPerType = useMemo(() => {
    switch (event.type) {
      case EventTypes.Fishing:
        return (
          <ActivityModalContentDetailsFishing event={event}></ActivityModalContentDetailsFishing>
        )
      case EventTypes.Loitering:
        return (
          <ActivityModalContentDetailsLoitering
            event={event}
          ></ActivityModalContentDetailsLoitering>
        )
      case EventTypes.Encounter:
        return (
          <ActivityModalContentDetailsEncounter
            event={event}
          ></ActivityModalContentDetailsEncounter>
        )
      default:
        return <Fragment />
    }
  }, [event])

  return (
    <Fragment>
      <div className={styles.modalContainer}>
        <ActivityModalContentField
          label={t('event.start', 'Start date')}
          value={<I18nDate date={event.start} format={DateTime.DATETIME_FULL} />}
        />
        <ActivityModalContentField
          label={t('event.end', 'End date')}
          value={<I18nDate date={event.end} format={DateTime.DATETIME_FULL} />}
        />
        <ActivityModalContentField
          label={t('event.avgDuration', 'Avg Duration')}
          value={event.durationDescription}
        />
        <div className={styles.break} />
        <ActivityModalContentField
          label={t('event.startDistanceShore', 'Start distance from shore')}
          value={
            event.distances?.startDistanceFromShoreKm
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.distances?.startDistanceFromShoreKm?.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
        <ActivityModalContentField
          label={t('event.endDistanceShore', 'End distance from shore')}
          value={
            event.distances?.endDistanceFromShoreKm
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.distances?.endDistanceFromShoreKm?.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
        <ActivityModalContentField
          label={t('event.startDistancePort', 'Start distance from port')}
          value={
            event.distances?.startDistanceFromPortKm
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.distances?.startDistanceFromPortKm?.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
        <ActivityModalContentField
          label={t('event.endDistancePort', 'End distance from port')}
          value={
            event.distances?.endDistanceFromPortKm
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.distances?.endDistanceFromPortKm?.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
        {detailsPerType}
      </div>
    </Fragment>
  )
}

export default ActivityModalContent
