import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import mpasData from './mpas.json'

const mpas: FeatureCollection<any, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: mpasData as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}

export default mpas
