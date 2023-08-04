import { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import saveAs from 'file-saver'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import { selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { getVoyageTimeRange, parseEventsToCSV } from 'features/vessel/vessel.utils'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { selectOngoingVoyageId } from 'features/vessel/vessel.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import styles from '../ActivityGroupedList.module.css'

interface EventProps {
  events: ActivityEvent[]
  expanded: boolean
  onMapClick?: (voyageId: ActivityEvent['voyage']) => void
  onMapHover?: (voyageId?: ActivityEvent['voyage']) => void
  onToggleClick?: (voyageId: ActivityEvent['voyage']) => void
}

const VoyageGroup: React.FC<EventProps> = ({
  events,
  expanded = false,
  onMapClick = () => {},
  onMapHover = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  const { t } = useTranslation()
  const vesselId = useSelector(selectVesselInfoDataId)
  const ongoingVoyageId = useSelector(selectOngoingVoyageId)
  const voyageId = events?.[0]?.voyage

  const voyageLabel = useMemo(() => {
    const parts: string[] = []
    const firstVoyageEvent = events[events.length - 1]
    const latestVoyageEvent = events[0]
    if (voyageId === ongoingVoyageId) {
      parts.push(t('event.currentVoyage' as any, 'Ongoing Voyage') as string)
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(firstVoyageEvent.end, {
          format: DateTime.DATE_FULL,
        })}`
      )
    } else {
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(firstVoyageEvent.end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
      const to =
        latestVoyageEvent.subType === 'entry' ? latestVoyageEvent.start : latestVoyageEvent.end
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(to, {
          format: DateTime.DATE_FULL,
        })}`
      )
    }

    parts.push(
      `(${events.filter((e) => e.type !== EventTypes.Port).length} ${t('common.events', 'Events')})`
    )

    return parts.join(' ')
  }, [events, ongoingVoyageId, t, voyageId])

  const hasEvents = events.length > 0

  const onDownloadClick = () => {
    if (events.length) {
      const { start, end } = getVoyageTimeRange(events)
      const data = parseEventsToCSV(events)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${vesselId}-voyage-${start}-${end}-events.csv`)
    }
  }

  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(voyageId) : {}),
    [hasEvents, onToggleClick, voyageId]
  )

  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hasEvents) {
        onMapClick(voyageId)
      }
      if (!expanded) {
        onToggle()
      }
    },
    [hasEvents, expanded, onMapClick, voyageId, onToggle]
  )

  return (
    <li className={cx(styles.eventGroup, { [styles.open]: expanded })}>
      <div
        className={styles.header}
        onClick={onToggle}
        onMouseEnter={() => onMapHover(voyageId)}
        onMouseLeave={() => onMapHover(undefined)}
      >
        <p className={styles.title}>{voyageLabel}</p>
        {hasEvents && (
          <div className={cx(styles.actions, 'print-hidden')}>
            <IconButton size="small" icon={expanded ? 'arrow-top' : 'arrow-down'} />
            <IconButton
              icon="download"
              size="small"
              onClick={onDownloadClick}
              tooltip={t('download.dataDownload', 'Download Data')}
              tooltipPlacement="top"
            />
            <IconButton icon="target" size="small" onClick={handleMapClick} />
          </div>
        )}
      </div>
    </li>
  )
}

export default VoyageGroup
