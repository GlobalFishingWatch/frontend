import { memo, useCallback } from 'react'
import { DateTime } from 'luxon'
import { Timebar, TimebarHighlighter } from '@globalfishingwatch/timebar'
import { DEFAULT_WORKSPACE } from 'data/config'
import {
  TimebarRange,
  useHighlightTimerange,
  useTimerange,
  useURLTimerange,
} from 'features/timebar/timebar.hooks'
// import { useMapInstanceStyle } from 'features/map/map-context.hooks'
import { formatI18nDate } from 'utils/i18n'
import { useAllMapSourceTilesLoaded } from 'features/map/map-sources.hooks'
import TimebarActivityGraph from './TimebarActivityGraph'
import TimebarSettings from './TimebarSettings'
import styles from './Timebar.module.css'

const TimebarHighlighterWrapper = () => {
  const [highlightTimerange] = useHighlightTimerange()
  // const metadata = useMapInstanceStyle()?.metadata?.generatorsMetadata

  // Return precise chunk frame extent
  const dateCallback = useCallback((timestamp: number) => {
    let dateLabel = formatI18nDate(timestamp, {
      showUTCLabel: true,
    })
    // if (metadata) {
    //   const interval = metadata.timeChunks.interval
    //   if (interval === 'hour') {
    //     return dateLabel
    //   } else if (interval === 'day') {
    //     return formatI18nDate(timestamp, { showUTCLabel: true })
    //   } else if (interval === 'month') {
    //     // TODO
    //   }
    // }
    return dateLabel
  }, [])

  return highlightTimerange ? (
    <TimebarHighlighter
      hoverStart={highlightTimerange.start}
      hoverEnd={highlightTimerange.end}
      dateCallback={dateCallback}
    />
  ) : null
}

const TimebarWrapper = () => {
  useURLTimerange()
  const [timerange, setTimerange] = useTimerange()
  const setHighlightTimerange = useHighlightTimerange()[1]
  const allSourcesLoaded = useAllMapSourceTilesLoaded()

  const onTimebarChange = useCallback(
    ({ start, end }: TimebarRange) => {
      setTimerange({ start, end })
    },
    [setTimerange]
  )
  const onMouseMove = useCallback(
    (clientX: number, scale: (arg: number) => Date) => {
      if (clientX === null || clientX === undefined || isNaN(clientX)) {
        setHighlightTimerange(undefined)
      } else {
        try {
          const start = scale(clientX - 10).toISOString()
          const end = scale(clientX + 10).toISOString()
          const startDateTime = DateTime.fromISO(start)
          const endDateTime = DateTime.fromISO(end)
          const diff = endDateTime.diff(startDateTime, 'hours')
          if (diff.hours < 1) {
            // To ensure at least 1h range is highlighted
            const hourStart = startDateTime.minus({ hours: diff.hours / 2 }).toISO()
            const hourEnd = endDateTime.plus({ hours: diff.hours / 2 }).toISO()
            setHighlightTimerange({ start: hourStart, end: hourEnd })
          } else {
            setHighlightTimerange({ start, end })
          }
        } catch (e: any) {
          console.log(clientX)
          console.warn(e)
        }
      }
    },
    [setHighlightTimerange]
  )

  if (!timerange?.start || !timerange?.end) return null
  return (
    <div className={styles.timebarWrapper}>
      <Timebar
        enablePlayback={true}
        start={timerange?.start}
        end={timerange?.end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={onTimebarChange}
        onMouseMove={onMouseMove}
        displayWarningWhenInFuture={false}
      >
        <TimebarActivityGraph />
        <TimebarHighlighterWrapper />
      </Timebar>
      <TimebarSettings />
    </div>
  )
}

export default memo(TimebarWrapper)
