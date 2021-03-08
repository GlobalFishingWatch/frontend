import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import type { MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { quantizeOffsetToDate, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph } from 'features/app/app.selectors'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import { useCurrentTimeChunkId, useMapFeatures, useMapStyle } from 'features/map/map.hooks'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import {
  selectTracksData,
  selectTracksGraphs,
  hasStaticHeatmapLayersActive,
} from './timebar.selectors'
import styles from './Timebar.module.css'

const filterByViewport = (features: MapboxGeoJSONFeature[], bounds: MiniglobeBounds) => {
  if (!bounds) {
    return []
  }
  const { north, east, south, west } = bounds
  const leftWorldCopy = east >= 180
  const rightWorldCopy = west <= -180
  return features.filter((f) => {
    const [lon, lat] = (f.geometry as any).coordinates[0][0]
    const rightOffset = rightWorldCopy && lon > 0 ? -360 : 0
    const leftOffset = leftWorldCopy && lon < 0 ? 360 : 0
    return (
      lon + rightOffset + leftOffset > west &&
      lon + rightOffset + leftOffset < east &&
      lat > south &&
      lat < north
    )
  })
}

const TimebarWrapper = () => {
  const { start, end, dispatchTimeranges } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)
  const temporalGridDataviews = useSelector(selectTemporalgridDataviews)
  const staticHeatmapLayersActive = useSelector(hasStaticHeatmapLayersActive)

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

  const currentTimeChunkId = useCurrentTimeChunkId()
  const mapStyle = useMapStyle()

  const [stackedActivity, setStackedActivity] = useState<any>()

  const visibleTemporalGridDataviews = useMemo(
    () => (temporalGridDataviews || [])?.map((dataview) => dataview.config?.visible ?? false),
    [temporalGridDataviews]
  )

  const { features: cellFeatures, sourceLoaded } = useMapFeatures({
    sourceId: currentTimeChunkId,
    sourceLayer: 'temporalgrid_interactive',
  })
  const [loading, setLoading] = useState(sourceLoaded)

  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 600)

  useEffect(() => {
    if (
      timebarVisualisation !== TimebarVisualisations.Heatmap ||
      !visibleTemporalGridDataviews?.length
    ) {
      setStackedActivity(undefined)
      return
    }

    if (cellFeatures?.length && debouncedBounds) {
      const temporalgrid = mapStyle?.metadata?.temporalgrid
      if (!temporalgrid) return
      // TODO: think about having an custom useMapFeatures just for cells
      const numSublayers = temporalgrid.numSublayers
      const timeChunks = temporalgrid.timeChunks as TimeChunks
      const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
      const chunkQuantizeOffset = activeTimeChunk.quantizeOffset

      const filteredFeatures = filterByViewport(cellFeatures, debouncedBounds)
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
        // console.log('compute graph', performance.now() - n)
        setStackedActivity(values)
      } else {
        setStackedActivity(undefined)
      }
    }
  }, [
    cellFeatures,
    debouncedBounds,
    mapStyle.metadata?.temporalgrid,
    sourceLoaded,
    timebarVisualisation,
    visibleTemporalGridDataviews,
  ])

  const dataviews = useSelector(selectTemporalgridDataviews)
  const dataviewsColors = dataviews?.map((dataview) => dataview.config?.color)

  // Using an effect to ensure the blur loading is removed once the component has been rendered
  useEffect(() => {
    setLoading(sourceLoaded)
  }, [sourceLoaded])

  if (!start || !end) return null
  return (
    <div>
      <TimebarComponent
        enablePlayback={!staticHeatmapLayersActive}
        start={start}
        end={end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={dispatchTimeranges}
        showLastUpdate={false}
        onMouseMove={(clientX: number, scale: (arg: number) => Date) => {
          if (clientX === null) {
            if (highlightedTime !== null) {
              dispatch(disableHighlightedTime())
            }
          } else {
            const start = scale(clientX - 10).toISOString()
            const end = scale(clientX + 10).toISOString()
            dispatch(setHighlightedTime({ start, end }))
          }
        }}
        onBookmarkChange={onBookmarkChange}
        bookmarkStart={bookmark?.start}
        bookmarkEnd={bookmark?.end}
        bookmarkPlacement="bottom"
      >
        {() => (
          <Fragment>
            {timebarVisualisation === TimebarVisualisations.Heatmap && stackedActivity && (
              <div className={cx({ [styles.loading]: !loading })}>
                <TimebarStackedActivity
                  key="stackedActivity"
                  data={stackedActivity}
                  colors={dataviewsColors}
                  numSublayers={dataviews?.length}
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
        )}
      </TimebarComponent>
      <TimebarSettings />
    </div>
  )
}

export default memo(TimebarWrapper)
