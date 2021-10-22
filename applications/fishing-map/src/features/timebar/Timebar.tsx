import React, { Fragment, memo, useCallback, useRef, useState, useMemo } from 'react'
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
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  useTimerangeConnect,
  useTimebarVisualisation,
  useTimebarVisualisationConnect,
  useHighlightEventConnect,
  useDisableHighlightTimeConnect,
} from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE, LAST_DATA_UPDATE } from 'data/config'
import { TimebarVisualisations } from 'types'
import useViewport from 'features/map/map-viewport.hooks'
import { selectActivityCategory, selectTimebarGraph } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import { upperFirst } from 'utils/info'
import { selectIsMapDrawing } from 'features/map/map.selectors'
import { selectShowTimeComparison } from 'features/analysis/analysis.selectors'
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
import styles from './Timebar.module.css'

export const TIMEBAR_HEIGHT = 72
export const MAX_TIMEBAR_VESSELS = 10

const TimebarHighlighterWrapper = ({ activity }: any) => {
  const highlightedTime = useSelector(selectHighlightedTime)
  return highlightedTime ? (
    <TimebarHighlighter
      hoverStart={highlightedTime.start}
      hoverEnd={highlightedTime.end}
      activity={activity}
      unit="knots"
    />
  ) : null
}

const TimebarWrapper = () => {
  useTimebarVisualisation()
  const { t, ready, i18n } = useTranslation()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, onTimebarChange } = useTimerangeConnect()
  const { highlightedEvent, dispatchHighlightedEvent } = useHighlightEventConnect()
  const { dispatchDisableHighlightedTime } = useDisableHighlightTimeConnect()
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const { setMapCoordinates, viewport } = useViewport()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraphs = useSelector(selectTracksGraphs)
  const tracksEvents = useSelector(selectEventsWithRenderingInfo)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const showTimeComparison = useSelector(selectShowTimeComparison)

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
  const hoverInEvent = useRef(false)

  const activityCategory = useSelector(selectActivityCategory)

  const onMouseMove = useCallback(
    (clientX: number, scale: (arg: number) => Date) => {
      if (hoverInEvent.current === false) {
        if (clientX === null || clientX === undefined || isNaN(clientX)) {
          dispatchDisableHighlightedTime()
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
          } catch (e: any) {
            console.log(clientX)
            console.warn(e)
          }
        }
      }
    },
    [dispatch, dispatchDisableHighlightedTime]
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

  const onTogglePlay = useCallback(
    (isPlaying: boolean) => {
      uaEvent({
        category: 'Timebar',
        action: `Click on ${isPlaying ? 'Play' : 'Pause'}`,
        label: getEventLabel([start ?? '', end ?? '']),
      })
    },
    [start, end]
  )

  const { zoom } = viewport
  const onEventClick = useCallback(
    (event: ApiEvent) => {
      setMapCoordinates({
        latitude: event.position.lat,
        longitude: event.position.lon,
        zoom: zoom < 8 ? 8 : zoom,
      })
    },
    [setMapCoordinates, zoom]
  )

  const onEventHover = useCallback(
    (event: ApiEvent) => {
      if (event) {
        dispatch(disableHighlightedTime())
      }
      hoverInEvent.current = event !== undefined
      dispatchHighlightedEvent(event)
    },
    [dispatch, dispatchHighlightedEvent]
  )
  const showGraph = useMemo(() => {
    return timebarGraph !== 'none' && tracksGraphs && tracksGraphs.length === 1
  }, [timebarGraph, tracksGraphs])

  const highlighterActivity = useMemo(() => {
    return timebarVisualisation === TimebarVisualisations.Vessel && showGraph && tracksGraphs
      ? tracksGraphs
      : null
  }, [timebarVisualisation, showGraph, tracksGraphs])

  if (!start || !end || isMapDrawing || showTimeComparison) return null

  return (
    <div>
      <TimebarComponent
        enablePlayback={true}
        labels={labels}
        start={internalRange ? internalRange.start : start}
        end={internalRange ? internalRange.end : end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        latestAvailableDataDate={LAST_DATA_UPDATE}
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
        locale={i18n.language}
      >
        {!isSmallScreen ? (
          <Fragment>
            {timebarVisualisation === TimebarVisualisations.Heatmap && <TimebarActivityGraph />}
            {timebarVisualisation === TimebarVisualisations.Vessel &&
              (tracks && tracks.length <= MAX_TIMEBAR_VESSELS ? (
                <Fragment>
                  <TimebarTracks key="tracks" tracks={tracks} />
                  {showGraph && tracksGraphs && (
                    <TimebarActivity key="trackActivity" graphTracks={tracksGraphs} />
                  )}
                  {tracksEvents && (
                    <Fragment>
                      <TimebarTracksEvents
                        key="events"
                        labels={labels?.trackEvents}
                        preselectedEventId={highlightedEvent?.id}
                        tracksEvents={tracksEvents}
                        onEventClick={onEventClick}
                        onEventHover={onEventHover}
                      />
                    </Fragment>
                  )}
                </Fragment>
              ) : (
                <div className={styles.disclaimer}>
                  <label className={styles.disclaimerLabel}>
                    {upperFirst(
                      t(
                        'timebar.maxTracksNumber',
                        'Track detail not available for more than 10 vessels'
                      )
                    )}
                  </label>
                </div>
              ))}
            <TimebarHighlighterWrapper activity={highlighterActivity} />
          </Fragment>
        ) : null}
      </TimebarComponent>
      {!isSmallScreen && <TimebarSettings />}
    </div>
  )
}

export default memo(TimebarWrapper)
