import React, { Fragment, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { Anchorage } from '@globalfishingwatch/api-types'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectPsmaEarliestDateById } from 'features/psma/psma.selectors'
import { useI18nDate } from 'features/i18n/i18nDate'
import { PORT_CONFIDENCE } from 'data/constants'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import ActivityModalContentField from './ActivityModalContentField'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContentDetailsPortVisit: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const psmaDate = useSelector(
    selectPsmaEarliestDateById(event.port_visit?.intermediateAnchorage.flag ?? '')
  )
  const psmaDateFormatted = useI18nDate(psmaDate ?? 0, DateTime.DATE_FULL)

  const formatPort = useCallback(
    (anchorage?: Anchorage) => {
      const { name, flag } = anchorage ?? { name: undefined, flag: undefined }
      if (name) {
        return [name, ...(flag ? [t(`flags:${flag}` as any, flag.toLocaleUpperCase())] : [])].join(
          ', '
        )
      }
      return DEFAULT_EMPTY_VALUE
    },
    [t]
  )

  const psmaDescription = useMemo(
    () =>
      psmaDate
        ? t('event.psmaIncluded', 'Included Since {{value}}', {
            value: psmaDateFormatted,
          })
        : t('event.psmaNotIncluded', 'Not included'),
    [psmaDate, psmaDateFormatted, t]
  )

  const confidence = useMemo(() => {
    const level =
      Object.keys(PORT_CONFIDENCE).indexOf(event.port_visit?.confidence.toString() ?? '') >= 0
        ? PORT_CONFIDENCE[`${event.port_visit?.confidence}` as '2' | '3' | '4']
        : undefined
    return level ? t(`common.${level}` as any, level) : undefined
  }, [event.port_visit?.confidence, t])

  const ports = useMemo(
    () =>
      Array.from(
        new Set([
          formatPort(event.port_visit?.startAnchorage),
          formatPort(event.port_visit?.intermediateAnchorage),
          formatPort(event.port_visit?.endAnchorage),
        ])
      ),
    [event.port_visit, formatPort]
  )
  return (
    <Fragment>
      <div className={styles.row}>
        <ActivityModalContentField label={t('event.port', 'Port')} value={ports} />
        <ActivityModalContentField
          label={t('event.confidence', 'Confidence')}
          value={confidence ?? DEFAULT_EMPTY_VALUE}
        />
        <ActivityModalContentField label={t('event.psma', 'PSMA')} value={psmaDescription} />
      </div>
      <ActivityModalContentDetails event={event} />
    </Fragment>
  )
}

export default ActivityModalContentDetailsPortVisit
