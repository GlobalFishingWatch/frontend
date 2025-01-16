import type { Feature, LineString } from 'geojson'

import type { GraticuleLineGroup, GraticulesProperties } from './graticules.types'

function getLineScaleRank(lon: number): GraticuleLineGroup {
  return lon % 90 === 0 ? 90 : lon % 30 === 0 ? 30 : lon % 10 === 0 ? 10 : lon % 5 === 0 ? 5 : 1
}

function getLongitudeLabel(lon: number): string {
  if (lon === 0) return '0'
  return lon < 0 ? `${Math.abs(lon)}W` : `${lon}E`
}

function getLatitudeLabel(lat: number): string {
  if (lat === 0) return '0'
  return lat < 0 ? `${Math.abs(lat)}S` : `${lat}N`
}

export function generateGraticulesFeatures() {
  const features: Feature<LineString, GraticulesProperties>[] = []

  // Generate meridians (lines of longitude)
  for (let lon = -180; lon < 180; lon++) {
    features.push({
      type: 'Feature',
      properties: {
        scaleRank: getLineScaleRank(lon),
        label: getLongitudeLabel(lon),
        type: 'lon',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [lon, -84.5],
          [lon, 84.5],
        ],
      },
    })
  }

  // Generate parallels (lines of latitude)
  for (let lat = -85; lat <= 85; lat += 1) {
    features.push({
      type: 'Feature',
      properties: {
        scaleRank: getLineScaleRank(lat),
        label: getLatitudeLabel(lat),
        type: 'lat',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-180, lat],
          [180, lat],
        ],
      },
    })
  }

  return features
}
