import React, { useMemo } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { Topology, GeometryCollection } from 'topojson-specification'

import jsonData from './ne_110m_land.json'
import styles from './miniglobe.module.css'

interface MiniglobeBounds {
  north: number
  south: number
  west: number
  east: number
}

interface MiniglobeCenter {
  latitude: number
  longitude: number
}

interface MiniglobeProps {
  center: MiniglobeCenter
  bounds?: MiniglobeBounds
  zoom: number
  size?: number
  viewportThickness?: number
}

const defaultBounds = {
  north: 25,
  south: -25,
  east: 40,
  west: -40,
}

const defaultCenter = { latitude: 0, longitude: 0 }

const MiniGlobe: React.FC<MiniglobeProps> = (props) => {
  const {
    bounds = defaultBounds,
    center = defaultCenter,
    zoom = 3,
    size = 40,
    viewportThickness = 6,
  } = props

  const getProjection = (center: MiniglobeCenter, size: number) => {
    const { latitude, longitude } = center
    const projection = geoOrthographic()
      .translate([size / 2, size / 2])
      .scale(size / 2)
      .clipAngle(90)
    projection.rotate([-longitude, -latitude])
    return projection
  }
  const projection = useMemo(() => getProjection(center, size), [center, size])
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
  const viewportBoundsGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [west, north],
          [east, north],
          [east, south],
          [west, south],
          [west, north],
        ],
      ],
    },
  }

  const path = zoom ? geoPath().projection(projection)(viewportBoundsGeoJSON as any) || null : null

  return (
    <svg width={size} height={size} className={styles.globeBackground}>
      <circle className={styles.globeSvg} cx={size / 2} cy={size / 2} r={size / 2} />
      <g>
        {worldData.map((d, i) => {
          const path = geoPath().projection(projection)(d)
          return path && <path key={`path-${i}`} d={path} />
        })}
        {path && (
          <path
            key="viewport"
            d={path}
            className={styles.viewport}
            style={{ strokeWidth: viewportThickness }}
          />
        )}
      </g>
    </svg>
  )
}

export default MiniGlobe
