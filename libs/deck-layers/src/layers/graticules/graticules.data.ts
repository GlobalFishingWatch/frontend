import { Feature, LineString } from 'geojson'

type GraticuleLineGroup = 1 | 5 | 10 | 30
function getLineScaleRank(lon: number): GraticuleLineGroup {
  return lon % 30 === 0 ? 30 : lon % 10 === 0 ? 10 : lon % 5 === 0 ? 5 : 1
}

function getLongitudeLabel(lon: number): string {
  return lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`
}

function getLatitudeLabel(lat: number): string {
  return lat < 0 ? `${Math.abs(lat)}°S` : `${lat}°N`
}

export function generateGraticulesFeatures() {
  const features: Feature<LineString>[] = []

  // Generate meridians (lines of longitude)
  for (let lon = -180; lon < 180; lon++) {
    features.push({
      type: 'Feature',
      properties: {
        scaleRank: getLineScaleRank(lon),
        label: getLongitudeLabel(lon),
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [lon, -90],
          [lon, 90],
        ],
      },
    } as Feature<LineString>)
  }

  // Generate parallels (lines of latitude)
  for (let lat = -90; lat < 90; lat += 1) {
    features.push({
      type: 'Feature',
      properties: {
        scaleRank: getLineScaleRank(lat),
        label: getLatitudeLabel(lat),
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-180, lat],
          [180, lat],
        ],
      },
    } as Feature<LineString>)
  }

  return features
}
