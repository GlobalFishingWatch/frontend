import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Map } from '@globalfishingwatch/mapbox-gl'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useTilesState } from '@globalfishingwatch/react-hooks'
import { quantizeOffsetToDate, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useMapboxInstance } from 'features/map/map.context'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph, selectViewport } from 'features/app/app.selectors'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import { useCurrentTimeChunkId, useMapStyle } from 'features/map/map.hooks'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import {
  selectTracksData,
  selectTracksGraphs,
  hasStaticHeatmapLayersActive,
} from './timebar.selectors'
import styles from './Timebar.module.css'

const TimebarWrapper = () => {
  const { start, end, dispatchTimeranges } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)
  const urlViewport = useSelector(selectViewport)
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
  const mapInstance = useMapboxInstance()
  const tilesLoading = useTilesState(mapInstance as Map).loading
  const currentTimeChunkId = useCurrentTimeChunkId()
  const mapStyle = useMapStyle()

  const [stackedActivity, setStackedActivity] = useState<any>()

  const visibleTemporalGridDataviews = useMemo(
    () => (temporalGridDataviews || [])?.map((dataview) => dataview.config?.visible ?? false),
    [temporalGridDataviews]
  )

  useEffect(() => {
    if (!mapInstance || !mapStyle || timebarVisualisation !== TimebarVisualisations.Heatmap) {
      return
    }
    if (tilesLoading || !visibleTemporalGridDataviews?.length) {
      setStackedActivity(undefined)
      return
    }

    const temporalgrid = mapStyle.metadata?.temporalgrid
    if (!temporalgrid) return
    const numSublayers = temporalgrid.numSublayers
    const timeChunks = temporalgrid.timeChunks as TimeChunks
    const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
    const chunkQuantizeOffset = activeTimeChunk.quantizeOffset

    // Getting features within viewport - it's somehow faster to use querySource with a crude viewport filter, than using queryRendered
    const [boundsSW, boundsNE] = mapInstance.getBounds().toArray()
    const allFeaturesWithStyle = mapInstance
      .querySourceFeatures(currentTimeChunkId, {
        sourceLayer: 'temporalgrid_interactive',
      })
      .filter((f) => {
        const coord = (f.geometry as any).coordinates[0][0]
        return (
          coord[0] > boundsSW[0] &&
          coord[0] < boundsNE[0] &&
          coord[1] > boundsSW[1] &&
          coord[1] < boundsNE[1]
        )
      })
    // console.log('querySourceFeatures', performance.now() - n)
    // n = performance.now()

    if (allFeaturesWithStyle?.length) {
      const values = getTimeSeries(
        allFeaturesWithStyle as any,
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

    // While mapStyle is needed inside the useEffect, we don't want the component to rerender everytime a new instance is generated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapInstance,
    currentTimeChunkId,
    tilesLoading,
    timebarVisualisation,
    urlViewport,
    visibleTemporalGridDataviews,
  ])

  const dataviews = useSelector(selectTemporalgridDataviews)
  const dataviewsColors = dataviews?.map((dataview) => dataview.config?.color)

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
            {timebarVisualisation === TimebarVisualisations.Heatmap && (
              <Fragment>
                {stackedActivity && (
                  <TimebarStackedActivity
                    key="stackedActivity"
                    data={stackedActivity}
                    colors={dataviewsColors}
                    numSublayers={dataviews?.length}
                  />
                )}
                {tilesLoading && (
                  <div className={styles.loading}>
                    <Spinner color="white" size="small" />
                  </div>
                )}
              </Fragment>
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
