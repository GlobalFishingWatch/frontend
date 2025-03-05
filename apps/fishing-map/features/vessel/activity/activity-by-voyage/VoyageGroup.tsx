import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { saveAs } from 'file-saver'
import { DateTime } from 'luxon'

import { EventTypes } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { formatI18nDate } from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselInfoDataId } from 'features/vessel/selectors/vessel.selectors'
import { parseEventsToCSV } from 'features/vessel/vessel.download'
import { getVoyageTimeRange } from 'features/vessel/vessel.utils'

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
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  const vesselId = useSelector(selectVesselInfoDataId)
  const { start, end } = useTimerangeConnect()
  const voyageId = events?.[0]?.voyage

  const voyageLabel = useMemo(() => {
    const parts: string[] = []
    const firstVoyageEvent = events[events.length - 1]
    const latestVoyageEvent = events[0]
    const voyageStart = firstVoyageEvent.port_visit?.intermediateAnchorage?.name
    const voyageEnd = latestVoyageEvent.port_visit?.intermediateAnchorage?.name
    const startDate = voyageStart ? firstVoyageEvent.end : start
    const endDate = voyageEnd ? latestVoyageEvent.start : end
    const eventCount = events.filter((e) => e.type !== EventTypes.Port).length
    parts.push(`${eventCount} ${t('common.event', { defaultValue: 'Events', count: eventCount })}`)
    parts.push(t('common.between', 'between'))
    parts.push(formatI18nDate(startDate, { format: DateTime.DATE_MED }))
    if (voyageStart) {
      parts.push(`(${voyageStart})`)
    }
    parts.push(t('common.and', 'and'))
    parts.push(formatI18nDate(endDate, { format: DateTime.DATE_MED }))
    if (voyageEnd) {
      parts.push(`(${voyageEnd})`)
    }
    return parts.join(' ')
  }, [end, events, start, t])

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
