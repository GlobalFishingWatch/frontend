import { Fragment, memo, useCallback, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
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
  useHighlightedEventsConnect,
} from 'features/timebar/timebar.hooks'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import useViewport from 'features/map/map-viewport.hooks'
import { selectLatestAvailableDataDate } from 'features/app/selectors/app.selectors'
import { getEventLabel } from 'utils/analytics'
import { upperFirst } from 'utils/info'
import { selectShowTimeComparison } from 'features/reports/reports.selectors'
import Hint from 'features/help/Hint'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectIsVessselGroupsFiltering } from 'features/vessel-groups/vessel-groups.selectors'
import { getUTCDateTime } from 'utils/dates'
import { selectIsAnyReportLocation } from 'routes/routes.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectTimebarGraph,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { setHighlightedTime, selectHighlightedTime, TimeRange } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import {
  selectTracksData,
  selectTracksGraphData,
  selectTracksEvents,
  selectAvailableStart,
  selectAvailableEnd,
} from './timebar.selectors'
import TimebarActivityGraph from './TimebarActivityGraph'
import styles from './Timebar.module.css'

export const ZOOM_LEVEL_TO_FOCUS_EVENT = 5

const TimebarHighlighterWrapper = ({ dispatchHighlightedEvents, showTooltip }: any) => {
  // const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const highlightedTime = useSelector(selectHighlightedTime)
  const onHighlightChunks = useCallback(
    (chunks?: HighlightedChunks) => {
      if (chunks && chunks.tracksEvents && chunks.tracksEvents.length) {
        dispatchHighlightedEvents(chunks.tracksEvents)
      } else {
        // TODO review this as it is triggered on every timebar change
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
        if (interval === 'HOUR') {
          const HOUR_FORMAT = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
          }
          return formatI18nDate(timestamp, { format: HOUR_FORMAT, showUTCLabel: true })
        } else if (interval === 'DAY') {
          const DAY_FORMAT = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          }
          return formatI18nDate(timestamp, { format: DAY_FORMAT })
        } else if (interval === 'MONTH') {
          const MONTH_FORMAT = {
            year: 'numeric',
            month: 'long',
          }
          return formatI18nDate(timestamp, { format: MONTH_FORMAT })
        } else if (interval === 'YEAR') {
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
      showTooltip={showTooltip}
      hoverStart={highlightedTime.start}
      hoverEnd={highlightedTime.end}
      onHighlightChunks={onHighlightChunks}
      dateCallback={formatDate}
    />
  ) : null
}

const TimebarWrapper = () => {
  useTimebarVisualisation()
  const [isMouseInside, setMouseInside] = useState(false)
  const { t, ready, i18n } = useTranslation()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, onTimebarChange } = useTimerangeConnect()
  const { highlightedEvents, dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const { dispatchDisableHighlightedTime } = useDisableHighlightTimeConnect()
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const { setMapCoordinates, viewport } = useViewport()
  const availableStart = useSelector(selectAvailableStart)
  const availableEnd = useSelector(selectAvailableEnd)
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraphsData = useSelector(selectTracksGraphData)
  const tracksEvents = useSelector(selectTracksEvents)
  const { isMapDrawing } = useMapDrawConnect()
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const vesselGroupsFiltering = useSelector(selectIsVessselGroupsFiltering)
  const isReportLocation = useSelector(selectIsAnyReportLocation)
  const latestAvailableDataDate = useSelector(selectLatestAvailableDataDate)
  const dispatch = useAppDispatch()

  const [bookmark, setBookmark] = useState<{ start: string; end: string } | null>(null)
  const onBookmarkChange = useCallback(
    (start: string, end: string) => {
      if (!start || !end) {
        trackEvent({
          category: TrackCategory.Timebar,
          action: 'Bookmark timerange',
          label: 'removed',
        })
        setBookmark(null)
        return
      }
      trackEvent({
        category: TrackCategory.Timebar,
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
            const hourStart = startDateTime.minus({ hours: diff.hours / 2 }).toISO() as string
            const hourEnd = endDateTime.plus({ hours: diff.hours / 2 }).toISO() as string
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

  const [internalRange, setInternalRange] = useState<TimeRange | null>(null)
  const onChange = useCallback(
    (e: any) => {
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
        trackEvent({
          category: TrackCategory.Timebar,
          action: gaActions[e.source],
          label: getEventLabel([e.start, e.end]),
        })
      }
      setInternalRange(null)
      onTimebarChange(e.start, e.end)
    },
    [setInternalRange, onTimebarChange]
  )

  const onMouseEnter = useCallback(() => {
    setMouseInside(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseInside(false)
  }, [])

  const onTogglePlay = useCallback(
    (isPlaying: boolean) => {
      trackEvent({
        category: TrackCategory.Timebar,
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
        latitude: event.props!?.latitude,
        longitude: event.props!?.longitude,
        zoom: zoom < ZOOM_LEVEL_TO_FOCUS_EVENT ? ZOOM_LEVEL_TO_FOCUS_EVENT : zoom,
      })
    },
    [setMapCoordinates, zoom]
  )

  const showGraph = useMemo(() => {
    return (
      timebarGraph !== TimebarGraphs.None &&
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
    <div className={styles.timebarWrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Timebar
        enablePlayback={!vesselGroupsFiltering && !isReportLocation}
        labels={labels}
        start={internalRange ? internalRange.start : start}
        end={internalRange ? internalRange.end : end}
        absoluteStart={availableStart}
        absoluteEnd={availableEnd}
        latestAvailableDataDate={latestAvailableDataDate}
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
            <TimebarHighlighterWrapper
              dispatchHighlightedEvents={dispatchHighlightedEvents}
              showTooltip={isMouseInside}
            />
          </Fragment>
        ) : null}
      </Timebar>
      {!isSmallScreen && <TimebarSettings loading={loading} />}
      <Hint id="changingTheTimeRange" className={styles.helpHint} />
    </div>
  )
}

export default memo(TimebarWrapper)
