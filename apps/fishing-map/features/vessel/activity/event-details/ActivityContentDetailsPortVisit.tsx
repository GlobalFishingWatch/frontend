import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Anchorage } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { ActivityEvent } from 'types/activity'
import ActivityContentDetails from './ActivityContentDetails'
import ActivityContentField from './ActivityContentField'
import styles from './ActivityDetails.module.css'

interface ActivityContentProps {
  event: ActivityEvent
}

const ActivityContentDetailsPortVisit: React.FC<ActivityContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  /*const psmaDate = useSelector(
    selectPsmaEarliestDateById(event.port_visit?.intermediateAnchorage.flag ?? '')
  )
  const psmaDateFormatted = useI18nDate(psmaDate ?? 0, DateTime.DATE_FULL)
*/
  const formatPort = useCallback(
    (anchorage?: Anchorage) => {
      const { name, flag } = anchorage ?? { name: undefined, flag: undefined }
      if (name) {
        return [name, ...(flag ? [t(`flags:${flag}` as any, flag.toLocaleUpperCase())] : [])].join(
          ', '
        )
      }
      return EMPTY_FIELD_PLACEHOLDER
    },
    [t]
  )

  /*const psmaDescription = useMemo(
    () =>
      psmaDate
        ? t('event.psmaIncluded', 'Included Since {{value}}', {
          value: psmaDateFormatted,
        })
        : t('event.psmaNotIncluded', 'Not included'),
    [psmaDate, psmaDateFormatted, t]
  )*/
  const confidenceLevel = useMemo(
    () => event.port_visit?.confidence || 0,
    [event.port_visit?.confidence]
  )

  /*const confidence = useMemo(() => {
    const level =
      Object.keys(PORT_CONFIDENCE).indexOf(event.port_visit?.confidence.toString() ?? '') >= 0
        ? PORT_CONFIDENCE[`${event.port_visit?.confidence}` as '2' | '3' | '4']
        : undefined
    return level ? t(`common.${level}` as any, level) : undefined
  }, [event.port_visit?.confidence, t])
  */
  const [showHelp, setShowHelp] = useState(false)
  const ports = useMemo(
    () => Array.from(formatPort(event.port_visit?.intermediateAnchorage)),
    [event.port_visit, formatPort]
  )
  return (
    <Fragment>
      <div className={styles.row}>
        <ActivityContentField label={t('event.port', 'Port')} value={ports} />
        <ActivityContentField label={t('event.psma', 'PSMA')} value={'psmaDescription'} />
      </div>
      <ActivityContentDetails event={event} />

      {false && [2, 3, 4].includes(confidenceLevel) && showHelp && (
        <div className={styles.help}>
          <p>{t(`event.confidenceHelp.help${confidenceLevel.toString()}` as any)}</p>
          <ol>
            {[3, 4].includes(confidenceLevel) && (
              <li>
                {t(
                  'event.confidenceHelp.portEntry',
                  'PORT ENTRY: vessel that was not in port gets within 3km of anchorage point'
                )}
              </li>
            )}
            <li>
              {t(
                'event.confidenceHelp.portStop',
                'PORT STOP: begin: speed < 0.2 knots; end: speed > 0.5 knots'
              )}
            </li>
            <li>
              {t(
                'event.confidenceHelp.portGap',
                'PORT GAP: AIS gap > 4 hours; start is recorded 4 hours after the last message before the gap; end at next message after gap.'
              )}
            </li>
            {[3, 4].includes(confidenceLevel) && (
              <li>
                {t(
                  'event.confidenceHelp.portExit',
                  'PORT EXIT: vessel that was in port moves more than 4km from anchorage point'
                )}
              </li>
            )}
          </ol>
        </div>
      )}
    </Fragment>
  )
}

export default ActivityContentDetailsPortVisit
