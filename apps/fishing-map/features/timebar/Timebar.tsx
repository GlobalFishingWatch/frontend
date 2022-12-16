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
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { getInterval, INTERVAL_ORDER } from '@globalfishingwatch/layer-composer'
import {
  useTimerangeConnect,
  useTimebarVisualisation,
  useTimebarVisualisationConnect,
  useDisableHighlightTimeConnect,
  useActivityMetadata,
} from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE, LAST_DATA_UPDATE } from 'data/config'
import { TimebarVisualisations } from 'types'
import useViewport from 'features/map/map-viewport.hooks'
import { selectTimebarGraph, selectTimebarVisualisation } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import { upperFirst } from 'utils/info'
import { selectShowTimeComparison } from 'features/analysis/analysis.selectors'
import Hint from 'features/hints/Hint'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectIsVessselGroupsFiltering } from 'features/vessel-groups/vessel-groups.selectors'
import { getUTCDateTime } from 'utils/dates'
import { setHighlightedTime, selectHighlightedTime, Range } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import { selectTracksData, selectTracksGraphData, selectTracksEvents } from './timebar.selectors'
import TimebarActivityGraph from './TimebarActivityGraph'
import styles from './Timebar.module.css'

const ZOOM_LEVEL_TO_FOCUS_EVENT = 5

const TimebarHighlighterWrapper = ({ dispatchHighlightedEvents }) => {
  // const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
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
      let dateLabel = formatI18nDate(timestamp, {
        format: DateTime.DATETIME_MED,
        showUTCLabel: true,
      })
      if (metadata) {
        const interval = metadata.timeChunks.interval
        if (interval === 'hour') {
          const HOUR_FORMAT = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
          }
          return formatI18nDate(timestamp, { format: HOUR_FORMAT, showUTCLabel: true })
        } else if (interval === 'day') {
          const DAY_FORMAT = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          }
          return formatI18nDate(timestamp, { format: DAY_FORMAT })
        } else if (interval === 'month') {
          const MONTH_FORMAT = {
            year: 'numeric',
            month: 'long',
          }
          return formatI18nDate(timestamp, { format: MONTH_FORMAT })
        } else if (interval === 'year') {
          const YEAR_FORMAT = {
            year: 'numeric',
          }
          return formatI18nDate(timestamp, { format: YEAR_FORMAT })
        }
      }
      return dateLabel
    },
    [metadata]
  )
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
  const vesselGroupsFiltering = useSelector(selectIsVessselGroupsFiltering)
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
  const onIntervalClick = useCallback(
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
          const startDateTime = getUTCDateTime(start)
          const endDateTime = getUTCDateTime(end)
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
      const gaActions: Record<string, string> = {
        TIME_RANGE_SELECTOR: 'Configure timerange using calendar option',
        ZOOM_IN_BUTTON: 'Zoom In timerange',
        ZOOM_OUT_BUTTON: 'Zoom Out timerange',
        HOUR_INTERVAL_BUTTON: 'Use hour preset',
        DAY_INTERVAL_BUTTON: 'Use day preset',
        MONTH_INTERVAL_BUTTON: 'Use month preset',
        YEAR_INTERVAL_BUTTON: 'Use year preset',
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
    tracks?.some(({ chunks, status }) => chunks?.length > 0 && status === ResourceStatus.Loading) ||
    tracksGraphsData?.some(
      ({ chunks, status }) => chunks?.length > 0 && status === ResourceStatus.Loading
    ) ||
    tracksEvents?.some(
      ({ chunks, status }) => chunks?.length > 0 && status === ResourceStatus.Loading
    )

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
        enablePlayback={!vesselGroupsFiltering}
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
        onIntervalClick={onIntervalClick}
        onTogglePlay={onTogglePlay}
        bookmarkStart={bookmark?.start}
        bookmarkEnd={bookmark?.end}
        bookmarkPlacement="bottom"
        minimumRange={1}
        // TODO: set this by current active activity dataviews
        // minimumRangeUnit={activityCategory === 'fishing' ? 'hour' : 'day'}
        intervals={INTERVAL_ORDER}
        getCurrentInterval={getInterval}
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
