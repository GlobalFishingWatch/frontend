import { Fragment, memo, useCallback, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import {
  Timebar,
  TimebarTracks,
  TimebarHighlighter,
  TimebarTracksEvents,
  TimebarTracksGraph,
  TimebarChartChunk,
  TrackEventChunkProps,
  TrackGraphOrientation,
  HighlightedChunks,
} from '@globalfishingwatch/timebar'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { CONFIG_BY_INTERVAL, getTimeChunksInterval } from '@globalfishingwatch/layer-composer'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { isMergedAnimatedGenerator } from '@globalfishingwatch/dataviews-client'
import {
  useTimerangeConnect,
  useTimebarVisualisation,
  useTimebarVisualisationConnect,
  useDisableHighlightTimeConnect,
  useActivityMetadata,
  useTimebarEnvironmentConnect,
} from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE, LAST_DATA_UPDATE } from 'data/config'
import { TimebarVisualisations } from 'types'
import useViewport from 'features/map/map-viewport.hooks'
import { selectTimebarGraph } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import { upperFirst } from 'utils/info'
import { selectShowTimeComparison } from 'features/analysis/analysis.selectors'
import Hint from 'features/help/hints/Hint'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'
import { useGeneratorsConnect } from 'features/map/map.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { setHighlightedTime, selectHighlightedTime, Range } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import { selectTracksData, selectTracksGraphData, selectTracksEvents } from './timebar.selectors'
import TimebarActivityGraph from './TimebarActivityGraph'
import styles from './Timebar.module.css'

const ZOOM_LEVEL_TO_FOCUS_EVENT = 5

const TimebarHighlighterWrapper = ({ dispatchHighlightedEvents }) => {
  // const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const onHighlightChunks = useCallback(
    (chunks: HighlightedChunks) => {
      if (chunks && chunks.tracksEvents && chunks.tracksEvents.length) {
        dispatchHighlightedEvents(chunks.tracksEvents)
      } else {
        dispatchHighlightedEvents(undefined)
      }
    },
    [dispatchHighlightedEvents]
  )
  const metadata = useActivityMetadata()

  // Return precise chunk frame extent
  const activityDateCallback = useCallback(
    (timestamp: number) => {
      const dt = DateTime.fromMillis(timestamp).toUTC()
      if (!metadata) {
        return dt.toLocaleString(DateTime.DATETIME_MED)
      }
      const interval = metadata.timeChunks.interval
      if (interval === 'hour') {
        return dt.toLocaleString(DateTime.DATETIME_MED)
      } else if (interval === 'day') {
        return dt.toLocaleString(DateTime.DATE_MED)
      } else if (interval === '10days') {
        const frame = CONFIG_BY_INTERVAL['10days'].getRawFrame(timestamp)
        const start = CONFIG_BY_INTERVAL['10days'].getDate(Math.floor(frame))
        const end = CONFIG_BY_INTERVAL['10days'].getDate(Math.ceil(frame))
        return [
          DateTime.fromJSDate(start).toLocaleString(DateTime.DATE_MED),
          DateTime.fromJSDate(end).toLocaleString(DateTime.DATE_MED),
        ].join('- ')
      } else if (interval === 'month') {
        // TODO
      }

      return dt.toLocaleString(DateTime.DATETIME_MED)
    },
    [metadata]
  )
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const formatDate =
    timebarVisualisation !== TimebarVisualisations.HeatmapActivity &&
    timebarVisualisation !== TimebarVisualisations.HeatmapDetections
      ? undefined
      : activityDateCallback

  return highlightedTime ? (
    <TimebarHighlighter
      hoverStart={highlightedTime.start}
      hoverEnd={highlightedTime.end}
      onHighlightChunks={onHighlightChunks}
      dateCallback={formatDate}
    />
  ) : null
}

