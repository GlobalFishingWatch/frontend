import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useTilesState } from '@globalfishingwatch/react-hooks'
import { frameToDate, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import { getCellValues } from '@globalfishingwatch/fourwings-aggregate'
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
  const tilesLoading = useTilesState(mapInstance).loading
  const currentTimeChunkId = useCurrentTimeChunkId()
  const mapStyle = useMapStyle()

  const [stackedActivity, setStackedActivity] = useState<any>()
  useEffect(() => {
    if (
      !mapInstance ||
      !mapStyle ||
      tilesLoading ||
      timebarVisualisation !== TimebarVisualisations.Heatmap
    )
      return

    const temporalgrid = mapStyle.metadata?.temporalgrid
    if (!temporalgrid) return
    const numSublayers = temporalgrid.numSublayers
    const timeChunks = temporalgrid.timeChunks as TimeChunks
    const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
    const chunkQuantizeOffset = activeTimeChunk.quantizeOffset
    const numChunkFrames = activeTimeChunk.framesDelta

    let n = 0
    n = performance.now()

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    n = performance.now()
    let valuesByFrame: any[] = new Array(numChunkFrames).fill(null)
    valuesByFrame = valuesByFrame.map(() => new Array(numSublayers).fill(0))

    allFeaturesWithStyle.forEach((feature) => {
      if (!feature.properties) return
      const rawValues: string = feature.properties.rawValues
      const { values, minCellOffset } = getCellValues(rawValues)
      const startAt = 2
      const endAt = values.length - 1 - startAt
      const rawValuesArrSlice = values.slice(startAt, endAt)
      let currentFrameIndex = minCellOffset - chunkQuantizeOffset

      for (let i = 0; i < rawValuesArrSlice.length; i++) {
        const sublayerIndex = i % numSublayers
        const rawValue = rawValuesArrSlice[i]

        if (valuesByFrame[currentFrameIndex]?.[sublayerIndex]) {
          valuesByFrame[currentFrameIndex][sublayerIndex] += rawValue
        }

        if (sublayerIndex === numSublayers - 1) {
          currentFrameIndex++
        }
      }
    })

    valuesByFrame = valuesByFrame.map((frameValues, frameIndex) => {
      return {
        date: frameToDate(frameIndex, chunkQuantizeOffset, timeChunks.interval).getTime(),
        ...frameValues,
      }
    })
    // console.log('compute graph', performance.now() - n)
    setStackedActivity(valuesByFrame)
    // While mapStyle is needed inside the useEffect, we don't want the component to rerender everytime a new instance is generated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance, currentTimeChunkId, tilesLoading, timebarVisualisation, urlViewport])

  const dataviews = useSelector(selectTemporalgridDataviews)
  const heatmapSublayerColors = useMemo(() => {
    return dataviews?.map((dataview) => dataview.config?.color)
  }, [dataviews])

  if (!start || !end) return null
  // console.log(timebarVisualisation, stackedActivity)
  return (
    <div className="print-hidden">
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
      >
        {() => (
          <Fragment>
            {timebarVisualisation === TimebarVisualisations.Heatmap && stackedActivity && (
              <Fragment>
                {stackedActivity && (
                  <TimebarStackedActivity
                    key="stackedActivity"
                    data={stackedActivity}
                    colors={heatmapSublayerColors}
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
                activity={timebarGraph === TimebarGraphs.Speed && tracksGraph ? tracksGraph : null}
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
