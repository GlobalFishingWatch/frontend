import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { Anchorage } from '@globalfishingwatch/api-types'

import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { PORT_CONFIDENCE } from 'data/constants'
import { useI18nDate } from 'features/i18n/i18nDate'
import Faq from 'features/profile/components/Faq'
import { selectPsmaEarliestDateById } from 'features/psma/psma.selectors'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'

import ActivityModalContentDetails from './ActivityModalContentDetails'
import ActivityModalContentField from './ActivityModalContentField'

import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContentDetailsPortVisit: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement<any> => {
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

  const [showHelp, setShowHelp] = useState(false)
  const ports = useMemo(
    () =>
      Array.from(
        formatPort(event.port_visit?.intermediateAnchorage)
      ),
    [event.port_visit, formatPort]
  )
  return (
    <Fragment>
      <div className={styles.row}>
        <ActivityModalContentField label={t('event.port', 'Port')} value={ports} />
        <ActivityModalContentField label={t('event.psma', 'PSMA')} value={psmaDescription} />
      </div>
      <ActivityModalContentDetails event={event} />
      <ActivityModalContentField
        label={t('event.confidence', 'Confidence')}
        value={confidence ?? DEFAULT_EMPTY_VALUE}
        onHelpClick={() => setShowHelp(!showHelp)}
      />
      {[2, 3, 4].includes(confidenceLevel) && showHelp && (
        <div className={styles.help}>
          <p>{t(`event.confidenceHelp.help${confidenceLevel.toString()}` as any)}</p>
          <ol>
            {[3, 4].includes(confidenceLevel) && <li>{t('event.confidenceHelp.portEntry', 'PORT ENTRY: vessel that was not in port gets within 3km of anchorage point')}</li>}
            <li>{t('event.confidenceHelp.portStop', 'PORT STOP: begin: speed < 0.2 knots; end: speed > 0.5 knots')}</li>
            <li>{t('event.confidenceHelp.portGap', 'PORT GAP: AIS gap > 4 hours; start is recorded 4 hours after the last message before the gap; end at next message after gap.')}</li>
            {[3, 4].includes(confidenceLevel) && <li>{t('event.confidenceHelp.portExit', 'PORT EXIT: vessel that was in port moves more than 4km from anchorage point')}</li>}
          </ol>
          <Faq source='Confidence info' />
        </div>
      )}
    </Fragment>
  )
}

export default ActivityModalContentDetailsPortVisit
