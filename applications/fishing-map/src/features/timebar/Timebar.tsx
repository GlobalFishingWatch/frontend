import React, { Fragment, memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layer } from 'mapbox-gl'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
} from '@globalfishingwatch/timebar'
import { useTilesState } from '@globalfishingwatch/react-hooks'
import { frameToDate, Generators, TimeChunks } from '@globalfishingwatch/layer-composer'
import { useMapboxInstance } from 'features/map/map.context'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph } from 'features/app/app.selectors'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import { selectTracksData, selectTracksGraphs } from './timebar.selectors'

const TimebarWrapper = () => {
  const { start, end, dispatchTimeranges } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)

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

  const [activityStream, setActivityStream] = useState()
  useEffect(() => {
    console.log(tilesLoading)
    if (!mapInstance || tilesLoading) return
    // Get interactive layer(s) from the heatmap animated layers
    console.log(mapInstance.getStyle().layers)
    const heatmapInteractiveLayers = (mapInstance.getStyle().layers as Layer[]).filter(
      (layer) =>
        layer.metadata?.generatorType === Generators.Type.HeatmapAnimated &&
        layer.metadata?.interactive === true
    )
    // .map((l) => l.id)
    console.log(heatmapInteractiveLayers)
    if (!heatmapInteractiveLayers.length) return
    let n = 0
    //n = performance.now()
    // const sourceName = heatmapInteractiveLayers[0].source as string
    // // TODO work over several sources
    // const allFeatures = mapInstance.querySourceFeatures(sourceName, {
    //   sourceLayer: 'temporalgrid_interactive',
    // })
    // console.log(performance.now() - n)
    // console.log(allFeatures)

    n = performance.now()
    const allFeaturesWithStyle = mapInstance.queryRenderedFeatures(undefined, {
      layers: heatmapInteractiveLayers.map((l) => l.id),
    })
    console.log(performance.now() - n)
    console.log(allFeaturesWithStyle)

    // TODO multiple layers

    const timechunks = mapInstance.getStyle().metadata?.temporalgrid?.timeChunks as TimeChunks
    console.log(timechunks)

    // TODO calculate this in generator
    // const numChunkFrames = timechunks.chunks[0].numChunkFrames
    const numChunkFrames = 400

    const values: any[] = []

    allFeaturesWithStyle.forEach((feature) => {
      for (let frameIndex = 0; frameIndex < numChunkFrames; frameIndex++) {
        if (!feature.properties) continue
        const valuesAtFrame = feature.properties[frameIndex]
        if (!valuesAtFrame) continue
        if (!values[frameIndex]) {
          values[frameIndex] = {
            // TODO
            date: frameToDate(frameIndex, timechunks.chunks[0].quantizeOffset, timechunks.interval),
            // TODO
            sublayers: [0, 0, 0, 0],
          }
        }

        let parsed = JSON.parse(valuesAtFrame)
        if (!Array.isArray(parsed)) parsed = [parsed]
        ;(parsed as number[]).forEach((value, sublayerIndex) => {
          values[frameIndex].sublayers[sublayerIndex] += value
        })
      }
    })
    console.log(values)
  }, [mapInstance, tilesLoading])

  if (!start || !end) return null

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