const TimebarWrapper = () => {
  useTimebarVisualisation()
  const { t, ready, i18n } = useTranslation()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, onTimebarChange } = useTimerangeConnect()
  // const { highlightedEvents } = useHighlightedEventsConnect()
  const [highlightedEvents, dispatchHighlightedEvents] = useState([])
  const { dispatchDisableHighlightedTime } = useDisableHighlightTimeConnect()
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const { setMapCoordinates, viewport } = useViewport()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraphsData = useSelector(selectTracksGraphData)
  const tracksEvents = useSelector(selectTracksEvents)
  const { isMapDrawing } = useMapDrawConnect()
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const { timebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const { generatorsConfig } = useGeneratorsConnect()

  const stickToUnit = useCallback(
    (start, end) => {
      const heatmapConfig = generatorsConfig.find((c) => isMergedAnimatedGenerator(c.id))
      if (
        heatmapConfig &&
        (timebarVisualisation === TimebarVisualisations.HeatmapActivity ||
          timebarVisualisation === TimebarVisualisations.HeatmapDetections)
      ) {
        const interval = getTimeChunksInterval(heatmapConfig as any, start, end)
        return interval === '10days' ? 'day' : interval
      } else if (timebarVisualisation === TimebarVisualisations.Environment) {
        // TODO decide interval for stick unit depending on available intervals when env layers have interval < month
        const heatmapConfig = generatorsConfig.find((c) => c.id === timebarSelectedEnvId)
        if (heatmapConfig) {
          const interval = getTimeChunksInterval(heatmapConfig as any, start, end)
          return interval === '10days' ? 'day' : interval
        }
        return 'month'
      }
    },
    [generatorsConfig, timebarSelectedEnvId, timebarVisualisation]
  )

  const dispatch = useAppDispatch()

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

  const onMouseMove = useCallback(
    (clientX: number, scale: (arg: number) => Date) => {
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
    (event: TimebarChartChunk<TrackEventChunkProps>) => {
      setMapCoordinates({
        latitude: event.props.latitude,
        longitude: event.props.longitude,
        zoom: zoom < ZOOM_LEVEL_TO_FOCUS_EVENT ? ZOOM_LEVEL_TO_FOCUS_EVENT : zoom,
      })
    },
    [setMapCoordinates, zoom]
  )

  const showGraph = useMemo(() => {
    return (
      timebarGraph !== 'none' &&
      tracksGraphsData &&
      (tracksGraphsData.length === 1 || tracksGraphsData.length === 2)
    )
  }, [timebarGraph, tracksGraphsData])

  const trackGraphOrientation = useMemo<TrackGraphOrientation>(() => {
    if (tracksGraphsData && (tracksGraphsData.length === 0 || tracksGraphsData.length > 2))
      return 'mirrored'
    return {
      none: 'mirrored',
      speed: 'mirrored',
      elevation: 'down',
    }[timebarGraph] as TrackGraphOrientation
  }, [timebarGraph, tracksGraphsData])

  if (!start || !end || isMapDrawing || showTimeComparison) return null

  const loading =
    tracks?.some(({ status }) => status === ResourceStatus.Loading) ||
    tracksGraphsData?.some(({ status }) => status === ResourceStatus.Loading) ||
    tracksEvents?.some(({ status }) => status === ResourceStatus.Loading)

  const hasTrackError =
    tracks?.some(({ status }) => status === ResourceStatus.Error) ||
    tracksEvents?.some(({ status }) => status === ResourceStatus.Error)

  const getTracksComponents = () => {
    if (hasTrackError) {
      return (
        <div className={styles.error}>
          {t(
            'analysis.error',
            'There was a problem loading the data, please try refreshing the page'
          )}
        </div>
      )
    } else if (!tracks || tracks?.length > MAX_TIMEBAR_VESSELS) {
      return (
        <div className={styles.disclaimer}>
          <label className={styles.disclaimerLabel}>
            {upperFirst(
              t('timebar.maxTracksNumber', 'Track detail not available for more than 10 vessels')
            )}
          </label>
        </div>
      )
    }
    return (
      <Fragment>
        <TimebarTracks key="tracks" data={tracks} />
        {showGraph && tracksGraphsData && (
          <TimebarTracksGraph key="trackGraph" data={tracksGraphsData} />
        )}
        {tracksEvents && (
          <Fragment>
            <TimebarTracksEvents
              data={tracksEvents}
              highlightedEventsIds={highlightedEvents}
              onEventClick={onEventClick}
            />
          </Fragment>
        )}
      </Fragment>
    )
  }

  return (
    <div className={styles.timebarWrapper}>
      <Timebar
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
        // TODO: set this by current active activity dataviews
        // minimumRangeUnit={activityCategory === 'fishing' ? 'hour' : 'day'}
        stickToUnit={stickToUnit}
        trackGraphOrientation={trackGraphOrientation}
        locale={i18n.language}
      >
        {!isSmallScreen ? (
          <Fragment>
            {(timebarVisualisation === TimebarVisualisations.HeatmapActivity ||
              timebarVisualisation === TimebarVisualisations.HeatmapDetections ||
              timebarVisualisation === TimebarVisualisations.Environment) && (
              <TimebarActivityGraph visualisation={timebarVisualisation} />
            )}
            {timebarVisualisation === TimebarVisualisations.Vessel && getTracksComponents()}
            <TimebarHighlighterWrapper dispatchHighlightedEvents={dispatchHighlightedEvents} />
          </Fragment>
        ) : null}
      </Timebar>
      {!isSmallScreen && <TimebarSettings loading={loading} />}
      <Hint id="changingTheTimeRange" className={styles.helpHint} />
    </div>
  )
}

export default memo(TimebarWrapper)
