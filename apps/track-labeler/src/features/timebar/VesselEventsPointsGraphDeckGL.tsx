import {
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as d3 from 'd3-scale'
import DeckGL from '@deck.gl/react'
import { OrthographicView } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'
import { TimelineContext } from '@globalfishingwatch/timebar'
import {
  useSegmentsLabeledConnect,
} from '../../features/timebar/timebar.hooks'
import {
  selectColorMode,
  selectProjectColors,
  selectTimebarMode,
} from '../../routes/routes.selectors'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import { Field } from '../../data/models'
import {
  setTooltip,
} from './timebar.slice'
import {
  selectVesselDirectionPoints,
  selectVesselDirectionsMinMaxValues,
  selectVesselDirectionsPositionScale,
} from './timebar.selectors'

export const VesselEventsPointsGraphDeckGL = () => {
  const { outerScale, outerHeight } = useContext(TimelineContext)
  const timebarMode = useSelector(selectTimebarMode)
  const colorMode = useSelector(selectColorMode)
  const projectColors = useSelector(selectProjectColors)
  const vesselPoints = useSelector(selectVesselDirectionPoints)
  const { min: minValue, max: maxValue } = useSelector(selectVesselDirectionsMinMaxValues)
  const positionScale = useSelector(selectVesselDirectionsPositionScale)

  const segments = useSelector(selectedtracks)
  const dispatch = useDispatch()
  const { onEventPointClick } = useSegmentsLabeledConnect()

  const handleEventClick = useCallback(
    (info: any) => {
      if (!info.object) return
      const e = info.object.vesselPoint
      const position = {
        latitude: e.position.lat,
        longitude: e.position.lon ?? 1,
      }
      onEventPointClick(segments, e.timestamp, position)
    },
    [onEventPointClick, segments]
  )

  const layers = useMemo(() => {
    if (!positionScale || minValue === null || maxValue === null) {
      return []
    }

    const topMargin = 15
    const points = vesselPoints.map((vesselPoint) => {
      const startX = outerScale(new Date(vesselPoint.timestamp))
      const yPosition =
        timebarMode === Field.speed
          ? vesselPoint.speed
          : timebarMode === Field.distanceFromPort
          ? vesselPoint.distanceFromPort
          : timebarMode === Field.elevation
          ? vesselPoint.elevation
          : 1
      const bottom =
        Math.abs(yPosition - minValue) * ((outerHeight - 20 - topMargin) / positionScale) + 15

      return {
        position: [startX, bottom],
        vesselPoint,
        color: colorMode === 'all' || colorMode === 'labels'
          ? projectColors[vesselPoint.action]
          : '#8091AB',
        gradient: colorMode === 'all' || colorMode === 'content',
        yPosition: Math.abs(yPosition - minValue) * ((outerHeight - 20 - topMargin) / positionScale)
      }
    })

    return [
      new ScatterplotLayer({
        id: 'vessel-events',
        data: points,
        pickable: true,
        opacity: 1,
        stroked: true,
        filled: true,
        radiusScale: 1,
        radiusMinPixels: 3.5,
        radiusMaxPixels: 3.5,
        lineWidthMinPixels: 1,
        getPosition: d => d.position,
        getFillColor: d => d.gradient 
          ? getGradientColor(d.yPosition / outerHeight)
          : hexToRgb(d.color),
        getLineColor: d => hexToRgb(d.color),
        onClick: handleEventClick,
        onHover: (info) => {
          if (info.object) {
            const point = info.object.vesselPoint
            dispatch(
              setTooltip({
                tooltip:
                  Math.round(point.speed * 100) / 100 +
                  'kt' +
                  (point.elevation
                    ? ', ' + Math.round(point.elevation) + 'm'
                    : ''),
              })
            )
          }
        }
      })
    ]
  }, [
    colorMode,
    maxValue,
    minValue,
    outerHeight,
    outerScale,
    positionScale,
    projectColors,
    timebarMode,
    vesselPoints,
    handleEventClick,
    dispatch
  ])

  if (!positionScale || minValue === null || maxValue === null) {
    return null
  }

  return (
    <DeckGL
      views={new OrthographicView({ id: 'ortho' })}
      initialViewState={{
        // Center the view on the data
        target: [outerScale.range()[1] / 2, outerHeight / 2, 0],
        zoom: 0
      }}
      controller={false}
      layers={layers}
      style={{
        position: 'absolute',
        background: 'transparent',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%'
      }}
    />
  )
}

// Helper function to convert hex colors to RGB array
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [128, 128, 128]
}

// Helper function to get gradient color
function getGradientColor(position: number): [number, number, number] {
  // Recreate the gradient from the original CSS
  // #FF6B6B -> #CC4AA9 -> #185AD0
  const colors = [
    [255, 107, 107], // #FF6B6B
    [204, 74, 169],  // #CC4AA9
    [24, 90, 208]    // #185AD0
  ]
  
  const p = Math.max(0, Math.min(1, position))
  if (p < 0.5) {
    const t = p * 2
    return colors[0].map((start, i) => 
      Math.round(start + (colors[1][i] - start) * t)
    ) as [number, number, number]
  } else {
    const t = (p - 0.5) * 2
    return colors[1].map((start, i) => 
      Math.round(start + (colors[2][i] - start) * t)
    ) as [number, number, number]
  }
} 