import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import rfmosData from './source/rfmos.json'

const rfmos: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: rfmosData as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}

export default rfmos
