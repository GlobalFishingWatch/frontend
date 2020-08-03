import React, { useMemo } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { Topology, GeometryCollection } from 'topojson-specification'
import jsonData from './ne_110m_land.json'
import styles from './Miniglobe.module.css'
import { MiniglobeCenter, MiniglobeBounds } from './index'

interface MiniglobeProps {
  center: MiniglobeCenter
  bounds: MiniglobeBounds
  size?: number
  viewportThickness?: number
}

const defaultBounds = {
  north: 10,
  south: -10,
  west: -10,
  east: 10,
}

const MIN_DEGREES_PATH = 4
const MAX_DEGREES_PATH = 150
const defaultCenter = { latitude: 0, longitude: 0 }

const MiniGlobe: React.FC<MiniglobeProps> = (props) => {
  const { bounds = defaultBounds, center = defaultCenter, size = 40, viewportThickness = 4 } = props

  const projection = useMemo(() => {
    const { latitude, longitude } = center
    const projection = geoOrthographic()
      .translate([size / 2, size / 2])
      .scale(size / 2)
      .clipAngle(90)
    projection.rotate([-longitude, -latitude])
    return projection
  }, [center, size])

  const worldData = useMemo(
    () =>
      feature((jsonData as unknown) as Topology, jsonData.objects.land as GeometryCollection)
        .features,
    []
  )

  if (!bounds) {
    console.error('MiniGlobe: bounds not specified')
    return null
  }

  const { north, south, west, east } = bounds
  if (north < south || west > east) {
    console.error('MiniGlobe: bounds specified not valid')
  }

  const longitudeExtent = east - west
  const latitudeExtent = north - south

  const viewportBoundsGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [west, north],
          [west + longitudeExtent * 0.1, north],
          [west + longitudeExtent * 0.2, north],
          [west + longitudeExtent * 0.3, north],
          [west + longitudeExtent * 0.4, north],
          [west + longitudeExtent * 0.5, north],
          [west + longitudeExtent * 0.6, north],
          [west + longitudeExtent * 0.7, north],
          [west + longitudeExtent * 0.8, north],
          [west + longitudeExtent * 0.9, north],
          [east, north],
          [east, north - latitudeExtent * 0.1],
          [east, north - latitudeExtent * 0.2],
          [east, north - latitudeExtent * 0.3],
          [east, north - latitudeExtent * 0.4],
          [east, north - latitudeExtent * 0.5],
          [east, north - latitudeExtent * 0.6],
          [east, north - latitudeExtent * 0.7],
          [east, north - latitudeExtent * 0.8],
          [east, north - latitudeExtent * 0.9],
          [east, south],
          [east - longitudeExtent * 0.1, south],
          [east - longitudeExtent * 0.2, south],
          [east - longitudeExtent * 0.3, south],
          [east - longitudeExtent * 0.4, south],
          [east - longitudeExtent * 0.5, south],
          [east - longitudeExtent * 0.6, south],
          [east - longitudeExtent * 0.7, south],
          [east - longitudeExtent * 0.8, south],
          [east - longitudeExtent * 0.9, south],
          [west, south],
          [west, south + latitudeExtent * 0.1],
          [west, south + latitudeExtent * 0.2],
          [west, south + latitudeExtent * 0.3],
          [west, south + latitudeExtent * 0.4],
          [west, south + latitudeExtent * 0.5],
          [west, south + latitudeExtent * 0.6],
          [west, south + latitudeExtent * 0.7],
          [west, south + latitudeExtent * 0.8],
          [west, south + latitudeExtent * 0.9],
          [west, north],
        ],
      ],
    },
  }

  const showPoint = latitudeExtent <= MIN_DEGREES_PATH || longitudeExtent <= MIN_DEGREES_PATH
  const showPath =
    !showPoint && latitudeExtent <= MAX_DEGREES_PATH && longitudeExtent <= MAX_DEGREES_PATH
  const path = geoPath().projection(projection)(viewportBoundsGeoJSON as any) || undefined

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle className={styles.globe} cx={size / 2} cy={size / 2} r={size / 2} />
      <g className={styles.land}>
        {worldData.map((d, i) => {
          const path = geoPath().projection(projection)(d)
          return path && <path key={`path-${i}`} d={path} />
        })}
      </g>
      {showPoint && (
        <circle
          className={styles.viewportPoint}
          cx={size / 2}
          cy={size / 2}
          r={viewportThickness}
        />
      )}
      {showPath && (
        <path
          key="viewport"
          d={path}
          className={styles.viewport}
          style={{ strokeWidth: viewportThickness }}
        />
      )}
    </svg>
  )
}

export default MiniGlobe
