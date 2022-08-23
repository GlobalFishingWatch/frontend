import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { Anchorage } from '@globalfishingwatch/api-types'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectPsmaEarliestDateById } from 'features/psma/psma.selectors'
import { useI18nDate } from 'features/i18n/i18nDate'
import { PORT_CONFIDENCE } from 'data/constants'
import Faq from 'features/profile/components/Faq'
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
  const psmaDate = useSelector(
    selectPsmaEarliestDateById(event.port_visit?.intermediateAnchorage.flag ?? '')
  )
  const psmaDateFormatted = useI18nDate(psmaDate ?? 0, DateTime.DATE_FULL)

  const psmaDescription = useMemo(
    () =>
      psmaDate
        ? t('event.psmaIncluded', 'Included Since {{value}}', {
          value: psmaDateFormatted,
        })
        : t('event.psmaNotIncluded', 'Not included'),
    [psmaDate, psmaDateFormatted, t]
  )

  return (
    <Fragment>
      <ActivityModalContentDetails event={event} />
      <div className={styles.row}>
        <ActivityModalContentField label={t('event.disabledDistance', 'Disabled distance')} value={t('event.formatDistanceKm', '{{value}} km', {
          value: event.gap.distanceKm?.toFixed(2),
        })} />
        <ActivityModalContentField label={t('event.avgSpeed', 'Avg Speed')} value={t('event.formatSpeedKnots', '{{value}} knots', {
          value: event.gap.impliedSpeedKnots?.toFixed(2),
        })} />
      </div>
      <ActivityModalContentField label={t('event.regionsInvolved', 'Regions involved')} value={event.description} />

    </Fragment>
  )
}

export default ActivityModalContentDetailsGap
