import { Fragment, memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import type {
  HighlightedChunks,
  TimebarChartChunk,
  TimebarProps,
  TrackEventChunkProps,
  TrackGraphOrientation,
} from '@globalfishingwatch/timebar'
import {
  Timebar,
  TimebarHighlighter,
  TimebarTracksEvents,
  TimebarTracksGraph,
} from '@globalfishingwatch/timebar'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch, useAppStore } from 'features/app/app.hooks'
import {
  selectLatestAvailableDataDate,
  selectScreenshotMode,
} from 'features/app/selectors/app.selectors'
import {
  selectTimebarGraph,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { selectHasVectorDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import Hint from 'features/help/Hint'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useMapViewState, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { useTimebarTracksGraphSteps } from 'features/map/timebar-graph.hooks'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import { selectShowTimeComparison } from 'features/reports/report-area/area-reports.selectors'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'
import {
  useDisableHighlightTimeConnect,
  useHighlightedEventsConnect,
  useTimebarVisualisation,
  useTimebarVisualisationConnect,
  useTimerangeConnect,
} from 'features/timebar/timebar.hooks'
import {
  useTimebarVesselEvents,
  useTimebarVesselTracks,
  useTimebarVesselTracksGraph,
} from 'features/timebar/timebar-vessel.hooks'
import TimebarClusterEventsGraph from 'features/timebar/TimebarClusterEventsGraph'
import { selectIsVessselGroupsFiltering } from 'features/vessel-groups/vessel-groups.selectors'
// import { selectTimeMode } from 'features/workspace/workspace.selectors'
import { useDOMElement } from 'hooks/dom.hooks'
import { selectIsAnyAreaReportLocation, selectIsAnyReportLocation } from 'router/routes.selectors'
import type { Locale } from 'types'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { getEventLabel } from 'utils/analytics'
import { getUTCDateTime } from 'utils/dates'
import { upperFirst } from 'utils/info'

import {
  selectAvailableEnd,
  selectAvailableStart,
  selectTimebarSelectedVisualizationMode,
} from './timebar.selectors'
import { selectHighlightedTime, setHighlightedEvents, setHighlightedTime } from './timebar.slice'
import TimebarActivityGraph from './TimebarActivityGraph'
import TimebarPointsGraph from './TimebarPointsGraph'
import TimebarSettings from './TimebarSettings'

import styles from './Timebar.module.css'

export const ZOOM_LEVEL_TO_FOCUS_EVENT = 5

const TimebarHighlighterWrapper = memo(
  ({
    showTooltip,
    fixed,
    onToggleFixedTooltip,
  }: {
    showTooltip: boolean
    fixed?: boolean
    onToggleFixedTooltip?: (toggle?: boolean) => void
  }) => {
    const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
    const timebarVisualisation = useSelector(selectTimebarVisualisation)
    const highlightedTime = useSelector(selectHighlightedTime)
    const visualizationMode = useSelector(selectTimebarSelectedVisualizationMode)
    const { start, end } = useTimerangeConnect()
    const interval = getFourwingsInterval(start, end)

    const onHighlightChunks = useCallback(
      (chunks?: HighlightedChunks) => {
        dispatchHighlightedEvents(chunks?.tracksEvents?.length ? chunks.tracksEvents : undefined)
      },
      [dispatchHighlightedEvents]
    )

    // Return precise chunk frame extent
    const activityDateCallback = useCallback(
      (timestamp: number) => {
        const dateLabel = formatI18nDate(timestamp, {
          format: DateTime.DATETIME_MED,
          showUTCLabel: true,
        })
        if (interval) {
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
      [interval]
    )

    const formatDate = useMemo(
      () =>
        timebarVisualisation === TimebarVisualisations.HeatmapActivity ||
        timebarVisualisation === TimebarVisualisations.HeatmapDetections ||
        visualizationMode !== 'positions'
          ? activityDateCallback
          : undefined,
      [timebarVisualisation, visualizationMode, activityDateCallback]
    )

    return highlightedTime ? (
      <TimebarHighlighter
        fixed={fixed}
        showTooltip={showTooltip}
        hoverStart={highlightedTime.start}
        hoverEnd={highlightedTime.end}
        onHighlightChunks={onHighlightChunks}
        dateCallback={formatDate}
        onToggleFixedTooltip={onToggleFixedTooltip}
      />
    ) : null
  }
)

const TimebarTracksEventsWrapper = memo(
  ({
    data,
    tracks,
    onEventClick,
  }: {
    data: Parameters<typeof TimebarTracksEvents>[0]['data']
    tracks?: Parameters<typeof TimebarTracksEvents>[0]['tracks']
    onEventClick?: Parameters<typeof TimebarTracksEvents>[0]['onEventClick']
  }) => {
    const { highlightedEventIds } = useHighlightedEventsConnect()
    return (
      <TimebarTracksEvents
        tracks={tracks}
        data={data}
        highlightedEventsIds={highlightedEventIds}
        onEventClick={onEventClick}
      />
    )
  }
)

const TimebarWrapper = () => {
  useTimebarVisualisation()

  const [isMouseInside, setMouseInside] = useState(false)
  const [isMouseClicked, setMouseClicked] = useState(false)
  const { t, ready, i18n } = useTranslation()
  const trackGraphSteps = useTimebarTracksGraphSteps()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, onTimebarChange } = useTimerangeConnect()
  const { dispatchDisableHighlightedTime } = useDisableHighlightTimeConnect()
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const viewState = useMapViewState()
  const setMapCoordinates = useSetMapCoordinates()
  const availableStart = useSelector(selectAvailableStart)
  const availableEnd = useSelector(selectAvailableEnd)
  const timebarGraph = useSelector(selectTimebarGraph)
  const { isMapDrawing } = useMapDrawConnect()
  const screenshotMode = useSelector(selectScreenshotMode)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const vesselGroupsFiltering = useSelector(selectIsVessselGroupsFiltering)
  const hasVectorDataviews = useSelector(selectHasVectorDataviews)
  const isReportLocation = useSelector(selectIsAnyReportLocation)
  const latestAvailableDataDate = useSelector(selectLatestAvailableDataDate)
  const reportAreaLocation = useSelector(selectIsAnyAreaReportLocation)
  // const timeMode = useSelector(selectTimeMode)
  const fitAreaInViewport = useFitAreaInViewport()
  const dispatch = useAppDispatch()
  const appStore = useAppStore()
  // const [isPending, startTransition] = useTransition()
  const tracks = useTimebarVesselTracks()
  const tracksGraphsData = useTimebarVesselTracksGraph()
  const events = useTimebarVesselEvents()
  const rootElement = useDOMElement()

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
    (clientX: number | null, scale: ((arg: number) => Date) | null) => {
      if (clientX === null || clientX === undefined || isNaN(clientX)) {
        if (!isMouseClicked) {
          dispatchDisableHighlightedTime()
        }
      } else {
        try {
          if (!scale || isMouseClicked) return
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
          console.warn(clientX, e)
        }
      }
    },
    [dispatch, dispatchDisableHighlightedTime, isMouseClicked]
  )
  const onToggleFixedTooltip = useCallback(
    (toggle?: boolean) => {
      const newToggle = toggle !== undefined ? toggle : !isMouseClicked
      setMouseClicked(newToggle)
      if (!newToggle) {
        dispatchDisableHighlightedTime()
      }
    },
    [dispatchDisableHighlightedTime, isMouseClicked]
  )

  const onChange: TimebarProps['onChange'] = useCallback(
    (e) => {
      if (e.start !== start || e.end !== end) {
        const gaActions: Record<string, string> = {
          TIME_RANGE_SELECTOR: 'Configure timerange using calendar option',
          ZOOM_IN_RELEASE: 'Zoom In timerange',
          ZOOM_OUT_RELEASE: 'Zoom Out timerange',
          HOUR_INTERVAL_BUTTON: 'Use hour preset',
          DAY_INTERVAL_BUTTON: 'Use day preset',
          MONTH_INTERVAL_BUTTON: 'Use month preset',
          YEAR_INTERVAL_BUTTON: 'Use year preset',
          SEEK_RELEASE: 'Move timebar slider',
          BOOKMARK_SELECT: 'Select bookmark period',
        }
        if (e.source && gaActions[e.source]) {
          trackEvent({
            category: TrackCategory.Timebar,
            action: gaActions[e.source],
            label: getEventLabel([e.start, e.end]),
          })
        }
        onTimebarChange(e.start, e.end, e.source)
        const highlightedTime = selectHighlightedTime(appStore.getState())
        if (highlightedTime && (highlightedTime.start < start || highlightedTime.end > end)) {
          onToggleFixedTooltip(false)
        }
        if (reportAreaLocation) {
          fitAreaInViewport()
        }
      }
    },
    [
      start,
      end,
      onTimebarChange,
      appStore,
      reportAreaLocation,
      onToggleFixedTooltip,
      fitAreaInViewport,
    ]
  )

  const onMouseEnter = useCallback(() => {
    setMouseInside(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseInside(false)
    if (!isMouseClicked) {
      requestAnimationFrame(() => {
        dispatch(setHighlightedEvents(undefined))
      })
    }
  }, [dispatch, isMouseClicked])

  const onMouseDown = useCallback(() => {
    rootElement?.classList.add('dragging')
  }, [rootElement])

  const onMouseUp = useCallback(() => {
    rootElement?.classList.remove('dragging')
  }, [rootElement])

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

  const onEventClick = useCallback(
    (event: TimebarChartChunk<TrackEventChunkProps>) => {
      if (event?.coordinates) {
        setMapCoordinates({
          ...viewState,
          latitude: event?.coordinates?.[1],
          longitude: event.coordinates?.[0],
          zoom:
            viewState.zoom < ZOOM_LEVEL_TO_FOCUS_EVENT ? ZOOM_LEVEL_TO_FOCUS_EVENT : viewState.zoom,
        })
      }
    },
    [viewState, setMapCoordinates]
  )

  const showGraph = useMemo(() => {
    return (
      timebarGraph !== TimebarGraphs.None &&
      tracksGraphsData &&
      (tracksGraphsData.length === 1 || tracksGraphsData.length === 2)
    )
  }, [timebarGraph, tracksGraphsData])

  const trackGraphOrientation = useMemo<TrackGraphOrientation>(() => {
    if (tracksGraphsData && (tracksGraphsData.length === 0 || tracksGraphsData.length > 2)) {
      return 'mirrored'
    }
    return {
      none: 'mirrored',
      speed: 'mirrored',
      elevation: 'down',
    }[timebarGraph] as TrackGraphOrientation
  }, [timebarGraph, tracksGraphsData])

  // tracks?.some(({ status }) => status === ResourceStatus.Error) ||
  // tracksEvents?.some(({ status }) => status === ResourceStatus.Error)
  const hasTrackError = false

  const tracksComponents = useMemo(() => {
    if (hasTrackError) {
      return <div className={styles.error}>{t((t) => t.analysis.error)}</div>
    } else if (!tracks) {
      return null
    } else if (tracks?.length > MAX_TIMEBAR_VESSELS) {
      return (
        <div className={styles.disclaimer}>
          <label className={styles.disclaimerLabel}>
            {upperFirst(
              t((t) => t.timebar.maxTracksNumber, {
                number: String(MAX_TIMEBAR_VESSELS),
              })
            )}
          </label>
        </div>
      )
    }
    return (
      <Fragment>
        {showGraph && tracksGraphsData && (
          <TimebarTracksGraph key="trackGraph" data={tracksGraphsData} steps={trackGraphSteps} />
        )}
        <TimebarTracksEventsWrapper
          tracks={tracks}
          data={events || []}
          onEventClick={onEventClick}
        />
      </Fragment>
    )
  }, [events, hasTrackError, onEventClick, showGraph, t, trackGraphSteps, tracks, tracksGraphsData])

  const timebarGraphComponent = useMemo(() => {
    return (
      <Fragment>
        {(timebarVisualisation === TimebarVisualisations.HeatmapActivity ||
          timebarVisualisation === TimebarVisualisations.HeatmapDetections ||
          timebarVisualisation === TimebarVisualisations.VesselGroup ||
          timebarVisualisation === TimebarVisualisations.Environment) && (
          <TimebarActivityGraph visualisation={timebarVisualisation} />
        )}
        {timebarVisualisation === TimebarVisualisations.Vessel && tracksComponents}
        {timebarVisualisation === TimebarVisualisations.Points && <TimebarPointsGraph />}
        {timebarVisualisation === TimebarVisualisations.Events && <TimebarClusterEventsGraph />}
        <TimebarHighlighterWrapper
          showTooltip={isMouseInside || isMouseClicked}
          fixed={isMouseClicked}
          onToggleFixedTooltip={onToggleFixedTooltip}
        />
      </Fragment>
    )
  }, [isMouseClicked, isMouseInside, onToggleFixedTooltip, timebarVisualisation, tracksComponents])

  if (!start || !end || isMapDrawing || showTimeComparison) return null

  const loading = false
  // tracks?.some(({ chunks, status }) => chunks?.length > 0 && status === ResourceStatus.Loading) ||
  // tracksGraphsData?.some(
  //   ({ chunks, status }) => chunks?.length > 0 && status === ResourceStatus.Loading
  // ) ||
  // tracksEvents?.some(
  //   ({ chunks, status }) => chunks?.length > 0 && status === ResourceStatus.Loading
  // )

  return (
    <div
      className={styles.timebarWrapper}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // style={hasDeprecatedDataviewInstances ? { pointerEvents: 'none' } : {}}
      role="toolbar"
      data-testid="timebar-wrapper"
    >
      <Timebar
        labels={labels}
        start={start}
        end={end}
        isResizable={!isSmallScreen}
        absoluteStart={availableStart}
        absoluteEnd={availableEnd}
        latestAvailableDataDate={latestAvailableDataDate}
        onChange={onChange}
        onBookmarkChange={onBookmarkChange}
        bookmarkStart={bookmark?.start}
        bookmarkEnd={bookmark?.end}
        minimumRange={1}
        // minimumRangeUnit={timeMode === 'realTime' ? 'hour' : 'day'}
        intervals={FOURWINGS_INTERVALS_ORDER}
        getCurrentInterval={getFourwingsInterval}
      >
        {!screenshotMode && (
          <Fragment>
            {!isReportLocation && (
              // || timeMode === 'realTime'
              <Timebar.Playback
                disabled={vesselGroupsFiltering || hasVectorDataviews}
                disabledTooltip={
                  vesselGroupsFiltering
                    ? t((t) => t.timebar.disablePlaybackVesselGroups)
                    : hasVectorDataviews
                      ? t((t) => t.timebar.disablePlaybackVectors)
                      : undefined
                }
                onTogglePlay={onTogglePlay}
              />
            )}
            <Timebar.Controls>
              <Timebar.TimeRangeSelector
              // showDateInputs={timeMode !== 'realTime'}
              />
              <Timebar.Bookmark />
            </Timebar.Controls>
            <Timebar.IntervalSelector />
            {/* {timeMode !== 'realTime' && <Timebar.IntervalSelector />} */}
          </Fragment>
        )}
        <Timebar.Graph
          fullWidth={screenshotMode}
          bookmarkPlacement="bottom"
          trackGraphOrientation={trackGraphOrientation}
          locale={i18n.language as Locale}
          onMouseMove={onMouseMove}
          onGraphClick={onToggleFixedTooltip}
        >
          {!isSmallScreen ? timebarGraphComponent : null}
        </Timebar.Graph>
      </Timebar>
      {!isSmallScreen && !screenshotMode && <TimebarSettings loading={loading} />}
      <Hint id="changingTheTimeRange" className={styles.helpHint} />
    </div>
  )
}

export default memo(TimebarWrapper)
