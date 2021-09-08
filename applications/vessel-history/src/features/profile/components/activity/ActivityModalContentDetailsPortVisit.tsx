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
  const confidenceLevel = useMemo(() => event.port_visit?.confidence || 0, [event.port_visit?.confidence])

  const confidence = useMemo(() => {
    const level =
      Object.keys(PORT_CONFIDENCE).indexOf(event.port_visit?.confidence.toString() ?? '') >= 0
        ? PORT_CONFIDENCE[`${event.port_visit?.confidence}` as '2' | '3' | '4']
        : undefined
    return level ? t(`common.${level}` as any, level) : undefined
  }, [event.port_visit?.confidence, t])

  const help = ''

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
          help={help}
        />
        <ActivityModalContentField label={t('event.psma', 'PSMA')} value={psmaDescription} />
      </div>
      <ActivityModalContentDetails event={event} />
      {[2,3,4].includes(confidenceLevel) && (
        <div className={styles.help}>
            <p>{t(`event.confidenceHelp.help${confidenceLevel.toString()}` as any)}</p>
            <ol>
              {[3,4].includes(confidenceLevel) && <li>{t('event.confidenceHelp.portEntry', 'PORT ENTRY: vessel that was not in port gets within 3km of anchorage point')}</li>}
              <li>{t('event.confidenceHelp.portStop', 'PORT STOP: begin: speed < 0.2 knots; end: speed > 0.5 knots')}</li>
              <li>{t('event.confidenceHelp.portGap', 'PORT GAP: AIS gap > 4 hours; start is recorded 4 hours after the last message before the gap; end at next message after gap.')}</li>
              {[3,4].includes(confidenceLevel) && <li>{t('event.confidenceHelp.portExit', 'PORT_EXIT: vessel that was in port moves more than 4km from anchorage point')}</li>}
            </ol>
        </div>
      )}
    </Fragment>
  )
}

export default ActivityModalContentDetailsPortVisit
