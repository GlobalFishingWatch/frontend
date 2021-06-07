import React, { Fragment, memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
  TimebarTracksEvents,
} from '@globalfishingwatch/timebar'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph } from 'features/app/app.selectors'
import { selectActivityCategory } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'
import {
  setHighlightedTime,
  disableHighlightedTime,
  selectHighlightedTime,
  Range,
} from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import {
  selectTracksData,
  selectTracksGraphs,
  selectEventsWithRenderingInfo,
} from './timebar.selectors'
import TimebarActivityGraph from './TimebarActivityGraph'

export const TIMEBAR_HEIGHT = 72

const TimebarWrapper = () => {
  const { ready, i18n } = useTranslation()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, onTimebarChange } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)
  const tracksEvents = useSelector(selectEventsWithRenderingInfo)

  const dispatch = useDispatch()

  const [bookmark, setBookmark] = useState<{ start: string; end: string } | null>(null)
  const onBookmarkChange = useCallback(
    (start, end) => {
      if (!start || !end) {
        uaEvent({
          category: 'Timebar',
          action: 'Bookmark timerange',
          label: 'removed',
        })
        setBookmark(null)
        return
      }
      uaEvent({
        category: 'Timebar',
        action: 'Bookmark timerange',
        label: getEventLabel([start, end]),
      })
      setBookmark({ start, end })
    },
    [setBookmark]
  )

  const isSmallScreen = useSmallScreen()

  const activityCategory = useSelector(selectActivityCategory)

  const onMouseMove = useCallback(
    (clientX: number, scale: (arg: number) => Date) => {
      if (clientX === null) {
        if (highlightedTime !== undefined) {
          dispatch(disableHighlightedTime())
        }
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
            dispatch(setHighlightedTime({ start: hourStart, end: hourEnd }))
          } else {
            dispatch(setHighlightedTime({ start, end }))
          }
        } catch (e) {
          console.warn(e)
        }
      }
    },
    [dispatch, highlightedTime]
  )

  const [internalRange, setInternalRange] = useState<Range | null>(null)
  const onChange = useCallback(
    (e) => {
      if (e.source === 'ZOOM_OUT_MOVE') {
        setInternalRange({ ...e })
        return
      }
      const gaActions: Record<string, string> = {
        TIME_RANGE_SELECTOR: 'Configure timerange using calendar option',
        ZOOM_IN_BUTTON: 'Zoom In timerange',
        ZOOM_OUT_BUTTON: 'Zoom Out timerange',
      }
      if (gaActions[e.source]) {
        uaEvent({
          category: 'Timebar',
          action: gaActions[e.source],
          label: getEventLabel([e.start, e.end]),
        })
      }
      setInternalRange(null)
      onTimebarChange(e.start, e.end)
    },
    [setInternalRange, onTimebarChange]
  )

  const onTogglePlay = useCallback((isPlaying: boolean) => {
    uaEvent({
      category: 'Timebar',
      action: `Click on ${isPlaying ? 'Play' : 'Pause'}`,
    })
  }, [])

  if (!start || !end) return null

  return (
    <div>
      <TimebarComponent
        enablePlayback={true}
        labels={labels}
        start={internalRange ? internalRange.start : start}
        end={internalRange ? internalRange.end : end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={onChange}
        showLastUpdate={false}
        onMouseMove={onMouseMove}
        onBookmarkChange={onBookmarkChange}
        onTogglePlay={onTogglePlay}
        bookmarkStart={bookmark?.start}
        bookmarkEnd={bookmark?.end}
        bookmarkPlacement="bottom"
        minimumRange={1}
        minimumRangeUnit={activityCategory === 'fishing' ? 'hour' : 'day'}
      >
        {!isSmallScreen
          ? () => (
              <Fragment>
                {timebarVisualisation === TimebarVisualisations.Heatmap && <TimebarActivityGraph />}
                {timebarVisualisation === TimebarVisualisations.Vessel && tracks?.length && (
                  <Fragment>
                    {timebarGraph !== TimebarGraphs.Speed && (
                      <TimebarTracks key="tracks" tracks={tracks} />
                    )}
                    {timebarGraph === TimebarGraphs.Speed && tracksGraph && (
                      <TimebarActivity key="trackActivity" graphTracks={tracksGraph} />
                    )}
                    {tracksEvents && (
                      <TimebarTracksEvents
                        key="events"
                        tracksEvents={tracksEvents}
                        onEventClick={(event: Event) => {
                          console.log(event)
                        }}
                        onEventHover={(event: Event) => {
                          console.log(event)
                        }}
                      />
                    )}
                  </Fragment>
                )}
                {highlightedTime && (
                  <TimebarHighlighter
                    hoverStart={highlightedTime.start}
                    hoverEnd={highlightedTime.end}
                    activity={
                      timebarVisualisation === TimebarVisualisations.Vessel &&
                      timebarGraph === TimebarGraphs.Speed &&
                      tracksGraph
                        ? tracksGraph
                        : null
                    }
                    unit="knots"
                  />
                )}
              </Fragment>
            )
          : null}
      </TimebarComponent>
      {!isSmallScreen && <TimebarSettings />}
    </div>
  )
}

export default memo(TimebarWrapper)
