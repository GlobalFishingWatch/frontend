import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { quantizeOffsetToDate } from '@globalfishingwatch/layer-composer'
import {
  TimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer/dist/generators/heatmap/util/time-chunks'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph } from 'features/app/app.selectors'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'
import { useActivityTemporalgridFeatures } from 'features/map/map-features.hooks'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import { selectTracksData, selectTracksGraphs } from './timebar.selectors'
import styles from './Timebar.module.css'

export const TIMEBAR_HEIGHT = 72

const TimebarWrapper = () => {
  const { ready, i18n } = useTranslation()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, dispatchTimeranges } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)
  const temporalGridDataviews = useSelector(selectActivityDataviews)

  const dispatch = useDispatch()

  const [bookmark, setBookmark] = useState<{ start: string; end: string } | null>(null)
  const onBookmarkChange = useCallback(
    (start, end) => {
      if (!start || !end) {
        setBookmark(null)
        return
      }
      setBookmark({ start, end })
    },
    [setBookmark]
  )

  const [stackedActivity, setStackedActivity] = useState<any>()

  const visibleTemporalGridDataviews = useMemo(
    () => (temporalGridDataviews || [])?.map((dataview) => dataview.config?.visible ?? false),
    [temporalGridDataviews]
  )

  const { bounds } = useMapBounds()
  const { sourcesFeatures, haveSourcesLoaded, sourcesMetadata } = useActivityTemporalgridFeatures()
  const debouncedBounds = useDebounce(bounds, 400)
  const isSmallScreen = useSmallScreen()

  useEffect(() => {
    if (
      timebarVisualisation !== TimebarVisualisations.Heatmap ||
      !visibleTemporalGridDataviews?.length ||
      !isSmallScreen
    ) {
      setStackedActivity(undefined)
      return
    }

    if (sourcesFeatures?.length && debouncedBounds) {
      const numSublayers = sourcesMetadata[0].numSublayers
      const timeChunks = sourcesMetadata[0].timeChunks as TimeChunks
      const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
      const chunkQuantizeOffset = activeTimeChunk.quantizeOffset

      const filteredFeatures = filterByViewport(sourcesFeatures[0], debouncedBounds)
      if (filteredFeatures?.length > 0) {
        const values = getTimeSeries(
          filteredFeatures as any,
          numSublayers,
          chunkQuantizeOffset
        ).map((frameValues) => {
          // Ideally we don't have the features not visible in 4wings but we have them
          // so this needs to be filtered by the current active ones
          const activeFrameValues = Object.fromEntries(
            Object.entries(frameValues).map(([key, value]) => {
              const cleanValue =
                key === 'frame' || visibleTemporalGridDataviews[parseInt(key)] === true ? value : 0
              return [key, cleanValue]
            })
          )
          return {
            ...activeFrameValues,
            date: quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime(),
          }
        })
        setStackedActivity(values)
      } else {
        setStackedActivity(undefined)
      }
    }
  }, [
    sourcesFeatures,
    haveSourcesLoaded,
    sourcesMetadata,
    debouncedBounds,
    timebarVisualisation,
    visibleTemporalGridDataviews,
    isSmallScreen,
  ])

  const dataviewsColors = temporalGridDataviews?.map((dataview) => dataview.config?.color)

  // Using an effect to ensure the blur loading is removed once the component has been rendered
  const [loading, setLoading] = useState(haveSourcesLoaded)

  useEffect(() => {
    setLoading(haveSourcesLoaded)
  }, [haveSourcesLoaded])

  if (!start || !end) return null

  const onMouseMove = (clientX: number, scale: (arg: number) => Date) => {
    if (clientX === null) {
      if (highlightedTime !== undefined) {
        dispatch(disableHighlightedTime())
      }
    } else {
      const start = scale(clientX - 10).toISOString()
      const end = scale(clientX + 10).toISOString()
      dispatch(setHighlightedTime({ start, end }))
    }
  }

  return (
    <div>
      <TimebarComponent
        enablePlayback={true}
        labels={labels}
        start={start}
        end={end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={dispatchTimeranges}
        showLastUpdate={false}
        onMouseMove={onMouseMove}
        onBookmarkChange={onBookmarkChange}
        bookmarkStart={bookmark?.start}
        bookmarkEnd={bookmark?.end}
        bookmarkPlacement="bottom"
      >
        {!isSmallScreen
          ? () => (
              <Fragment>
                {timebarVisualisation === TimebarVisualisations.Heatmap && stackedActivity && (
                  <div className={cx({ [styles.loading]: !loading })}>
                    <TimebarStackedActivity
                      key="stackedActivity"
                      data={stackedActivity}
                      colors={dataviewsColors}
                      numSublayers={temporalGridDataviews?.length}
                    />
                  </div>
                )}
                {timebarVisualisation === TimebarVisualisations.Vessel && tracks?.length && (
                  <Fragment>
                    {timebarGraph !== TimebarGraphs.Speed && (
                      <TimebarTracks key="tracks" tracks={tracks} />
                    )}
                    {timebarGraph === TimebarGraphs.Speed && tracksGraph && (
                      <TimebarActivity key="trackActivity" graphTracks={tracksGraph} />
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
