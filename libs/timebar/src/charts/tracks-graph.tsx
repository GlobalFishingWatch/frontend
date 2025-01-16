/* eslint-disable @next/next/no-img-element */
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { OrthographicViewState } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import { SolidPolygonLayer } from '@deck.gl/layers'
import type { DeckGLRef } from '@deck.gl/react'
import DeckGL from '@deck.gl/react'
import { scaleSqrt } from 'd3-scale'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { hexToDeckColor } from '@globalfishingwatch/deck-layers'
import { usePrintSize } from '@globalfishingwatch/react-hooks'

import TimelineContext from '../timelineContext'

import { useFilteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'
import type { TimebarChartData } from '.'
import { useUpdateChartsData } from './chartsData.atom'

import styles from './tracks-graph.module.css'

const VIEW = new OrthographicView({ id: '2d-scene', controller: false })
const GRAPH_STYLE = { zIndex: '-1' }

type TimebarChartSteps = { value: number; color: string }[]
type TimebarChartProps = { data: TimebarChartData; steps: TimebarChartSteps; printing?: boolean }

const TrackGraph = ({ data, steps, printing = false }: TimebarChartProps) => {
  const printSize = usePrintSize()
  const [screenshotImage, setScreenshotImage] = useState<string | null>(null)
  const deckRef = useRef<DeckGLRef>(null)
  const { outerScale, innerWidth, outerWidth, graphHeight, trackGraphOrientation, start } =
    useContext(TimelineContext)
  const oldOuterScaleRef = useRef(outerScale)
  const offsetHashRef = useRef(Date.now())

  const oldStartX = oldOuterScaleRef.current(getUTCDate(start))
  const startX = outerScale(getUTCDate(start))
  const offsetStartX = startX - oldStartX
  const veilWidth = (outerWidth - innerWidth) / 2
  offsetHashRef.current = Math.abs(offsetStartX) > veilWidth ? Date.now() : offsetHashRef.current

  const filteredGraphsData = useFilteredChartData(data)
  useUpdateChartsData('tracksGraphs', filteredGraphsData)

  useEffect(() => {
    if (deckRef.current && printing) {
      const canvas = deckRef.current?.deck?.getCanvas()
      if (canvas) {
        deckRef.current?.deck?.redraw('graph-screenshot')
        setScreenshotImage(canvas.toDataURL())
      }
    }
    return () => {
      setScreenshotImage(null)
    }
  }, [printing])

  const initialViewState = useMemo(
    () =>
      ({
        target: [outerWidth / 2, graphHeight / 2, 0],
        zoom: 0,
      }) as OrthographicViewState,
    [graphHeight, outerWidth]
  )

  const heightScale = useMemo(() => {
    if (!steps?.length) return undefined
    const domainEnd =
      trackGraphOrientation === 'down'
        ? Math.min(...steps.map((step) => step.value || 0))
        : Math.max(...steps.map((step) => step.value || 0))
    const { height } = getTrackY(filteredGraphsData.length, 0, graphHeight)
    return scaleSqrt([0, domainEnd], [2, height]).clamp(true)
  }, [filteredGraphsData.length, graphHeight, steps, trackGraphOrientation])

  const layers = useMemo(() => {
    if (!heightScale || !steps.length) return []
    oldOuterScaleRef.current = outerScale
    const layerData = filteredGraphsData.flatMap((track, trackIndex) => {
      const trackY = getTrackY(data.length, trackIndex, graphHeight, trackGraphOrientation)
      return track.chunks.flatMap((segment) => {
        return (segment.values || [])?.flatMap(({ value = 0, timestamp }, index, array) => {
          const x1 = outerScale(timestamp)
          const x2 = outerScale(array[index + 1]?.timestamp || Number.POSITIVE_INFINITY)
          const height = heightScale(value)
          let y1
          let y2
          if (trackGraphOrientation === 'mirrored') {
            y1 = trackY.defaultY - height / 2
            y2 = trackY.defaultY + height / 2
          } else {
            y1 = trackY.defaultY
            y2 = trackY.defaultY + height
          }
          if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
            return []
          }
          const color =
            steps?.find((step) =>
              trackGraphOrientation === 'down' ? value >= step.value : value <= step.value
            )?.color || steps[steps.length - 1].color
          const colorResolved = hexToDeckColor(color)
          if (
            track.filters &&
            ((track.filters.minElevationFilter && value < track.filters.minElevationFilter) ||
              (track.filters.maxElevationFilter && value > track.filters.maxElevationFilter) ||
              (track.filters.minSpeedFilter && value < track.filters.minSpeedFilter) ||
              (track.filters.maxSpeedFilter && value > track.filters.maxSpeedFilter))
          ) {
            colorResolved[3] = 50
          }
          return {
            polygon: [x1, y1, x2, y1, x2, y2, x1, y2],
            color: colorResolved,
          }
        })
      })
    })
    return [
      new SolidPolygonLayer({
        id: 'polygon-layer',
        data: layerData,
        _normalize: false,
        positionFormat: 'XY',
        getPolygon: (d) => d.polygon,
        getFillColor: (d) => d.color,
      }),
    ]
  }, [
    heightScale,
    steps,
    outerScale,
    filteredGraphsData,
    data.length,
    graphHeight,
    trackGraphOrientation,
  ])

  const leftOffset = offsetStartX - veilWidth

  return (
    <Fragment>
      <div style={{ transform: `translateX(${leftOffset}px)`, zIndex: -1 }}>
        <DeckGL
          ref={deckRef}
          views={VIEW}
          initialViewState={initialViewState}
          layers={layers}
          width={outerWidth + veilWidth * 2}
          height={graphHeight}
          style={GRAPH_STYLE}
        />
      </div>
      {screenshotImage && (
        <Fragment>
          <img
            id="graph-screenshot-img"
            className={styles.screenshot}
            src={screenshotImage}
            alt="graph screenshot"
          />
          <style>
            {`@page {
          size: ${printSize};
          margin: 0;
        }`}
          </style>
        </Fragment>
      )}
    </Fragment>
  )
}

export default TrackGraph
