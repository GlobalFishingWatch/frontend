import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layer } from 'mapbox-gl'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useTilesState } from '@globalfishingwatch/react-hooks'
import { frameToDate, Generators, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useMapboxInstance } from 'features/map/map.context'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph, selectViewport } from 'features/app/app.selectors'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import { selectTracksData, selectTracksGraphs } from './timebar.selectors'
import styles from './Timebar.module.css'

const TimebarWrapper = () => {
  const { start, end, dispatchTimeranges } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)
  const urlViewport = useSelector(selectViewport)

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

  const [stackedActivity, setStackedActivity] = useState<any>()
  useEffect(() => {
    if (!mapInstance || tilesLoading || timebarVisualisation !== TimebarVisualisations.Heatmap)
      return

    let style: any
    try {
      style = mapInstance.getStyle()
    } catch (e) {
      // console.log(e)
    }

    if (!style) return
    // Get interactive layer(s) from the heatmap animated layers
    const heatmapInteractiveLayers = (style.layers as Layer[]).filter(
      (layer) =>
        layer.metadata?.generatorType === Generators.Type.HeatmapAnimated &&
        layer.metadata?.interactive === true
    )
    if (!heatmapInteractiveLayers.length) return
    let n = 0
    n = performance.now()
    const allFeaturesWithStyle = mapInstance.queryRenderedFeatures(undefined, {
      layers: heatmapInteractiveLayers.map((l) => l.id),
    })
    console.log('queryRenderedFeatures', performance.now() - n)

    // TODO Pick active timechunk layers or handle multiple timechunks?
    const timechunks = mapInstance.getStyle().metadata?.temporalgrid?.timeChunks as TimeChunks

    const metadata = style.metadata
    const timeChunks = metadata?.temporalgrid?.timeChunks
    const activeTimeChunk: TimeChunk = timeChunks?.chunks.find((c: any) => c.active)
    const numSublayers = metadata?.temporalgrid?.numSublayers
    const chunkQuantizeOffset = activeTimeChunk.quantizeOffset
    const numChunkFrames = activeTimeChunk.framesDelta

    n = performance.now()
    let valuesByFrame: any[] = new Array(numChunkFrames).fill(null)
    valuesByFrame = valuesByFrame.map(() => new Array(numSublayers).fill(0))

    allFeaturesWithStyle.forEach((feature) => {
      if (!feature.properties) return
      const rawValues: string = feature.properties.rawValues
      const rawValuesArr: number[] = rawValues.split(',').map((v) => parseInt(v))
      const minCellOffset = rawValuesArr[0]
      const startAt = 2
      const endAt = rawValuesArr.length - 1 - startAt
      const rawValuesArrSlice = rawValuesArr.slice(startAt, endAt)
      let currentFrameIndex = minCellOffset - chunkQuantizeOffset

      for (let i = 0; i < rawValuesArrSlice.length; i++) {
        const sublayerIndex = i % numSublayers
        const rawValue = rawValuesArrSlice[i]

        valuesByFrame[currentFrameIndex][sublayerIndex] += rawValue

        if (sublayerIndex === numSublayers - 1) {
          currentFrameIndex++
        }
      }
    })

    valuesByFrame = valuesByFrame.map((frameValues, frameIndex) => {
      return {
        date: frameToDate(frameIndex, chunkQuantizeOffset, timechunks.interval).getTime(),
        ...frameValues,
      }
    })
    console.log('compute graph', performance.now() - n)
    setStackedActivity(valuesByFrame)
  }, [mapInstance, tilesLoading, timebarVisualisation, urlViewport])

  const dataviews = useSelector(selectTemporalgridDataviews)
  const heatmapSublayerColors = useMemo(() => {
    return dataviews?.map((dataview) => dataview.config?.color)
  }, [dataviews])

  if (!start || !end) return null
  // console.log(timebarVisualisation, stackedActivity)
  return (
    <div className="print-hidden">
      <TimebarComponent
        enablePlayback
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
