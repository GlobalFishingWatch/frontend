import { useMemo } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'

import jsonData from './ne_110m_land.json'

import styles from './Miniglobe.module.css'

export interface MiniglobeBounds {
  north: number
  south: number
  west: number
  east: number
}

export interface MiniglobeCenter {
  latitude: number
  longitude: number
}

const EDGE_STEPS = 10
const densifyEdge = (from: number[], to: number[]) =>
  Array.from({ length: EDGE_STEPS }, (_, i) => {
    const t = i / EDGE_STEPS
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]
  })

const MIN_DEGREES_PATH = 4
const MAX_DEGREES_PATH = 150
const defaultCenter = { latitude: 0, longitude: 0 }
const worldData = feature(
  jsonData as unknown as Topology,
  jsonData.objects.land as GeometryCollection
).features

interface MiniglobeProps {
  center: MiniglobeCenter
  bounds?: MiniglobeBounds
  size?: number
  className?: string
  viewportThickness?: number
}

export function MiniGlobe(props: MiniglobeProps) {
  const { bounds, center = defaultCenter, size = 40, viewportThickness = 4, className = '' } = props

  const projection = useMemo(() => {
    const { latitude, longitude } = center
    const projection = geoOrthographic()
      .translate([size / 2, size / 2])
      .scale(size / 2)
      .clipAngle(90)
    projection.rotate([-longitude, -latitude])
    return projection
  }, [center, size])

  const pathGen = useMemo(() => geoPath().projection(projection), [projection])

  const worldComponent = useMemo(
    () => (
      <g className={styles.land}>
        {worldData.map((d, i) => {
          const path = pathGen(d)
          return path && <path key={`path-${i}`} d={path} />
        })}
      </g>
    ),
    [pathGen]
  )

  const boundsComponent = useMemo(() => {
    if (!bounds) return null

    const { north, south, west, east } = bounds

    if (north < south || west > east) {
      console.error('MiniGlobe: bounds specified not valid')
      return null
    }

    const longitudeExtent = east - west
    const latitudeExtent = north - south

    const ring = [
      ...densifyEdge([west, north], [east, north]),
      ...densifyEdge([east, north], [east, south]),
      ...densifyEdge([east, south], [west, south]),
      ...densifyEdge([west, south], [west, north]),
      [west, north],
    ]
    const viewportBoundsGeoJSON = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [ring] },
    }

    const showPoint = latitudeExtent <= MIN_DEGREES_PATH || longitudeExtent <= MIN_DEGREES_PATH
    const showPath = latitudeExtent <= MAX_DEGREES_PATH && longitudeExtent <= MAX_DEGREES_PATH
    if (showPoint) {
      return (
        <circle
          className={styles.viewportPoint}
          cx={size / 2}
          cy={size / 2}
          r={viewportThickness}
        />
      )
    } else if (showPath) {
      const path = pathGen(viewportBoundsGeoJSON as any) || undefined
      return (
        <path
          key="viewport"
          d={path}
          className={styles.viewport}
          style={{ strokeWidth: viewportThickness }}
        />
      )
    }
    return null
  }, [bounds, pathGen, size, viewportThickness])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle className={styles.globe} cx={size / 2} cy={size / 2} r={size / 2} />
      {worldComponent}
      {boundsComponent}
    </svg>
  )
}
