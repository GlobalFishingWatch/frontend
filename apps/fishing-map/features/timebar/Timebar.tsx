import { Fragment, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import type {
  HighlightedChunks,
  LastXOption,
  TrackGraphOrientation,
} from '@globalfishingwatch/timebar'
import { Timebar } from '@globalfishingwatch/timebar'
import { Icon } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectLatestAvailableDataDate,
  selectScreenshotMode,
} from 'features/app/selectors/app.selectors'
import {
  selectTimebarGraph,
  selectTimebarVisualisation,
} from 'features/app/selectors/app.timebar.selectors'
import { selectHasVectorDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import Hint from 'features/help/Hint'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useTimebarTracksGraphSteps } from 'features/map/timebar-graph.hooks'
import { selectShowTimeComparison } from 'features/reports/report-area/area-reports.selectors'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'
import {
  useHighlightedEventsConnect,
  useTimebarVisualisation,
  useTimebarVisualisationConnect,
  useTimerangeConnect,
} from 'features/timebar/timebar.hooks'
import {
  useOnTimebarRangeChange,
  useTimebarBookmark,
  useTimebarMouseInteractions,
} from 'features/timebar/timebar-interactions.hooks'
import { useRealTimeDataUpdates } from 'features/timebar/timebar-realtime.hooks'
import {
  useTimebarVesselEvents,
  useTimebarVesselTracks,
  useTimebarVesselTracksGraph,
} from 'features/timebar/timebar-vessel.hooks'
import TimebarClusterEventsGraph from 'features/timebar/TimebarClusterEventsGraph'
import { selectIsVessselGroupsFiltering } from 'features/vessel-groups/vessel-groups.selectors'
import { selectTimeMode } from 'features/workspace/workspace.selectors'
import { useDOMElement } from 'hooks/dom.hooks'
import { selectIsAnyReportLocation } from 'router/routes.selectors'
import type { Locale } from 'types'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { getEventLabel } from 'utils/analytics'
import { upperFirst } from 'utils/info'

import {
  selectAvailableEnd,
  selectAvailableStart,
  selectTimebarSelectedVisualizationMode,
} from './timebar.selectors'
import { selectHighlightedTime } from './timebar.slice'
import TimebarActivityGraph from './TimebarActivityGraph'
import TimebarPointsGraph from './TimebarPointsGraph'
import TimebarSettings from './TimebarSettings'

import styles from './Timebar.module.css'

export const ZOOM_LEVEL_TO_FOCUS_EVENT = 5

const INTERVAL_DATE_FORMATS: Partial<
  Record<FourwingsInterval, { format: Intl.DateTimeFormatOptions; showUTCLabel?: boolean }>
> = {
  HOUR: {
    format: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric' },
    showUTCLabel: true,
  },
  DAY: { format: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' } },
  MONTH: { format: { year: 'numeric', month: 'long' } },
  YEAR: { format: { year: 'numeric' } },
}

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
        const intervalFormat = interval && INTERVAL_DATE_FORMATS[interval]
        if (intervalFormat) {
          return formatI18nDate(timestamp, intervalFormat)
        }
        return formatI18nDate(timestamp, { format: DateTime.DATETIME_MED, showUTCLabel: true })
      },
      [interval]
    )

    const showActivityDate =
      timebarVisualisation === TimebarVisualisations.HeatmapActivity ||
      timebarVisualisation === TimebarVisualisations.HeatmapDetections ||
      visualizationMode !== 'positions'
    const formatDate = showActivityDate ? activityDateCallback : undefined

    return highlightedTime ? (
      <Timebar.Charts.Highlighter
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
    data: Parameters<typeof Timebar.Charts.TracksEvents>[0]['data']
    tracks?: Parameters<typeof Timebar.Charts.TracksEvents>[0]['tracks']
    onEventClick?: Parameters<typeof Timebar.Charts.TracksEvents>[0]['onEventClick']
  }) => {
    const { highlightedEventIds } = useHighlightedEventsConnect()
    return (
      <Timebar.Charts.TracksEvents
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
  useRealTimeDataUpdates()

  const { t, ready, i18n } = useTranslation()
  const trackGraphSteps = useTimebarTracksGraphSteps()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end } = useTimerangeConnect()
  const { timebarVisualisation } = useTimebarVisualisationConnect()
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
  const debugOptions = useSelector(selectDebugOptions)
  const timeMode = useSelector(selectTimeMode)
  // const [isPending, startTransition] = useTransition()
  const tracks = useTimebarVesselTracks()
  const tracksGraphsData = useTimebarVesselTracksGraph()
  const events = useTimebarVesselEvents()
  const rootElement = useDOMElement()

  const { bookmark, onBookmarkChange } = useTimebarBookmark()
  const isSmallScreen = useSmallScreen()

  const {
    isMouseInside,
    isMouseClicked,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onToggleFixedTooltip,
    onGraphClick,
    onEventClick,
  } = useTimebarMouseInteractions(rootElement)
  const onChange = useOnTimebarRangeChange(onToggleFixedTooltip)

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

  const realTimeTimerangeOptions = useMemo(
    (): LastXOption[] =>
      [24, 48, 72].map((count) => ({
        id: `last${count}Hours`,
        label: t((t) => t.common.latestHours, { count }),
        num: count,
        unit: 'hour',
      })),
    [t]
  )

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
          <Timebar.Charts.TracksGraph
            key="trackGraph"
            data={tracksGraphsData}
            steps={trackGraphSteps}
          />
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
        minimumRangeUnit={timeMode === 'realTime' ? 'hour' : 'day'}
        intervals={FOURWINGS_INTERVALS_ORDER}
        getCurrentInterval={getFourwingsInterval}
      >
        {!screenshotMode && (
          <Fragment>
            {!isReportLocation && timeMode === 'historical' && (
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
            <Timebar.ToolbarWrapper>
              <Timebar.TimeRangeSelector
                timeRangeOptions={timeMode === 'realTime' ? realTimeTimerangeOptions : undefined}
                showDateInputs={timeMode === 'historical'}
              />
              {timeMode === 'realTime' ? (
                <Timebar.Tools.Wrapper>
                  <Icon icon="history" />
                </Timebar.Tools.Wrapper>
              ) : (
                <Timebar.Tools.Bookmark />
              )}
            </Timebar.ToolbarWrapper>
            {timeMode === 'historical' && <Timebar.IntervalSelector />}
          </Fragment>
        )}
        <Timebar.Charts.Wrapper
          fullWidth={screenshotMode}
          bookmarkPlacement="bottom"
          trackGraphOrientation={trackGraphOrientation}
          showLast30DaysBtn={timeMode === 'historical'}
          locale={i18n.language as Locale}
          onMouseMove={onMouseMove}
          onGraphClick={onGraphClick}
          showDeckStats={debugOptions.deckStats}
        >
          {!isSmallScreen ? timebarGraphComponent : null}
        </Timebar.Charts.Wrapper>
      </Timebar>
      {!isSmallScreen && !screenshotMode && <TimebarSettings loading={loading} />}
      <Hint id="changingTheTimeRange" className={styles.helpHint} />
    </div>
  )
}

export default memo(TimebarWrapper)
