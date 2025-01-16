import { useCallback, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { OrthographicView } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'
import DeckGL from '@deck.gl/react'

import { TimelineContext } from '@globalfishingwatch/timebar'

import { Field } from '../../data/models'
import { useSegmentsLabeledConnect } from '../../features/timebar/timebar.hooks'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import {
  selectColorMode,
  selectProjectColors,
  selectTimebarMode,
} from '../../routes/routes.selectors'
import { ActionType } from '../../types'

import {
  selectVesselDirectionPoints,
  selectVesselDirectionsMinMaxValues,
  selectVesselDirectionsPositionScale,
} from './timebar.selectors'

// Helper function to get gradient color
function getGradientColor(position: number): [number, number, number] {
  // Recreate the gradient from the original CSS
  // #FF6B6B -> #CC4AA9 -> #185AD0
  const colors = [
    [255, 107, 107], // #FF6B6B
    [204, 74, 169], // #CC4AA9
    [24, 90, 208], // #185AD0
  ]

  const p = Math.max(0, Math.min(1, position))
  if (p < 0.5) {
    const t = p * 2
    return colors[0].map((start, i) => Math.round(start + (colors[1][i] - start) * t)) as [
      number,
      number,
      number
    ]
  } else {
    const t = (p - 0.5) * 2
    return colors[1].map((start, i) => Math.round(start + (colors[2][i] - start) * t)) as [
      number,
      number,
      number
    ]
  }
}

// Helper function to convert hex colors to RGB array
function hexToRgb(
  hex: string,
  handleOpacity: boolean = false
): [number, number, number] | [number, number, number, number] {
  // Handle 8-digit hex (#RRGGBBAA)
  const result8 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result8 && handleOpacity) {
    return [
      parseInt(result8[1], 16),
      parseInt(result8[2], 16),
      parseInt(result8[3], 16),
      parseInt(result8[4], 16),
    ]
  }

  // Handle 6-digit hex (#RRGGBB)
  const result6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result6
    ? [parseInt(result6[1], 16), parseInt(result6[2], 16), parseInt(result6[3], 16)]
    : [128, 128, 128]
}

export const VesselEventsPointsGraphDeckGL = () => {
  const { outerScale, outerHeight } = useContext(TimelineContext)
  const timebarMode = useSelector(selectTimebarMode)
  const colorMode = useSelector(selectColorMode)
  const projectColors = useSelector(selectProjectColors)
  const vesselPoints = useSelector(selectVesselDirectionPoints)
  const { min: minValue, max: maxValue } = useSelector(selectVesselDirectionsMinMaxValues)
  const positionScale = useSelector(selectVesselDirectionsPositionScale)

  const segments = useSelector(selectedtracks)
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
        outerHeight -
        (Math.abs(yPosition - minValue) * ((outerHeight - 20 - topMargin) / positionScale) + 15)

      const getActionColor = (action: ActionType) => {
        if (action === ActionType.selected) return '#ffffff10'
        return projectColors[action]
      }

      return {
        position: [startX, bottom],
        vesselPoint,
        color: vesselPoint.outOfRange
          ? '#000'
          : colorMode === 'all' || colorMode === 'labels'
          ? getActionColor(vesselPoint.action as ActionType)
          : '#8091AB',
        gradient: vesselPoint.outOfRange ? false : colorMode === 'all' || colorMode === 'content',
        yPosition:
          Math.abs(yPosition - minValue) * ((outerHeight - 20 - topMargin) / positionScale),
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
        getPosition: (d) => d.position,
        getFillColor: (d) =>
          d.gradient ? getGradientColor(d.yPosition / outerHeight) : hexToRgb(d.color, true),
        getLineColor: (d) => hexToRgb(d.color),
        onClick: handleEventClick,
      }),
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
  ])

  if (!positionScale || minValue === null || maxValue === null) {
    return null
  }

  return (
    <DeckGL
      views={new OrthographicView({ id: 'ortho', flipY: true })}
      initialViewState={{
        // Center the view on the data
        target: [outerScale.range()[1] / 2, outerHeight / 2, 0],
        zoom: 0,
      }}
      getTooltip={({ object }) => {
        if (!object) return null
        const point = object.vesselPoint
        return {
          html: `<div>
            <p style="font-weight: bold; font-size: 1.2rem;">${point.action}</p>
            <p>speed: ${Math.round(point.speed * 100) / 100}kt</p>
            <p>elevation: ${point.elevation ? Math.round(point.elevation) + 'm' : ''}</p>
          </div>`,
          style: {
            background: '#163f89',
            color: 'white',
            padding: '10px',
            top: '-50px',
            left: '10px',
          },
        }
      }}
      controller={false}
      layers={layers}
      style={{
        position: 'absolute',
        background: 'transparent',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
